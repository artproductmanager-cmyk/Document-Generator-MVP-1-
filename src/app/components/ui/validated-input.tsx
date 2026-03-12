import * as React from "react";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "./utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface ValidatedInputProps extends React.ComponentProps<"input"> {
  label: string;
  id: string;
  validate?: (value: string) => ValidationResult;
  formatValue?: (value: string) => string;
  showValidation?: boolean;
  required?: boolean;
  helpText?: string;
}

export function ValidatedInput({
  label,
  id,
  value,
  onChange,
  validate,
  formatValue,
  showValidation = true,
  required = false,
  helpText,
  className,
  ...props
}: ValidatedInputProps) {
  const [touched, setTouched] = React.useState(false);
  const [validation, setValidation] = React.useState<ValidationResult>({ isValid: true });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    
    if (validate) {
      const result = validate(e.target.value);
      setValidation(result);
    }
    
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Применяем форматирование если есть
    if (formatValue) {
      newValue = formatValue(newValue);
      e.target.value = newValue;
    }
    
    // Валидируем при вводе (но показываем ошибки только после blur)
    if (validate && touched) {
      const result = validate(newValue);
      setValidation(result);
    }
    
    onChange?.(e);
  };

  const showError = touched && !validation.isValid && showValidation;
  const showSuccess = touched && validation.isValid && showValidation && value;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError}
          className={cn(
            className,
            showError && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50",
            showSuccess && "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/50"
          )}
          {...props}
        />
        
        {/* Иконка валидации */}
        {showValidation && touched && value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {validation.isValid ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      
      {/* Текст помощи или ошибка */}
      {showError && validation.error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {validation.error}
        </p>
      )}
      
      {!showError && helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
