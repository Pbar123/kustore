// Конфигурация API для служб доставки
// Замените YOUR_TOKEN на реальные токены

export const DELIVERY_API_CONFIG = {
  boxberry: {
    baseUrl: 'https://api.boxberry.ru/json.php',
    token: process.env.VITE_BOXBERRY_TOKEN || 'YOUR_BOXBERRY_TOKEN',
    endpoints: {
      listPoints: (cityCode: string) => `?token=${DELIVERY_API_CONFIG.boxberry.token}&method=ListPoints&CityCode=${cityCode}`,
      pointInfo: (pointCode: string) => `?token=${DELIVERY_API_CONFIG.boxberry.token}&method=PointsDescription&code=${pointCode}`
    }
  },
  
  cdek: {
    baseUrl: 'https://api.cdek.ru/v2',
    clientId: process.env.VITE_CDEK_CLIENT_ID || 'YOUR_CDEK_CLIENT_ID',
    clientSecret: process.env.VITE_CDEK_CLIENT_SECRET || 'YOUR_CDEK_CLIENT_SECRET',
    endpoints: {
      auth: '/oauth/token',
      deliveryPoints: '/deliverypoints',
      calculate: '/calculator/tariff'
    }
  },
  
  russianPost: {
    baseUrl: 'https://otpravka-api.pochta.ru/1.0',
    token: process.env.VITE_RUSSIAN_POST_TOKEN || 'YOUR_RUSSIAN_POST_TOKEN',
    login: process.env.VITE_RUSSIAN_POST_LOGIN || 'YOUR_LOGIN',
    password: process.env.VITE_RUSSIAN_POST_PASSWORD || 'YOUR_PASSWORD',
    endpoints: {
      offices: '/offices',
      tariff: '/tariff'
    }
  },
  
  yandexMarket: {
    baseUrl: 'https://api.partner.market.yandex.ru/v2',
    token: process.env.VITE_YANDEX_MARKET_TOKEN || 'YOUR_YANDEX_MARKET_TOKEN',
    campaignId: process.env.VITE_YANDEX_CAMPAIGN_ID || 'YOUR_CAMPAIGN_ID',
    endpoints: {
      outlets: (campaignId: string) => `/campaigns/${campaignId}/outlets`,
      regions: '/regions'
    }
  }
};

// Инструкции по получению API ключей:
export const API_SETUP_INSTRUCTIONS = {
  boxberry: {
    name: 'Boxberry',
    url: 'https://boxberry.ru/integration/',
    steps: [
      '1. Зарегистрируйтесь на сайте Boxberry',
      '2. Подайте заявку на подключение API',
      '3. Получите токен для доступа к API',
      '4. Добавьте токен в переменную VITE_BOXBERRY_TOKEN'
    ]
  },
  
  cdek: {
    name: 'СДЭК',
    url: 'https://www.cdek.ru/clients/integrator.html',
    steps: [
      '1. Зарегистрируйтесь в личном кабинете СДЭК',
      '2. Подключите интеграцию через API',
      '3. Получите Client ID и Client Secret',
      '4. Добавьте их в переменные VITE_CDEK_CLIENT_ID и VITE_CDEK_CLIENT_SECRET'
    ]
  },
  
  russianPost: {
    name: 'Почта России',
    url: 'https://otpravka.pochta.ru/',
    steps: [
      '1. Зарегистрируйтесь в сервисе "Отправка"',
      '2. Получите доступ к API',
      '3. Создайте токен доступа',
      '4. Добавьте данные в переменные VITE_RUSSIAN_POST_*'
    ]
  },
  
  yandexMarket: {
    name: 'Яндекс.Маркет',
    url: 'https://partner.market.yandex.ru/',
    steps: [
      '1. Зарегистрируйтесь в Партнерском интерфейсе',
      '2. Создайте приложение для API',
      '3. Получите OAuth токен',
      '4. Добавьте токен в переменную VITE_YANDEX_MARKET_TOKEN'
    ]
  }
};