# KUSTORE - Minimalistic Clothing Store

Современный интернет-магазин минималистичной одежды с Telegram Web App интеграцией.

## 🚀 Функции

- 📱 Telegram Web App интеграция
- 🛍️ Каталог товаров с фильтрацией
- ❤️ Избранные товары
- 🛒 Корзина покупок
- 📦 Система заказов
- 🎫 Промокоды и скидки
- 🚚 Интеграция с службами доставки
- 👤 Личный кабинет пользователя

## 🛠 Технологии

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Routing**: React Router
- **State Management**: React Context
- **Icons**: Lucide React

## 📦 Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd kustore
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте переменные окружения:
```bash
cp .env.example .env
```

4. Заполните `.env` файл своими данными:
- Supabase URL и ключи
- API токены служб доставки

5. Запустите проект:
```bash
npm run dev
```

## 🚚 Настройка служб доставки

### Boxberry
1. Зарегистрируйтесь на [boxberry.ru](https://boxberry.ru/integration/)
2. Получите API токен
3. Добавьте в `VITE_BOXBERRY_TOKEN`

### СДЭК
1. Зарегистрируйтесь в [личном кабинете СДЭК](https://www.cdek.ru/clients/integrator.html)
2. Получите Client ID и Client Secret
3. Добавьте в `VITE_CDEK_CLIENT_ID` и `VITE_CDEK_CLIENT_SECRET`

### Почта России
1. Зарегистрируйтесь в [сервисе "Отправка"](https://otpravka.pochta.ru/)
2. Получите API токен
3. Добавьте в `VITE_RUSSIAN_POST_TOKEN`

### Яндекс.Маркет
1. Зарегистрируйтесь в [Партнерском интерфейсе](https://partner.market.yandex.ru/)
2. Получите OAuth токен
3. Добавьте в `VITE_YANDEX_MARKET_TOKEN`

## 🗄️ База данных

Проект использует Supabase с следующими таблицами:
- `products` - товары
- `users` - пользователи
- `orders` - заказы
- `user_favorites` - избранное
- `promo_codes` - промокоды

## 🤖 Telegram Bot

Административный бот для управления товарами находится в папке `telegram-bot/`.

Установка и запуск:
```bash
cd telegram-bot
npm install
npm start
```

## 📱 Структура проекта

```
src/
├── components/     # React компоненты
├── pages/         # Страницы приложения
├── hooks/         # Custom hooks
├── context/       # React Context
├── types/         # TypeScript типы
├── lib/           # Утилиты и конфигурация
└── utils/         # Вспомогательные функции
```

## 🎨 Дизайн

Проект использует минималистичный дизайн с:
- Мобильная навигация (3 основные вкладки)
- Плавающая корзина
- Адаптивная сетка товаров (3 колонки)
- Интерактивные карты пунктов выдачи

## 📄 Лицензия

MIT License