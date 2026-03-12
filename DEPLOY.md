# 🚀 Инструкция по деплою Документатора

## ✅ Что уже готово

- ✅ Код проекта полностью готов
- ✅ Supabase проект настроен (ID: qayiggchqifbxxjulosy)
- ✅ Backend (Edge Function) развернут
- ✅ База данных настроена
- ✅ Аутентификация работает

## 📦 Шаг 1: Установка зависимостей

```bash
npm install
# или
pnpm install
# или
yarn install
```

## 🧪 Шаг 2: Проверка локально

```bash
npm run dev
```

Откройте http://localhost:5173 в браузере. Сайт должен работать!

## 🚀 Шаг 3: Деплой на Vercel

### 3.1. Через GitHub (РЕКОМЕНДУЕТСЯ)

1. Создайте репозиторий на GitHub
2. Залейте код:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ваш-username/documentator.git
git branch -M main
git push -u origin main
```

3. Зайдите на https://vercel.com
4. **New Project** → Import Git Repository
5. Выберите ваш репозиторий
6. **Framework Preset:** Vite
7. Добавьте переменные окружения:

```
VITE_SUPABASE_URL=https://qayiggchqifbxxjulosy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFheWlnZ2NocWlmYnh4anVsb3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDgyMjIsImV4cCI6MjA4ODgyNDIyMn0.tlWKzGY7gxxxaHbHttTw7qGxla84LgdnYf4ImNDyg1w
```

8. Нажмите **Deploy**

### 3.2. Через Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## 🌐 Шаг 4: Привязка домена documentator.online

### 4.1. В Vercel

1. Settings → Domains
2. Add Domain: `documentator.online`
3. Add Domain: `www.documentator.online`
4. Vercel покажет DNS записи (обычно):

```
A запись: 76.76.21.21
CNAME: cname.vercel-dns.com
```

### 4.2. В reg.ru

1. Личный кабинет → Домены → documentator.online
2. Управление DNS
3. Добавьте записи:

**Для основного домена:**
```
Тип: A
Имя: @
Значение: 76.76.21.21 (IP от Vercel)
TTL: 3600
```

**Для www:**
```
Тип: CNAME
Имя: www
Значение: cname.vercel-dns.com (от Vercel)
TTL: 3600
```

4. Сохраните изменения
5. Подождите 15-60 минут для обновления DNS

## 🔄 Альтернатива: Netlify

### Через Netlify UI

1. Соберите проект локально:
```bash
npm run build
```

2. Зайдите на https://netlify.com
3. Перетащите папку `dist` на страницу
4. Добавьте переменные окружения (Settings → Environment variables)
5. Привяжите домен (Domain settings → Add custom domain)

### Через Netlify CLI

```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

## ✅ Шаг 5: Проверка

После деплоя проверьте:

1. ✅ Сайт открывается по https://documentator.online
2. ✅ SSL-сертификат работает (замочек в браузере)
3. ✅ Создание документа без регистрации работает
4. ✅ Регистрация работает
5. ✅ Авторизация работает
6. ✅ Создание документа после авторизации работает

## 🐛 Проблемы и решения

### Ошибка: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Ошибка при сборке
```bash
npm run build
# Смотрите ошибки в консоли
```

### Белый экран после деплоя
- Проверьте консоль браузера (F12)
- Убедитесь, что добавили переменные окружения в Vercel/Netlify

### DNS не обновляется
- Подождите до 24 часов (обычно 15-60 минут)
- Проверьте через https://dnschecker.org

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в Vercel/Netlify
2. Проверьте консоль браузера (F12)
3. Проверьте Supabase Dashboard → Edge Functions → Logs

---

**Удачного запуска! 🚀**
