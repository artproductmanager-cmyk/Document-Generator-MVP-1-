// Универсальные функции валидации для всех форм

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Валидация ФИО - только буквы, пробелы, дефисы
 */
export function validateFullName(value: string): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: "Поле обязательно для заполнения" };
  }

  // Проверяем на наличие цифр
  if (/\d/.test(value)) {
    return { isValid: false, error: "ФИО не может содержать цифры" };
  }

  // Разрешены только буквы (кириллица, латиница), пробелы, дефисы, точки
  const nameRegex = /^[а-яёА-ЯЁa-zA-Z\s\-\.]+$/;
  if (!nameRegex.test(value)) {
    return { isValid: false, error: "ФИО может содержать только буквы, пробелы и дефисы" };
  }

  // Минимум 2 символа
  if (value.trim().length < 2) {
    return { isValid: false, error: "ФИО слишком короткое (минимум 2 символа)" };
  }

  return { isValid: true };
}

/**
 * Валидация паспорта РФ - серия и номер
 */
export function validatePassport(value: string): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: "Поле обязательно для заполнения" };
  }

  // Удаляем пробелы для проверки
  const cleaned = value.replace(/\s/g, '');
  
  // Проверяем формат: 10 цифр (4 цифры серия + 6 цифр номер)
  if (!/^\d{10}$/.test(cleaned)) {
    return { isValid: false, error: "Паспорт должен содержать 10 цифр (серия 4 цифры + номер 6 цифр)" };
  }

  return { isValid: true };
}

/**
 * Форматирование паспорта: ХХХХ ХХХХХХ
 */
export function formatPassport(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 10);
  if (cleaned.length <= 4) {
    return cleaned;
  }
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
}

/**
 * Валидация ИНН (10 или 12 цифр)
 */
export function validateINN(value: string): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: "Поле обязательно для заполнения" };
  }

  const cleaned = value.replace(/\s/g, '');
  
  if (!/^\d{10}$|^\d{12}$/.test(cleaned)) {
    return { isValid: false, error: "ИНН должен содержать 10 или 12 цифр" };
  }

  return { isValid: true };
}

/**
 * Форматирование ИНН с пробелами
 */
export function formatINN(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 12);
  if (cleaned.length <= 4) return cleaned;
  if (cleaned.length <= 8) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
}

/**
 * Валидация VIN номера автомобиля (17 символов)
 */
export function validateVIN(value: string): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: "Поле обязательно для заполнения" };
  }

  const cleaned = value.replace(/\s/g, '').toUpperCase();
  
  // VIN всегда 17 символов, без букв I, O, Q
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(cleaned)) {
    return { isValid: false, error: "VIN должен содержать 17 символов (буквы A-Z кроме I,O,Q и цифры)" };
  }

  return { isValid: true };
}

/**
 * Форматирование VIN (в верхний регистр)
 */
export function formatVIN(value: string): string {
  return value.replace(/[^A-HJ-NPR-Z0-9]/gi, '').toUpperCase().slice(0, 17);
}

/**
 * Валидация email
 */
export function validateEmail(value: string): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: "Email обязателен для заполнения" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return { isValid: false, error: "Некорректный формат email" };
  }

  return { isValid: true };
}

/**
 * Валидация телефона РФ
 */
export function validatePhone(value: string): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: "Телефон обязателен для заполнения" };
  }

  const cleaned = value.replace(/\D/g, '');
  
  // Российский номер: 11 цифр, начинается с 7 или 8
  if (!/^[78]\d{10}$/.test(cleaned)) {
    return { isValid: false, error: "Телефон должен содержать 11 цифр и начинаться с 7 или 8" };
  }

  return { isValid: true };
}

/**
 * Форматирование телефона: +7 (XXX) XXX-XX-XX
 */
export function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length === 0) return '';
  if (cleaned.length <= 1) return `+${cleaned}`;
  if (cleaned.length <= 4) return `+${cleaned[0]} (${cleaned.slice(1)}`;
  if (cleaned.length <= 7) return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
  if (cleaned.length <= 9) return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
}

/**
 * Валидация суммы (положительное число)
 */
export function validateAmount(value: string): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: "Сумма обязательна для заполнения" };
  }

  const amount = parseFloat(value);
  
  if (isNaN(amount) || amount <= 0) {
    return { isValid: false, error: "Сумма должна быть положительным числом" };
  }

  return { isValid: true };
}

/**
 * Валидация адреса
 */
export function validateAddress(value: string): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: "Адрес обязателен для заполнения" };
  }

  if (value.trim().length < 10) {
    return { isValid: false, error: "Адрес слишком короткий (минимум 10 символов)" };
  }

  return { isValid: true };
}

/**
 * Валидация ОГРН (13 цифр для юридических лиц, 15 для ИП)
 */
export function validateOGRN(value: string): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: "Поле обязательно для заполнения" };
  }

  const cleaned = value.replace(/\s/g, '');
  
  if (!/^\d{13}$|^d{15}$/.test(cleaned)) {
    return { isValid: false, error: "ОГРН должен содержать 13 цифр (для юр. лиц) или 15 цифр (для ИП)" };
  }

  return { isValid: true };
}

/**
 * Форматирование ОГРН
 */
export function formatOGRN(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 15);
  if (cleaned.length <= 1) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 1)} ${cleaned.slice(1)}`;
  if (cleaned.length <= 11) return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 6)} ${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 6)} ${cleaned.slice(6, 11)} ${cleaned.slice(11)}`;
}

/**
 * Валидация КПП (9 цифр)
 */
export function validateKPP(value: string): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: "Поле обязательно для заполнения" };
  }

  const cleaned = value.replace(/\s/g, '');
  
  if (!/^\d{9}$/.test(cleaned)) {
    return { isValid: false, error: "КПП должен содержать 9 цифр" };
  }

  return { isValid: true };
}

/**
 * Форматирование КПП
 */
export function formatKPP(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 9);
  if (cleaned.length <= 4) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
}

/**
 * Валидация названия организации
 */
export function validateCompanyName(value: string): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: "Поле обязательно для заполнения" };
  }

  if (value.trim().length < 3) {
    return { isValid: false, error: "Название организации слишком короткое (минимум 3 символа)" };
  }

  return { isValid: true };
}