# 🚀 ЗАПУСКАЕМ ПРЯМО СЕЙЧАС!

## Твой пошаговый план на 20 минут

---

## ШАГ 1: Подготовка (5 минут)

### 1.1 Убедись что Supabase работает

Открой Supabase Dashboard: https://supabase.com/dashboard

**Проверь:**
- ✅ Проект создан
- ✅ Edge Function "server" запущена (зелёный статус)
- ✅ Таблица `kv_store_297fba9e` существует

**Если что-то не работает:**
```bash
# Задеплой Edge Function заново
cd supabase
supabase functions deploy server
```

### 1.2 Скопируй Supabase ключи

В Supabase Dashboard → Settings → API:
- **Project URL**: `https://xxx.supabase.co`
- **Anon public key**: `eyJhbG...`

Запиши их — понадобятся для Vercel!

---

## ШАГ 2: Временно отключи кнопку подписки (2 минуты)

Пока нет YooKassa, давай сделаем так, чтобы на странице Pricing была надпись "Скоро":

Открой `/src/app/pages/Pricing.tsx` и найди кнопки "Оформить подписку".

Замени их на:

```tsx
<Button size="lg" className="w-full" disabled>
  Скоро будет доступно
</Button>
```

Или ещё лучше — добавь форму для сбора email:

```tsx
<div className="space-y-3">
  <p className="text-sm text-gray-600">Оставьте email, узнаете о запуске первым:</p>
  <Input type="email" placeholder="ваш@email.com" />
  <Button size="lg" className="w-full">
    Узнать о запуске
  </Button>
</div>
```

Хочешь, я это сделаю за тебя?

---

## ШАГ 3: Установи Vercel CLI (1 минута)

```bash
npm install -g vercel
```

**Проверь установку:**
```bash
vercel --version
```

Должна показаться версия (например: Vercel CLI 37.0.0)

---

## ШАГ 4: Залогинься в Vercel (1 минута)

```bash
vercel login
```

Выбери один из вариантов:
- Email
- GitHub
- GitLab
- Bitbucket

Подтверди логин в браузере.

---

## ШАГ 5: Задеплой проект (5 минут)

### 5.1 Первый деплой (тестовый)

```bash
# Из корневой папки проекта
vercel
```

**Ответь на вопросы:**
```
? Set up and deploy "~/документатор"? [Y/n] y
? Which scope do you want to deploy to? → [Твой аккаунт]
? Link to existing project? [y/N] n
? What's your project's name? → dokumentator
? In which directory is your code located? → ./
? Want to override the settings? [y/N] n
```

**Vercel автоматически:**
- ✅ Обнаружит Vite проект
- ✅ Установит зависимости
- ✅ Соберёт проект (`vite build`)
- ✅ Задеплоит на временный URL

**Результат:**
```
✅  Production: https://dokumentator-xxx.vercel.app [copied to clipboard]
```

### 5.2 Добавь переменные окружения

```bash
# Открой настройки проекта
vercel env add VITE_SUPABASE_URL
# Вставь: https://xxx.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Вставь: eyJhbG...
```

Или через Web Dashboard:
1. Открой https://vercel.com/dashboard
2. Выбери проект "dokumentator"
3. Settings → Environment Variables
4. Добавь:
   - `VITE_SUPABASE_URL` = `https://xxx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbG...`

### 5.3 Передеплой с переменными

```bash
vercel --prod
```

**Готово!** Сайт на production URL:
```
https://dokumentator.vercel.app
```

---

## ШАГ 6: Тестирование (5 минут)

### 6.1 Открой сайт
```
https://dokumentator.vercel.app
```

### 6.2 Пройди полный флоу:

**1. Регистрация:**
- Нажми "Войти"
- Перейди на "Регистрация"
- Зарегистрируй тестовый аккаунт
- ✅ Должен автоматически залогиниться

**2. Создание документа:**
- Вернись на главную
- Выбери "Договор аренды квартиры"
- Заполни форму
- Скачай документ
- ✅ Должен скачаться Word файл

**3. История:**
- Открой "Личный кабинет"
- ✅ Должен увидеть созданный документ
- ✅ Счётчик: "2 документа осталось"

**4. Лимиты:**
- Создай ещё 2 документа (всего 3)
- Попытайся создать 4-й
- ✅ Должно показать: "Лимит достигнут"

**5. Pricing:**
- Открой "Тарифы"
- ✅ Должны быть кнопки "Скоро" (или форма email)

---

## ШАГ 7: Настройка домена (опционально, 5 минут)

### Если у тебя есть домен:

**В Vercel Dashboard:**
1. Проект → Settings → Domains
2. Add Domain → введи `dokumentator.ru`
3. Скопируй DNS записи

**У регистратора домена (reg.ru, nic.ru и т.д.):**
1. Открой управление DNS
2. Добавь записи:
   ```
   A     @      76.76.21.21
   CNAME www    cname.vercel-dns.com
   ```
3. Подожди 5-10 минут (пропагация DNS)

**Готово!** Сайт доступен на `dokumentator.ru`

### Если домена нет:
Пока используй `dokumentator.vercel.app` — это нормально для старта!

---

## ШАГ 8: Анонс запуска! 🎉

### Где постить:

**1. Telegram:**
- Каналы про стартапы
- IT-сообщества
- Бизнес-каналы

**2. Соцсети:**
- ВКонтакте (группы предпринимателей)
- Facebook (бизнес-группы)
- LinkedIn

**3. Площадки:**
- vc.ru — написать пост
- habr.com — в песочницу
- pikabu.ru

**4. Форумы:**
- reddit.com/r/startups
- reddit.com/r/Entrepreneur

### Что написать:

```
🎉 Запустил сервис для генерации юридических документов!

Документатор — это онлайн-конструктор договоров и заявлений:
• 13 готовых шаблонов документов
• 3 документа бесплатно каждый месяц
• Скачивание в Word за 3 минуты
• Никаких юристов и сложностей

Попробуйте: https://dokumentator.vercel.app

Буду рад любому feedback! 🙏

#стартап #документы #бизнес
```

---

## Альтернатива: GitHub Pages (если не хочешь Vercel)

```bash
# 1. Собери проект
npm run build

# 2. Опубликуй на GitHub
cd dist
git init
git add -A
git commit -m "Deploy"
git push -f git@github.com:username/dokumentator.git main:gh-pages

# 3. Включи GitHub Pages в настройках репозитория
```

---

## Проблемы и решения:

### ❌ "Command not found: vercel"
```bash
# Установи глобально
npm install -g vercel

# Или используй npx
npx vercel
```

### ❌ "Build failed"
```bash
# Проверь что package.json содержит build script
npm run build

# Если не работает — проверь логи в Vercel Dashboard
```

### ❌ "Supabase не отвечает"
```bash
# Проверь что Edge Function запущена
# Supabase Dashboard → Edge Functions → server → должна быть зелёная

# Передеплой если нужно
supabase functions deploy server
```

### ❌ "Cannot read environment variables"
```bash
# Убедись что добавил переменные в Vercel
# Settings → Environment Variables

# И передеплоил
vercel --prod
```

---

## Чек-лист запуска:

- [ ] Supabase работает (Edge Function зелёная)
- [ ] Скопировал Supabase URL и Key
- [ ] Отключил кнопку подписки (или добавил "Скоро")
- [ ] Установил Vercel CLI
- [ ] Залогинился в Vercel
- [ ] Задеплоил проект (`vercel`)
- [ ] Добавил environment variables
- [ ] Передеплоил production (`vercel --prod`)
- [ ] Протестировал регистрацию
- [ ] Протестировал создание документа
- [ ] Протестировал лимиты
- [ ] Анонсировал запуск!

---

## 🎉 ПОЗДРАВЛЯЮ С ЗАПУСКОМ!

**Твой сайт живой:** `https://dokumentator.vercel.app`

### Что дальше:

**Неделя 1: Мониторинг**
- Смотри на пользователей в Supabase Dashboard
- Собирай feedback
- Исправляй баги

**Неделя 2-3: Оптимизация**
- Доработай по feedback
- Настрой аналитику (Яндекс.Метрика)
- Начни SEO

**Месяц 2: Монетизация**
- Оформи самозанятость
- Добавь YooKassa
- Запусти платные подписки

**Месяц 3+: Масштабирование**
- Контекстная реклама
- Партнёрства
- Новые документы

---

## 💬 Нужна помощь?

**Если что-то не работает:**
1. Проверь логи в Vercel Dashboard
2. Проверь Edge Function в Supabase
3. Напиши мне — помогу разобраться!

**Успехов с проектом! 🚀**

---

**Дата запуска:** 11 марта 2026  
**Первая версия:** 1.0 (MVP)  
**Следующий шаг:** Собирать пользователей и feedback!
