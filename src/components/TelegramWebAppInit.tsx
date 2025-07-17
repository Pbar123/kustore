import { useEffect } from 'react';

export function TelegramWebAppInit() {
  useEffect(() => {
    // Добавляем скрипт Telegram Web App, если его еще нет
    if (!document.getElementById('telegram-web-app-script')) {
      const script = document.createElement('script');
      script.id = 'telegram-web-app-script';
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Telegram Web App script loaded');
        
        // Инициализируем Telegram Web App
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready();
          
          // Настраиваем тему приложения
          tg.headerColor = '#ffffff';
          tg.backgroundColor = '#ffffff';
          
          console.log('Telegram Web App initialized:', {
            version: tg.version,
            platform: tg.platform,
            user: tg.initDataUnsafe.user,
          });
        }
      };
      
      script.onerror = () => {
        console.error('Failed to load Telegram Web App script');
      };
      
      document.head.appendChild(script);
    }
  }, []);

  return null;
}