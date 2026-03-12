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

export function SupplyContract() {
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('dogovor-postavki');
  const [formData, setFormData] = useState({ supplier: "", supplierDetails: "", buyer: "", buyerDetails: "", goods: "", price: "", deadline: "", city: "", date: new Date().toISOString().split("T")[0] });
  const updateField = (f: string, v: string) => setFormData({ ...formData, [f]: v });
  
  const steps = [
    { title: "Поставщик", content: (<div className="space-y-4">
      <div className="space-y-2"><Label>Наименование *</Label><Input value={formData.supplier} onChange={(e) => updateField("supplier", e.target.value)} /></div>
      <div className="space-y-2"><Label>Реквизиты *</Label><Textarea value={formData.supplierDetails} onChange={(e) => updateField("supplierDetails", e.target.value)} /></div>
    </div>) },
    { title: "Покупатель", content: (<div className="space-y-4">
      <div className="space-y-2"><Label>Наименование *</Label><Input value={formData.buyer} onChange={(e) => updateField("buyer", e.target.value)} /></div>
      <div className="space-y-2"><Label>Реквизиты *</Label><Textarea value={formData.buyerDetails} onChange={(e) => updateField("buyerDetails", e.target.value)} /></div>
    </div>) },
    { title: "Условия", content: (<div className="space-y-4">
      <div className="space-y-2"><Label>Описание товара *</Label><Textarea value={formData.goods} onChange={(e) => updateField("goods", e.target.value)} /></div>
      <div className="space-y-2"><Label>Стоимость *</Label><Input type="number" value={formData.price} onChange={(e) => updateField("price", e.target.value)} /></div>
      <div className="space-y-2"><Label>Срок поставки *</Label><Input value={formData.deadline} onChange={(e) => updateField("deadline", e.target.value)} /></div>
      <div className="space-y-2"><Label>Город *</Label><Input value={formData.city} onChange={(e) => updateField("city", e.target.value)} /></div>
      <div className="space-y-2"><Label>Дата *</Label><Input type="date" value={formData.date} onChange={(e) => updateField("date", e.target.value)} /></div>
    </div>) },
    { title: "Готово", content: (<Button size="lg" className="w-full" onClick={async () => {
      if (!checkLimit()) return;
      try {
        const saved = await saveDocument(formData);
        if (!saved) return;
        const p = parseInt(formData.price) || 0;
        await generateWord([
          createParagraph("ДОГОВОР ПОСТАВКИ", { alignment: AlignmentType.CENTER, bold: true, size: 28 }),
          createParagraph(`г. ${formData.city}`, { alignment: AlignmentType.RIGHT }),
          createParagraph(formatDate(new Date(formData.date)), { alignment: AlignmentType.RIGHT, after: 200 }),
          createParagraph(`${formData.supplier}, именуемый "Поставщик", и ${formData.buyer}, именуемый "Покупатель", заключили договор:`, { before: 200 }),
          createParagraph("1. ПРЕДМЕТ ДОГОВОРА", { bold: true, before: 300 }),
          createParagraph(`1.1. Поставщик обязуется поставить товар: ${formData.goods}`, {}),
          createParagraph("2. СТОИМОСТЬ", { bold: true, before: 300 }),
          createParagraph(`2.1. Стоимость: ${formData.price} (${numberToWords(p)} ${rublesWord(p)}) руб.`, {}),
          createParagraph("3. СРОК ПОСТАВКИ", { bold: true, before: 300 }),
          createParagraph(`3.1. Срок: ${formData.deadline}`, {}),
        ], "dogovor-postavki.docx");
        toast.success("Готово!");
      } catch (e) { toast.error("Ошибка"); }
    }} disabled={saving}><Download className="w-5 h-5 mr-2" />Скачать</Button>) },
  ];

  return <DocumentWizard title="Договор поставки" description="Договор на поставку товаров" steps={steps} onComplete={() => toast.success("Готово!")} canProceed={(s) => s === 2 ? !!(formData.goods && formData.price) : true} banner={<LimitBanner />} />;
}
