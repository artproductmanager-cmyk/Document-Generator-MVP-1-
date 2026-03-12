import { useState } from "react";
import { DocumentWizard } from "../components/DocumentWizard";
import { Input } from "../components/ui/input";
import { ValidatedInput } from "../components/ui/validated-input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Download, Eye } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";
import { generateWord, createParagraph, formatDate } from "../utils/documentGenerator";
import { validateFullName } from "../utils/validation";
import { AlignmentType } from "docx";
import { LimitBanner } from "../components/LimitBanner";
import { useDocumentGeneration } from "../hooks/useDocumentGeneration";

interface PropertyDivisionData {
  spouse1Name: string;
  spouse1Passport: string;
  spouse2Name: string;
  spouse2Passport: string;
  propertyList: string;
  spouse1Gets: string;
  spouse2Gets: string;
  city: string;
  date: string;
}

export function PropertyDivision() {
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('soglashenie-o-razdele-imushhestva');
  const [formData, setFormData] = useState<PropertyDivisionData>({
    spouse1Name: "", spouse1Passport: "", spouse2Name: "", spouse2Passport: "",
    propertyList: "", spouse1Gets: "", spouse2Gets: "", city: "", date: new Date().toISOString().split("T")[0],
  });
  const [showPreview, setShowPreview] = useState(false);
  const updateField = (field: keyof PropertyDivisionData, value: string) => setFormData({ ...formData, [field]: value });
  const canProceed = (stepIndex: number): boolean => {
    if (stepIndex === 0) return !!(formData.spouse1Name && formData.spouse1Passport);
    if (stepIndex === 1) return !!(formData.spouse2Name && formData.spouse2Passport);
    if (stepIndex === 2) return !!(formData.propertyList && formData.spouse1Gets && formData.spouse2Gets && formData.city && formData.date);
    return true;
  };

  const generateDocument = () => [
    createParagraph("СОГЛАШЕНИЕ О РАЗДЕЛЕ ИМУЩЕСТВА", { alignment: AlignmentType.CENTER, bold: true, size: 28 }),
    createParagraph(`г. ${formData.city}`, { alignment: AlignmentType.RIGHT }),
    createParagraph(formatDate(new Date(formData.date)), { alignment: AlignmentType.RIGHT, after: 200 }),
    createParagraph(`${formData.spouse1Name}, паспорт ${formData.spouse1Passport}, и ${formData.spouse2Name}, паспорт ${formData.spouse2Passport}, заключили настоящее соглашение о разделе совместно нажитого имущества:`, { before: 200 }),
    createParagraph("1. ИМУЩЕСТВО, ПОДЛЕЖАЩЕЕ РАЗДЕЛУ", { bold: true, before: 300 }),
    createParagraph(`1.1. ${formData.propertyList}`, {}),
    createParagraph("2. РАЗДЕЛ ИМУЩЕСТВА", { bold: true, before: 300 }),
    createParagraph(`2.1. ${formData.spouse1Name} получает: ${formData.spouse1Gets}`, {}),
    createParagraph(`2.2. ${formData.spouse2Name} получает: ${formData.spouse2Gets}`, { before: 200 }),
    createParagraph("3. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ", { bold: true, before: 300 }),
    createParagraph("3.1. Соглашение вступает в силу с момента подписания.", {}),
    createParagraph("ПОДПИСИ СТОРОН", { bold: true, before: 400, alignment: AlignmentType.CENTER }),
    createParagraph(`${formData.spouse1Name} ________________`, { before: 200 }),
    createParagraph(`${formData.spouse2Name} ________________`, { before: 200 }),
  ];

  const handleDownloadWord = async () => {
    if (!checkLimit()) return;
    try {
      const saved = await saveDocument(formData);
      if (!saved) return;
      const sections = generateDocument();
      await generateWord(sections, "soglashenie-o-razdele-imushhestva.docx");
      toast.success("Документ успешно скачан!");
    } catch (error) { toast.error("Ошибка при создании документа"); console.error(error); }
  };

  const steps = [
    { title: "Супруг 1", content: (<div className="space-y-4">
      <div className="space-y-2"><ValidatedInput label="ФИО первого супруга" placeholder="Иванов Иван Иванович" value={formData.spouse1Name} onChange={(e) => updateField("spouse1Name", e.target.value)} validate={validateFullName} required /></div>
      <div className="space-y-2"><Label>Паспортные данные *</Label><Input placeholder="серия 1234 номер 567890" value={formData.spouse1Passport} onChange={(e) => updateField("spouse1Passport", e.target.value)} /></div>
    </div>) },
    { title: "Супруг 2", content: (<div className="space-y-4">
      <div className="space-y-2"><ValidatedInput label="ФИО второго супруга" placeholder="Иванова Анна Петровна" value={formData.spouse2Name} onChange={(e) => updateField("spouse2Name", e.target.value)} validate={validateFullName} required /></div>
      <div className="space-y-2"><Label>Паспортные данные *</Label><Input placeholder="серия 4321 номер 098765" value={formData.spouse2Passport} onChange={(e) => updateField("spouse2Passport", e.target.value)} /></div>
    </div>) },
    { title: "Раздел имущества", content: (<div className="space-y-4">
      <div className="space-y-2"><Label>Описание совместного имущества *</Label><Textarea placeholder="Квартира по адресу..., автомобиль..." value={formData.propertyList} onChange={(e) => updateField("propertyList", e.target.value)} /></div>
      <div className="space-y-2"><Label>Что получает первый супруг *</Label><Textarea placeholder="Квартира..." value={formData.spouse1Gets} onChange={(e) => updateField("spouse1Gets", e.target.value)} /></div>
      <div className="space-y-2"><Label>Что получает второй супруг *</Label><Textarea placeholder="Автомобиль..." value={formData.spouse2Gets} onChange={(e) => updateField("spouse2Gets", e.target.value)} /></div>
      <div className="space-y-2"><Label>Город *</Label><Input placeholder="Москва" value={formData.city} onChange={(e) => updateField("city", e.target.value)} /></div>
      <div className="space-y-2"><Label>Дата *</Label><Input type="date" value={formData.date} onChange={(e) => updateField("date", e.target.value)} /></div>
    </div>) },
    { title: "Готово", content: (<div className="space-y-6">
      {showPreview && (<Card><CardContent className="p-6"><h3 className="text-center font-bold text-xl mb-4">СОГЛАШЕНИЕ О РАЗДЕЛЕ ИМУЩЕСТВА</h3><p>Супруги: {formData.spouse1Name} и {formData.spouse2Name}</p></CardContent></Card>)}
      {!showPreview && <Button onClick={() => setShowPreview(true)} className="w-full" size="lg"><Eye className="w-5 h-5 mr-2" />Предпросмотр</Button>}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><p className="text-sm text-gray-700"><strong>⚠️ Важно:</strong> Соглашение желательно нотариально заверить.</p></div>
      <Button size="lg" className="w-full" onClick={handleDownloadWord} disabled={saving}><Download className="w-5 h-5 mr-2" />{saving ? "Сохранение..." : "Скачать Word (.docx)"}</Button>
    </div>) },
  ];

  return <DocumentWizard title="Соглашение о разделе имущества" description="Раздел совместно нажитого имущества супругов" steps={steps} onComplete={() => {setShowPreview(true);toast.success("Соглашение готово!");}} canProceed={canProceed} banner={<LimitBanner />} />;
}