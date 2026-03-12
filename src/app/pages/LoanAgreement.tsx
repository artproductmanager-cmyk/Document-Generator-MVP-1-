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
import { AlignmentType, Paragraph, TextRun } from "docx";
import { useDocumentGeneration } from "../hooks/useDocumentGeneration";
import {
  generateWord,
  createParagraph,
  formatDate,
  numberToWords,
  rublesWord,
} from "../utils/documentGenerator";
import { ValidatedInput } from "../components/ui/validated-input";
import { validateFullName } from "../utils/validation";

interface LoanData {
  // Заимодавец
  lenderName: string;
  lenderPassport: string;
  lenderAddress: string;
  
  // Заемщик
  borrowerName: string;
  borrowerPassport: string;
  borrowerAddress: string;
  
  // Условия займа
  amount: string;
  hasInterest: "yes" | "no";
  interestRate: string;
  returnDate: string;
  
  // Место и дата
  city: string;
  date: string;
}

export function LoanAgreement() {
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('dogovor-zajma');
  
  const [formData, setFormData] = useState<LoanData>({
    lenderName: "",
    lenderPassport: "",
    lenderAddress: "",
    borrowerName: "",
    borrowerPassport: "",
    borrowerAddress: "",
    amount: "",
    hasInterest: "no",
    interestRate: "",
    returnDate: "",
    city: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateField = (field: keyof LoanData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const canProceed = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Заимодавец
        return !!(formData.lenderName && formData.lenderPassport && formData.lenderAddress);
      case 1: // Заемщик
        return !!(formData.borrowerName && formData.borrowerPassport && formData.borrowerAddress);
      case 2: // Условия займа
        const baseConditions = !!(formData.amount && formData.returnDate && formData.city);
        if (formData.hasInterest === "yes") {
          return baseConditions && !!formData.interestRate;
        }
        return baseConditions;
      default:
        return true;
    }
  };

  const generateDocument = () => {
    const amount = parseInt(formData.amount) || 0;
    const amountInWords = numberToWords(amount);
    
    const sections = [
      // Заголовок
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: "ДОГОВОР ЗАЙМА",
            bold: true,
            size: 36,
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
        `${formData.lenderName}, паспорт ${formData.lenderPassport}, зарегистрирован(а) по адресу: ${formData.lenderAddress}, именуемый(ая) в дальнейшем "Заимодавец", с одной стороны, и`,
        {}
      ),
      
      createParagraph(
        `${formData.borrowerName}, паспорт ${formData.borrowerPassport}, зарегистрирован(а) по адресу: ${formData.borrowerAddress}, именуемый(ая) в дальнейшем "Заемщик", с другой стороны, заключили настоящий договор о нижеследующем:`,
        {}
      ),

      // 1. Предмет договора
      createParagraph("1. ПРЕДМЕТ ДОГОВОРА", { bold: true, before: 300 }),
      
      createParagraph(
        `1.1. Заимодавец передает в собственность Заемщику денежные средства в размере ${formData.amount} (${amountInWords} ${rublesWord(amount)}) рублей, а Заемщик обязуется возвратить Заимодавцу указанную сумму ${formData.hasInterest === "yes" ? "с процентами" : "без процентов"} в срок и на условиях настоящего договора.`,
        {}
      ),

      createParagraph(
        "1.2. Сумма займа передается Заемщику в момент подписания настоящего договора наличными денежными средствами.",
        {}
      ),

      // 2. Срок возврата займа
      createParagraph("2. СРОК ВОЗВРАТА ЗАЙМА", { bold: true, before: 300 }),
      
      createParagraph(
        `2.1. Заемщик обязуется возвратить полученную сумму займа ${formData.hasInterest === "yes" ? "с процентами" : ""} не позднее ${formatDate(new Date(formData.returnDate))}.`,
        {}
      ),

      createParagraph(
        "2.2. Заемщик вправе возвратить сумму займа досрочно.",
        {}
      ),
    ];

    // Проценты
    if (formData.hasInterest === "yes") {
      sections.push(
        createParagraph("3. ПРОЦЕНТЫ ЗА ПОЛЬЗОВАНИЕ ЗАЙМОМ", { bold: true, before: 300 }),
        
        createParagraph(
          `3.1. За пользование займом Заемщик выплачивает Заимодавцу проценты в размере ${formData.interestRate}% годовых.`,
          {}
        ),

        createParagraph(
          "3.2. Проценты начисляются со дня, следующего за днем предоставления займа, по день возврата суммы займа включительно.",
          {}
        ),

        createParagraph(
          "3.3. Проценты уплачиваются Заемщиком одновременно с возвратом суммы займа.",
          {}
        )
      );
    }

    // Ответственность сторон
    const responsibilitySection = formData.hasInterest === "yes" ? "4" : "3";
    sections.push(
      createParagraph(`${responsibilitySection}. ОТВЕТСТВЕННОСТЬ СТОРОН`, { bold: true, before: 300 }),
      
      createParagraph(
        `${responsibilitySection}.1. В случае невозврата суммы займа в установленный срок Заемщик уплачивает Заимодавцу пени в размере 0,1% от суммы займа за каждый день просрочки.`,
        {}
      ),

      createParagraph(
        `${responsibilitySection}.2. Уплата неустойки не освобождает Заемщика от исполнения обязательств по настоящему договор.`,
        {}
      )
    );

    // Прочие условия
    const otherSection = formData.hasInterest === "yes" ? "5" : "4";
    sections.push(
      createParagraph(`${otherSection}. ПРОЧИЕ УСЛОВИЯ`, { bold: true, before: 300 }),
      
      createParagraph(
        `${otherSection}.1. Настоящий договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из сторон.`,
        {}
      ),
      
      createParagraph(
        `${otherSection}.2. Споры по настоящему договору разрешаются путем переговоров, а при недстижении согласия - в судебном порядке по месту жительства Заимодавца.`,
        {}
      ),

      createParagraph(
        `${otherSection}.3. Настоящий договор вступает в силу с момента его подписания и действует до полного исполнения сторонами своих обязательств.`,
        {}
      )
    );

    // Подписи
    const signaturesSection = formData.hasInterest === "yes" ? "6" : "5";
    sections.push(
      createParagraph(`${signaturesSection}. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН`, { bold: true, before: 300 }),
      
      new Paragraph({
        spacing: { after: 200, before: 400 },
        children: [
          new TextRun({
            text: "ЗАИМОДАВЕЦ:",
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),
      createParagraph(`${formData.lenderName}`, {}),
      createParagraph(`Паспорт: ${formData.lenderPassport}`, {}),
      createParagraph(`Адрес: ${formData.lenderAddress}`, {}),
      createParagraph("", {}),
      createParagraph("Подпись: _______________", {}),
      createParagraph("", {}),
      createParagraph(`Деньги в размере ${formData.amount} рублей получены полностью.`, {}),
      
      new Paragraph({
        spacing: { after: 200, before: 400 },
        children: [
          new TextRun({
            text: "ЗАЕМЩИК:",
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),
      createParagraph(`${formData.borrowerName}`, {}),
      createParagraph(`Паспорт: ${formData.borrowerPassport}`, {}),
      createParagraph(`Адрес: ${formData.borrowerAddress}`, {}),
      createParagraph("", {}),
      createParagraph("Подпись: _______________", {})
    );

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
      await generateWord(sections, "dogovor-zajma.docx");
      toast.success("Документ успешно скачан!");
    } catch (error) {
      toast.error("Ошибка при создании документа");
      console.error(error);
    }
  };

  const steps = [
    {
      title: "Заимодавец",
      description: "Укажите данные того, кто дает деньги в долг",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <ValidatedInput
              label="ФИО заимодавца"
              id="lenderName"
              placeholder="Иванов Иван Иванович"
              value={formData.lenderName}
              onChange={(e) => updateField("lenderName", e.target.value)}
              validate={validateFullName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lenderPassport">Паспортные данные *</Label>
            <Input
              id="lenderPassport"
              placeholder="серия 1234 номер 567890, выдан..."
              value={formData.lenderPassport}
              onChange={(e) => updateField("lenderPassport", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lenderAddress">Адрес регистрации *</Label>
            <Textarea
              id="lenderAddress"
              placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
              value={formData.lenderAddress}
              onChange={(e) => updateField("lenderAddress", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Заемщик",
      description: "Укажите данные того, кто берет деньги в долг",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <ValidatedInput
              label="ФИО заемщика"
              id="borrowerName"
              placeholder="Петров Петр Петрович"
              value={formData.borrowerName}
              onChange={(e) => updateField("borrowerName", e.target.value)}
              validate={validateFullName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrowerPassport">Паспортные данные *</Label>
            <Input
              id="borrowerPassport"
              placeholder="серия 5678 номер 123456, выдан..."
              value={formData.borrowerPassport}
              onChange={(e) => updateField("borrowerPassport", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrowerAddress">Адрес регистрации *</Label>
            <Textarea
              id="borrowerAddress"
              placeholder="г. Санкт-Петербург, пр. Невский, д. 1, кв. 1"
              value={formData.borrowerAddress}
              onChange={(e) => updateField("borrowerAddress", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Условия займа",
      description: "Укажите сумму, срок и условия возврата",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма займа (руб.) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="100000"
              value={formData.amount}
              onChange={(e) => updateField("amount", e.target.value)}
            />
            {formData.amount && (
              <p className="text-sm text-gray-500">
                Прописью: {numberToWords(parseInt(formData.amount))} {rublesWord(parseInt(formData.amount))}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Проценты за пользование займом</Label>
            <RadioGroup
              value={formData.hasInterest}
              onValueChange={(value) => updateField("hasInterest", value)}
              className="grid grid-cols-2 gap-4"
            >
              <label
                htmlFor="no-interest"
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.hasInterest === "no"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <RadioGroupItem value="no" id="no-interest" />
                <span className="font-medium">Беспроцентный займ</span>
              </label>
              <label
                htmlFor="has-interest"
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.hasInterest === "yes"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <RadioGroupItem value="yes" id="has-interest" />
                <span className="font-medium">С процентами</span>
              </label>
            </RadioGroup>
          </div>

          {formData.hasInterest === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="interestRate">Процентная ставка (% годовых) *</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                placeholder="10"
                value={formData.interestRate}
                onChange={(e) => updateField("interestRate", e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Ключевая ставка ЦБ РФ на март 2026 года — около 16%. Максимальная ставка по договорам займа между физлицами ограничена законом.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="returnDate">Дата возврата займа *</Label>
            <Input
              id="returnDate"
              type="date"
              value={formData.returnDate}
              onChange={(e) => updateField("returnDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Го��од *</Label>
              <Input
                id="city"
                placeholder="Москва"
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Дата подписания *</Label>
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
      description: "Ваш договор займа готов к скачиванию",
      content: (
        <div className="space-y-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Договор займа готов!</h3>
                  <p className="text-gray-600 mb-4">
                    Вы успешно создали договор займа между физическими лицами. 
                    {formData.hasInterest === "yes" 
                      ? ` С процентной ставкой ${formData.interestRate}% годовых.`
                      : " Беспроцентный займ."}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Все данные заполнены</li>
                    <li>✓ Договор соответствует ГК РФ</li>
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
              {showPreview ? "Скрыть предпросмотр" : "Показать предпосмотр"}
            </Button>
          </div>

          {showPreview && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="prose prose-sm max-w-none">
                  <div className="text-center mb-6">
                    <h2 className="font-bold text-2xl">ДОГОВОР ЗАЙМА</h2>
                    <p className="text-right text-sm mt-4">
                      г. {formData.city}, {formatDate(new Date(formData.date))}
                    </p>
                  </div>
                  
                  <p className="mb-2">
                    {formData.lenderName}, паспорт {formData.lenderPassport}, "Заимодавец", и
                  </p>
                  <p className="mb-4">
                    {formData.borrowerName}, паспорт {formData.borrowerPassport}, "Заемщик".
                  </p>

                  <p className="font-semibold mt-6 mb-2">1. ПРЕДМЕТ ДОГОВОРА</p>
                  <p className="mb-4">
                    1.1. Заимодавец передает Заемщику {formData.amount} ({numberToWords(parseInt(formData.amount) || 0)}{" "}
                    {rublesWord(parseInt(formData.amount) || 0)}) рублей {formData.hasInterest === "yes" ? "с процентами" : "без процентов"}.
                  </p>

                  <p className="font-semibold mt-6 mb-2">2. СРОК ВОЗВРАТА ЗАЙМА</p>
                  <p className="mb-4">
                    2.1. Заемщик обязуется возвратить сумму не позднее {formatDate(new Date(formData.returnDate))}.
                  </p>

                  {formData.hasInterest === "yes" && (
                    <>
                      <p className="font-semibold mt-6 mb-2">3. ПРОЦЕНТЫ ЗА ПОЛЬЗОВАНИЕ ЗАЙМОМ</p>
                      <p className="mb-4">
                        3.1. Процентная ставка: {formData.interestRate}% годовых.
                      </p>
                    </>
                  )}

                  <p className="text-sm text-gray-500 mt-6">
                    ... (полный текст документа будет в скачанном файле)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>⚠️ Важно:</strong>
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
              <li>Договор зама имеет силу только при наличии подписей обеих сторон</li>
              <li>Рекомендуется составить расписку о получении денег</li>
              <li>Для займов на крупные суммы рекомендуется нотариальное заверение</li>
              {formData.hasInterest === "yes" && (
                <li>Проценты по займу облагаются НДФЛ у заимодавца</li>
              )}
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DocumentWizard
      title="Договор займа"
      description="Создайте договор займа между физическими лицами"
      steps={steps}
      onComplete={() => {
        setShowPreview(true);
        toast.success("Договор займа готов!");
      }}
      canProceed={canProceed}
    />
  );
}