import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { ArrowLeft, FileText, Shield } from 'lucide-react';
import { SEO } from '../components/SEO';

export function Privacy() {
  return (
    <>
      <SEO
        title="Политика конфиденциальности — Документатор"
        description="Политика конфиденциальности и обработки персональных данных сервиса Документатор"
        keywords="политика конфиденциальности, персональные данные, ФЗ-152"
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
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Политика конфиденциальности</h1>
            </div>

            <p className="text-sm text-gray-500 mb-8">
              Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
            </p>

            <div className="prose prose-gray max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Общие положения</h2>
                <p className="text-gray-700 leading-relaxed">
                  Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сервиса «Документатор» (далее — «Сервис»). Политика разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Используя Сервис, вы соглашаетесь с условиями настоящей Политики конфиденциальности и даете согласие на обработку ваших персональных данных.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Собираемые данные</h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  В процессе использования Сервиса мы можем собирать следующие категории персональных данных:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>ФИО (имя и фамилия)</li>
                  <li>Адрес электронной почты</li>
                  <li>Данные, указанные в генерируемых документах (ФИО сторон, паспортные данные, адреса, ИНН, ОГРН, КПП и другие реквизиты)</li>
                  <li>Информация о платежах (для платных тарифов)</li>
                  <li>Техническая информация: IP-адрес, тип браузера, операционная система, время посещения</li>
                  <li>Cookie-файлы для улучшения работы Сервиса</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Цели обработки данных</h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Мы используем собранные данные для следующих целей:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Регистрация и идентификация пользователей</li>
                  <li>Предоставление доступа к функционалу Сервиса</li>
                  <li>Генерация юридических документов</li>
                  <li>Управление подписками и обработка платежей</li>
                  <li>Обеспечение безопасности и предотвращение мошенничества</li>
                  <li>Техническая поддержка пользователей</li>
                  <li>Улучшение качества Сервиса и разработка новых функций</li>
                  <li>Отправка уведомлений, связанных с работой Сервиса</li>
                  <li>Соблюдение законодательства РФ</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Правовые основания обработки</h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Обработка персональных данных осуществляется на основании:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Согласия субъекта персональных данных (ст. 6 и 9 ФЗ-152)</li>
                  <li>Договорных отношений между пользователем и оператором (ст. 6 ФЗ-152)</li>
                  <li>Необходимости исполнения обязательств перед пользователем</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Передача данных третьим лицам</h2>
                <p className="text-gray-700 leading-relaxed">
                  Мы не передаем ваши персональные данные третьим лицам, за исключением следующих случаев:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>С вашего явного согласия</li>
                  <li>Платежным системам для обработки платежей (при использовании платных тарифов)</li>
                  <li>По требованию государственных органов в случаях, предусмотренных законодательством РФ</li>
                  <li>Провайдерам облачных услуг (Supabase) для хранения данных</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Хранение и защита данных</h2>
                <p className="text-gray-700 leading-relaxed">
                  Мы применяем технические и организационные меры для защиты персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Шифрование данных при передаче (SSL/TLS)</li>
                  <li>Шифрование паролей в базе данных</li>
                  <li>Регулярное резервное копирование</li>
                  <li>Ограничение доступа к персональным данным</li>
                  <li>Мониторинг и аудит безопасности</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Персональные данные хранятся в течение срока, необходимого для достижения целей обработки, но не менее 3 лет с момента последнего обращения пользователя, если иное не предусмотрено законодательством.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Ваши права</h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  В соответствии с ФЗ-152 вы имеете следующие права:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Право на доступ к вашим персональным данным</li>
                  <li>Право на исправление неточных данных</li>
                  <li>Право на удаление данных («право на забвение»)</li>
                  <li>Право на ограничение обработки</li>
                  <li>Право на возражение против обработки</li>
                  <li>Право на отзыв согласия на обработку</li>
                  <li>Право на подачу жалобы в Роскомнадзор</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Для реализации своих прав вы можете связаться с нами по адресу электронной почты, указанному в разделе «Контакты».
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Cookie-файлы</h2>
                <p className="text-gray-700 leading-relaxed">
                  Сервис использует cookie-файлы для обеспечения функциональности, аналитики и улучшения пользовательского опыта. Вы можете настроить использование cookie в настройках вашего браузера, однако это может ограничить функциональность Сервиса.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Изменение Политики</h2>
                <p className="text-gray-700 leading-relaxed">
                  Мы оставляем за собой право изменять настоящую Политику конфиденциальности. Актуальная версия всегда доступна на данной странице. Существенные изменения будут доведены до вашего сведения через Сервис или по электронной почте.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Контакты</h2>
                <p className="text-gray-700 leading-relaxed">
                  По вопросам обработки персональных данных вы можете обратиться к оператору:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <p className="text-gray-700"><strong>Email:</strong> support@dokumentator.ru</p>
                  <p className="text-gray-700 mt-1"><strong>Форма обратной связи:</strong> доступна в личном кабинете</p>
                </div>
              </section>

              <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                <p className="text-sm text-gray-700">
                  <strong>Важно:</strong> Используя Сервис «Документатор», вы подтверждаете, что ознакомились с настоящей Политикой конфиденциальности и согласны с условиями обработки персональных данных.
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
