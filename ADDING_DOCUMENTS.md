# 📄 Добавление новых документов

Руководство по добавлению новых типов документов в Документатор.

## Структура документа

Каждый документ состоит из:
1. **Страница-мастер** — пошаговый интерфейс для заполнения
2. **Форма данных** — TypeScript интерфейс с полями
3. **Генератор документа** — функция создания Word файла
4. **Роут** — URL страницы
5. **Карточка на главной** — для навигации

## Шаг 1: Создайте интерфейс данных

```typescript
// Определите какие данные нужно собрать
interface MyDocumentData {
  // Основные участники
  party1Name: string;
  party1Passport: string;
  party1Address: string;
  
  party2Name: string;
  party2Passport: string;
  party2Address: string;
  
  // Специфичные поля документа
  specificField1: string;
  specificField2: string;
  
  // Общие поля
  city: string;
  date: string;
}
```

## Шаг 2: Создайте страницу документа

Создайте файл `/src/app/pages/MyDocument.tsx`:

```typescript
import { useState } from "react";
import { DocumentWizard } from "../components/DocumentWizard";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Download, Eye } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";
import { generateWord, createParagraph, formatDate } from "../utils/documentGenerator";

interface MyDocumentData {
  // ... ваши поля
}

export function MyDocument() {
  const [formData, setFormData] = useState<MyDocumentData>({
    // Инициализация полей
    party1Name: "",
    party1Passport: "",
    // ... остальные поля
    date: new Date().toISOString().split("T")[0],
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateField = (field: keyof MyDocumentData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Валидация для каждого шага
  const canProceed = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        return !!(formData.party1Name && formData.party1Passport);
      case 1:
        return !!(formData.party2Name && formData.party2Passport);
      // ... остальные шаги
      default:
        return true;
    }
  };

  // Генерация документа
  const generateDocument = () => {
    const sections = [
      // Заголовок
      createParagraph("НАЗВАНИЕ ДОКУМЕНТА", { 
        bold: true, 
        alignment: "center" 
      }),
      
      // Город и дата
      createParagraph(
        `г. ${formData.city}, ${formatDate(new Date(formData.date))}`,
        {}
      ),
      
      // Основное содержание
      createParagraph(
        `Текст документа с данными: ${formData.party1Name}...`,
        {}
      ),
      
      // ... остальные параграфы
    ];

    return sections;
  };

  const handleDownloadWord = async () => {
    try {
      const sections = generateDocument();
      await generateWord(sections, "my-document.docx");
      toast.success("Документ успешно скачан!");
    } catch (error) {
      toast.error("Ошибка при создании документа");
    }
  };

  // Определяем шаги мастера
  const steps = [
    {
      title: "Первая сторона",
      description: "Укажите данные первой стороны",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="party1Name">ФИО *</Label>
            <Input
              id="party1Name"
              value={formData.party1Name}
              onChange={(e) => updateField("party1Name", e.target.value)}
            />
          </div>
          {/* Остальные поля */}
        </div>
      ),
    },
    // ... остальные шаги
    {
      title: "Готово!",
      description: "Документ готов к скачиванию",
      content: (
        <div className="space-y-6">
          <Button size="lg" onClick={handleDownloadWord}>
            <Download className="w-5 h-5 mr-2" />
            Скачать Word
          </Button>
          {/* Предпросмотр и т.д. */}
        </div>
      ),
    },
  ];

  return (
    <DocumentWizard
      title="Название документа"
      description="Краткое описание"
      steps={steps}
      onComplete={() => {
        toast.success("Документ готов!");
      }}
      canProceed={canProceed}
    />
  );
}
```

## Шаг 3: Добавьте роут

В файл `/src/app/routes.tsx` добавьте:

```typescript
import { MyDocument } from "./pages/MyDocument";

export const router = createBrowserRouter([
  // ... существующие роуты
  {
    path: "/my-document-url",
    Component: MyDocument,
  },
]);
```

## Шаг 4: Добавьте карточку на главную

В файл `/src/app/pages/Home.tsx` добавьте документ в массив:

```typescript
const documents: DocumentType[] = [
  // ... существующие документы
  {
    id: "my-doc",
    title: "Название документа",
    description: "Краткое описание документа",
    path: "/my-document-url",
    category: "civil", // или "family" или "business"
    popular: false, // true если хотите отметить как популярный
  },
];
```

## Шаг 5: Обновите SEO

1. **Добавьте страницу в sitemap.xml:**

```xml
<url>
  <loc>https://dokumentator.ru/my-document-url</loc>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
  <lastmod>2026-03-11</lastmod>
</url>
```

2. **Добавьте SEO компонент на страницу:**

```typescript
import { SEO } from "../components/SEO";

export function MyDocument() {
  return (
    <>
      <SEO
        title="Название документа — создать онлайн | Документатор"
        description="Создайте [название документа] онлайн за 5 минут..."
        keywords="название документа, скачать, создать онлайн"
      />
      {/* Остальной контент */}
    </>
  );
}
```

## Примеры популярных документов для добавления

### 1. Брачный договор
- **URL:** `/brachnyj-dogovor`
- **Спрос:** 3000 показов/месяц
- **Сложность:** средняя
- **Поля:** данные супругов, режим имущества, условия

### 2. Договор дарения
- **URL:** `/dogovor-dareniya`
- **Спрос:** 2000 показов/месяц
- **Сложность:** средняя
- **Поля:** даритель, одаряемый, предмет дарения

### 3. Доверенность
- **URL:** `/doverennost`
- **Спрос:** 5000 показов/месяц
- **Сложность:** легкая
- **Поля:** доверитель, поверенный, полномочия, срок

### 4. Трудовой договор
- **URL:** `/trudovoj-dogovor`
- **Спрос:** 4000 показов/месяц
- **Сложность:** сложная
- **Поля:** работодатель, работник, должность, оклад, график

### 5. Договор оказания услуг
- **URL:** `/dogovor-okazaniya-uslug`
- **Спрос:** 4000 показов/месяц
- **Сложность:** средняя
- **Поля:** заказчик, исполнитель, услуги, стоимость

### 6. Согласие на выезд ребенка
- **URL:** `/soglasie-na-vyezd-rebenka`
- **Спрос:** 3000 показов/месяц
- **Сложность:** легкая
- **Поля:** родитель, ребенок, сопровождающий, страна, срок

### 7. Заявление на развод
- **URL:** `/zayavlenie-na-razvod`
- **Спрос:** 3000 показов/месяц
- **Сложность:** средняя
- **Поля:** супруги, дети, имущество, причина

### 8. Договор подряда
- **URL:** `/dogovor-podryada`
- **Спрос:** 2000 показов/месяц
- **Сложность:** средняя
- **Поля:** заказчик, подрядчик, работы, сроки, цена

### 9. Акт приема-передачи
- **URL:** `/akt-priema-peredachi`
- **Спрос:** 2500 показов/месяц
- **Сложность:** легкая
- **Поля:** передающая сторона, принимающая, объект, дата

### 10. Договор поставки
- **URL:** `/dogovor-postavki`
- **Спрос:** 1500 показов/месяц
- **Сложность:** сложная
- **Поля:** поставщик, покупатель, товар, количество, цена

## Советы по созданию документов

### 1. Изучите существующие шаблоны
Посмотрите на существующие документы (RentalAgreement.tsx, Receipt.tsx) как примеры.

### 2. Структура документа
Большинство документов имеют:
- Заголовок
- Дата и место
- Стороны договора
- Предмет (что именно оформляется)
- Условия и обязательства
- Ответственность
- Реквизиты и подписи

### 3. Валидация полей
Всегда валидируйте обязательные поля перед переходом к следующему шагу.

### 4. Предпросмотр
Давайте пользователям возможность посмотреть документ перед скачиванием.

### 5. Юридическая корректность
Проверяйте шаблоны у юриста, особенно для сложных документов.

### 6. Подсказки
Добавляйте подсказки и примеры заполнения полей:
```typescript
<Input
  placeholder="Иванов Иван Иванович"
  helperText="Укажите ФИО полностью как в паспорте"
/>
```

### 7. Автоматическое заполнение
Используйте разумные значения по умолчанию:
```typescript
date: new Date().toISOString().split("T")[0], // сегодняшняя дата
```

## Тестирование нового документа

1. ✅ Все поля заполняются
2. ✅ Валидация работает
3. ✅ Навигация между шагами корректна
4. ✅ Документ генерируется без ошибок
5. ✅ Word файл открывается и содержит правильные данные
6. ✅ Все русские символы отображаются корректно
7. ✅ Предпросмотр показывает актуальные данные
8. ✅ SEO теги настроены
9. ✅ Страница добавлена в sitemap

## Частые ошибки

### ❌ Забыли добавить роут
**Проблема:** Страница не открывается (404)  
**Решение:** Добавьте роут в routes.tsx

### ❌ Не обновили тип в canProceed
**Проблема:** Кнопка "Далее" всегда активна/неактивна  
**Решение:** Добавьте правильную валидацию для каждого шага

### ❌ Неправильная генерация документа
**Проблема:** Документ пустой или с ошибками  
**Решение:** Проверьте, что все поля formData правильно используются в generateDocument()

### ❌ Кириллица не отображается
**Проблема:** Русские буквы заменены на знаки вопроса  
**Решение:** Используйте библиотеку docx (она поддерживает UTF-8), а не jsPDF

## Поддержка

Если у вас возникли вопросы:
1. Изучите существующий код
2. Проверьте консоль браузера на ошибки
3. Убедитесь, что все импорты корректны

Удачи в расширении Документатора! 🚀
