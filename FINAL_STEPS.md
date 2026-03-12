# 🚀 Финальные Шаги для Запуска Документатора

## ✅ Что уже готово

- ✅ Backend API (Supabase Edge Functions + Hono)
- ✅ Frontend (React + TypeScript + Tailwind)
- ✅ Аутентификация (Supabase Auth)
- ✅ База данных (KV Store)
- ✅ Генерация документов (4 рабочих документа)
- ✅ Система лимитов (3 документа для free tier)
- ✅ Личный кабинет (Dashboard)
- ✅ Страница тарифов (Pricing)
- ✅ Современный дизайн (13 документов на сайте)

## 🎯 Что осталось для Production

### 1. Настройка YooKassa (15 минут)

#### Шаг 1: Регистрация в YooKassa
1. Перейти на https://yookassa.ru/
2. Зарегистрироваться (нужны реквизиты ИП или ООО)
3. Подтвердить email и телефон
4. Дождаться модерации (обычно 1-3 дня)

#### Шаг 2: Получить API ключи
1. Войти в личный кабинет YooKassa
2. Перейти в "Настройки" → "API и Webhooks"
3. Создать новый магазин (если нет)
4. Скопировать:
   - `shopId` (6-значное число)
   - `secretKey` (начинается с `live_`)

#### Шаг 3: Добавить секреты в Supabase
```bash
# В Supabase Dashboard → Settings → Edge Functions → Secrets

YOOKASSA_SHOP_ID=123456
YOOKASSA_SECRET_KEY=live_ваш_секретный_ключ
```

#### Шаг 4: Настроить Webhook в YooKassa
1. В YooKassa: "Настройки" → "API и Webhooks"
2. Добавить URL для уведомлений:
   ```
   https://ваш-project-id.supabase.co/functions/v1/make-server-297fba9e/api/webhook/payment
   ```
3. Выбрать события:
   - `payment.succeeded` (платёж успешен)
   - `payment.canceled` (платёж отменён)
4. Сохранить

#### Шаг 5: Обновить код (уже готов!)
Код в `/supabase/functions/server/index.tsx` уже содержит:
- Создание платежа через YooKassa API
- Обработку webhook от YooKassa
- Обновление подписки в базе

**Просто раскомментируйте строки с `YOOKASSA_*` и всё заработает!**

### 2. Настройка Cron для сброса лимитов (10 минут)

#### Зачем нужен Cron?
Раз в месяц (1-го числа) нужно обнулять поле `generated_this_month` для всех пользователей, чтобы free tier снова мог создавать 3 документа.

#### Вариант 1: GitHub Actions (Рекомендуется)

Создать файл `.github/workflows/reset-monthly-limits.yml`:

```yaml
name: Reset Monthly Limits

on:
  schedule:
    # Запускать 1-го числа каждого месяца в 00:00 UTC
    - cron: '0 0 1 * *'
  workflow_dispatch: # Ручной запуск для тестирования

jobs:
  reset-limits:
    runs-on: ubuntu-latest
    steps:
      - name: Call Supabase Edge Function
        run: |
          curl -X POST \
            https://ваш-project-id.supabase.co/functions/v1/make-server-297fba9e/api/cron/reset-monthly-counters \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json"

      - name: Log result
        run: echo "Monthly limits reset successfully!"
```

**Добавить секрет в GitHub:**
1. GitHub repo → Settings → Secrets → Actions
2. Добавить `SUPABASE_SERVICE_ROLE_KEY`

#### Вариант 2: Supabase Cron (если доступно)

В Supabase Dashboard → Database → Cron Jobs:

```sql
SELECT
  net.http_post(
    url := 'https://ваш-project-id.supabase.co/functions/v1/make-server-297fba9e/api/cron/reset-monthly-counters',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    )
  ) AS request_id;
```

Schedule: `0 0 1 * *` (каждое 1-е число месяца)

#### Вариант 3: Внешний сервис (Cron-job.org)

1. Перейти на https://cron-job.org/
2. Зарегистрироваться бесплатно
3. Создать новый Cron Job:
   - **URL:** `https://ваш-project-id.supabase.co/functions/v1/make-server-297fba9e/api/cron/reset-monthly-counters`
   - **Schedule:** `0 0 1 * *`
   - **Method:** POST
   - **Headers:**
     ```
     Authorization: Bearer ваш_service_role_key
     Content-Type: application/json
     ```
4. Сохранить и активировать

### 3. Тестирование перед запуском

#### Тест 1: Регистрация и создание документов
```bash
1. Зарегистрировать тестового пользователя
2. Создать 1-й документ → должен сохраниться (счётчик 1/3)
3. Создать 2-й документ → должен сохраниться (счётчик 2/3)
4. Создать 3-й документ → должен сохраниться (счётчик 3/3)
5. Попытаться создать 4-й → должна быть ошибка "Лимит исчерпан"
```

#### Тест 2: Покупка подписки
```bash
1. Перейти на /pricing
2. Выбрать тариф "Месячный" или "Годовой"
3. Нажать "Оформить подписку"
4. Проверить редирект в YooKassa
5. Оплатить тестовым платежом (если test mode)
6. Проверить что подписка активирована
7. Создать ещё документы → должно работать безлимитно
```

#### Тест 3: Dashboard
```bash
1. Открыть /dashboard
2. Проверить отображение всех созданных документов
3. Проверить информацию о текущем тарифе
4. Проверить счётчик документов
```

#### Тест 4: Сброс лимитов (вручную)
```bash
# Вызвать endpoint вручную
curl -X POST \
  https://ваш-project-id.supabase.co/functions/v1/make-server-297fba9e/api/cron/reset-monthly-counters \
  -H "Authorization: Bearer ваш_service_role_key"

# Проверить что счётчики обнулились в базе
```

### 4. Мониторинг и логирование

#### Логи Supabase Edge Functions
```bash
# В Supabase Dashboard → Edge Functions → Logs
# Проверять на наличие ошибок после каждого теста
```

#### Важные метрики для отслеживания:
- Количество регистраций в день
- Количество созданных документов
- Конверсия free → paid
- Ошибки при генерации документов
- Время ответа API

### 5. SEO и Маркетинг (Опционально)

#### Добавить Google Analytics
```html
<!-- В /index.html перед </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Настроить Яндекс.Метрику
```html
<!-- В /index.html перед </head> -->
<script type="text/javascript">
   (function(m,e,t,r,i,k,a){...}) // Код метрики
</script>
```

#### Создать sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://yourdomain.com/</loc><priority>1.0</priority></url>
  <url><loc>https://yourdomain.com/dogovor-arendy-kvartiry</loc><priority>0.9</priority></url>
  <url><loc>https://yourdomain.com/raspiska-v-poluchenii-deneg</loc><priority>0.9</priority></url>
  <url><loc>https://yourdomain.com/dogovor-kupli-prodazhi-avto</loc><priority>0.9</priority></url>
  <url><loc>https://yourdomain.com/dogovor-zajma</loc><priority>0.9</priority></url>
  <url><loc>https://yourdomain.com/pricing</loc><priority>0.8</priority></url>
</urlset>
```

#### Добавить robots.txt
```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

## 📊 Чек-лист перед запуском

### Backend
- [ ] YooKassa API ключи добавлены в Supabase Secrets
- [ ] Webhook от YooKassa настроен
- [ ] Cron для сброса лимитов настроен
- [ ] Все API endpoints протестированы
- [ ] Логирование работает корректно

### Frontend
- [ ] Все 4 документа создаются и скачиваются
- [ ] LimitBanner отображается на всех страницах
- [ ] Login/Signup работают
- [ ] Dashboard отображает историю
- [ ] Pricing перенаправляет на YooKassa

### Тестирование
- [ ] Регистрация нового пользователя
- [ ] Создание 3 документов (free tier)
- [ ] Блокировка при 4-м документе
- [ ] Покупка подписки через YooKassa
- [ ] Безлимитное создание после оплаты
- [ ] Сброс месячных лимитов (cron)

### SEO
- [ ] Google Analytics подключён
- [ ] Яндекс.Метрика подключена
- [ ] sitemap.xml создан
- [ ] robots.txt создан
- [ ] Meta-теги на всех страницах

## 🎯 План на первый месяц

### Неделя 1: Запуск
- Опубликовать сайт
- Настроить мониторинг
- Собрать первых 10 пользователей (друзья, соцсети)

### Неделя 2: Первые продажи
- Проанализировать поведение пользователей
- Оптимизировать воронку
- Получить первые продажи

### Неделя 3: Масштабирование
- Запустить контекстную рекламу (Яндекс.Директ, Google Ads)
- Оптимизировать SEO
- Добавить новые документы по запросам

### Неделя 4: Анализ
- Собрать метрики за месяц
- Определить самые популярные документы
- Спланировать развитие на 2-й месяц

## 💰 Прогноз Монетизации

### Консервативный сценарий:
```
100 регистраций/месяц
Конверсия в платных: 5%
Средний чек: 300 руб/мес
---
Доход: 100 * 5% * 300 = 1,500 руб/мес
```

### Оптимистичный сценарий:
```
1,000 регистраций/месяц
Конверсия в платных: 10%
Средний чек: 500 руб/мес (больше годовых)
---
Доход: 1,000 * 10% * 500 = 50,000 руб/мес
```

### Целевой сценарий (цель в ТЗ):
```
4,000 регистраций/месяц
Конверсия в платных: 10%
Средний чек: 500 руб/мес
---
Доход: 4,000 * 10% * 500 = 200,000 руб/мес ✅
```

## 🚀 Готово к запуску!

После выполнения шагов выше проект полностью готов к production!

**Удачи с запуском! 🎉**

---

**P.S.** Если возникнут вопросы по настройке YooKassa или Cron — пишите, помогу разобраться!
