# 📄 Документатор — Генератор юридических документов

> Pet project для создания договоров и заявлений с выгрузкой в Word

---

## 🔴 ВАЖНО! Сначала прочитай:

### 1. **`/FIX_NOW.md`** — Задеплой backend (5 минут)
   ⚠️ **БЕЗ этого регистрация НЕ работает!**

### 2. **`/START_NOW.md`** — Задеплой на Vercel (15 минут)
   🚀 Запуск в production

### 3. **`/LAUNCH_NOW.md`** — SEO, аналитика, монетизация
   💰 Рост до 200k/мес

---

## 🎯 Что это:

- **13 популярных документов** (договоры, заявления)
- **Freemium модель:** 3 документа free, безлимит на платных тарифах
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Frontend:** React + Tailwind CSS
- **Монетизация:** YooKassa (пока отключена до самозанятости)

---

## ⚡ Быстрый старт:

### Локально:
```bash
npm install
npm run dev
```

### Production:
```bash
vercel --prod
```

---

## 📂 Структура:

```
/src/app/
  ├── pages/           # Страницы (Home, Login, Signup, etc)
  ├── components/      # Компоненты (UI, документы)
  ├── templates/       # 13 шаблонов документов
  └── utils/           # Supabase client, helpers

/supabase/functions/server/
  └── index.tsx        # Edge Function (backend)
```

---

## 🚀 Статус проекта:

- ✅ Все 13 документов работают
- ✅ Backend готов на 95%
- ✅ Регистрация и авторизация
- ✅ История документов
- ✅ Система лимитов (3 free, безлимит paid)
- ⏳ Платежи через YooKassa (отключены до самозанятости)

---

## 🛠 Tech Stack:

- **Frontend:** React, TypeScript, Tailwind CSS v4
- **Backend:** Supabase Edge Functions (Deno), Hono
- **Database:** PostgreSQL (KV Store)
- **Auth:** Supabase Auth
- **Deploy:** Vercel (frontend), Supabase (backend)
- **Documents:** docx (Word генерация)

---

## 📝 Следующие шаги:

1. Задеплой backend (`/FIX_NOW.md`)
2. Задеплой на Vercel (`/START_NOW.md`)
3. Протестируй всё
4. Анонсируй запуск
5. Получи самозанятость
6. Включи платежи
7. **Profit!** 💰

---

## 🎉 Готов к запуску!

**Начни с `/FIX_NOW.md`** — там инструкция как запустить backend за 5 минут.

**Удачи! 🚀**
