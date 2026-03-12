import { useState } from "react";
import { DocumentWizard } from "../components/DocumentWizard";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Download, Eye } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";
import { generateWord, createParagraph, formatDate, numberToWords, rublesWord } from "../utils/documentGenerator";
import { AlignmentType } from "docx";
import { LimitBanner } from "../components/LimitBanner";
import { useDocumentGeneration } from "../hooks/useDocumentGeneration";

interface ServiceContractData {
  customerName: string;
  customerDetails: string;
  performerName: string;
  performerDetails: string;
  serviceDescription: string;
  price: string;
  deadline: string;
  city: string;
  date: string;
}

export function ServiceContract() {
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('dogovor-okazaniya-uslug');
  
  const [formData, setFormData] = useState<ServiceContractData>({
    customerName: "",
    customerDetails: "",
    performerName: "",
    performerDetails: "",
    serviceDescription: "",
    price: "",
    deadline: "",
    city: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateField = (field: keyof ServiceContractData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const canProceed = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        return !!(formData.customerName && formData.customerDetails);
      case 1:
        return !!(formData.performerName && formData.performerDetails);
      case 2:
        return !!(formData.serviceDescription && formData.price && formData.deadline && formData.city && formData.date);
      default:
        return true;
    }
  };

  const generateDocument = () => {
    const price = parseInt(formData.price) || 0;
    const priceInWords = numberToWords(price);

    const sections = [
      createParagraph("ДОГОВОР ОКАЗАНИЯ УСЛУГ", { alignment: AlignmentType.CENTER, bold: true, size: 28 }),
      createParagraph(`№ ____`, { alignment: AlignmentType.CENTER, after: 200 }),
      
      createParagraph(`г. ${formData.city}`, { alignment: AlignmentType.RIGHT }),
      createParagraph(formatDate(new Date(formData.date)), { alignment: AlignmentType.RIGHT, after: 200 }),

      createParagraph(
        `${formData.customerName}, ${formData.customerDetails}, именуемый в дальнейшем "Заказчик", с одной стороны, и ${formData.performerName}, ${formData.performerDetails}, именуемый в дальнейшем "Исполнитель", с другой стороны, заключили настоящий договор о нижеследующем:`,
        { before: 200 }
      ),

      createParagraph("1. ПРЕДМЕТ ДОГОВОРА", { bold: true, before: 300 }),
      createParagraph(
        `1.1. Исполнитель обязуется по заданию Заказчика оказать услуги: ${formData.serviceDescription}, а Заказчик обязуется оплатить эти услуги.`,
        {}
      ),

      createParagraph("2. СТОИМОСТЬ УСЛУГ И ПОРЯДОК РАСЧЕТОВ", { bold: true, before: 300 }),
      createParagraph(
        `2.1. Стоимость услуг по настоящему договору составляет ${formData.price} (${priceInWords} ${rublesWord(price)}) рублей.`,
        {}
      ),
      createParagraph(
        "2.2. Оплата производится в течение 3 банковских дней с момента подписания акта выполненных работ.",
        {}
      ),

      createParagraph("3. СРОКИ ВЫПОЛНЕНИЯ", { bold: true, before: 300 }),
      createParagraph(
        `3.1. Срок оказания услуг: ${formData.deadline}.`,
        {}
      ),

      createParagraph("4. ПРАВА И ОБЯЗАННОСТИ СТОРОН", { bold: true, before: 300 }),
      createParagraph("4.1. Исполнитель обязуется:", {}),
      createParagraph("- оказать услуги качественно и в установленный срок;", {}),
      createParagraph("- соблюдать конфиденциальность информации Заказчика.", {}),
      
      createParagraph("4.2. Заказчик обязуется:", { before: 200 }),
      createParagraph("- своевременно оплатить услуги;", {}),
      createParagraph("- предоставить необходимую информацию для оказания услуг.", {}),

      createParagraph("5. ОТВЕТСТВЕННОСТЬ СТОРОН", { bold: true, before: 300 }),
      createParagraph(
        "5.1. За неисполнение или ненадлежащее исполнение обязательств стороны несут ответственность в соответствии с законодательством РФ.",
        {}
      ),

      createParagraph("6. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ", { bold: true, before: 300 }),
      createParagraph(
        "6.1. Договор вступает в силу с момента подписания и действует до полного исполнения обязательств сторонами.",
        {}
      ),
      createParagraph(
        "6.2. Договор составлен в двух экземплярах, по одному для каждой стороны.",
        {}
      ),

      createParagraph("РЕКВИЗИТЫ И ПОДПИСИ СТОРОН", { bold: true, before: 400, alignment: AlignmentType.CENTER }),
      
      createParagraph("Заказчик:", { before: 200 }),
      createParagraph(formData.customerName, {}),
      createParagraph("________________", { after: 200 }),
      
      createParagraph("Исполнитель:", {}),
      createParagraph(formData.performerName, {}),
      createParagraph("________________", {}),
    ];

    return sections;
  };

  const handleDownloadWord = async () => {
    if (!checkLimit()) return;
    try {
      const saved = await saveDocument(formData);
      if (!saved) return;
      const sections = generateDocument();
      await generateWord(sections, "dogovor-okazaniya-uslug.docx");
      toast.success("Документ успешно скачан!");
    } catch (error) {
      toast.error("Ошибка при создании документа");
      console.error(error);
    }
  };

  const steps = [
    {
      title: "Заказчик",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Наименование заказчика *</Label>
            <Input placeholder="ООО 'Компания' или Иванов И.И." value={formData.customerName} onChange={(e) => updateField("customerName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Реквизиты заказчика *</Label>
            <Textarea placeholder="ИНН, КПП, адрес или паспортные данные" value={formData.customerDetails} onChange={(e) => updateField("customerDetails", e.target.value)} />
          </div>
        </div>
      ),
    },
    {
      title: "Исполнитель",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Наименование исполнителя *</Label>
            <Input placeholder="ИП Иванов И.И. или ООО 'Компания'" value={formData.performerName} onChange={(e) => updateField("performerName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Реквизиты исполнителя *</Label>
            <Textarea placeholder="ИНН, КПП, адрес, банковские реквизиты" value={formData.performerDetails} onChange={(e) => updateField("performerDetails", e.target.value)} />
          </div>
        </div>
      ),
    },
    {
      title: "Условия",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Описание услуг *</Label>
            <Textarea placeholder="Подробное описание оказываемых услуг" value={formData.serviceDescription} onChange={(e) => updateField("serviceDescription", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Стоимость (руб) *</Label>
            <Input type="number" placeholder="50000" value={formData.price} onChange={(e) => updateField("price", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Срок выполнения *</Label>
            <Input placeholder="до 31.12.2026 или в течение 30 дней" value={formData.deadline} onChange={(e) => updateField("deadline", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Город *</Label>
            <Input placeholder="Москва" value={formData.city} onChange={(e) => updateField("city", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Дата *</Label>
            <Input type="date" value={formData.date} onChange={(e) => updateField("date", e.target.value)} />
          </div>
        </div>
      ),
    },
    {
      title: "Готово",
      content: (
        <div className="space-y-6">
          {showPreview && (
            <Card><CardContent className="p-6"><div className="prose max-w-none">
              <h3 className="text-center font-bold">ДОГОВОР ОКАЗАНИЯ УСЛУГ</h3>
              <p>Заказчик: {formData.customerName}</p>
              <p>Исполнитель: {formData.performerName}</p>
              <p>Стоимость: {formData.price} руб.</p>
            </div></CardContent></Card>
          )}
          {!showPreview && <Button onClick={() => setShowPreview(true)} className="w-full" size="lg"><Eye className="w-5 h-5 mr-2" />Предпросмотр</Button>}
          <Button size="lg" className="w-full" onClick={handleDownloadWord} disabled={saving}>
            <Download className="w-5 h-5 mr-2" />{saving ? "Сохранение..." : "Скачать Word (.docx)"}
          </Button>
        </div>
      ),
    },
  ];

  return <DocumentWizard title="Договор оказания услуг" description="Создайте договор для оказания услуг" steps={steps} onComplete={() => {setShowPreview(true);toast.success("Договор готов!");}} canProceed={canProceed} banner={<LimitBanner />} />;
}
