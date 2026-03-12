import { ReactNode, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ArrowLeft, ArrowRight, Download, FileText, Home } from "lucide-react";
import { Link } from "react-router";

interface WizardStep {
  title: string;
  description?: string;
  content: ReactNode;
}

interface DocumentWizardProps {
  title: string;
  description: string;
  steps: WizardStep[];
  onComplete: () => void;
  canProceed?: (stepIndex: number) => boolean;
  banner?: ReactNode;
}

export function DocumentWizard({
  title,
  description,
  steps,
  onComplete,
  canProceed = () => true,
  banner,
}: DocumentWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Документатор</h1>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4 mr-2" />
                На главную
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Document Title */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>

        {/* Banner (e.g. LimitBanner) */}
        {banner && <div className="mb-8">{banner}</div>}

        {/* Step Indicators - только один прогресс-бар */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              Шаг {currentStep + 1} из {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% завершено
            </span>
          </div>
          
          <div className="flex gap-2">
            {steps.map((step, index) => (
              <div key={index} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
                <div className="mt-2 text-xs text-center">
                  <span
                    className={`${
                      index === currentStep
                        ? "text-blue-600 font-semibold"
                        : index < currentStep
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    {index < currentStep ? "✓ " : ""}{step.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8 shadow-xl">
          <CardContent className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {steps[currentStep].title}
              </h3>
              {steps[currentStep].description && (
                <p className="text-gray-600">{steps[currentStep].description}</p>
              )}
            </div>
            <div>{steps[currentStep].content}</div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed(currentStep)}
            size="lg"
            className="min-w-32"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Download className="w-4 h-4 mr-2" />
                Завершить
              </>
            ) : (
              <>
                Далее
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            💡 <strong>Совет:</strong> Убедитесь, что все данные заполнены корректно. 
            Вы сможете скачать документ после завершения всех шагов.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-16">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-gray-400 text-sm">
            ⚠️ Документы носят информационный характер и не являются юридической консультацией.
            <br />
            Для сложных ситуаций рекомендуем обратиться к юристу.
          </p>
        </div>
      </footer>
    </div>
  );
}