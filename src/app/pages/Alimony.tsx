import { useState } from "react";
import { DocumentWizard } from "../components/DocumentWizard";
import { Input } from "../components/ui/input";
import { ValidatedInput } from "../components/ui/validated-input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Download, Eye } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";
import { generateWord, createParagraph, formatDate, numberToWords, rublesWord } from "../utils/documentGenerator";
import { validateFullName } from "../utils/validation";
import { AlignmentType } from "docx";
import { LimitBanner } from "../components/LimitBanner";
import { useDocumentGeneration } from "../hooks/useDocumentGeneration";

interface AlimonyData {
  payerName: string; payerPassport: string; receiverName: string; receiverPassport: string;
  childName: string; childBirthDate: string; amount: string; city: string; date: string;
}

export function Alimony() {
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('soglashenie-ob-alimentah');
  const [formData, setFormData] = useState<AlimonyData>({
    payerName: "", payerPassport: "", receiverName: "", receiverPassport: "",
    childName: "", childBirthDate: "", amount: "", city: "", date: new Date().toISOString().split("T")[0],
  });
  const [showPreview, setShowPreview] = useState(false);
  const updateField = (field: keyof AlimonyData, value: string) => setFormData({ ...formData, [field]: value });
  const canProceed = (stepIndex: number): boolean => {
    if (stepIndex === 0) return !!(formData.payerName && formData.payerPassport);
    if (stepIndex === 1) return !!(formData.receiverName && formData.receiverPassport);
    if (stepIndex === 2) return !!(formData.childName && formData.childBirthDate && formData.amount && formData.city && formData.date);
    return true;
  };

  const generateDocument = () => {
    const amount = parseInt(formData.amount) || 0;
    return [
      createParagraph("СОГЛАШЕНИЕ ОБ УПЛАТЕ АЛИМЕНТОВ", { alignment: AlignmentType.CENTER, bold: true, size: 28 }),
      createParagraph(`г. ${formData.city}`, { alignment: AlignmentType.RIGHT }),
      createParagraph(formatDate(new Date(formData.date)), { alignment: AlignmentType.RIGHT, after: 200 }),
      createParagraph(`${formData.payerName}, паспорт ${formData.payerPassport}, именуемый "Плательщик", и ${formData.receiverName}, паспорт ${formData.receiverPassport}, именуемый "Получатель", заключили соглашение:`, { before: 200 }),
      createParagraph("1. ПРЕДМЕТ СОГЛАШЕНИЯ", { bold: true, before: 300 }),
      createParagraph(`1.1. Плательщик обязуется ежемесячно уплачивать алименты на содержание несовершеннолетнего ребенка ${formData.childName}, дата рождения ${formatDate(new Date(formData.childBirthDate))}.`, {}),
      createParagraph("2. РАЗМЕР И ПОРЯДОК УПЛАТЫ", { bold: true, before: 300 }),
      createParagraph(`2.1. Размер алиментов составляет ${formData.amount} (${numberToWords(amount)} ${rublesWord(amount)}) рублей ежемесячно.`, {}),
      createParagraph("2.2. Алименты уплачиваются до 10 числа каждого месяца.", {}),
      createParagraph("3. ОТВЕТСТВЕННОСТЬ СТОРОН", { bold: true, before: 300 }),
      createParagraph("3.1. За несвоевременную уплату начисляется неустойка 0.1% от суммы за каждый день просрочки.", {}),
      createParagraph("ПОДПИСИ СТОРОН", { bold: true, before: 400, alignment: AlignmentType.CENTER }),
      createParagraph(`Плательщик: ${formData.payerName} ________________`, { before: 200 }),
      createParagraph(`Получатель: ${formData.receiverName} ________________`, { before: 200 }),
    ];
  };

  const handleDownloadWord = async () => {
    if (!checkLimit()) return;
    try {
      const saved = await saveDocument(formData);
      if (!saved) return;
      await generateWord(generateDocument(), "soglashenie-ob-alimentah.docx");
      toast.success("Документ успешно скачан!");
    } catch (error) { toast.error("Ошибка при создании документа"); }
  };

  const steps = [
    { title: "Плательщик", content: (<div className="space-y-4">
      <div className="space-y-2"><ValidatedInput label="ФИО плательщика" placeholder="Иванов Иван Иванович" value={formData.payerName} onChange={(e) => updateField("payerName", e.target.value)} validate={validateFullName} required /></div>
      <div className="space-y-2"><Label>Паспортные данные *</Label><Input placeholder="серия 1234 номер 567890" value={formData.payerPassport} onChange={(e) => updateField("payerPassport", e.target.value)} /></div>
    </div>) },
    { title: "Получатель", content: (<div className="space-y-4">
      <div className="space-y-2"><ValidatedInput label="ФИО получателя" placeholder="Иванова Анна Петровна" value={formData.receiverName} onChange={(e) => updateField("receiverName", e.target.value)} validate={validateFullName} required /></div>
      <div className="space-y-2"><Label>Паспортные данные *</Label><Input placeholder="серия 4321 номер 098765" value={formData.receiverPassport} onChange={(e) => updateField("receiverPassport", e.target.value)} /></div>
    </div>) },
    { title: "Условия", content: (<div className="space-y-4">
      <div className="space-y-2"><ValidatedInput label="ФИО ребенка" placeholder="Иванов Петр Иванович" value={formData.childName} onChange={(e) => updateField("childName", e.target.value)} validate={validateFullName} required /></div>
      <div className="space-y-2"><Label>Дата рождения ребенка *</Label><Input type="date" value={formData.childBirthDate} onChange={(e) => updateField("childBirthDate", e.target.value)} /></div>
      <div className="space-y-2"><Label>Размер алиментов (руб/мес) *</Label><Input type="number" placeholder="15000" value={formData.amount} onChange={(e) => updateField("amount", e.target.value)} /></div>
      <div className="space-y-2"><Label>Город *</Label><Input placeholder="Москва" value={formData.city} onChange={(e) => updateField("city", e.target.value)} /></div>
      <div className="space-y-2"><Label>Дата *</Label><Input type="date" value={formData.date} onChange={(e) => updateField("date", e.target.value)} /></div>
    </div>) },
    { title: "Готово", content: (<div className="space-y-6">
      {showPreview && (<Card><CardContent className="p-6"><h3 className="text-center font-bold text-xl mb-4">СОГЛАШЕНИЕ ОБ УПЛАТЕ АЛИМЕНТОВ</h3><p>Размер: {formData.amount} руб/мес</p></CardContent></Card>)}
      {!showPreview && <Button onClick={() => setShowPreview(true)} className="w-full" size="lg"><Eye className="w-5 h-5 mr-2" />Предпросмотр</Button>}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><p className="text-sm"><strong>⚠️ Важно:</strong> Соглашение нужно нотариально заверить.</p></div>
      <Button size="lg" className="w-full" onClick={handleDownloadWord} disabled={saving}><Download className="w-5 h-5 mr-2" />{saving ? "Сохранение..." : "Скачать Word"}</Button>
    </div>) },
  ];

  return <DocumentWizard title="Соглашение об уплате али��ентов" description="Договор о содержании ребенка" steps={steps} onComplete={() => {setShowPreview(true);toast.success("Соглашение готово!");}} canProceed={canProceed} banner={<LimitBanner />} />;
}