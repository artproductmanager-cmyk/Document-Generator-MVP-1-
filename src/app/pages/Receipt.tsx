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
} from "../utils/validation";
import { AlignmentType, Paragraph, TextRun } from "docx";
import { useDocumentGeneration } from "../hooks/useDocumentGeneration";

interface ReceiptData {
  // Кто получает деньги
  recipientName: string;
  recipientPassport: string;
  recipientAddress: string;
  
  // Кто передает деньги
  payerName: string;
  payerPassport: string;
  payerAddress: string;
  
  // Информация о деньгах
  amount: string;
  purpose: string;
  
  // Место и дата
  city: string;
  date: string;
}

export function Receipt() {
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('raspiska-v-poluchenii-deneg');
  
  const [formData, setFormData] = useState<ReceiptData>({
    recipientName: "",
    recipientPassport: "",
    recipientAddress: "",
    payerName: "",
    payerPassport: "",
    payerAddress: "",
    amount: "",
    purpose: "",
    city: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateField = (field: keyof ReceiptData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const canProceed = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Получатель
        return !!(formData.recipientName && formData.recipientPassport && formData.recipientAddress);
      case 1: // Плательщик
        return !!(formData.payerName && formData.payerPassport && formData.payerAddress);
      case 2: // Сумма и назначение
        return !!(formData.amount && formData.purpose && formData.city);
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
            text: "РАСПИСКА",
            bold: true,
            size: 36,
            font: "Times New Roman",
          }),
        ],
      }),
      
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: "в получении денежных средств",
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

      // Основной текст
      createParagraph(
        `Я, ${formData.recipientName}, паспорт ${formData.recipientPassport}, зарегистрирован(а) по адресу: ${formData.recipientAddress}, получил(а) от ${formData.payerName}, паспорт ${formData.payerPassport}, зарегистрирован(а) по адресу: ${formData.payerAddress}, денежные средства в размере ${formData.amount} (${amountInWords} ${rublesWord(amount)}) рублей.`,
        { before: 200 }
      ),

      createParagraph(
        `Назначение платежа: ${formData.purpose}`,
        { before: 200 }
      ),

      createParagraph(
        "Денежные средства получены в полном объеме. Претензий к передавшему денежные средства не имею.",
        { before: 200 }
      ),

      // Подпись
      new Paragraph({
        spacing: { after: 200, before: 600 },
        children: [
          new TextRun({
            text: `Получатель: ${formData.recipientName}`,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),

      createParagraph("Подпись: _______________", { before: 200 }),
      
      new Paragraph({
        spacing: { before: 200 },
        children: [
          new TextRun({
            text: `Дата: ${formatDate(new Date(formData.date))}`,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),
    ];

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
      await generateWord(sections, "raspiska.docx");
      toast.success("Документ успешно скачан!");
    } catch (error) {
      toast.error("Ошибка при создании документа");
      console.error(error);
    }
  };

  const steps = [
    {
      title: "Получатель денег",
      description: "Укажите данные того, кто получает деньги",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <ValidatedInput
              label="ФИО получателя"
              id="recipientName"
              placeholder="Иванов Иван Иванович"
              value={formData.recipientName}
              onChange={(e) => updateField("recipientName", e.target.value)}
              validate={validateFullName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientPassport">Паспортные данные *</Label>
            <Input
              id="recipientPassport"
              placeholder="1234 567890"
              value={formData.recipientPassport}
              onChange={(e) => updateField("recipientPassport", e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Формат: 1234 567890 (4 цифры серии + 6 цифр номера)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientAddress">Адрес регистрации *</Label>
            <Textarea
              id="recipientAddress"
              placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
              value={formData.recipientAddress}
              onChange={(e) => updateField("recipientAddress", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Плательщик",
      description: "Укажите данные того, кто передает деньги",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <ValidatedInput
              label="ФИО плательщика"
              id="payerName"
              placeholder="Петров Петр Петрович"
              value={formData.payerName}
              onChange={(e) => updateField("payerName", e.target.value)}
              validate={validateFullName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payerPassport">Паспортные данные *</Label>
            <Input
              id="payerPassport"
              placeholder="1234 567890"
              value={formData.payerPassport}
              onChange={(e) => updateField("payerPassport", e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Формат: 1234 567890 (4 цифры серии + 6 цифр номера)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payerAddress">Адрес регистрации *</Label>
            <Textarea
              id="payerAddress"
              placeholder="г. Санкт-Петербург, пр. Невский, д. 1, кв. 1"
              value={formData.payerAddress}
              onChange={(e) => updateField("payerAddress", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Сумма и назначение",
      description: "Укажите сумму и цель передачи денег",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма (руб.) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="50000"
              value={formData.amount}
              onChange={(e) => updateField("amount", e.target.value)}
            />
            {formData.amount && (
              <p className="text-sm text-gray-500">
                Происью: {numberToWords(parseInt(formData.amount))} {rublesWord(parseInt(formData.amount))}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Назначение платежа *</Label>
            <Textarea
              id="purpose"
              placeholder="Например: в качестве предоплаты по договору купли-продажи автомобиля"
              value={formData.purpose}
              onChange={(e) => updateField("purpose", e.target.value)}
              rows={3}
            />
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
              <Label htmlFor="date">Дата *</Label>
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
      description: "Ваша расписка готова к скачиванию",
      content: (
        <div className="space-y-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Расписка готова!</h3>
                  <p className="text-gray-600 mb-4">
                    Вы успешно заполнили все необходимые поля. Теперь вы можете скачать расписку в формате Word, распечатать и подписать.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Все данные заполнены</li>
                    <li>✓ Документ имеет юридическую силу</li>
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
                    <h2 className="font-bold text-2xl mb-2">РАСПИСКА</h2>
                    <p className="text-lg">в получении денежных средств</p>
                    <p className="text-right text-sm mt-4">
                      г. {formData.city}, {formatDate(new Date(formData.date))}
                    </p>
                  </div>
                  
                  <p className="mb-4 text-justify leading-relaxed">
                    Я, {formData.recipientName}, паспорт {formData.recipientPassport}, зарегистрирован(а) по адресу: {formData.recipientAddress}, 
                    получил(а) от {formData.payerName}, паспорт {formData.payerPassport}, зарегистрирован(а) по адресу: {formData.payerAddress}, 
                    деежные средства в размере {formData.amount} ({numberToWords(parseInt(formData.amount) || 0)}{" "}
                    {rublesWord(parseInt(formData.amount) || 0)}) рублей.
                  </p>

                  <p className="mb-4">
                    Назначение платежа: {formData.purpose}
                  </p>

                  <p className="mb-8">
                    Денежные средства получены в полном объеме. Претензий к передавшему денежные средства не имею.
                  </p>

                  <div className="mt-12">
                    <p className="mb-2">Получатель: {formData.recipientName}</p>
                    <p className="mb-2">Подпись: _______________</p>
                    <p>Дата: {formatDate(new Date(formData.date))}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>💡 Совет:</strong> Расписка имеет юридическую силу только при наличии собственноручной подписи получателя денег. 
              Рекомендуется составить в двух экземплярах.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DocumentWizard
      title="Расписка в получении денег"
      description="Создайте расписку для подтверждения передачи денежных средств"
      steps={steps}
      onComplete={() => {
        setShowPreview(true);
        toast.success("Расписка готова к скачиванию!");
      }}
      canProceed={canProceed}
    />
  );
}