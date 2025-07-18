import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TelegramUser } from '../types/telegram';
import { authenticateWithTelegram } from '../api/auth';

interface User {
  id: string;
  telegram_id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  created_at: string;
  last_login: string;
}

interface AuthState {
  user: User | null;
  telegramUser: TelegramUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { user: User; telegramUser: TelegramUser } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'LOGOUT' };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: () => Promise<void>;
  logout: () => void;
} | undefined>(undefined);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        telegramUser: action.payload.telegramUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        telegramUser: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        telegramUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    telegramUser: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const login = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });


      // Проверяем, доступен ли Telegram Web App
      if (!window.Telegram?.WebApp) {
        // Для тестирования в браузере создаем тестового пользователя
        const mockUser = {
          id: 999999999, // Фиксированный тестовый ID
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser'
        };
        
        const user = await authenticateWithTelegram(mockUser);
        dispatch({ 
          type: 'SET_USER', 
          payload: { user, telegramUser: mockUser } 
        });
        return;
      }

      const tg = window.Telegram.WebApp;
      
      // Инициализируем Telegram Web App
      tg.ready();
      tg.expand();

      // Получаем данные пользователя из Telegram
      const telegramUser = tg.initDataUnsafe.user;
      
      if (!telegramUser) {
        // Если данных нет, создаем тестового пользователя
        const mockUser = {
          id: 999999999, // Фиксированный тестовый ID
          first_name: 'Telegram',
          last_name: 'User',
          username: 'telegram_user'
        };
        
        const user = await authenticateWithTelegram(mockUser);
        dispatch({ 
          type: 'SET_USER',
          payload: { user, telegramUser: mockUser }
        });
        return;
      }

      const user = await authenticateWithTelegram(telegramUser);

      dispatch({ 
        type: 'SET_USER', 
        payload: { user, telegramUser } 
      });

    } catch (error) {
      console.error('Ошибка авторизации:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Произошла ошибка при авторизации' 
      });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    
    // Закрываем Telegram Web App при выходе
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  };

  // Автоматическая авторизация при загрузке приложения
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Ждем немного, чтобы Telegram Web App успел инициализироваться
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Проверяем, доступен ли Telegram Web App
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          console.log('Telegram WebApp detected:', {
            version: tg.version,
            platform: tg.platform,
            user: tg.initDataUnsafe?.user
          });
          
          // Если есть пользователь Telegram, авторизуемся
          if (tg.initDataUnsafe?.user) {
            console.log('Telegram user found, authenticating...');
            await login();
          } else {
            console.log('No Telegram user, using test user');
            // Если нет пользователя Telegram, используем тестового
            const mockUser = {
              id: 999999999,
              first_name: 'Telegram',
              last_name: 'User',
              username: 'telegram_user'
            };
            
            const user = await authenticateWithTelegram(mockUser);
            dispatch({ 
              type: 'SET_USER',
              payload: { user, telegramUser: mockUser }
            });
          }
        } else {
          console.log('Telegram WebApp not available, using test user');
          // Если Telegram Web App недоступен, используем тестового пользователя
          const mockUser = {
            id: 999999999,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser'
          };
          
          const user = await authenticateWithTelegram(mockUser);
          dispatch({ 
            type: 'SET_USER',
            payload: { user, telegramUser: mockUser }
          });
        }
      } catch (error) {
        console.error('Ошибка инициализации авторизации:', error);
        // В случае ошибки все равно создаем тестового пользователя
        try {
          const mockUser = {
            id: 999999999,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser'
          };
          
          const user = await authenticateWithTelegram(mockUser);
          dispatch({ 
            type: 'SET_USER',
            payload: { user, telegramUser: mockUser }
          });
        } catch (fallbackError) {
          console.error('Fallback auth failed:', fallbackError);
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    initAuth();
  }, []);

  // Убираем старый useEffect, заменяем на новый выше
  /*
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Ждем немного, чтобы Telegram Web App успел инициализироваться
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
          await login();
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Ошибка инициализации авторизации:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
}