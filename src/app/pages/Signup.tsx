import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ValidatedInput } from '../components/ui/validated-input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Checkbox } from '../components/ui/checkbox';
import { FileText, Lock, Mail, User, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { validateFullName } from '../utils/validation';
import { SEO } from '../components/SEO';

export function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError('Необходимо согласие на обработку персональных данных');
      toast.error('Необходимо согласие на обработку персональных данных');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, fullName);
      toast.success('Регистрация успешна! Добро пожаловать!');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации. Попробуйте снова.');
      toast.error('Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Регистрация — Документатор"
        description="Зарегистрируйтесь для создания юридических документов онлайн"
        keywords="регистрация, создать аккаунт, документы онлайн"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                На главную
              </Button>
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              <FileText className="w-8 h-8" />
              Документатор
            </Link>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Создать аккаунт</CardTitle>
              <CardDescription>
                Зарегистрируйтесь, чтобы получить 3 бесплатных документа
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <ValidatedInput
                    label="Полное имя"
                    id="fullName"
                    type="text"
                    placeholder="Иван Иванов"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    validate={validateFullName}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">Минимум 6 символов</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                      Я согласен с{' '}
                      <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium underline" target="_blank">
                        политикой конфиденциальности
                      </Link>{' '}и{' '}
                      <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium underline" target="_blank">
                        пользовательским соглашением
                      </Link>, а также даю согласие на обработку персональных данных
                    </Label>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>

                <div className="text-sm text-center text-gray-600">
                  Уже есть аккаунт?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Войти
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}