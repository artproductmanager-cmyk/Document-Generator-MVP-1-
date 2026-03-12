import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
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
  validateVIN,
  formatVIN,
  validatePassport,
  formatPassport,
} from "../utils/validation";
import { AlignmentType, Paragraph, TextRun } from "docx";
import { useDocumentGeneration } from "../hooks/useDocumentGeneration";

interface CarSaleData {
  // Продавец
  sellerName: string;
  sellerPassport: string;
  sellerAddress: string;
  
  // Покупатель
  buyerName: string;
  buyerPassport: string;
  buyerAddress: string;
  
  // Автомобиль
  carBrand: string;
  carModel: string;
  carYear: string;
  carVin: string;
  carEngine: string;
  carColor: string;
  carPts: string;
  carMileage: string;
  
  // Условия
  price: string;
  
  // Место и дата
  city: string;
  date: string;
}

export function CarSale() {
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('dogovor-kupli-prodazhi-avto');
  
  const [formData, setFormData] = useState<CarSaleData>({
    sellerName: "",
    sellerPassport: "",
    sellerAddress: "",
    buyerName: "",
    buyerPassport: "",
    buyerAddress: "",
    carBrand: "",
    carModel: "",
    carYear: "",
    carVin: "",
    carEngine: "",
    carColor: "",
    carPts: "",
    carMileage: "",
    price: "",
    city: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateField = (field: keyof CarSaleData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const canProceed = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Продавец
        return !!(formData.sellerName && formData.sellerPassport && formData.sellerAddress);
      case 1: // Покупатель
        return !!(formData.buyerName && formData.buyerPassport && formData.buyerAddress);
      case 2: // Автомобиль
        return !!(
          formData.carBrand &&
          formData.carModel &&
          formData.carYear &&
          formData.carVin &&
          formData.carColor
        );
      case 3: // Цена
        return !!(formData.price && formData.city);
      default:
        return true;
    }
  };

  const generateDocument = () => {
    const price = parseInt(formData.price) || 0;
    const priceInWords = numberToWords(price);
    
    const sections = [
      // Заголовок
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: "ДОГОВОР КУПЛИ-ПРОДАЖИ",
            bold: true,
            size: 32,
            font: "Times New Roman",
          }),
        ],
      }),
      
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: "транспортного средства",
            size: 28,
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
            text: `г. ${formData.city}, ${formatDate(new Date(formData.date))}`,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),

      // Стороны
      createParagraph(
        `${formData.sellerName}, паспорт ${formData.sellerPassport}, зарегистрирован(а) по адресу: ${formData.sellerAddress}, именуемый(ая) в дальнейшем "Продавец", с одной стороны, и`,
        {}
      ),
      
      createParagraph(
        `${formData.buyerName}, паспорт ${formData.buyerPassport}, зарегистрирован(а) по адресу: ${formData.buyerAddress}, именуемый(ая) в дальнейшем "Покупатель", с другой стороны, заключили настоящий договор о нижеследующем:`,
        {}
      ),

      // 1. Предмет договора
      createParagraph("1. ПРЕДМЕТ ДОГОВОРА", { bold: true, before: 300 }),
      
      createParagraph(
        `1.1. Продавец обязуется передать в собственность Покупателя транспортное средство (далее - ТС):`,
        {}
      ),
      
      createParagraph(`- Марка, модель: ${formData.carBrand} ${formData.carModel}`, {}),
      createParagraph(`- Год выпуска: ${formData.carYear} г.`, {}),
      createParagraph(`- VIN: ${formData.carVin}`, {}),
      formData.carEngine && createParagraph(`- Номер двигателя: ${formData.carEngine}`, {}),
      createParagraph(`- Цвет: ${formData.carColor}`, {}),
      formData.carPts && createParagraph(`- ПТС серия и номер: ${formData.carPts}`, {}),
      formData.carMileage && createParagraph(`- Пробег: ${formData.carMileage} км`, {}),

      createParagraph(
        "1.2. Продавец гарантирует, что до заключения настоящего договора указанное транспортное средство никому не продано, не заложено, в споре и под арестом (запрещением) не состоит.",
        { before: 200 }
      ),

      // 2. Цена и порядок расчетов
      createParagraph("2. ЦЕНА И ПОРЯДОК РАСЧЕТОВ", { bold: true, before: 300 }),
      
      createParagraph(
        `2.1. Цена транспортного средства составляет ${formData.price} (${priceInWords} ${rublesWord(price)}) рублей.`,
        {}
      ),
      
      createParagraph(
        "2.2. Оплата производится в момент подписания настоящего договора.",
        {}
      ),

      createParagraph(
        "2.3. Расчет между сторонами произведен полностью в момент подписания настоящего договора. Стороны взаимных претензий не имеют.",
        {}
      ),

      // 3. Передача транспортного средства
      createParagraph("3. ПЕРЕДАЧА ТРАНСПОРТНОГО СРЕДСТВА", { bold: true, before: 300 }),
      
      createParagraph(
        "3.1. Одновременно с подписанием настоящего договора Продавец передает Покупателю:",
        {}
      ),
      
      createParagraph("- транспортное средство, указанное в п. 1.1 настоящего договора;", {}),
      createParagraph("- паспорт транспортного средства (ПТС);", {}),
      createParagraph("- свидетельство о регистрации транспортного средства (СТС);", {}),
      createParagraph("- два комплекта ключей от транспортного средства.", {}),

      createParagraph(
        "3.2. С момента подписания настоящего договора право собственности на транспортное средство переходит к Покупателю.",
        { before: 200 }
      ),

      // 4. Прочие условия
      createParagraph("4. ПРОЧИЕ УСЛОВИЯ", { bold: true, before: 300 }),
      
      createParagraph(
        "4.1. Настоящий договор составлен в трех экземплярах, имеющих одинаковую юридическую силу: один - для Продавца, один - для Покупателя, один - для органов ГИБДД.",
        {}
      ),
      
      createParagraph(
        "4.2. Покупатель обязуется в 10-дневный срок с момента покупки зарегистрировать транспортное средство в органах ГИБДД.",
        {}
      ),

      createParagraph(
        "4.3. Настоящий договор вступает в силу с момента его подписания.",
        {}
      ),

      // Подписи
      createParagraph("5. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН", { bold: true, before: 300 }),
      
      new Paragraph({
        spacing: { after: 200, before: 400 },
        children: [
          new TextRun({
            text: "ПРОДАВЕЦ:",
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),
      createParagraph(`${formData.sellerName}`, {}),
      createParagraph(`Паспорт: ${formData.sellerPassport}`, {}),
      createParagraph(`Адрес: ${formData.sellerAddress}`, {}),
      createParagraph("", {}),
      createParagraph("Подпись: _______________", {}),
      
      new Paragraph({
        spacing: { after: 200, before: 400 },
        children: [
          new TextRun({
            text: "ПОКУПАТЕЛЬ:",
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),
      createParagraph(`${formData.buyerName}`, {}),
      createParagraph(`Паспорт: ${formData.buyerPassport}`, {}),
      createParagraph(`Адрес: ${formData.buyerAddress}`, {}),
      createParagraph("", {}),
      createParagraph("Подпись: _______________", {}),
    ].filter(Boolean);

    return sections;
  };

  const handleDownloadWord = async () => {
    // Проверяем лимиты перед генерацией
    if (!checkLimit()) {
      return;
    }

    try {
      // Сохраняем документ на сервере
      const saved = await saveDocument(formData);
      
      if (!saved) {
        return; // Если сохранение не удалось, не скачиваем файл
      }

      // Генерируем и скачиваем файл
      const sections = generateDocument();
      await generateWord(sections, "dogovor-kupli-prodazhi-avto.docx");
      toast.success("Документ успешно скачан!");
    } catch (error) {
      toast.error("Ошибка при создании документа");
      console.error(error);
    }
  };

  const steps = [
    {
      title: "Продавец",
      description: "Укажите данные продавца автомобиля",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <ValidatedInput
              label="ФИО продавца"
              id="sellerName"
              placeholder="Иванов Иван Иванович"
              value={formData.sellerName}
              onChange={(e) => updateField("sellerName", e.target.value)}
              validate={validateFullName}
              required
            />
          </div>

          <div className="space-y-2">
            <ValidatedInput
              label="Паспортные данные"
              id="sellerPassport"
              placeholder="1234 567890"
              value={formData.sellerPassport}
              onChange={(e) => updateField("sellerPassport", e.target.value)}
              validate={validatePassport}
              formatValue={formatPassport}
              helpText="Формат: 1234 567890 (4 цифры серии + 6 цифр номера)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellerAddress">Адрес регистрации *</Label>
            <Textarea
              id="sellerAddress"
              placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
              value={formData.sellerAddress}
              onChange={(e) => updateField("sellerAddress", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Покупатель",
      description: "Укажите данные покупателя автомобиля",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <ValidatedInput
              label="ФИО покупателя"
              id="buyerName"
              placeholder="Петров Петр Петрович"
              value={formData.buyerName}
              onChange={(e) => updateField("buyerName", e.target.value)}
              validate={validateFullName}
              required
            />
          </div>

          <div className="space-y-2">
            <ValidatedInput
              label="Паспортные данные"
              id="buyerPassport"
              placeholder="1234 567890"
              value={formData.buyerPassport}
              onChange={(e) => updateField("buyerPassport", e.target.value)}
              validate={validatePassport}
              formatValue={formatPassport}
              helpText="Формат: 1234 567890 (4 цифры серии + 6 цифр номера)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyerAddress">Адрес регистрации *</Label>
            <Textarea
              id="buyerAddress"
              placeholder="г. Санкт-Петербург, пр. Невский, д. 1, кв. 1"
              value={formData.buyerAddress}
              onChange={(e) => updateField("buyerAddress", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Данные автомобиля",
      description: "Укажите характеристики транспортного средства",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carBrand">Марка *</Label>
              <Input
                id="carBrand"
                placeholder="Toyota"
                value={formData.carBrand}
                onChange={(e) => updateField("carBrand", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carModel">Модель *</Label>
              <Input
                id="carModel"
                placeholder="Camry"
                value={formData.carModel}
                onChange={(e) => updateField("carModel", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carYear">Год выпуска *</Label>
              <Input
                id="carYear"
                type="number"
                placeholder="2020"
                value={formData.carYear}
                onChange={(e) => updateField("carYear", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carColor">Цвет *</Label>
              <Input
                id="carColor"
                placeholder="Черный"
                value={formData.carColor}
                onChange={(e) => updateField("carColor", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <ValidatedInput
              label="VIN номер"
              id="carVin"
              placeholder="WVWZZZ3CZBE123456"
              value={formData.carVin}
              onChange={(e) => updateField("carVin", e.target.value.toUpperCase())}
              validate={validateVIN}
              formatValue={formatVIN}
              helpText="17 символов, только латинские буквы и цифры"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carEngine">Номер двигателя</Label>
            <Input
              id="carEngine"
              placeholder="1234567890"
              value={formData.carEngine}
              onChange={(e) => updateField("carEngine", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carPts">ПТС (серия и номер)</Label>
            <Input
              id="carPts"
              placeholder="77 АА 123456"
              value={formData.carPts}
              onChange={(e) => updateField("carPts", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carMileage">Пробег (км)</Label>
            <Input
              id="carMileage"
              type="number"
              placeholder="50000"
              value={formData.carMileage}
              onChange={(e) => updateField("carMileage", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Цена и условия",
      description: "Укажите стоимость автомобиля",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="price">Цена автомобиля (руб.) *</Label>
            <Input
              id="price"
              type="number"
              placeholder="850000"
              value={formData.price}
              onChange={(e) => updateField("price", e.target.value)}
            />
            {formData.price && (
              <p className="text-sm text-gray-500">
                Прописью: {numberToWords(parseInt(formData.price))} {rublesWord(parseInt(formData.price))}
              </p>
            )}
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
              <Label htmlFor="date">Дата сделки *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Готово!",
      description: "Ваш договор готов к скачиванию",
      content: (
        <div className="space-y-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Договор готов!</h3>
                  <p className="text-gray-600 mb-4">
                    Договор купли-продажи автомобиля готов к скачиванию. Распечатайте 3 экземпляра: для продавца, покупателя и ГИБДД.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Все данные заполнены</li>
                    <li>✓ Договор соответствует требованиям ГИБДД</li>
                    <li>✓ Готов к подписанию</li>
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
                    <h2 className="font-bold text-xl mb-1">ДОГОВОР КУПЛИ-ПРОДАЖИ</h2>
                    <p className="text-lg">транспортного средства</p>
                    <p className="text-right text-sm mt-4">
                      г. {formData.city}, {formatDate(new Date(formData.date))}
                    </p>
                  </div>
                  
                  <p className="mb-2">
                    {formData.sellerName}, паспорт {formData.sellerPassport}, "Продавец", и
                  </p>
                  <p className="mb-4">
                    {formData.buyerName}, паспорт {formData.buyerPassport}, "Покупатель".
                  </p>

                  <p className="font-semibold mt-4 mb-2">1. ПРЕДМЕТ ДОГОВОРА</p>
                  <p>Транспортное средство:</p>
                  <ul className="list-disc pl-5 mb-4">
                    <li>{formData.carBrand} {formData.carModel}</li>
                    <li>Год: {formData.carYear}</li>
                    <li>VIN: {formData.carVin}</li>
                    <li>Цвет: {formData.carColor}</li>
                  </ul>

                  <p className="font-semibold mt-4 mb-2">2. ЦЕНА</p>
                  <p className="mb-4">
                    Цена ТС: {formData.price} ({numberToWords(parseInt(formData.price) || 0)}{" "}
                    {rublesWord(parseInt(formData.price) || 0)}) рублей.
                  </p>

                  <p className="text-sm text-gray-500 mt-6">
                    ... (полный текст документа будет в скачанном файле)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>💡 Важно:</strong> После подписания договора у покупателя есть 10 дней для регистрации автомобиля в ГИБДД. 
              Не забудьте проверить автомобиль на наличие ограничений на сайте ГИБДД перед покупкой.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DocumentWizard
      title="Договор купли-продажи автомобиля"
      description="Создайте договор для безопасной сделки с автомобилем"
      steps={steps}
      onComplete={() => {
        setShowPreview(true);
        toast.success("Договор готов к скачиванию!");
      }}
      canProceed={canProceed}
    />
  );
}