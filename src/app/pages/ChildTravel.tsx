import { useState } from "react";
import { DocumentWizard } from "../components/DocumentWizard";
import { Input } from "../components/ui/input";
import { ValidatedInput } from "../components/ui/validated-input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Download, Eye } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";
import { generateWord, createParagraph, formatDate } from "../utils/documentGenerator";
import { validateFullName } from "../utils/validation";
import { AlignmentType } from "docx";
import { LimitBanner } from "../components/LimitBanner";
import { useDocumentGeneration } from "../hooks/useDocumentGeneration";

interface ChildTravelData {
  parentName: string;
  parentPassport: string;
  childName: string;
  childBirthDate: string;
  childPassport: string;
  destination: string;
  travelPeriod: string;
  accompaniedBy: string;
  city: string;
  date: string;
}

export function ChildTravel() {
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('soglasie-na-vyezd-rebenka');
  
  const [formData, setFormData] = useState<ChildTravelData>({
    parentName: "",
    parentPassport: "",
    childName: "",
    childBirthDate: "",
    childPassport: "",
    destination: "",
    travelPeriod: "",
    accompaniedBy: "",
    city: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateField = (field: keyof ChildTravelData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const canProceed = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        return !!(formData.parentName && formData.parentPassport);
      case 1:
        return !!(formData.childName && formData.childBirthDate && formData.childPassport);
      case 2:
        return !!(formData.destination && formData.travelPeriod && formData.accompaniedBy && formData.city && formData.date);
      default:
        return true;
    }
  };

  const generateDocument = () => {
    const sections = [
      createParagraph("СОГЛАСИЕ НА ВЫЕЗД РЕБЕНКА ЗА ГРАНИЦУ", { alignment: AlignmentType.CENTER, bold: true, size: 28 }),
      
      createParagraph(`г. ${formData.city}`, { alignment: AlignmentType.RIGHT }),
      createParagraph(formatDate(new Date(formData.date)), { alignment: AlignmentType.RIGHT, after: 200 }),

      createParagraph(
        `Я, ${formData.parentName}, паспорт ${formData.parentPassport}, даю согласие на выезд моего несовершеннолетнего ребенка ${formData.childName}, дата рождения ${formatDate(new Date(formData.childBirthDate))}, ${formData.childPassport}, в ${formData.destination} в период ${formData.travelPeriod} в сопровождении ${formData.accompaniedBy}.`,
        { before: 200 }
      ),

      createParagraph(
        "Я даю согласие на выезд ребенка в указанные страны и на указанный период.",
        { before: 200 }
      ),

      createParagraph(
        "Настоящее согласие действительно до окончания поездки.",
        { before: 200 }
      ),

      createParagraph(`Дата: ${formatDate(new Date(formData.date))}`, { before: 400 }),
      createParagraph(`${formData.parentName} ________________`, { before: 200 }),
      createParagraph("(подпись)", { alignment: AlignmentType.RIGHT }),
    ];

    return sections;
  };

  const handleDownloadWord = async () => {
    if (!checkLimit()) {
      return;
    }

    try {
      const saved = await saveDocument(formData);
      
      if (!saved) {
        return;
      }

      const sections = generateDocument();
      await generateWord(sections, "soglasie-na-vyezd-rebenka.docx");
      toast.success("Документ успешно скачан!");
    } catch (error) {
      toast.error("Ошибка при создании документа");
      console.error(error);
    }
  };

  const steps = [
    {
      title: "Родитель",
      description: "Данные родителя, дающего согласие",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <ValidatedInput
              label="ФИО родителя"
              id="parentName"
              placeholder="Иванов Иван Иванович"
              value={formData.parentName}
              onChange={(e) => updateField("parentName", e.target.value)}
              validate={validateFullName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentPassport">Паспортные данные *</Label>
            <Input
              id="parentPassport"
              placeholder="серия 1234 номер 567890"
              value={formData.parentPassport}
              onChange={(e) => updateField("parentPassport", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Ребенок",
      description: "Данные несовершеннолетнего ребенка",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <ValidatedInput
              label="ФИО ребенка"
              id="childName"
              placeholder="Иванов Петр Иванович"
              value={formData.childName}
              onChange={(e) => updateField("childName", e.target.value)}
              validate={validateFullName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="childBirthDate">Дата рождения ребенка *</Label>
            <Input
              id="childBirthDate"
              type="date"
              value={formData.childBirthDate}
              onChange={(e) => updateField("childBirthDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="childPassport">Данные свидетельства о рождении или паспорта *</Label>
            <Input
              id="childPassport"
              placeholder="Свидетельство о рождении серия II-МЮ номер 123456"
              value={formData.childPassport}
              onChange={(e) => updateField("childPassport", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Поездка",
      description: "Детали поездки",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Страна(ы) назначения *</Label>
            <Input
              id="destination"
              placeholder="Турция, Греция"
              value={formData.destination}
              onChange={(e) => updateField("destination", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelPeriod">Период поездки *</Label>
            <Input
              id="travelPeriod"
              placeholder="с 01.06.2026 по 15.06.2026"
              value={formData.travelPeriod}
              onChange={(e) => updateField("travelPeriod", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accompaniedBy">Сопровождающее лицо *</Label>
            <Input
              id="accompaniedBy"
              placeholder="Иванова Мария Петровна, паспорт..."
              value={formData.accompaniedBy}
              onChange={(e) => updateField("accompaniedBy", e.target.value)}
            />
          </div>

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
      ),
    },
    {
      title: "Готово",
      description: "Скачайте документ",
      content: (
        <div className="space-y-6">
          {!showPreview ? (
            <Button onClick={() => setShowPreview(true)} className="w-full" size="lg">
              <Eye className="w-5 h-5 mr-2" />
              Предпросмотр документа
            </Button>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <h3 className="text-center font-bold text-xl mb-4">СОГЛАСИЕ НА ВЫЕЗД РЕБЕНКА ЗА ГРАНИЦУ</h3>
                  <p className="text-right">г. {formData.city}</p>
                  <p className="text-right mb-4">{formatDate(new Date(formData.date))}</p>
                  
                  <p className="mb-4">
                    Я, {formData.parentName}, даю согласие на выезд моего ребенка {formData.childName} 
                    в {formData.destination} в период {formData.travelPeriod}.
                  </p>

                  <p className="text-sm text-gray-500 mt-6">
                    ... (полный текст документа будет в скачанном файле)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>⚠️ Важно:</strong> Согласие должно быть нотариально заверено. 
              Также может потребоваться перевод на язык страны назначения.
            </p>
          </div>

          <Button size="lg" className="w-full" onClick={handleDownloadWord} disabled={saving}>
            <Download className="w-5 h-5 mr-2" />
            {saving ? "Сохранение..." : "Скачать Word (.docx)"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DocumentWizard
      title="Согласие на выезд ребенка за границу"
      description="Создайте согласие на выезд несовершеннолетнего ребенка"
      steps={steps}
      onComplete={() => {
        setShowPreview(true);
        toast.success("Согласие готово!");
      }}
      canProceed={canProceed}
      banner={<LimitBanner />}
    />
  );
}