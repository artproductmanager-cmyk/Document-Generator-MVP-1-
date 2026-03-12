# Примеры использования — Документатор Backend

## Быстрый старт

### 1. Подключение авторизации к странице документа

```typescript
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDocumentGeneration } from '../hooks/useDocumentGeneration';
import { LimitBanner } from '../components/LimitBanner';

export function MyDocumentPage() {
  const { user } = useAuth();
  const { saveDocument, checkLimit, saving } = useDocumentGeneration('my-template-slug');
  const [formData, setFormData] = useState({});

  const handleGenerate = async () => {
    // Проверяем лимиты перед генерацией
    if (!checkLimit()) return;

    // Генерируем документ (ваша логика)
    const docBlob = await generateDocumentFile(formData);
    
    // Сохраняем в backend
    const saved = await saveDocument(formData);
    
    if (saved) {
      // Скачиваем файл
      downloadBlob(docBlob, 'document.docx');
    }
  };

  return (
    <div>
      {/* Показываем баннер с лимитами */}
      <LimitBanner />
      
      {/* Ваша форма */}
      <form>
        {/* ... поля формы ... */}
        <button onClick={handleGenerate} disabled={saving}>
          {saving ? 'Сохранение...' : 'Создать документ'}
        </button>
      </form>
    </div>
  );
}
```

### 2. Защита роута (только для авторизованных)

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      {/* Защищённый контент */}
    </div>
  );
}
```

### 3. Условный рендеринг для авторизованных пользователей

```typescript
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, userProfile } = useAuth();

  return (
    <header>
      {user ? (
        <div>
          <span>Привет, {userProfile?.fullName}!</span>
          <Link to="/dashboard">Личный кабинет</Link>
        </div>
      ) : (
        <div>
          <Link to="/login">Войти</Link>
          <Link to="/signup">Регистрация</Link>
        </div>
      )}
    </header>
  );
}
```

### 4. Отображение информации о подписке

```typescript
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './ui/badge';

export function SubscriptionBadge() {
  const { userProfile } = useAuth();

  if (!userProfile) return null;

  const tierNames = {
    free: 'Бесплатный',
    standard: 'Стандарт',
    premium: 'Премиум',
  };

  const tierColors = {
    free: 'gray',
    standard: 'blue',
    premium: 'purple',
  };

  return (
    <Badge variant={tierColors[userProfile.subscriptionTier]}>
      {tierNames[userProfile.subscriptionTier]}
    </Badge>
  );
}
```

## Работа с API напрямую

### Создание пользователя

```typescript
import { apiCall } from '../utils/supabaseClient';

async function createUser(email: string, password: string, fullName: string) {
  try {
    const data = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    
    console.log('User created:', data);
    return data;
  } catch (error) {
    console.error('Signup failed:', error);
    throw error;
  }
}
```

### Получение списка документов

```typescript
import { apiCall } from '../utils/supabaseClient';

async function getMyDocuments() {
  try {
    const data = await apiCall('/api/my-documents');
    console.log('Documents:', data.documents);
    return data.documents;
  } catch (error) {
    console.error('Failed to fetch documents:', error);
    throw error;
  }
}
```

### Создание платежа

```typescript
import { apiCall } from '../utils/supabaseClient';

async function createPayment(tier: string, months: number) {
  try {
    const data = await apiCall('/api/create-payment', {
      method: 'POST',
      body: JSON.stringify({ tier, months }),
    });
    
    console.log('Payment created:', data);
    
    // В продакшене здесь будет редирект на YooKassa
    // window.location.href = data.confirmationUrl;
    
    return data;
  } catch (error) {
    console.error('Payment creation failed:', error);
    throw error;
  }
}
```

## Расширенные примеры

### Форма с автосохранением

```typescript
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function AutoSaveForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) return;

    // Автосохранение каждые 30 секунд
    const interval = setInterval(async () => {
      try {
        await saveFormDraft(formData);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, formData]);

  const saveFormDraft = async (data: any) => {
    // Сохраняем черновик в localStorage или на сервер
    localStorage.setItem(`draft_${user.id}`, JSON.stringify(data));
  };

  return (
    <div>
      <form>
        {/* ... */}
      </form>
      {lastSaved && (
        <p className="text-sm text-gray-500">
          Последнее сохранение: {lastSaved.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
```

### Проверка лимитов с предупреждением

```typescript
import { useAuth } from '../contexts/AuthContext';
import { Alert } from './ui/alert';

export function LimitWarning() {
  const { userProfile } = useAuth();

  if (!userProfile || userProfile.subscriptionTier !== 'free') {
    return null;
  }

  const remaining = Math.max(0, 3 - userProfile.documentsGeneratedThisMonth);

  if (remaining === 0) {
    return (
      <Alert variant="destructive">
        <h4>Лимит исчерпан</h4>
        <p>Оформите подписку для продолжения</p>
      </Alert>
    );
  }

  if (remaining === 1) {
    return (
      <Alert variant="warning">
        <h4>Последний бесплатный документ!</h4>
        <p>Оформите подписку, чтобы не терять доступ</p>
      </Alert>
    );
  }

  return null;
}
```

### Компонент истории документов

```typescript
import { useState, useEffect } from 'react';
import { apiCall } from '../utils/supabaseClient';

interface Document {
  id: string;
  templateSlug: string;
  documentData: any;
  createdAt: string;
}

export function DocumentHistory() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await apiCall('/api/my-documents');
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h2>История документов ({documents.length})</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            <span>{doc.templateSlug}</span>
            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
            <button onClick={() => downloadDocument(doc)}>
              Скачать
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Обработка ошибок

### Глобальный обработчик ошибок API

```typescript
import { apiCall } from '../utils/supabaseClient';
import { toast } from 'sonner';

async function safeApiCall(endpoint: string, options?: RequestInit) {
  try {
    return await apiCall(endpoint, options);
  } catch (error: any) {
    // Показываем пользовательское сообщение
    if (error.message.includes('Unauthorized')) {
      toast.error('Требуется авторизация');
      window.location.href = '/login';
    } else if (error.message.includes('limit reached')) {
      toast.error('Лимит документов исчерпан');
      window.location.href = '/pricing';
    } else {
      toast.error('Произошла ошибка. Попробуйте позже.');
    }
    
    throw error;
  }
}
```

### Повторная попытка при ошибке

```typescript
async function retryApiCall(
  endpoint: string,
  options?: RequestInit,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall(endpoint, options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Экспоненциальная задержка
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

## Оптимизация производительности

### Кэширование профиля пользователя

```typescript
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useCachedProfile() {
  const { userProfile, refreshUserProfile } = useAuth();
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  useEffect(() => {
    // Обновляем профиль каждые 5 минут
    const interval = setInterval(() => {
      refreshUserProfile();
      setLastRefresh(Date.now());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshUserProfile]);

  return { userProfile, lastRefresh };
}
```

### Debounce для поиска

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Использование:
function SearchDocuments() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedQuery) {
      searchDocuments(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}
```

## Тестирование

### Мокирование AuthContext для тестов

```typescript
import { render } from '@testing-library/react';
import { AuthContext } from '../contexts/AuthContext';

function renderWithAuth(component: React.ReactElement, authValue: any) {
  return render(
    <AuthContext.Provider value={authValue}>
      {component}
    </AuthContext.Provider>
  );
}

// Использование:
test('shows login button for unauthenticated users', () => {
  const { getByText } = renderWithAuth(<Header />, {
    user: null,
    userProfile: null,
    loading: false,
  });
  
  expect(getByText('Войти')).toBeInTheDocument();
});
```

## Best Practices

1. **Всегда проверяйте авторизацию** перед вызовом защищённых endpoints
2. **Обновляйте профиль** после действий, изменяющих лимиты
3. **Показывайте прогресс** при длительных операциях
4. **Обрабатывайте ошибки** с понятными сообщениями для пользователя
5. **Кэшируйте данные** где возможно для улучшения UX
6. **Валидируйте ввод** на клиенте перед отправкой на сервер
