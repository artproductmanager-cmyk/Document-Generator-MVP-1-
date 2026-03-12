import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { DocumentWizard } from "../components/DocumentWizard";
import { Download, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  generateWord,
  createParagraph,
  formatDate,
  numberToWords,
  rublesWord,
} from "../utils/documentGenerator";
import { ValidatedInput } from "../components/ui/validated-input";
import {
  validateFullName,
  validatePassport,
  formatPassport,
  validateCompanyName,
  validateINN,
  formatINN,
  validateOGRN,
  formatOGRN,
  validateKPP,
  formatKPP,
} from "../utils/validation";
import { AlignmentType, Paragraph, TextRun } from "docx";
import { useDocumentGeneration } from "../hooks/useDocumentGeneration";

interface RentalData {
  // Арендодатель
  landlordType: "individual" | "company";
  landlordName: string;
  landlordPassport: string;
  landlordAddress: string;
  // Для юрлица - арендодатель
  landlordCompanyName: string;
  landlordINN: string;
  landlordOGRN: string;
  landlordKPP: string;
  landlordLegalAddress: string;
  landlordDirectorPosition: string;
  landlordDirectorName: string;
  
  // Арендатор
  tenantType: "individual" | "company";
  tenantName: string;
  tenantPassport: string;
  tenantAddress: string;
  // Для юрлица - арендатор
  tenantCompanyName: string;
  tenantINN: string;
  tenantOGRN: string;
  tenantKPP: string;
  tenantLegalAddress: string;
  tenantDirectorPosition: string;
  tenantDirectorName: string;
  
  // Квартира
  apartmentAddress: string;
  apartmentArea: string;
  apartmentRooms: string;
  
  // Условия
  rentalPrice: string;
  rentalPeriod: string;
  startDate: string;
  utilities: string;
  
  // Город и дата подписания
  city: string;
  signDate: string;
}

export function RentalAgreement() {
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('dogovor-arendy-kvartiry');
  
  const [formData, setFormData] = useState<RentalData>({
    landlordType: "individual",
    landlordName: "",
    landlordPassport: "",
    landlordAddress: "",
    // Для юрлица - арендодатель
    landlordCompanyName: "",
    landlordINN: "",
    landlordOGRN: "",
    landlordKPP: "",
    landlordLegalAddress: "",
    landlordDirectorPosition: "",
    landlordDirectorName: "",
    tenantType: "individual",
    tenantName: "",
    tenantPassport: "",
    tenantAddress: "",
    // Для юрлица - арендатор
    tenantCompanyName: "",
    tenantINN: "",
    tenantOGRN: "",
    tenantKPP: "",
    tenantLegalAddress: "",
    tenantDirectorPosition: "",
    tenantDirectorName: "",
    apartmentAddress: "",
    apartmentArea: "",
    apartmentRooms: "",
    rentalPrice: "",
    rentalPeriod: "",
    startDate: "",
    utilities: "включены",
    city: "",
    signDate: new Date().toISOString().split("T")[0],
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateField = (field: keyof RentalData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const canProceed = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Арендодатель
        if (formData.landlordType === "individual") {
          return !!(formData.landlordName && formData.landlordPassport && formData.landlordAddress);
        } else {
          return !!(formData.landlordCompanyName && formData.landlordINN && formData.landlordOGRN && formData.landlordKPP && formData.landlordLegalAddress && formData.landlordDirectorPosition && formData.landlordDirectorName);
        }
      case 1: // Арендатор
        if (formData.tenantType === "individual") {
          return !!(formData.tenantName && formData.tenantPassport && formData.tenantAddress);
        } else {
          return !!(formData.tenantCompanyName && formData.tenantINN && formData.tenantOGRN && formData.tenantKPP && formData.tenantLegalAddress && formData.tenantDirectorPosition && formData.tenantDirectorName);
        }
      case 2: // Объект аренды
        return !!(formData.apartmentAddress && formData.apartmentArea && formData.apartmentRooms);
      case 3: // Условия
        return !!(formData.rentalPrice && formData.rentalPeriod && formData.startDate && formData.city);
      default:
        return true;
    }
  };

  const generateDocument = () => {
    const price = parseInt(formData.rentalPrice) || 0;
    const priceInWords = numberToWords(price);
    
    // Формируем строки для сторон в зависимости от типа
    const landlordInfo = formData.landlordType === "individual"
      ? `${formData.landlordName}, паспорт ${formData.landlordPassport}, проживающий(ая) по адресу: ${formData.landlordAddress}`
      : `${formData.landlordCompanyName}, ИНН ${formData.landlordINN}, ОГРН ${formData.landlordOGRN}, КПП ${formData.landlordKPP}, юридический адрес: ${formData.landlordLegalAddress}, в ли��е ${formData.landlordDirectorPosition} ${formData.landlordDirectorName}`;
    
    const tenantInfo = formData.tenantType === "individual"
      ? `${formData.tenantName}, паспорт ${formData.tenantPassport}, проживающий(ая) по адресу: ${formData.tenantAddress}`
      : `${formData.tenantCompanyName}, ИНН ${formData.tenantINN}, ОГРН ${formData.tenantOGRN}, КПП ${formData.tenantKPP}, юридический адрес: ${formData.tenantLegalAddress}, в лице ${formData.tenantDirectorPosition} ${formData.tenantDirectorName}`;
    
    const sections = [
      // Заголовок
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: "ДОГОВОР АРЕНДЫ ЖИЛОГО ПОМЕЩЕНИЯ",
            bold: true,
            size: 32,
            font: "Times New Roman",
          }),
        ],
      }),
      
      // Город и дата
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: `г. ${formData.city}, ${formatDate(new Date(formData.signDate))}`,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),

      // Стороны
      createParagraph(
        `${landlordInfo}, именуемый в дальнейшем "Арендодатель", с одной стороны, и`,
        {}
      ),
      
      createParagraph(
        `${tenantInfo}, именуемый в дальнейшем "Арендатор", с другой стороны, заключили настоящий договор о нижеследующем:`,
        {}
      ),

      // 1. Предмет договора
      createParagraph("1. ПРЕДМЕТ ДОГОВОРА", { bold: true, before: 300 }),
      
      createParagraph(
        `1.1. Арендодатель передает, а Арендатор принимает во временное владение и пользование жилое помещение (квартиру), расположенное по адресу: ${formData.apartmentAddress}, общей площадью ${formData.apartmentArea} кв.м, количество комнат: ${formData.apartmentRooms}.`,
        {}
      ),

      // 2. Срок действия договора
      createParagraph("2. СРОК ДЕЙСТВИЯ ДОГОВОРА", { bold: true, before: 300 }),
      
      createParagraph(
        `2.1. Квартира передается Арендатору на срок ${formData.rentalPeriod} с ${formatDate(new Date(formData.startDate))}.`,
        {}
      ),
      
      createParagraph(
        "2.2. По истечении срока действия договора Арендатор обязан освободить квартиру и передать ее Арендодателю в том же состоянии, в котором он ее получил, с учетом нормального износа.",
        {}
      ),

      // 3. Размер и порядок внесения платы
      createParagraph("3. РАЗМЕР И ПОРЯДОК ВНЕСЕНИЯ ПЛАТЫ", { bold: true, before: 300 }),
      
      createParagraph(
        `3.1. Размер арендной платы составляет ${formData.rentalPrice} (${priceInWords} ${rublesWord(price)}) рублей в месяц.`,
        {}
      ),
      
      createParagraph(
        `3.2. Коммунальные услуги ${formData.utilities} в арендную плату.`,
        {}
      ),
      
      createParagraph(
        "3.3. Арендная плата вносится Арендатором ежемесячно до 10 числа текущего месяца путем передачи наличных денежных средств Арендодателю либо перечислением на банковский счет.",
        {}
      ),

      // 4. Права и обязанности сторон
      createParagraph("4. ПРАВА И ОБЯЗАННОСТИ СТОРОН", { bold: true, before: 300 }),
      
      createParagraph("4.1. Арендодатель обязуется:", {}),
      createParagraph(
        "- передать Арендатору квартиру в состоянии, пригодном для проживания;",
        {}
      ),
      createParagraph(
        "- обеспечить Арендатору беспрепятственное пользование квартирой;",
        {}
      ),
      createParagraph(
        "- производить за свой счет капитальный ремонт квартиры.",
        {}
      ),
      
      createParagraph("4.2. Арендатор обязуется:", { before: 200 }),
      createParagraph(
        "- использовать квартиру только для проживания;",
        {}
      ),
      createParagraph(
        "- своевременно вносить арендную плату;",
        {}
      ),
      createParagraph(
        "- содержать квартиру в чистоте и порядке;",
        {}
      ),
      createParagraph(
        "- производить за свой счет текущий ремонт квартиры;",
        {}
      ),
      createParagraph(
        "- не произв��дить перепланировку без письменного согласия Арендодателя.",
        {}
      ),

      // 5. Ответственность сторон
      createParagraph("5. ОТВЕТСТВЕННОСТЬ СТОРОН", { bold: true, before: 300 }),
      
      createParagraph(
        "5.1. За нарушение условий настоящего договора стороны несут ответственность в соответствии с действующим законодательством РФ.",
        {}
      ),

      // 6. Прочие условия
      createParagraph("6. ПРОЧИЕ УСЛОВИЯ", { bold: true, before: 300 }),
      
      createParagraph(
        "6.1. Настоящий договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из сторон.",
        {}
      ),
      
      createParagraph(
        "6.2. Все изменения и дополнения к настоящему договору действительны, если они совершены в письменной форме и подписаны обеими сторонами.",
        {}
      ),

      // Подписи
      createParagraph("7. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН", { bold: true, before: 300 }),
      
      new Paragraph({
        spacing: { after: 200, before: 400 },
        children: [
          new TextRun({
            text: "Арендодатель:",
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),
    ];

    // Реквизиты арендодателя
    if (formData.landlordType === "individual") {
      sections.push(
        createParagraph(`${formData.landlordName}`, {}),
        createParagraph(`Паспорт: ${formData.landlordPassport}`, {}),
        createParagraph(`Адрес: ${formData.landlordAddress}`, {}),
        createParagraph("Подпись: _______________", {})
      );
    } else {
      sections.push(
        createParagraph(`${formData.landlordCompanyName}`, {}),
        createParagraph(`ИНН: ${formData.landlordINN}`, {}),
        createParagraph(`ОГРН: ${formData.landlordOGRN}`, {}),
        createParagraph(`КПП: ${formData.landlordKPP}`, {}),
        createParagraph(`Юридический адрес: ${formData.landlordLegalAddress}`, {}),
        createParagraph(`${formData.landlordDirectorPosition}: ${formData.landlordDirectorName}`, {}),
        createParagraph("Подпись: _______________", {})
      );
    }

    // Реквизиты арендатора
    sections.push(
      new Paragraph({
        spacing: { after: 200, before: 400 },
        children: [
          new TextRun({
            text: "Арендатор:",
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      })
    );

    if (formData.tenantType === "individual") {
      sections.push(
        createParagraph(`${formData.tenantName}`, {}),
        createParagraph(`Паспорт: ${formData.tenantPassport}`, {}),
        createParagraph(`Адрес: ${formData.tenantAddress}`, {}),
        createParagraph("Подпись: _______________", {})
      );
    } else {
      sections.push(
        createParagraph(`${formData.tenantCompanyName}`, {}),
        createParagraph(`ИНН: ${formData.tenantINN}`, {}),
        createParagraph(`ОГРН: ${formData.tenantOGRN}`, {}),
        createParagraph(`КПП: ${formData.tenantKPP}`, {}),
        createParagraph(`Юридический адрес: ${formData.tenantLegalAddress}`, {}),
        createParagraph(`${formData.tenantDirectorPosition}: ${formData.tenantDirectorName}`, {}),
        createParagraph("Подпись: _______________", {})
      );
    }

    return sections;
  };

  const handleDownloadWord = async () => {
    // Проверяем лимиты перед генерацией
    if (!checkLimit()) {
      return;
    }

    try {
      // Сохраняем документ на серере
      const saved = await saveDocument(formData);
      
      if (!saved) {
        return; // Если сохранение не удалось, не скачиваем файл
      }

      // Генерируем и скачиваем файл
      const sections = generateDocument();
      await generateWord(sections, "dogovor-arendy-kvartiry.docx");
      toast.success("Документ успешно скачан!");
    } catch (error) {
      toast.error("Ошибка при создании дкумента");
      console.error(error);
    }
  };

  const steps = [
    {
      title: "Арндодатель",
      description: "Укажите данные владельца квартиры",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Тип арендодателя</Label>
            <RadioGroup
              value={formData.landlordType}
              onValueChange={(value) => updateField("landlordType", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="landlord-individual" />
                <Label htmlFor="landlord-individual">Физическое лицо</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="landlord-company" />
                <Label htmlFor="landlord-company">Юридическое лицо</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.landlordType === "individual" ? (
            <>
              <div className="space-y-2">
                <ValidatedInput
                  label="ФИО арендодателя"
                  id="landlordName"
                  placeholder="Иванов Иван Иванович"
                  value={formData.landlordName}
                  onChange={(e) => updateField("landlordName", e.target.value)}
                  validate={validateFullName}
                  required
                />
              </div>

              <div className="space-y-2">
                <ValidatedInput
                  label="Паспортные данные"
                  id="landlordPassport"
                  placeholder="1234 567890"
                  value={formData.landlordPassport}
                  onChange={(e) => updateField("landlordPassport", e.target.value)}
                  validate={validatePassport}
                  formatValue={formatPassport}
                  helpText="Формат: 1234 567890 (4 цифры серии + 6 цифр номера)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landlordAddress">Адрес регистрации *</Label>
                <Textarea
                  id="landlordAddress"
                  placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
                  value={formData.landlordAddress}
                  onChange={(e) => updateField("landlordAddress", e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <ValidatedInput
                  label="Название компании"
                  id="landlordCompanyName"
                  placeholder="ООО «Пример»"
                  value={formData.landlordCompanyName}
                  onChange={(e) => updateField("landlordCompanyName", e.target.value)}
                  validate={validateCompanyName}
                  required
                />
              </div>

              <div className="space-y-2">
                <ValidatedInput
                  label="ИНН"
                  id="landlordINN"
                  placeholder="1234567890"
                  value={formData.landlordINN}
                  onChange={(e) => updateField("landlordINN", e.target.value)}
                  validate={validateINN}
                  formatValue={formatINN}
                  helpText="Формат: 1234567890 (10 цифр)"
                  required
                />
              </div>

              <div className="space-y-2">
                <ValidatedInput
                  label="ОГРН"
                  id="landlordOGRN"
                  placeholder="1234567890123"
                  value={formData.landlordOGRN}
                  onChange={(e) => updateField("landlordOGRN", e.target.value)}
                  validate={validateOGRN}
                  formatValue={formatOGRN}
                  helpText="Формат: 1234567890123 (13 цифр)"
                  required
                />
              </div>

              <div className="space-y-2">
                <ValidatedInput
                  label="КПП"
                  id="landlordKPP"
                  placeholder="123456789"
                  value={formData.landlordKPP}
                  onChange={(e) => updateField("landlordKPP", e.target.value)}
                  validate={validateKPP}
                  formatValue={formatKPP}
                  helpText="Формат: 123456789 (9 цифр)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landlordLegalAddress">Юридический адрес *</Label>
                <Textarea
                  id="landlordLegalAddress"
                  placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
                  value={formData.landlordLegalAddress}
                  onChange={(e) => updateField("landlordLegalAddress", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landlordDirectorPosition">Должность руководителя *</Label>
                <Input
                  id="landlordDirectorPosition"
                  placeholder="Генеральный директор"
                  value={formData.landlordDirectorPosition}
                  onChange={(e) => updateField("landlordDirectorPosition", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landlordDirectorName">ФИО руководителя *</Label>
                <Input
                  id="landlordDirectorName"
                  placeholder="Иванов Иван Иванович"
                  value={formData.landlordDirectorName}
                  onChange={(e) => updateField("landlordDirectorName", e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      title: "Арендатор",
      description: "Укажите данные арендатора квартиры",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Тип арендатора</Label>
            <RadioGroup
              value={formData.tenantType}
              onValueChange={(value) => updateField("tenantType", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="tenant-individual" />
                <Label htmlFor="tenant-individual">Физическое лицо</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="tenant-company" />
                <Label htmlFor="tenant-company">Юридическое лицо</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.tenantType === "individual" ? (
            <>
              <div className="space-y-2">
                <ValidatedInput
                  label="ФИО арендатора"
                  id="tenantName"
                  placeholder="Петров Петр Петрович"
                  value={formData.tenantName}
                  onChange={(e) => updateField("tenantName", e.target.value)}
                  validate={validateFullName}
                  required
                />
              </div>

              <div className="space-y-2">
                <ValidatedInput
                  label="Паспортные данные"
                  id="tenantPassport"
                  placeholder="1234 567890"
                  value={formData.tenantPassport}
                  onChange={(e) => updateField("tenantPassport", e.target.value)}
                  validate={validatePassport}
                  formatValue={formatPassport}
                  helpText="Формат: 1234 567890 (4 цифры серии + 6 цифр номера)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenantAddress">Адрес регистрации *</Label>
                <Textarea
                  id="tenantAddress"
                  placeholder="г. Санкт-Петербург, пр. Невский, д. 1, кв. 1"
                  value={formData.tenantAddress}
                  onChange={(e) => updateField("tenantAddress", e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <ValidatedInput
                  label="Название компании"
                  id="tenantCompanyName"
                  placeholder="ООО «Пример»"
                  value={formData.tenantCompanyName}
                  onChange={(e) => updateField("tenantCompanyName", e.target.value)}
                  validate={validateCompanyName}
                  required
                />
              </div>

              <div className="space-y-2">
                <ValidatedInput
                  label="ИНН"
                  id="tenantINN"
                  placeholder="1234567890"
                  value={formData.tenantINN}
                  onChange={(e) => updateField("tenantINN", e.target.value)}
                  validate={validateINN}
                  formatValue={formatINN}
                  helpText="Формат: 1234567890 (10 цифр)"
                  required
                />
              </div>

              <div className="space-y-2">
                <ValidatedInput
                  label="ОГРН"
                  id="tenantOGRN"
                  placeholder="1234567890123"
                  value={formData.tenantOGRN}
                  onChange={(e) => updateField("tenantOGRN", e.target.value)}
                  validate={validateOGRN}
                  formatValue={formatOGRN}
                  helpText="Формат: 1234567890123 (13 цифр)"
                  required
                />
              </div>

              <div className="space-y-2">
                <ValidatedInput
                  label="КПП"
                  id="tenantKPP"
                  placeholder="123456789"
                  value={formData.tenantKPP}
                  onChange={(e) => updateField("tenantKPP", e.target.value)}
                  validate={validateKPP}
                  formatValue={formatKPP}
                  helpText="Формат: 123456789 (9 цифр)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenantLegalAddress">Юридический адрес *</Label>
                <Textarea
                  id="tenantLegalAddress"
                  placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
                  value={formData.tenantLegalAddress}
                  onChange={(e) => updateField("tenantLegalAddress", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenantDirectorPosition">Должность руководителя *</Label>
                <Input
                  id="tenantDirectorPosition"
                  placeholder="Генеральный директор"
                  value={formData.tenantDirectorPosition}
                  onChange={(e) => updateField("tenantDirectorPosition", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenantDirectorName">ФИО руководителя *</Label>
                <Input
                  id="tenantDirectorName"
                  placeholder="Иванов Иван Иванович"
                  value={formData.tenantDirectorName}
                  onChange={(e) => updateField("tenantDirectorName", e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      title: "Объект аренды",
      description: "Информация о квартире",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apartmentAddress">Адрес квартиры *</Label>
            <Textarea
              id="apartmentAddress"
              placeholder="г. Москва, ул. Пушкина, д. 10, кв. 25"
              value={formData.apartmentAddress}
              onChange={(e) => updateField("apartmentAddress", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apartmentArea">Общая площадь (кв.м) *</Label>
              <Input
                id="apartmentArea"
                type="number"
                placeholder="45"
                value={formData.apartmentArea}
                onChange={(e) => updateField("apartmentArea", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apartmentRooms">Количество комнат *</Label>
              <Input
                id="apartmentRooms"
                type="number"
                placeholder="2"
                value={formData.apartmentRooms}
                onChange={(e) => updateField("apartmentRooms", e.target.value)}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Условия аренды",
      description: "Укажите финансовые условия и сроки",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rentalPrice">Стоимость аренды в месяц (руб.) *</Label>
            <Input
              id="rentalPrice"
              type="number"
              placeholder="30000"
              value={formData.rentalPrice}
              onChange={(e) => updateField("rentalPrice", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rentalPeriod">Срок аренды *</Label>
            <Input
              id="rentalPeriod"
              placeholder="1 год / 6 месяцев"
              value={formData.rentalPeriod}
              onChange={(e) => updateField("rentalPeriod", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Дата начала аренды *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Коммунальные услуги</Label>
            <RadioGroup
              value={formData.utilities}
              onValueChange={(value) => updateField("utilities", value)}
              className="grid grid-cols-2 gap-4"
            >
              <label
                htmlFor="utilities-included"
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.utilities === "включены"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <RadioGroupItem value="включены" id="utilities-included" />
                <span className="font-medium">Включены в стоимость</span>
              </label>
              <label
                htmlFor="utilities-not-included"
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.utilities === "не включены"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <RadioGroupItem value="не включены" id="utilities-not-included" />
                <span className="font-medium">Оплачиваются отдельно</span>
              </label>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Город *</Label>
              <Input
                id="city"
                placeholder="Москва"
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signDate">Дата подписания *</Label>
              <Input
                id="signDate"
                type="date"
                value={formData.signDate}
                onChange={(e) => updateField("signDate", e.target.value)}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Готово!",
      description: "Ваш документ готов к скачиванию",
      content: (
        <div className="space-y-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Документ готов!</h3>
                  <p className="text-gray-600 mb-4">
                    Вы успешно заполнили все необходимые поля. Теперь вы можете скачать договор аренды квартиры в формате Word.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Все данные заполнены</li>
                    <li>✓ Документ соответствует законодательству РФ</li>
                    <li>✓ Готов к подписанию сторонами</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full" onClick={handleDownloadWord}>
              <Download className="w-5 h-5 mr-2" />
              Скачать Word (.docx)
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-5 h-5 mr-2" />
              {showPreview ? "Скрыть предпросмотр" : "Показать предпросмотр"}
            </Button>
          </div>

          {showPreview && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="prose prose-sm max-w-none">
                  <div className="text-center mb-6">
                    <h3 className="font-bold text-lg">ДОГОВОР АРЕНДЫ ЖИЛОГО ПОМЕЩЕНИЯ</h3>
                    <p className="text-right text-sm mt-2">
                      г. {formData.city}, {formatDate(new Date(formData.signDate))}
                    </p>
                  </div>
                  
                  <p className="mb-4">
                    {formData.landlordName}, паспорт {formData.landlordPassport}, проживающий(ая) по адресу: {formData.landlordAddress}, 
                    именуемый(ая) в дальнейшем "Арендодатель", с одной стороны, и
                  </p>
                  
                  <p className="mb-4">
                    {formData.tenantName}, паспорт {formData.tenantPassport}, проживающий(ая) по адресу: {formData.tenantAddress}, 
                    именуемый(ая) в дальнейшем "Арендатор", с другой стороны, заключили настоящий договор о нижеследующем:
                  </p>

                  <p className="font-semibold mt-6 mb-2">1. ПРЕДМЕТ ДОГОВОРА</p>
                  <p className="mb-4">
                    1.1. Арендодатель передает, а Арендатор принимает во временное владение и пользование жилое помещение (квартиру), 
                    расположенное по адресу: {formData.apartmentAddress}, общей площадью {formData.apartmentArea} кв.м, 
                    количество комнат: {formData.apartmentRooms}.
                  </p>

                  <p className="font-semibold mt-6 mb-2">2. СРОК ДЕЙСТВИЯ ДОГОВОРА</p>
                  <p className="mb-4">
                    2.1. Квартира передается Арендатору на срок {formData.rentalPeriod} с {formatDate(new Date(formData.startDate))}.
                  </p>

                  <p className="font-semibold mt-6 mb-2">3. РАЗМЕР И ПОРЯДОК ВНЕСЕНИЯ ПЛАТЫ</p>
                  <p className="mb-2">
                    3.1. Размер арендной платы составляет {formData.rentalPrice} ({numberToWords(parseInt(formData.rentalPrice) || 0)}{" "}
                    {rublesWord(parseInt(formData.rentalPrice) || 0)}) рублей в месяц.
                  </p>
                  <p className="mb-4">
                    3.2. Коммунальные услуги {formData.utilities} в арендную плату.
                  </p>

                  <p className="text-sm text-gray-500 mt-6">
                    ... (полный текст документа будет в скачанном файле)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>⚠️ Важно:</strong> Перед подписанием внимательно проверьте все данные. 
              Рекомендуем показать документ юристу для проверки, особенно если сумма сделки значительная.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DocumentWizard
      title="Договор аренды квартиры"
      description="Создайте договор аренды жилого помещения за несколько минут"
      steps={steps}
      onComplete={() => {
        setShowPreview(true);
        toast.success("Документ готов к скачиванию!");
      }}
      canProceed={canProceed}
    />
  );
}