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

interface WorkContractData {
  customerName: string; customerDetails: string; contractorName: string; contractorDetails: string;
  workDescription: string; price: string; deadline: string; city: string; date: string;
}

export function WorkContract() {
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('dogovor-podryada');
  const [formData, setFormData] = useState<WorkContractData>({
    customerName: "", customerDetails: "", contractorName: "", contractorDetails: "",
    workDescription: "", price: "", deadline: "", city: "", date: new Date().toISOString().split("T")[0],
  });
  const [showPreview, setShowPreview] = useState(false);
  const updateField = (field: keyof WorkContractData, value: string) => setFormData({ ...formData, [field]: value });
  const canProceed = (s: number) => {
    if (s === 0) return !!(formData.customerName && formData.customerDetails);
    if (s === 1) return !!(formData.contractorName && formData.contractorDetails);
    if (s === 2) return !!(formData.workDescription && formData.price && formData.deadline && formData.city && formData.date);
    return true;
  };

  const generateDocument = () => {
    const price = parseInt(formData.price) || 0;
    return [
      createParagraph("ДОГОВОР ПОДРЯДА", { alignment: AlignmentType.CENTER, bold: true, size: 28 }),
      createParagraph(`г. ${formData.city}`, { alignment: AlignmentType.RIGHT }),
      createParagraph(formatDate(new Date(formData.date)), { alignment: AlignmentType.RIGHT, after: 200 }),
      createParagraph(`${formData.customerName}, ${formData.customerDetails}, именуемый "Заказчик", и ${formData.contractorName}, ${formData.contractorDetails}, именуемый "Подрядчик", заключили договор:`, { before: 200 }),
      createParagraph("1. ПРЕДМЕТ ДОГОВОРА", { bold: true, before: 300 }),
      createParagraph(`1.1. Подрядчик обязуется выполнить работы: ${formData.workDescription}, а Заказчик обязуется принять и оплатить результат работ.`, {}),
      createParagraph("2. СТОИМОСТЬ И ОПЛАТА", { bold: true, before: 300 }),
      createParagraph(`2.1. Стоимость работ составляет ${formData.price} (${numberToWords(price)} ${rublesWord(price)}) рублей.`, {}),
      createParagraph("2.2. Оплата производится после подписания акта выполненных работ.", {}),
      createParagraph("3. СРОКИ", { bold: true, before: 300 }),
      createParagraph(`3.1. Срок выполнения работ: ${formData.deadline}.`, {}),
      createParagraph("4. ПРАВА И ОБЯЗАННОСТИ", { bold: true, before: 300 }),
      createParagraph("4.1. Подрядчик обязуется выполнить работы качественно и в срок.", {}),
      createParagraph("4.2. Заказчик обязуется принять и оплатить работы.", {}),
      createParagraph("ПОДПИСИ СТОРОН", { bold: true, before: 400, alignment: AlignmentType.CENTER }),
      createParagraph(`Заказчик: ${formData.customerName} ________________`, { before: 200 }),
      createParagraph(`Подрядчик: ${formData.contractorName} ________________`, { before: 200 }),
    ];
  };

  const handleDownloadWord = async () => {
    if (!checkLimit()) return;
    try {
      const saved = await saveDocument(formData);
      if (!saved) return;
      await generateWord(generateDocument(), "dogovor-podryada.docx");
      toast.success("Документ успешно скачан!");
    } catch (error) { toast.error("Ошибка"); }
  };

  const steps = [
    { title: "Заказчик", content: (<div className="space-y-4">
      <div className="space-y-2"><Label>Наименование *</Label><Input placeholder="ООО или Иванов И.И." value={formData.customerName} onChange={(e) => updateField("customerName", e.target.value)} /></div>
      <div className="space-y-2"><Label>Реквизиты *</Label><Textarea placeholder="ИНН, адрес..." value={formData.customerDetails} onChange={(e) => updateField("customerDetails", e.target.value)} /></div>
    </div>) },
    { title: "Подрядчик", content: (<div className="space-y-4">
      <div className="space-y-2"><Label>Наименование *</Label><Input placeholder="ИП или ООО" value={formData.contractorName} onChange={(e) => updateField("contractorName", e.target.value)} /></div>
      <div className="space-y-2"><Label>Реквизиты *</Label><Textarea placeholder="ИНН, адрес..." value={formData.contractorDetails} onChange={(e) => updateField("contractorDetails", e.target.value)} /></div>
    </div>) },
    { title: "Условия", content: (<div className="space-y-4">
      <div className="space-y-2"><Label>Описание работ *</Label><Textarea placeholder="Ремонт помещения..." value={formData.workDescription} onChange={(e) => updateField("workDescription", e.target.value)} /></div>
      <div className="space-y-2"><Label>Стоимость (руб) *</Label><Input type="number" placeholder="100000" value={formData.price} onChange={(e) => updateField("price", e.target.value)} /></div>
      <div className="space-y-2"><Label>Срок выполнения *</Label><Input placeholder="до 31.12.2026" value={formData.deadline} onChange={(e) => updateField("deadline", e.target.value)} /></div>
      <div className="space-y-2"><Label>Город *</Label><Input placeholder="Москва" value={formData.city} onChange={(e) => updateField("city", e.target.value)} /></div>
      <div className="space-y-2"><Label>Дата *</Label><Input type="date" value={formData.date} onChange={(e) => updateField("date", e.target.value)} /></div>
    </div>) },
    { title: "Готово", content: (<div className="space-y-6">
      {showPreview && (<Card><CardContent className="p-6"><h3 className="text-center font-bold">ДОГОВОР ПОДРЯДА</h3><p>Стоимость: {formData.price} руб</p></CardContent></Card>)}
      {!showPreview && <Button onClick={() => setShowPreview(true)} className="w-full" size="lg"><Eye className="w-5 h-5 mr-2" />Предпросмотр</Button>}
      <Button size="lg" className="w-full" onClick={handleDownloadWord} disabled={saving}><Download className="w-5 h-5 mr-2" />{saving ? "Сохранение..." : "Скачать Word"}</Button>
    </div>) },
  ];

  return <DocumentWizard title="Договор подряда" description="Договор на выполнение работ" steps={steps} onComplete={() => {setShowPreview(true);toast.success("Готово!");}} canProceed={canProceed} banner={<LimitBanner />} />;
}
