🎯 Проект "Документатор" — Техническое задание на MVP
Ближайшая цель
За 2-3 недели сделать работающий прототип, который умеет:

Показывать каталог из 5-10 самых популярных документов.

Задавать пользователю простые вопросы (как в чате).

Генерировать готовый документ в форматах PDF и Word.

Давать скачать файл бесплатно (с лимитом 3 документа в месяц).

Принимать оплату за подписку.

📊 Структура базы данных (PostgreSQL)
На основе обсуждения на технических форумах, для хранения древовидной структуры документов и связей между ними лучше всего использовать реляционную БД с таблицами связей . Вот минимальная схема:

Таблица users
sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subscription_tier VARCHAR(50) DEFAULT 'free', -- free, standard, premium
    documents_generated_this_month INT DEFAULT 0,
    subscription_expires_at TIMESTAMP
);
Таблица document_templates (шаблоны документов)
sql
CREATE TABLE document_templates (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL, -- для URL: dogovor-arendy-kvartiry
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price_tier VARCHAR(50) DEFAULT 'standard', -- для разных тарифов
    template_path_docx VARCHAR(255), -- путь к файлу шаблона .docx
    template_fields JSONB, -- поля в формате JSON: [{"name": "client_name", "type": "text", "label": "ФИО клиента"}]
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);
Таблица generated_documents (история генераций)
sql
CREATE TABLE generated_documents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    template_id INTEGER REFERENCES document_templates(id),
    document_data JSONB, -- все данные, которые ввел пользователь
    file_path_pdf VARCHAR(255), -- путь к сгенерированному PDF
    file_path_docx VARCHAR(255), -- путь к сгенерированному DOCX
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
);
Таблица payments (платежи)
sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'RUB',
    payment_system VARCHAR(50), -- yookassa, tinkoff
    payment_status VARCHAR(50), -- pending, succeeded, failed
    subscription_tier VARCHAR(50),
    subscription_months INTEGER,
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP -- когда заканчивается подписка
);
⚙️ API Endpoints (бэкенд на FastAPI)
1. Публичные endpoints (без авторизации)
Метод	URL	Описание
GET	/	Главная страница
GET	/templates	Список всех шаблонов
GET	/templates/{slug}	Страница конкретного шаблона
POST	/api/generate-preview	Сгенерировать превью (без сохранения)
2. Защищенные endpoints (требуют авторизации)
Метод	URL	Описание
POST	/api/generate	Сгенерировать и сохранить документ
GET	/api/my-documents	История сгенерированных документов
POST	/api/create-payment	Создать платёж для подписки
POST	/api/webhook/payment	Вебхук от платёжной системы
🔧 Генерация документов (техническая реализация)
Вариант 1: python-docx-template (рекомендую для старта)
Это самая простая и бесплатная библиотека . Работает так:

Создаёшь шаблон .docx с переменными вида {{ client_name }}.

На бэкенде заполняешь шаблон данными из формы.

Сохраняешь результат.

Пример кода:

python
from docxtpl import DocxTemplate
import comtypes.client  # для конвертации в PDF

def generate_document(template_path, context, output_format='docx'):
    # Загружаем шаблон
    doc = DocxTemplate(template_path)
    
    # Заполняем данными
    doc.render(context)
    
    # Сохраняем DOCX
    docx_path = f"/tmp/output_{uuid4()}.docx"
    doc.save(docx_path)
    
    # Если нужен PDF - конвертируем
    if output_format == 'pdf':
        pdf_path = convert_to_pdf(docx_path)
        return pdf_path
    
    return docx_path

def convert_to_pdf(docx_path):
    # Конвертация через Word (только на Windows)
    word = comtypes.client.CreateObject('Word.Application')
    doc = word.Documents.Open(docx_path)
    pdf_path = docx_path.replace('.docx', '.pdf')
    doc.SaveAs(pdf_path, FileFormat=17)  # 17 = wdFormatPDF
    doc.Close()
    word.Quit()
    return pdf_path
Вариант 2: GroupDocs.Assembly (более мощный)
Если нужно больше возможностей (диаграммы, сложные таблицы), можно использовать платную библиотеку . Но для старта она избыточна.

Вариант 3: API-сервисы (Aspose, PandaDoc)
Есть готовые облачные решения , но они платные и зависят от внешних сервисов. Для домашнего сервера лучше локальная генерация.

💳 Интеграция с платежами (ЮKassa)
Простая схема работы:
Клиент выбирает тариф и нажимает "Оплатить".

Бэкенд создаёт платёж через API ЮKassa:

python
import uuid
import yookassa
from yookassa import Payment

yookassa.Configuration.account_id = 'shop_id'
yookassa.Configuration.secret_key = 'secret_key'

def create_payment(amount, user_id, tier):
    idempotence_key = str(uuid.uuid4())
    
    payment = Payment.create({
        "amount": {
            "value": amount,
            "currency": "RUB"
        },
        "confirmation": {
            "type": "redirect",
            "return_url": "https://your-site.com/payment-success"
        },
        "capture": True,
        "description": f"Подписка {tier}",
        "metadata": {
            "user_id": user_id,
            "tier": tier
        }
    }, idempotence_key)
    
    return payment
ЮKassa редиректит пользователя на страницу оплаты.

После оплаты приходит вебхук на /api/webhook/payment:

python
@app.post("/api/webhook/payment")
async def payment_webhook(request: Request):
    data = await request.json()
    
    if data['event'] == 'payment.succeeded':
        payment = data['object']
        user_id = payment['metadata']['user_id']
        tier = payment['metadata']['tier']
        
        # Активируем подписку
        update_user_subscription(user_id, tier, months=1)
        
    return {"status": "ok"}
🎨 Фронтенд (через Bolt.new / v0)
Главная страница
Заголовок: "Создайте юридически грамотный документ за 3 минуты"

Список популярных категорий: Аренда, Купля-продажа, Расписки, Для бизнеса

Поиск по документам

Блок с примерами

Страница документа (например /dogovor-arendy-kvartiry)
Шаг 1: Кто вы? (физлицо / компания)

Шаг 2: Данные сторон (ФИО, паспорт / ИНН, ОГРН)

Шаг 3: Условия сделки (сумма, срок, адрес)

Шаг 4: Предпросмотр документа и кнопка "Скачать"

Личный кабинет
История документов

Статус подписки

Кнопка "Продлить/купить подписку"

📈 SEO-оптимизация (чтобы тебя находили)
Мета-теги для каждой страницы
По рекомендациям Google, метаописание должно точно отражать содержание страницы и убеждать пользователя перейти по ссылке .

Для страницы договора аренды:

html
<title>Договор аренды квартиры — скачать бесплатно, заполнить онлайн</title>
<meta name="description" content="Скачать договор аренды квартиры 2025. Заполните простую форму и получите готовый документ за минуту. Все шаблоны актуальны по законодательству РФ.">
Структура URL
/dogovor-arendy-kvartiry — договор аренды

/raspiska-v-poluchenii-deneg — расписка

/dogovor-kupli-prodazhi-avto — купля-продажа авто

Блог-статьи (для привлечения трафика)
"Как правильно составить договор аренды квартиры, чтобы не потерять деньги"

"Расписка или договор займа: что выбрать?"

"5 ошибок при продаже автомобиля по договору купли-продажи"

"Нужен ли юрист при составлении брачного договора?"

📋 План работ на 2 недели
Неделя 1: База и шаблоны
День	Задачи
День 1	Настроить сервер: установить PostgreSQL, Coolify, подготовить окружение
День 2	Создать структуру БД, написать базовые модели
День 3	Подготовить 5 шаблонов договоров в .docx с переменными
День 4	Написать API для генерации документов (python-docx-template)
День 5	Добавить конвертацию в PDF
День 6	Сделать простую админку для загрузки шаблонов
День 7	Тестирование генерации, отладка ошибок
Неделя 2: Фронтенд и платежи
День	Задачи
День 8	Сгенерировать фронтенд на Bolt.new (главная + страницы документов)
День 9	Подключить фронтенд к API (fetch-запросы)
День 10	Добавить форму с вопросами для каждого шаблона
День 11	Интегрировать ЮKassa: создать тестовый платёж
День 12	Написать логику лимитов (3 документа бесплатно)
День 13	Добавить личный кабинет и историю документов
День 14	Финальное тестирование, исправление багов, запуск
🚀 Запуск и первые шаги
День запуска
Выложить сайт в открытый доступ.

Написать пост на vc.ru / Habr о том, как создавался сервис.

Разослать ссылку друзьям и знакомым, попросить протестировать и оставить отзыв.

Добавить счётчик Яндекс.Метрики и Google Analytics.

Первая неделя после запуска
Собрать обратную связь от первых пользователей.

Исправить критичные баги.

Добавить 2-3 новых шаблона по запросам.

Начать писать статьи в блог.

Первый месяц
Отслеживать поисковые запросы, по которым приходят люди.

Оптимизировать страницы под эти запросы.

Добавить форму сбора email для "раннего доступа" (если ещё не запустили платную подписку).

💰 Прогноз доходов (реалистичный)
Трафик
При хорошем SEO через 3-4 месяца можно выйти на 1000-2000 посетителей в день (30 000 - 60 000 в месяц). Это реально, учитывая объём запросов (сотни тысяч в месяц).

Конверсия
2-3% посетителей становятся платными пользователями .

При 30 000 посетителей → 600-900 платящих.

Доход
600 платящих × средний чек 300 руб = 180 000 руб/мес.

900 платящих × 300 руб = 270 000 руб/мес.

📦 Что делать, если что-то пойдёт не так
Проблема: Никто не приходит
Решение: Активно продвигаться в соцсетях, форумах, тематических пабликах. Добавить партнёрскую программу ("приведи друга — получи месяц бесплатно").

Проблема: Люди приходят, но не платят
Решение: Улучшить бесплатный тариф (больше лимитов), добавить более понятный призыв к действию, сделать A/B-тестирование цен.

Проблема: Технические сбои
Решение: Настроить мониторинг (UptimeRobot), сделать резервное копирование БД ежедневно, иметь план отката.

✅ Твои действия прямо сейчас
Зарегистрируй домен (например, prosto-doc.ru или dokumentator.ru).

Купи VPS или настрой домашний сервер с белым IP.

Установи Coolify для удобного деплоя.

Собери 5 самых популярных шаблонов (аренда, расписка, купля-продажа авто, договор займа, договор оказания услуг).

Начни кодить — с бэкенда на FastAPI, он самый понятный.