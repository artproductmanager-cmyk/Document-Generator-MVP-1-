import { Link } from 'react-router';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Sparkles } from 'lucide-react';

export function LimitBanner() {
  const { user, userProfile } = useAuth();

  if (!user || !userProfile) {
    return (
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-blue-900">
            Войдите для получения 3 бесплатных документов в месяц
          </span>
          <Link to="/login">
            <Button size="sm" variant="outline">
              Войти
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  if (userProfile.subscriptionTier === 'free') {
    const remaining = Math.max(0, 3 - userProfile.documentsGeneratedThisMonth);
    
    if (remaining === 0) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Вы исчерпали лимит бесплатных документов (3 в месяц)
            </span>
            <Link to="/pricing">
              <Button size="sm" variant="outline">
                Улучшить тариф
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-amber-900">
            Осталось бесплатных документов: <strong>{remaining} из 3</strong>
          </span>
          <Link to="/pricing">
            <Button size="sm" variant="ghost" className="text-amber-900">
              <Sparkles className="w-4 h-4 mr-1" />
              Безлимит
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-green-50 border-green-200">
      <Sparkles className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-900">
        Вы на тарифе <strong>{userProfile.subscriptionTier === 'premium' ? 'Премиум' : 'Стандарт'}</strong> — создавайте документы без ограничений!
      </AlertDescription>
    </Alert>
  );
}
