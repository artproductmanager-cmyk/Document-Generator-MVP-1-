import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

// Добавляем русский шрифт для PDF (упрощенная версия)
// В продакшене нужно подключить кастомный шрифт с поддержкой кириллицы
const addRussianFont = (doc: jsPDF) => {
  // jsPDF не поддерживает кириллицу из коробки
  // В продакшене используйте html2pdf или WeasyPrint на бэкенде
};

export const generatePDF = (html: string, filename: string) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Простой парсинг HTML в текст для PDF
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const text = tempDiv.textContent || "";

  // Разбиваем текст на строки с учетом ширины страницы
  const lines = doc.splitTextToSize(text, 180);
  
  doc.text(lines, 15, 15);
  doc.save(filename);
};

export const generateWord = async (sections: any[], filename: string) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// Утилита для создания параграфа Word
export const createParagraph = (text: string, options: any = {}) => {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: {
      after: 200,
      before: options.before || 0,
    },
    children: [
      new TextRun({
        text,
        bold: options.bold || false,
        size: options.size || 24, // 12pt * 2
        font: "Times New Roman",
      }),
    ],
  });
};

// Форматирование даты
export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Прописью для сумм
export const numberToWords = (num: number): string => {
  const ones = [
    "",
    "один",
    "два",
    "три",
    "четыре",
    "пять",
    "шесть",
    "семь",
    "восемь",
    "девять",
  ];
  const tens = [
    "",
    "",
    "двадцать",
    "тридцать",
    "сорок",
    "пятьдесят",
    "шестьдесят",
    "семьдесят",
    "восемьдесят",
    "девяносто",
  ];
  const hundreds = [
    "",
    "сто",
    "двести",
    "триста",
    "четыреста",
    "пятьсот",
    "шестьсот",
    "семьсот",
    "восемьсот",
    "девятьсот",
  ];
  const thousands = ["", "тысяча", "тысячи", "тысяч"];

  if (num === 0) return "ноль";

  let result = "";
  
  // Тысячи
  const thousand = Math.floor(num / 1000);
  if (thousand > 0) {
    result += hundreds[Math.floor(thousand / 100)] + " ";
    const tenPart = thousand % 100;
    if (tenPart >= 10 && tenPart < 20) {
      const teens = [
        "десять",
        "одиннадцать",
        "двенадцать",
        "тринадцать",
        "четырнадцать",
        "пятнадцать",
        "шестнадцать",
        "семнадцать",
        "восемнадцать",
        "девятнадцать",
      ];
      result += teens[tenPart - 10] + " ";
    } else {
      result += tens[Math.floor(tenPart / 10)] + " ";
      const onePart = tenPart % 10;
      if (onePart === 1) result += "одна ";
      else if (onePart === 2) result += "две ";
      else if (onePart > 0) result += ones[onePart] + " ";
    }
    
    // Склонение слова "тысяча"
    const lastDigit = thousand % 10;
    const lastTwo = thousand % 100;
    if (lastTwo >= 11 && lastTwo <= 14) {
      result += thousands[3] + " ";
    } else if (lastDigit === 1) {
      result += thousands[1] + " ";
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      result += thousands[2] + " ";
    } else {
      result += thousands[3] + " ";
    }
  }

  // Сотни, десятки, единицы
  const remainder = num % 1000;
  result += hundreds[Math.floor(remainder / 100)] + " ";
  const tenPart = remainder % 100;
  
  if (tenPart >= 10 && tenPart < 20) {
    const teens = [
      "десять",
      "одиннадцать",
      "двенадцать",
      "тринадцать",
      "четырнадцать",
      "пятнадцать",
      "шестнадцать",
      "семнадцать",
      "восемнадцать",
      "девятнадцать",
    ];
    result += teens[tenPart - 10];
  } else {
    result += tens[Math.floor(tenPart / 10)] + " ";
    result += ones[tenPart % 10];
  }

  return result.trim();
};

// Функция склонения рублей
export const rublesWord = (num: number): string => {
  const lastDigit = num % 10;
  const lastTwo = num % 100;
  
  if (lastTwo >= 11 && lastTwo <= 14) return "рублей";
  if (lastDigit === 1) return "рубль";
  if (lastDigit >= 2 && lastDigit <= 4) return "рубля";
  return "рублей";
};
