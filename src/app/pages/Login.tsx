import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { FileText, Lock, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { SEO } from '../components/SEO';

export function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Вы успешно вошли в систему');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа. Проверьте email и пароль.');
      toast.error('Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Вход в личный кабинет — Документатор"
        description="Войдите в личный кабинет для управления документами и подписками"
        keywords="вход, личный кабинет, авторизация"
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
              <CardTitle>Вход в систему</CardTitle>
              <CardDescription>
                Введите email и пароль для доступа к личному кабинету
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
                      placeholder="•��••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Вход...' : 'Войти'}
                </Button>

                <div className="text-sm text-center text-gray-600">
                  Нет аккаунта?{' '}
                  <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                    Зарегистрироваться
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