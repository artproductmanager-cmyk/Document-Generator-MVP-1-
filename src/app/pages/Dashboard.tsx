import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { apiCall } from '../utils/supabaseClient';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { FileText, CreditCard, LogOut, Download, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { SEO } from '../components/SEO';

interface Document {
  id: string;
  templateSlug: string;
  documentData: any;
  createdAt: string;
}

const documentTitles: Record<string, string> = {
  'dogovor-arendy-kvartiry': 'Договор аренды квартиры',
  'raspiska-v-poluchenii-deneg': 'Расписка в получении денег',
  'dogovor-kupli-prodazhi-avto': 'Договор купли-продажи автомобиля',
  'dogovor-zajma': 'Договор займа',
};

const tierNames: Record<string, string> = {
  free: 'Бесплатный',
  standard: 'Стандарт',
  premium: 'Премиум',
};

const tierColors: Record<string, string> = {
  free: 'bg-gray-500',
  standard: 'bg-blue-500',
  premium: 'bg-purple-500',
};

export function Dashboard() {
  const navigate = useNavigate();
  const { user, userProfile, signOut, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      const data = await apiCall('/api/my-documents');
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Failed to load documents:', error);
      toast.error('Не удалось загрузить документы');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Вы вышли из системы');
      navigate('/');
    } catch (error) {
      toast.error('Ошибка выхода');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || !user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  const remainingDocs = userProfile.subscriptionTier === 'free' 
    ? Math.max(0, 3 - userProfile.documentsGeneratedThisMonth)
    : null;

  return (
    <>
      <SEO
        title="Личный кабинет — Документатор"
        description="Управляйте вашими документами и подписками"
        keywords="личный кабинет, мои документы, история"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                На главную
              </Link>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Личный кабинет
            </h1>
            <p className="text-gray-600">
              Добро пожаловать, {userProfile.fullName}!
            </p>
          </div>

          {/* Profile Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Тарифный план
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Текущий тариф:</span>
                  <Badge className={tierColors[userProfile.subscriptionTier]}>
                    {tierNames[userProfile.subscriptionTier]}
                  </Badge>
                </div>

                {userProfile.subscriptionTier === 'free' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Осталось документов:</span>
                      <span className="font-semibold">{remainingDocs} из 3</span>
                    </div>
                    <Button className="w-full" onClick={() => navigate('/pricing')}>
                      Улучшить тариф
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Документов в месяц:</span>
                      <span className="font-semibold">Безлимит</span>
                    </div>
                    {userProfile.subscriptionExpiresAt && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Действует до {new Date(userProfile.subscriptionExpiresAt).toLocaleDateString('ru-RU')}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Статистика
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Создано документов:</span>
                  <span className="font-semibold text-2xl">{documents.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">В этом месяце:</span>
                  <span className="font-semibold">{userProfile.documentsGeneratedThisMonth}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents List */}
          <Card>
            <CardHeader>
              <CardTitle>История документов</CardTitle>
              <CardDescription>
                Все ваши созданные документы доступны для повторного скачивания
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Загрузка документов...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">У вас пока нет созданных документов</p>
                  <Button onClick={() => navigate('/')}>
                    Создать первый документ
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc, index) => (
                    <div key={doc.id}>
                      {index > 0 && <Separator />}
                      <div className="flex items-center justify-between py-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {documentTitles[doc.templateSlug] || doc.templateSlug}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Создан {formatDate(doc.createdAt)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigate(`/${doc.templateSlug}`, {
                              state: { documentData: doc.documentData },
                            });
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Скачать
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
