import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { apiCall } from '../utils/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Check, FileText, ArrowLeft, Sparkles, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { SEO } from '../components/SEO';

const plans = [
  {
    tier: 'free',
    name: 'Бесплатный',
    price: 0,
    description: 'Для первого знакомства',
    features: [
      '3 документа в месяц',
      'Все типы документов',
      'Экспорт в Word',
      'Базовая поддержка',
    ],
    buttonText: 'Текущий план',
    disabled: true,
  },
  {
    tier: 'standard',
    name: 'Стандарт',
    price: 299,
    description: 'Для регулярного использования',
    features: [
      'Безлимитные документы',
      'Все типы документов',
      'Экспорт в Word и PDF',
      'Приоритетная поддержка',
      'История документов',
      'Без рекламы',
    ],
    buttonText: 'Выбрать план',
    popular: true,
  },
  {
    tier: 'premium',
    name: 'Премиум',
    price: 599,
    description: 'Для профессионалов',
    features: [
      'Все из тарифа Стандарт',
      'Электронная подпись',
      'Юридическая консультация',
      'API доступ',
      'Кастомные шаблоны',
      'Персональный менеджер',
    ],
    buttonText: 'Выбрать план',
  },
];

export function Pricing() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (tier: string, price: number) => {
    if (!user) {
      toast.error('Войдите в систему для оформления подписки');
      navigate('/login');
      return;
    }

    if (tier === 'free') {
      return;
    }

    setLoading(tier);

    try {
      const data = await apiCall('/api/create-payment', {
        method: 'POST',
        body: JSON.stringify({
          tier,
          months: 1,
        }),
      });

      toast.success('Платеж создан!');
      toast.info(data.message || 'Интеграция с YooKassa требуется для продакшена');
      
      // In production, redirect to YooKassa payment page
      // window.location.href = data.confirmationUrl;
    } catch (error: any) {
      console.error('Payment creation error:', error);
      toast.error(error.message || 'Ошибка создания платежа');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <SEO
        title="Тарифы и цены — Документатор"
        description="Выберите подходящий тариф для создания юридических документов онлайн"
        keywords="тарифы, цены, подписка, документы онлайн"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Выберите ваш тариф
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Создавайте юридические документы онлайн с гарантией качества
            </p>
            
            {/* Временное уведомление */}
            <div className="mt-6 max-w-2xl mx-auto">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <p className="text-sm text-blue-800">
                    🚀 <strong>Мягкий запуск!</strong> Платные подписки временно недоступны. 
                    Вы можете создавать <strong>3 документа бесплатно каждый месяц</strong>. 
                    О запуске платных тарифов сообщим дополнительно!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => {
              const isCurrentPlan = userProfile?.subscriptionTier === plan.tier;
              
              return (
                <Card 
                  key={plan.tier}
                  className={`relative ${plan.popular ? 'border-blue-500 border-2 shadow-lg' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-blue-500 gap-1">
                        <Sparkles className="w-3 h-3" />
                        Популярный
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price} ₽</span>
                      {plan.price > 0 && <span className="text-gray-600">/месяц</span>}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    {plan.tier === 'free' ? (
                      <Button
                        className="w-full"
                        variant="outline"
                        disabled
                      >
                        Текущий план
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant={plan.popular ? 'default' : 'outline'}
                        disabled
                      >
                        Скоро будет доступно
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Часто задаваемые вопросы
            </h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Как работает бесплатный период?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    После регистрации вы можете создать до 3 документов бесплатно. 
                    Лимит обновляется каждый месяц.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Можно ли отменить подписку?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Да, вы можете отменить подписку в любой момент. Доступ сохранится 
                    до конца оплаченного периода.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Юридическая сила документов?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Все шаблоны соответствуют действующему законодательству РФ и имеют 
                    полную юридическую силу при правильном заполнении.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}