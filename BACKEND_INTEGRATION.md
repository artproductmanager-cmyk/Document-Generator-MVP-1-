# Backend Integration Guide — Документатор

## Обзор архитектуры

Проект использует **трёхуровневую архитектуру**:

```
Frontend (React) → API (Supabase Edge Functions + Hono) → Database (KV Store)
```

## Реализованный функционал

### 1. Аутентификация (Supabase Auth)

#### Регистрация
```typescript
POST /make-server-297fba9e/auth/signup
Body: { email, password, fullName }
```

- Создаёт пользователя в Supabase Auth
- Автоматически подтверждает email (т.к. email-сервер не настроен)
- Создаёт профиль в KV store с бесплатным тарифом

#### Вход (через Supabase SDK)
```typescript
import { supabase } from './utils/supabaseClient';

const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

#### Получение текущего пользователя
```typescript
GET /make-server-297fba9e/auth/me
Headers: { Authorization: Bearer <token> }
```

### 2. Управление документами

#### Генерация и сохранение документа
```typescript
POST /make-server-297fba9e/api/generate
Headers: { Authorization: Bearer <token> }
Body: {
  templateSlug: 'dogovor-arendy-kvartiry',
  documentData: { /* данные формы */ }
}
```

**Функционал**:
- ✅ Проверка авторизации
- ✅ Проверка лимитов (3 для free, безлимит для платных)
- ✅ Сохранение документа в KV store
- ✅ Увеличение счётчика документов пользователя
- ✅ Возврат информации об оставшихся документах

#### История документов пользователя
```typescript
GET /make-server-297fba9e/api/my-documents
Headers: { Authorization: Bearer <token> }
```

### 3. Система подписок

#### Структура тарифов

| Тариф | Цена | Документов | Особенности |
|-------|------|------------|-------------|
| Free | 0₽ | 3/месяц | Базовые функции |
| Standard | 299₽/мес | Безлимит | Word/PDF, поддержка |
| Premium | 599₽/мес | Безлимит | + ЭП, консультации |

#### Создание платежа
```typescript
POST /make-server-297fba9e/api/create-payment
Headers: { Authorization: Bearer <token> }
Body: { tier: 'standard', months: 1 }
```

**Примечание**: Для продакшена требуется интеграция с YooKassa API.

#### Webhook для обработки платежей
```typescript
POST /make-server-297fba9e/api/webhook/payment
Body: { /* webhook data from YooKassa */ }
```

## Структура данных в KV Store

### User Profile
```typescript
Key: user:{userId}
Value: {
  id: string,
  email: string,
  fullName: string,
  subscriptionTier: 'free' | 'standard' | 'premium',
  documentsGeneratedThisMonth: number,
  createdAt: string,
  subscriptionExpiresAt: string | null
}
```

### Document
```typescript
Key: document:{userId}:{docId}
Value: {
  id: string,
  userId: string,
  templateSlug: string,
  documentData: any,
  createdAt: string
}
```

### Payment
```typescript
Key: payment:{paymentId}
Value: {
  id: string,
  userId: string,
  amount: number,
  currency: 'RUB',
  tier: string,
  months: number,
  status: 'pending' | 'succeeded' | 'failed',
  createdAt: string
}
```

## Использование на Frontend

### AuthContext
```typescript
import { useAuth } from './contexts/AuthContext';

function Component() {
  const { user, userProfile, signIn, signUp, signOut } = useAuth();
  
  // user - объект пользователя Supabase
  // userProfile - профиль из KV store с подпиской и лимитами
}
```

### Хук для генерации документов
```typescript
import { useDocumentGeneration } from './hooks/useDocumentGeneration';

function DocumentPage() {
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('dogovor-arendy');
  
  const handleGenerate = async () => {
    if (!checkLimit()) return;
    
    const success = await saveDocument(formData);
    if (success) {
      // Документ сохранён
    }
  };
}
```

### Баннер лимитов
```typescript
import { LimitBanner } from './components/LimitBanner';

function DocumentPage() {
  return (
    <div>
      <LimitBanner />
      {/* ... форма документа */}
    </div>
  );
}
```

## Интеграция с YooKassa (для продакшена)

### 1. Получите API ключи
- Зарегистрируйтесь на [yookassa.ru](https://yookassa.ru)
- Получите `shop_id` и `secret_key`
- Добавьте в переменные окружения Supabase

### 2. Обновите код создания платежа

В `/supabase/functions/server/index.tsx`:

```typescript
// Установите npm:yookassa в Deno
import { Payment } from 'npm:yookassa';

// В endpoint create-payment:
const payment = await Payment.create({
  amount: {
    value: amount.toString(),
    currency: 'RUB'
  },
  confirmation: {
    type: 'redirect',
    return_url: 'https://your-domain.com/payment-success'
  },
  capture: true,
  description: `Подписка ${tier}`,
  metadata: {
    paymentId,
    userId: user.id,
  }
}, crypto.randomUUID());

return c.json({
  confirmationUrl: payment.confirmation.confirmation_url,
  paymentId,
});
```

### 3. Настройте webhook
- В личном кабинете YooKassa добавьте webhook URL:
  `https://your-project.supabase.co/functions/v1/make-server-297fba9e/api/webhook/payment`
- Webhook автоматически обработает успешные платежи и активирует подписки

## Cron задачи

### Сброс месячных лимитов
```typescript
POST /make-server-297fba9e/api/cron/reset-monthly-counters
```

Настройте вызов этого endpoint 1-го числа каждого месяца через:
- Supabase Cron (если доступно)
- Внешний cron-сервис (cron-job.org, easycron.com)
- GitHub Actions

Пример GitHub Actions:
```yaml
name: Reset Monthly Limits
on:
  schedule:
    - cron: '0 0 1 * *' # 1-е число каждого месяца в 00:00

jobs:
  reset:
    runs-on: ubuntu-latest
    steps:
      - name: Call reset endpoint
        run: |
          curl -X POST https://your-project.supabase.co/functions/v1/make-server-297fba9e/api/cron/reset-monthly-counters
```

## Безопасность

### ✅ Реализовано
- Supabase Auth для аутентификации
- Service Role Key только на сервере
- Bearer tokens для защищённых endpoints
- CORS настроен правильно

### ⚠️ TODO для продакшена
- [ ] Валидация webhook от YooKassa (проверка подписи)
- [ ] Rate limiting для API
- [ ] Логирование подозрительной активности
- [ ] HTTPS обязателен
- [ ] Регулярные бэкапы KV store

## Мониторинг и аналитика

### Рекомендуемые метрики
- Количество регистраций в день
- Конверсия free → paid
- Количество созданных документов
- Популярные типы документов
- Частота превышения лимита

### Инструменты
- Supabase Dashboard — логи и статистика
- Яндекс.Метрика / Google Analytics — поведение пользователей
- Sentry / LogRocket — отслеживание ошибок

## Troubleshooting

### Ошибка "Unauthorized" при генерации документа
- Проверьте, что пользователь вошёл в систему
- Убедитесь, что токен передаётся в заголовке Authorization
- Проверьте срок действия сессии

### Документы не сохраняются
- Откройте DevTools Console и проверьте ошибки
- Проверьте логи в Supabase Edge Functions
- Убедитесь, что KV store работает

### Лимиты не обновляются
- Проверьте, что вызывается `refreshUserProfile()` после генерации
- Убедитесь, что профиль пользователя обновляется в KV store

## Дальнейшее развитие

### Приоритет 1 (MVP+)
- [ ] Интеграция с реальной платёжной системой (YooKassa)
- [ ] Email уведомления (через Supabase или SendGrid)
- [ ] Экспорт в PDF на сервере

### Приоритет 2 (Growth)
- [ ] Шаблоны с переменными (как в ТЗ)
- [ ] Админ-панель для управления шаблонами
- [ ] Социальный вход (Google, Yandex)
- [ ] Реферальная программа

### Приоритет 3 (Scale)
- [ ] Миграция на полноценную PostgreSQL БД
- [ ] Электронная подпись документов
- [ ] API для партнёров
- [ ] Мобильное приложение
