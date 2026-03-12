import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { DocumentWizard } from "../components/DocumentWizard";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { AlignmentType } from "docx";
import { useDocumentGeneration } from "../hooks/useDocumentGeneration";
import {
  generateWord,
  createParagraph,
  formatDate,
} from "../utils/documentGenerator";
import { ValidatedInput } from "../components/ui/validated-input";
import { validateFullName } from "../utils/validation";

interface PrenupData {
  // Супруг 1
  spouse1Name: string;
  spouse1Passport: string;
  spouse1Address: string;
  
  // Супруг 2
  spouse2Name: string;
  spouse2Passport: string;
  spouse2Address: string;
  
  // Имущественный режим
  propertyMode: string;
  
  // Особые условия
  specialConditions: string;
  
  // Место и дата
  city: string;
  date: string;
}

export function Prenup() {
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('brachnyj-dogovor');
  
  const [formData, setFormData] = useState<PrenupData>({
    spouse1Name: "",
    spouse1Passport: "",
    spouse1Address: "",
    spouse2Name: "",
    spouse2Passport: "",
    spouse2Address: "",
    propertyMode: "",
    specialConditions: "",
    city: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateField = (field: keyof PrenupData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const canProceed = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        return !!(formData.spouse1Name && formData.spouse1Passport && formData.spouse1Address);
      case 1:
        return !!(formData.spouse2Name && formData.spouse2Passport && formData.spouse2Address);
      case 2:
        return !!(formData.propertyMode && formData.city && formData.date);
      default:
        return true;
    }
  };

  const generateDocument = () => {
    const sections = [
      createParagraph("БРАЧНЫЙ ДОГОВОР", { alignment: AlignmentType.CENTER, bold: true, size: 28 }),
      
      createParagraph(`г. ${formData.city}`, { alignment: AlignmentType.RIGHT }),
      createParagraph(formatDate(new Date(formData.date)), { alignment: AlignmentType.RIGHT, after: 200 }),

      createParagraph(
        `Мы, ${formData.spouse1Name}, паспорт ${formData.spouse1Passport}, зарегистрированный по адресу: ${formData.spouse1Address}, именуемый в дальнейшем "Супруг 1", с одной стороны, и ${formData.spouse2Name}, паспорт ${formData.spouse2Passport}, зарегистрированная по адресу: ${formData.spouse2Address}, именуемая в дальнейшем "Супруг 2", с другой стороны, вместе именуемые "Стороны", заключили настоящий брачный договор о нижеследующем:`,
        { before: 200 }
      ),

      createParagraph("1. ОБЩИЕ ПОЛОЖЕНИЯ", { bold: true, before: 300 }),
      
      createParagraph(
        "1.1. Настоящий брачный договор заключен в соответствии с Семейным кодексом Российской Федерации.",
        {}
      ),
      
      createParagraph(
        "1.2. Брачный договор вступает в силу со дня государственной регистрации заключения брака.",
        {}
      ),

      createParagraph("2. РЕЖИМ ИМУЩЕСТВА СУПРУГОВ", { bold: true, before: 300 }),
      
      createParagraph(
        `2.1. ${formData.propertyMode}`,
        {}
      ),
      
      createParagraph(
        "2.2. Имущество, принадлежавшее каждому из супругов до вступления в брак, а также полученное одним из супругов во время брака в дар или в порядке наследования, является его собственностью.",
        {}
      ),

      createParagraph("3. ПРАВА И ОБЯЗАННОСТИ ПО ВЗАИМНОМУ СОДЕРЖАНИЮ", { bold: true, before: 300 }),
      
      createParagraph(
        "3.1. Супруги обязуются материально поддерживать друг друга.",
        {}
      ),
      
      createParagraph(
        "3.2. В случае отказа от такой поддержки и отсутствия соглашения между супругами об уплате алиментов применяются нормы Семейного кодекса РФ.",
        {}
      ),
    ];

    if (formData.specialConditions) {
      sections.push(
        createParagraph("4. ОСОБЫЕ УСЛОВИЯ", { bold: true, before: 300 }),
        createParagraph(formData.specialConditions, {})
      );
    }

    sections.push(
      createParagraph("5. ИЗМЕНЕНИЕ И РАСТОРЖЕНИЕ ДОГОВОРА", { bold: true, before: 300 }),
      
      createParagraph(
        "5.1. Брачный договор может быть изменен или расторгнут в любое время по соглашению супругов.",
        {}
      ),
      
      createParagraph(
        "5.2. Односторонний отказ от исполнения брачного договора не допускается.",
        {}
      ),

      createParagraph("6. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ", { bold: true, before: 300 }),
      
      createParagraph(
        "6.1. Настоящий договор сотавлен в трех экземплярах, имеющих одинаковую юридическую силу, один из которых хранится в делах нотариуса, второй - у Супруга 1, третий - у Супруга 2.",
        {}
      ),
      
      createParagraph(
        "6.2. Брачный договор подлежит нотариальному удостоверению.",
        {}
      ),

      createParagraph("ПОДПИСИ СТОРОН", { bold: true, before: 400, alignment: AlignmentType.CENTER }),
      
      createParagraph("Супруг 1:", { before: 200 }),
      createParagraph(`${formData.spouse1Name} ________________`, {}),
      
      createParagraph("Супруг 2:", { before: 200 }),
      createParagraph(`${formData.spouse2Name} ________________`, {}),
    );

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
      await generateWord(sections, "brachnyj-dogovor.docx");
      toast.success("Документ успешно скачан!");
    } catch (error) {
      toast.error("Ошибка при создании документа");
      console.error(error);
    }
  };

  const steps = [
    {
      title: "Супруг 1",
      description: "Данные первого супруга",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <ValidatedInput
              label="ФИО первого супруга"
              id="spouse1Name"
              placeholder="Иванов Иван Иванович"
              value={formData.spouse1Name}
              onChange={(e) => updateField("spouse1Name", e.target.value)}
              validate={validateFullName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spouse1Passport">Паспортные данные *</Label>
            <Input
              id="spouse1Passport"
              placeholder="серия 1234 номер 567890, выдан УВД г. Москвы 01.01.2020"
              value={formData.spouse1Passport}
              onChange={(e) => updateField("spouse1Passport", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spouse1Address">Адрес регистрации *</Label>
            <Input
              id="spouse1Address"
              placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
              value={formData.spouse1Address}
              onChange={(e) => updateField("spouse1Address", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Супруг 2",
      description: "Данные второго супруга",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <ValidatedInput
              label="ФИО второго супруга"
              id="spouse2Name"
              placeholder="Иванова Анна Петровна"
              value={formData.spouse2Name}
              onChange={(e) => updateField("spouse2Name", e.target.value)}
              validate={validateFullName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spouse2Passport">Паспортные данные *</Label>
            <Input
              id="spouse2Passport"
              placeholder="серия 4321 номер 098765, выдан УВД г. Москвы 01.01.2020"
              value={formData.spouse2Passport}
              onChange={(e) => updateField("spouse2Passport", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spouse2Address">Адрес регистрации *</Label>
            <Input
              id="spouse2Address"
              placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
              value={formData.spouse2Address}
              onChange={(e) => updateField("spouse2Address", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Условия договора",
      description: "Режим имущества и особые условия",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyMode">Режим имущества супругов *</Label>
            <Input
              id="propertyMode"
              placeholder="Раздельная собственность на все имущество"
              value={formData.propertyMode}
              onChange={(e) => updateField("propertyMode", e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Например: "Раздельная собственность" или "Совместная собственность" или "Долевая собственность"
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialConditions">Особые условия (необязательно)</Label>
            <Input
              id="specialConditions"
              placeholder="Дополнительные условия договора"
              value={formData.specialConditions}
              onChange={(e) => updateField("specialConditions", e.target.value)}
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
            <Label htmlFor="date">Дата заключения договора *</Label>
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
      description: "Проверьте данные и скачайте документ",
      content: (
        <div className="space-y-6">
          {!showPreview ? (
            <Button onClick={() => setShowPreview(true)} className="w-full" size="lg">
              <Eye className="w-5 h-5 mr-2" />
              Предросмотр документа
            </Button>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <h3 className="text-center font-bold text-xl mb-4">БРАЧНЫЙ ДОГОВОР</h3>
                  <p className="text-right">г. {formData.city}</p>
                  <p className="text-right mb-4">{formatDate(new Date(formData.date))}</p>
                  
                  <p className="mb-4">
                    Мы, {formData.spouse1Name}, паспорт {formData.spouse1Passport}, 
                    и {formData.spouse2Name}, паспорт {formData.spouse2Passport}, 
                    заключили настоящий брачный договор.
                  </p>

                  <p className="font-semibold mt-6 mb-2">1. ОБЩИЕ ПОЛОЖЕНИЯ</p>
                  <p className="mb-2">
                    1.1. Настоящий брачный договор заключен в соответствии с Семейным кодексом РФ.
                  </p>

                  <p className="font-semibold mt-6 mb-2">2. РЕЖИМ ИМУЩЕСТВА СУПРУГОВ</p>
                  <p className="mb-4">
                    2.1. {formData.propertyMode}
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
              <strong>⚠️ Важно:</strong> Брачный договор подлежит обязательному нотариальному удостоверению. 
              Без нотариального удостоверения он недействителен.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full" onClick={handleDownloadWord} disabled={saving}>
              <Download className="w-5 h-5 mr-2" />
              {saving ? "Сохранение..." : "Скачать Word (.docx)"}
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DocumentWizard
      title="Брачный договор"
      description="Создайте брачный договор для регулирования имущественных отношений"
      steps={steps}
      onComplete={() => {
        setShowPreview(true);
        toast.success("Брачный договор готов!");
      }}
      canProceed={canProceed}
    />
  );
}