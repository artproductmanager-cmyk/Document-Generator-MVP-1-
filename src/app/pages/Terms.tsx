import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { ArrowLeft, FileText, Scale } from 'lucide-react';
import { SEO } from '../components/SEO';

export function Terms() {
  return (
    <>
      <SEO
        title="Пользовательское соглашение — Документатор"
        description="Пользовательское соглашение и правила использования сервиса Документатор"
        keywords="пользовательское соглашение, условия использования, правила"
      />
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                На главную
              </Button>
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              <FileText className="w-6 h-6" />
              Документатор
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Пользовательское соглашение</h1>
            </div>

            <p className="text-sm text-gray-500 mb-8">
              Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
            </p>

            <div className="prose prose-gray max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Общие положения</h2>
                <p className="text-gray-700 leading-relaxed">
                  Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между владельцем сервиса «Документатор» (далее — «Сервис», «Оператор») и пользователем Сервиса (далее — «Пользователь»).
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Регистрируясь и используя Сервис, Пользователь подтверждает свое согласие с условиями настоящего Соглашения. Если вы не согласны с какими-либо условиями, пожалуйста, не используйте Сервис.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Предмет Соглашения</h2>
                <p className="text-gray-700 leading-relaxed">
                  Сервис «Документатор» предоставляет Пользователям онлайн-платформу для автоматизированного создания юридических документов на основе заполненных форм. Сервис включает:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Интерактивные формы для заполнения данных</li>
                  <li>Автоматическую генерацию документов в формате Word (.docx)</li>
                  <li>Хранение истории созданных документов (для зарегистрированных пользователей)</li>
                  <li>Управление подписками и тарифами</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Регистрация и учетная запись</h2>
                <p className="text-gray-700 leading-relaxed">
                  3.1. Для доступа к полному функционалу Сервиса Пользователь должен пройти регистрацию, предоставив актуальную и достоверную информацию.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  3.2. Пользователь обязуется сохранять конфиденциальность своих учетных данных и несет полную ответственность за все действия, совершенные под его учетной записью.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  3.3. Пользователь обязан немедленно уведомить Оператора о любом несанкционированном использовании своей учетной записи.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Тарифы и оплата</h2>
                <p className="text-gray-700 leading-relaxed">
                  4.1. <strong>Бесплатный тариф (Free):</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Доступно создание до 3 документов</li>
                  <li>Базовый функционал Сервиса</li>
                  <li>Хранение документов в течение 30 дней</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  4.2. <strong>Платные тарифы:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Безлимитное создание документов</li>
                  <li>Бессрочное хранение документов</li>
                  <li>Приоритетная поддержка</li>
                  <li>Дополнительные шаблоны документов</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  4.3. Оплата осуществляется через интегрированные платежные системы. Все платежи обрабатываются безопасно в соответствии с PCI DSS.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  4.4. Возврат средств возможен в течение 14 дней с момента оплаты при условии отсутствия использования платных функций.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Права и обязанности Пользователя</h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  5.1. Пользователь имеет право:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Использовать Сервис в личных или коммерческих целях</li>
                  <li>Создавать и скачивать юридические документы</li>
                  <li>Получать техническую поддержку</li>
                  <li>Удалить свою учетную запись в любое время</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4 mb-2">
                  5.2. Пользователь обязуется:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Предоставлять достоверную информацию при заполнении документов</li>
                  <li>Не использовать Сервис в незаконных целях</li>
                  <li>Не пытаться нарушить работу Сервиса или получить несанкционированный доступ</li>
                  <li>Не распространять вредоносное программное обеспечение</li>
                  <li>Соблюдать законодательство РФ</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Права и обязанности Оператора</h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  6.1. Оператор обязуется:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Обеспечивать работоспособность Сервиса</li>
                  <li>Защищать персональные данные Пользователей</li>
                  <li>Предоставлять техническую поддержку</li>
                  <li>Уведомлять о значительных изменениях в работе Сервиса</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4 mb-2">
                  6.2. Оператор имеет право:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Изменять функционал Сервиса</li>
                  <li>Приостанавливать или прекращать работу Сервиса для проведения технических работ</li>
                  <li>Блокировать учетные записи при нарушении условий Соглашения</li>
                  <li>Изменять тарифы с предварительным уведомлением Пользователей (не менее чем за 30 дней)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Интеллектуальная собственность</h2>
                <p className="text-gray-700 leading-relaxed">
                  7.1. Все права на Сервис, включая дизайн, программный код, шаблоны документов и товарные знаки, принадлежат Оператору.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  7.2. Созданные Пользователем документы являются его интеллектуальной собственностью. Оператор не имеет права использовать содержимое документов без согласия Пользователя.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Ответственность и ограничения</h2>
                <p className="text-gray-700 leading-relaxed">
                  8.1. Сервис предоставляется «как есть». Оператор не гарантирует, что Сервис будет работать без сбоев и ошибок.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  8.2. <strong>Важное предупреждение:</strong> Сервис предназначен для помощи в создании документов, но не заменяет профессиональную юридическую консультацию. Рекомендуется проверять созданные документы у квалифицированного юриста перед подписанием.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  8.3. Оператор не несет ответственности за:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Убытки, возникшие в результате использования созданных документов</li>
                  <li>Некорректные данные, предоставленные Пользователем</li>
                  <li>Временные сбои в работе Сервиса</li>
                  <li>Действия третьих лиц</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  8.4. Максимальная ответственность Оператора ограничена суммой, уплаченной Пользователем за текущий период подписки.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Конфиденциальность</h2>
                <p className="text-gray-700 leading-relaxed">
                  Обработка персональных данных Пользователей осуществляется в соответствии с <Link to="/privacy" className="text-blue-600 hover:text-blue-700 underline">Политикой конфиденциальности</Link>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Изменение Соглашения</h2>
                <p className="text-gray-700 leading-relaxed">
                  10.1. Оператор вправе вносить изменения в настоящее Соглашение в одностороннем порядке.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  10.2. Актуальная версия Соглашения всегда доступна на данной странице.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  10.3. Продолжение использования Сервиса после внесения изменений означает согласие Пользователя с новой версией Соглашения.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Разрешение споров</h2>
                <p className="text-gray-700 leading-relaxed">
                  11.1. Все споры, возникающие в связи с использованием Сервиса, решаются путем переговоров.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  11.2. При невозможности достижения согласия споры разрешаются в судебном порядке в соответствии с законодательством Российской Федерации.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Контакты</h2>
                <p className="text-gray-700 leading-relaxed">
                  По всем вопросам, связанным с настоящим Соглашением, вы можете обратиться:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <p className="text-gray-700"><strong>Email:</strong> support@dokumentator.ru</p>
                  <p className="text-gray-700 mt-1"><strong>Форма обратной связи:</strong> доступна в личном кабинете</p>
                </div>
              </section>

              <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                <p className="text-sm text-gray-700">
                  <strong>Важно:</strong> Регистрируясь в Сервисе «Документатор», вы подтверждаете, что прочитали, поняли и согласны с условиями настоящего Пользовательского соглашения и <Link to="/privacy" className="text-blue-600 hover:text-blue-700 underline">Политики конфиденциальности</Link>.
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
