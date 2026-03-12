# ⚡ БЫСТРЫЙ СТАРТ - Что делать прямо сейчас

## 🔧 Исправлено:
✅ Добавлен `index.html` - точка входа
✅ Добавлен `src/main.tsx` - инициализация React
✅ Исправлен `package.json` - добавлены react и react-dom
✅ Добавлены скрипты: dev, build, preview
✅ Созданы конфиги для Vercel и Netlify

---

## 🚀 ТРИ СПОСОБА ЗАПУСТИТЬ

### СПОСОБ 1: Проверка локально (СДЕЛАЙТЕ ЭТО ПЕРВЫМ!)

```bash
# 1. Установите зависимости
npm install

# 2. Запустите локально
npm run dev

# 3. Откройте http://localhost:5173
```

**Если открылся сайт - УРА! Можно деплоить.**

---

### СПОСОБ 2: Быстрый деплой на Vercel через UI

1. **Соберите проект:**
```bash
npm run build
```

2. **Зайдите на https://vercel.com**
   - Sign up / Login (можно через GitHub)

3. **New Project**

4. **Если уже залили на GitHub:**
   - Import Git Repository
   - Выберите репозиторий
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Добавьте Environment Variables:**
```
VITE_SUPABASE_URL=https://qayiggchqifbxxjulosy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFheWlnZ2NocWlmYnh4anVsb3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDgyMjIsImV4cCI6MjA4ODgyNDIyMn0.tlWKzGY7gxxxaHbHttTw7qGxla84LgdnYf4ImNDyg1w
```

6. **Deploy** → Дождитесь окончания (2-3 минуты)

7. **Settings → Domains**
   - Add: `documentator.online`
   - Add: `www.documentator.online`
   - Vercel даст вам DNS записи

8. **В reg.ru → Управление DNS:**
```
Тип: A
Имя: @
Значение: [IP от Vercel, например 76.76.21.21]

Тип: CNAME
Имя: www
Значение: cname.vercel-dns.com
```

9. **Сохраните → Подождите 15-60 минут**

---

### СПОСОБ 3: Супер быстрый деплой на Netlify (Drag & Drop)

1. **Соберите проект:**
```bash
npm install
npm run build
```

2. **Зайдите на https://app.netlify.com**
   - Sign up / Login

3. **Перетащите папку `dist`** на страницу Netlify

4. **Site settings → Environment variables:**
```
VITE_SUPABASE_URL=https://qayiggchqifbxxjulosy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFheWlnZ2NocWlmYnh4anVsb3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDgyMjIsImV4cCI6MjA4ODgyNDIyMn0.tlWKzGY7gxxxaHbHttTw7qGxla84LgdnYf4ImNDyg1w
```

5. **Rebuil d → Domain settings → Add domain**
   - Добавьте `documentator.online`

6. **В reg.ru настройте DNS** (как в способе 2)

---

## 🔍 ДИАГНОСТИКА ПРОБЛЕМ

### Ошибка: Cannot find module 'react'
```bash
rm -rf node_modules package-lock.json
npm install
```

### Белый экран / Ничего не работает
- Откройте консоль браузера (F12)
- Посмотрите ошибки
- Проверьте Network tab - загружаются ли файлы

### Сайт не открывается по домену
- Подождите до 24 часов (обычно 15-60 минут)
- Проверьте DNS: https://dnschecker.org
- Убедитесь, что в reg.ru правильно указали записи от Vercel

### Регистрация не работает
- Проверьте, что Supabase Edge Function работает:
  https://qayiggchqifbxxjulosy.supabase.co/functions/v1/make-server-297fba9e/health
- Должно вернуть: `{"status":"ok"}`

---

## 📋 ЧЕКЛИСТ ПЕРЕД ЗАПУСКОМ

- [ ] `npm install` выполнен без ошибок
- [ ] `npm run dev` запускается локально
- [ ] Сайт открывается на http://localhost:5173
- [ ] Можно создать документ без регистрации
- [ ] `npm run build` собирается без ошибок
- [ ] Залили на Vercel/Netlify
- [ ] Добавили переменные окружения
- [ ] Настроили DNS в reg.ru
- [ ] Подождали 30-60 минут
- [ ] Сайт открывается по https://documentator.online

---

## ❓ ЧТО-ТО НЕ РАБОТАЕТ?

**Напишите мне:**
1. Какую ошибку видите?
2. На каком этапе застряли?
3. Скриншот ошибки из консоли (F12)

Помогу разобраться! 🚀
