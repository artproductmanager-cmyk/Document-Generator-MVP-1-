import { useState } from "react";
import { DocumentWizard } from "../components/DocumentWizard";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { generateWord, createParagraph, formatDate, numberToWords, rublesWord } from "../utils/documentGenerator";
import { AlignmentType } from "docx";
import { LimitBanner } from "../components/LimitBanner";
import { useDocumentGeneration } from "../hooks/useDocumentGeneration";

export function WorkAcceptance() {
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('akt-vypolnennyh-rabot');
  const [formData, setFormData] = useState({ contractNumber: "", contractDate: "", customer: "", performer: "", workList: "", totalAmount: "", city: "", date: new Date().toISOString().split("T")[0] });
  const updateField = (f: string, v: string) => setFormData({ ...formData, [f]: v });
  
  const steps = [
    { title: "Договор", content: (<div className="space-y-4">
      <div className="space-y-2"><Label>Номер договора *</Label><Input value={formData.contractNumber} onChange={(e) => updateField("contractNumber", e.target.value)} /></div>
      <div className="space-y-2"><Label>Дата договора *</Label><Input type="date" value={formData.contractDate} onChange={(e) => updateField("contractDate", e.target.value)} /></div>
      <div className="space-y-2"><Label>Заказчик *</Label><Input value={formData.customer} onChange={(e) => updateField("customer", e.target.value)} /></div>
      <div className="space-y-2"><Label>Исполнитель *</Label><Input value={formData.performer} onChange={(e) => updateField("performer", e.target.value)} /></div>
    </div>) },
    { title: "Работы", content: (<div className="space-y-4">
      <div className="space-y-2"><Label>Перечень выполненных работ *</Label><Textarea placeholder="1. Работа А - 10000 руб\n2. Работа Б - 15000 руб" value={formData.workList} onChange={(e) => updateField("workList", e.target.value)} /></div>
      <div className="space-y-2"><Label>Общая стоимость (руб) *</Label><Input type="number" value={formData.totalAmount} onChange={(e) => updateField("totalAmount", e.target.value)} /></div>
      <div className="space-y-2"><Label>Город *</Label><Input value={formData.city} onChange={(e) => updateField("city", e.target.value)} /></div>
      <div className="space-y-2"><Label>Дата акта *</Label><Input type="date" value={formData.date} onChange={(e) => updateField("date", e.target.value)} /></div>
    </div>) },
    { title: "Готово", content: (<Button size="lg" className="w-full" onClick={async () => {
      if (!checkLimit()) return;
      try {
        const saved = await saveDocument(formData);
        if (!saved) return;
        const a = parseInt(formData.totalAmount) || 0;
        await generateWord([
          createParagraph("АКТ ВЫПОЛНЕННЫХ РАБОТ", { alignment: AlignmentType.CENTER, bold: true, size: 28 }),
          createParagraph(`к договору № ${formData.contractNumber} от ${formatDate(new Date(formData.contractDate))}`, { alignment: AlignmentType.CENTER }),
          createParagraph(`г. ${formData.city}`, { alignment: AlignmentType.RIGHT }),
          createParagraph(formatDate(new Date(formData.date)), { alignment: AlignmentType.RIGHT, after: 200 }),
          createParagraph(`${formData.customer}, именуемый "Заказчик", и ${formData.performer}, именуемый "Исполнитель", составили настоящий акт:`, { before: 200 }),
          createParagraph("1. ВЫПОЛНЕННЫЕ РАБОТЫ", { bold: true, before: 300 }),
          createParagraph(formData.workList, {}),
          createParagraph("2. СТОИМОСТЬ", { bold: true, before: 300 }),
          createParagraph(`2.1. Общая стоимость: ${formData.totalAmount} (${numberToWords(a)} ${rublesWord(a)}) руб.`, {}),
          createParagraph("3. ЗАКЛЮЧЕНИЕ", { bold: true, before: 300 }),
          createParagraph("3.1. Работы выполнены полностью и в срок. Заказчик претензий не имеет.", {}),
          createParagraph("ПОДПИСИ СТОРОН", { bold: true, before: 400, alignment: AlignmentType.CENTER }),
          createParagraph(`Заказчик: ${formData.customer} ________________`, { before: 200 }),
          createParagraph(`Исполнитель: ${formData.performer} ________________`, { before: 200 }),
        ], "akt-vypolnennyh-rabot.docx");
        toast.success("Готово!");
      } catch (e) { toast.error("Ошибка"); }
    }} disabled={saving}><Download className="w-5 h-5 mr-2" />Скачать</Button>) },
  ];

  return <DocumentWizard title="Акт выполненных работ" description="Подтверждение выполнения работ" steps={steps} onComplete={() => toast.success("Готово!")} canProceed={(s) => s === 1 ? !!(formData.workList && formData.totalAmount) : true} banner={<LimitBanner />} />;
}
