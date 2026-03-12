# 🚨 СРОЧНО: Нужно задеплоить Backend!

## Проблема:
Ошибка "API request failed" означает, что **Edge Function не запущена** на Supabase!

---

## 🚀 КАК ИСПРАВИТЬ (2 варианта):

### ✅ Вариант A: Быстрый способ — через Supabase Dashboard

1. **Открой Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/qayiggchqifbxxjulosy/functions
   ```

2. **Создай новую Edge Function:**
   - Нажми **"Create a new function"**
   - Имя функции: `make-server-297fba9e`
   - Нажми **"Create"**

3. **Скопируй код:**
   - Открой файл `/supabase/functions/server/index.tsx` в твоём проекте
   - Скопируй **ВЕСЬ код**

4. **Вставь в Supabase:**
   - В редакторе Supabase вставь скопированный код
   - Нажми **"Deploy"**

5. **Проверь статус:**
   - Функция должна стать **зелёной** (Running)
   - Проверь URL: `https://qayiggchqifbxxjulosy.supabase.co/functions/v1/make-server-297fba9e/health`

---

### ✅ Вариант B: Профессиональный способ — через Supabase CLI

#### Шаг 1: Установи Supabase CLI

**На Mac:**
```bash
brew install supabase/tap/supabase
```

**На Windows:**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Или через NPM:**
```bash
npm install -g supabase
```

#### Шаг 2: Залогинься
```bash
supabase login
```

Откроется браузер → авторизуйся через GitHub/Google

#### Шаг 3: Свяжи проект
```bash
supabase link --project-ref qayiggchqifbxxjulosy
```

#### Шаг 4: Задеплой функцию
```bash
supabase functions deploy make-server-297fba9e --no-verify-jwt
```

**Важно:** Флаг `--no-verify-jwt` нужен для работы регистрации!

#### Шаг 5: Проверь
```bash
curl https://qayiggchqifbxxjulosy.supabase.co/functions/v1/make-server-297fba9e/health
```

Должен вернуть: `{"status":"ok"}`

---

## 🧪 После деплоя проверь:

1. **Health check:**
   ```
   https://qayiggchqifbxxjulosy.supabase.co/functions/v1/make-server-297fba9e/health
   ```
   Должен вернуть: `{"status":"ok"}`

2. **Регистрация:**
   - Открой свой сайт
   - Попробуй зарегистрироваться
   - ✅ Должно работать!

---

## 📋 Чек-лист:

- [ ] Edge Function создана в Supabase
- [ ] Код задеплоен
- [ ] Функция работает (статус зелёный)
- [ ] Health check возвращает `{"status":"ok"}`
- [ ] Регистрация работает на сайте

---

## ❓ Проблемы?

### Ошибка "Function not found":
- Проверь, что функция называется **точно** `make-server-297fba9e`
- Проверь статус в Dashboard

### Ошибка "500 Internal Server Error":
- Открой Logs в Supabase Dashboard
- Посмотри что там написано
- Пришли мне лог — я помогу!

### Регистрация всё ещё не работает:
- Открой Console браузера (F12)
- Попробуй зарегистрироваться
- Скопируй все ошибки
- Пришли мне — разберёмся!

---

## 🎯 Рекомендация:

**Используй Вариант A** (через Dashboard) — быстрее и проще!

1. Открой https://supabase.com/dashboard
2. Выбери свой проект
3. Edge Functions → Create function → `make-server-297fba9e`
4. Вставь код из `/supabase/functions/server/index.tsx`
5. Deploy!

**Время:** 2-3 минуты ⚡

---

## ✅ После этого:

1. Регистрация заработает ✅
2. Логин заработает ✅
3. Генерация документов заработает ✅
4. Вся система заработает полностью! 🚀

---

## 🚀 Готов запускать!

После деплоя функции всё заработает и можно будет сразу запускать проект!
