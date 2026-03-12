# 🚀 Быстрый старт — Документатор

Инструкция для запуска проекта за 5 минут.

## Шаг 1: Клонирование и установка

```bash
# Клонируйте репозиторий (замените на ваш URL)
git clone https://github.com/your-username/dokumentator.git
cd dokumentator

# Установите зависимости
npm install
# или
pnpm install
# или
yarn install
```

## Шаг 2: Запуск локально

```bash
# Запустите dev сервер
npm run dev

# Откройте в браузере
# http://localhost:5173
```

## Шаг 3: Тестирование

1. Откройте главную страницу
2. Выберите любой документ (например, "Договор аренды квартиры")
3. Заполните все шаги мастера
4. Скачайте готовый Word документ
5. Проверьте содержимое документа

## Шаг 4: Сборка для продакшена

```bash
# Соберите проект
npm run build

# Все файлы будут в папке dist/
```

## Шаг 5: Деплой

### Быстрый вариант — Vercel (бесплатно)

1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Подключите GitHub репозиторий
3. Vercel автоматически определит настройки и задеплоит проект
4. Готово! Ваш сайт доступен по адресу типа `https://dokumentator.vercel.app`

### Свой домен на Vercel

1. В настройках проекта на Vercel перейдите в Domains
2. Добавьте ваш домен (например, dokumentator.ru)
3. Настройте DNS записи у вашего регистратора (reg.ru):
   ```
   Type: A
   Host: @
   Value: 76.76.21.21
   
   Type: CNAME
   Host: www
   Value: cname.vercel-dns.com
   ```

### Классический вариант — свой VPS

```bash
# Подключитесь к серверу
ssh user@your-server-ip

# Установите nginx (если еще не установлен)
sudo apt update
sudo apt install nginx -y

# Скопируйте файлы из папки dist на сервер
# Локально выполните:
scp -r dist/* user@your-server-ip:/var/www/dokumentator/

# На сервере настройте nginx
sudo nano /etc/nginx/sites-available/dokumentator
# Скопируйте содержимое из nginx.conf.example

# Создайте симлинк
sudo ln -s /etc/nginx/sites-available/dokumentator /etc/nginx/sites-enabled/

# Проверьте конфигурацию
sudo nginx -t

# Перезапустите nginx
sudo systemctl restart nginx

# Установите SSL сертификат
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d dokumentator.ru -d www.dokumentator.ru
```

## Шаг 6: SEO настройка

### Google Search Console

1. Перейдите на [search.google.com/search-console](https://search.google.com/search-console)
2. Добавьте ваш сайт
3. Подтвердите владение (через DNS или файл)
4. Отправьте sitemap.xml: `https://dokumentator.ru/sitemap.xml`

### Яндекс Вебмастер

1. Перейдите на [webmaster.yandex.ru](https://webmaster.yandex.ru)
2. Добавьте сайт
3. Подтвердите владение
4. Отправьте sitemap.xml

### robots.txt проверка

Проверьте, что robots.txt доступен:
```
https://dokumentator.ru/robots.txt
```

## Шаг 7: Аналитика

### Яндекс.Метрика

1. Создайте счетчик на [metrika.yandex.ru](https://metrika.yandex.ru)
2. Получите код счетчика
3. Добавьте в `index.html` внутрь `<head>`

### Google Analytics

1. Создайте свойство на [analytics.google.com](https://analytics.google.com)
2. Получите ID (например, G-XXXXXXXXXX)
3. Добавьте код в `index.html`

## Шаг 8: Мониторинг и обновления

```bash
# Проверяйте логи nginx
sudo tail -f /var/log/nginx/dokumentator_access.log
sudo tail -f /var/log/nginx/dokumentator_error.log

# Обновление проекта
git pull origin main
npm run build
scp -r dist/* user@your-server-ip:/var/www/dokumentator/
```

## 🎯 Чек-лист запуска

- [ ] Проект запущен локально
- [ ] Все документы работают и скачиваются
- [ ] Проект собран (`npm run build`)
- [ ] Сайт задеплоен на хостинг
- [ ] Домен подключен и работает
- [ ] SSL сертификат установлен (HTTPS)
- [ ] robots.txt доступен
- [ ] sitemap.xml доступен
- [ ] Google Search Console настроен
- [ ] Яндекс Вебмастер настроен
- [ ] Аналитика (Метрика/GA) подключена
- [ ] Проверена работа на мобильных устройствах

## 📊 Ожидаемые результаты

### Через 1 неделю:
- Сайт проиндексирован Google и Яндекс
- Первые 10-50 посетителей из поиска

### Через 1 месяц:
- 100-500 посетителей из поиска
- Первые конверсии (скачивания документов)

### Через 3 месяца:
- 1000-3000 посетителей
- Появление в топ-10 по некоторым запросам
- Регулярные пользователи

### Через 6 месяцев:
- 5000-10000 посетителей
- Топ-5 по основным запросам
- Возможность монетизации

## 💡 Советы по продвижению

1. **Контент:** Создайте блог с полезными статьями
2. **Соцсети:** Делитесь в VK, Telegram, Instagram
3. **Форумы:** Отвечайте на вопросы на форумах с ссылкой на сервис
4. **YouTube:** Сделайте видео-инструкции
5. **Партнерства:** Договоритесь с юридическими блогами
6. **Отзывы:** Просите пользователей оставлять отзывы

## 🆘 Помощь

Если что-то не работает:

1. Проверьте логи браузера (F12 → Console)
2. Проверьте логи сервера (nginx error log)
3. Убедитесь, что все файлы скопированы правильно
4. Проверьте права доступа к файлам: `sudo chmod -R 755 /var/www/dokumentator`

## 🎉 Готово!

Ваш сервис "Документатор" запущен и готов к работе!

Теперь можно:
- Добавлять новые документы
- Настраивать монетизацию
- Масштабировать сервис

Успехов! 🚀
