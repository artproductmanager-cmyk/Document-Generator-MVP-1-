import { useState } from "react";
import { DocumentWizard } from "../components/DocumentWizard";
import { Input } from "../components/ui/input";
import { ValidatedInput } from "../components/ui/validated-input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { generateWord, createParagraph, formatDate, numberToWords, rublesWord } from "../utils/documentGenerator";
import { validateFullName } from "../utils/validation";
import { AlignmentType } from "docx";
import { LimitBanner } from "../components/LimitBanner";
import { useDocumentGeneration } from "../hooks/useDocumentGeneration";

export function Employment() {
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('trudovoj-dogovor');
  const [formData, setFormData] = useState({ employer: "", employee: "", position: "", salary: "", startDate: "", city: "", date: new Date().toISOString().split("T")[0] });
  const updateField = (f: string, v: string) => setFormData({ ...formData, [f]: v });
  
  const steps = [
    { title: "Работодатель", content: (<div className="space-y-4">
      <div className="space-y-2"><Label>Наименование *</Label><Input value={formData.employer} onChange={(e) => updateField("employer", e.target.value)} /></div>
    </div>) },
    { title: "Работник", content: (<div className="space-y-4">
      <div className="space-y-2"><ValidatedInput label="ФИО работника" value={formData.employee} onChange={(e) => updateField("employee", e.target.value)} validate={validateFullName} required /></div>
      <div className="space-y-2"><Label>Должность *</Label><Input value={formData.position} onChange={(e) => updateField("position", e.target.value)} /></div>
      <div className="space-y-2"><Label>Оклад (руб/мес) *</Label><Input type="number" value={formData.salary} onChange={(e) => updateField("salary", e.target.value)} /></div>
      <div className="space-y-2"><Label>Дата начала работы *</Label><Input type="date" value={formData.startDate} onChange={(e) => updateField("startDate", e.target.value)} /></div>
    </div>) },
    { title: "Готово", content: (<Button size="lg" className="w-full" onClick={async () => {
      if (!checkLimit()) return;
      try {
        const saved = await saveDocument(formData);
        if (!saved) return;
        const s = parseInt(formData.salary) || 0;
        await generateWord([
          createParagraph("ТРУДОВОЙ ДОГОВОР", { alignment: AlignmentType.CENTER, bold: true, size: 28 }),
          createParagraph(`г. ${formData.city || "Москва"}`, { alignment: AlignmentType.RIGHT }),
          createParagraph(formatDate(new Date(formData.date)), { alignment: AlignmentType.RIGHT, after: 200 }),
          createParagraph(`${formData.employer}, именуемый "Работодатель", и ${formData.employee}, именуемый "Работник", заключили трудовой договор:`, { before: 200 }),
          createParagraph("1. ПРЕДМЕТ ДОГОВОРА", { bold: true, before: 300 }),
          createParagraph(`1.1. Работник принимается на должность: ${formData.position}`, {}),
          createParagraph("2. ОПЛАТА ТРУДА", { bold: true, before: 300 }),
          createParagraph(`2.1. Оклад: ${formData.salary} (${numberToWords(s)} ${rublesWord(s)}) руб/мес.`, {}),
          createParagraph("3. НАЧАЛО РАБОТЫ", { bold: true, before: 300 }),
          createParagraph(`3.1. Дата начала: ${formatDate(new Date(formData.startDate))}`, {}),
        ], "trudovoj-dogovor.docx");
        toast.success("Готово!");
      } catch (e) { toast.error("Ошибка"); }
    }} disabled={saving}><Download className="w-5 h-5 mr-2" />Скачать</Button>) },
  ];

  return <DocumentWizard title="Трудовой договор" description="Договор между работником и работодателем" steps={steps} onComplete={() => toast.success("Готово!")} canProceed={(s) => s === 1 ? !!(formData.employee && formData.position && formData.salary) : true} banner={<LimitBanner />} />;
}