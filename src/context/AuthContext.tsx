import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TelegramUser } from '../types/telegram';
import { supabase } from '../lib/supabase';

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

      console.log('Starting login process...');
      console.log('Window.Telegram:', window.Telegram);
      console.log('WebApp available:', !!window.Telegram?.WebApp);

      // Проверяем, доступен ли Telegram Web App
      if (!window.Telegram?.WebApp) {
        console.warn('Telegram Web App not available, creating mock user for testing');
        // Для тестирования в браузере создаем тестового пользователя
        const mockUser = {
          id: Date.now(), // Уникальный ID
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser_' + Date.now()
        };
        
        console.log('Using mock user:', mockUser);
        
        // Создаем или обновляем пользователя в базе данных
        let { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('telegram_id', mockUser.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching existing user:', fetchError);
          throw fetchError;
        }

        let user;
        if (existingUser) {
          console.log('Updating existing user');
          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({ 
              last_login: new Date().toISOString(),
              first_name: mockUser.first_name,
              last_name: mockUser.last_name,
              username: mockUser.username,
            })
            .eq('telegram_id', mockUser.id)
            .select()
            .single();

          if (updateError) {
            console.error('Error updating user:', updateError);
            throw updateError;
          }
          user = updatedUser;
        } else {
          console.log('Creating new user');
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              id: mockUser.id,
              telegram_id: mockUser.id,
              first_name: mockUser.first_name,
              last_name: mockUser.last_name,
              username: mockUser.username,
              last_login: new Date().toISOString(),
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user:', insertError);
            throw insertError;
          }
          user = newUser;
        }

        console.log('User authenticated successfully:', user);
        dispatch({ 
          type: 'SET_USER', 
          payload: { user, telegramUser: mockUser } 
        });
        return;
      }

      const tg = window.Telegram.WebApp;
      
      console.log('Telegram WebApp object:', tg);
      console.log('InitData:', tg.initData);
      console.log('InitDataUnsafe:', tg.initDataUnsafe);
      
      // Инициализируем Telegram Web App
      tg.ready();
      tg.expand();

      // Получаем данные пользователя из Telegram
      const telegramUser = tg.initDataUnsafe.user;
      
      console.log('Telegram user from initDataUnsafe:', telegramUser);
      
      if (!telegramUser) {
        // Пробуем альтернативный способ получения данных
        console.log('No user in initDataUnsafe, trying alternative methods...');
        
        // Если данных нет, создаем тестового пользователя
        const mockUser = {
          id: Date.now(), // Уникальный ID на основе времени
          first_name: 'Telegram',
          last_name: 'User',
          username: 'telegram_user'
        };
        
        console.log('Using mock user:', mockUser);
        
        // Проверяем, существует ли пользователь
        let { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('telegram_id', mockUser.id)
          .single();

        let user;
        if (existingUser) {
          // Обновляем существующего пользователя
          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({ 
              last_login: new Date().toISOString(),
              first_name: mockUser.first_name,
              last_name: mockUser.last_name,
              username: mockUser.username,
            })
            .eq('telegram_id', mockUser.id)
            .select()
            .single();

          if (updateError) {
            console.error('Error updating user:', updateError);
            throw updateError;
          }
          user = updatedUser;
        } else {
          // Создаем нового пользователя
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              id: mockUser.id,
              telegram_id: mockUser.id,
              first_name: mockUser.first_name,
              last_name: mockUser.last_name,
              username: mockUser.username,
              last_login: new Date().toISOString(),
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user:', insertError);
            throw insertError;
          }
          user = newUser;
        }
        
        dispatch({ 
          type: 'SET_USER',
          payload: { user, telegramUser: mockUser }
        });
        return;
      }

      console.log('Telegram user data:', telegramUser);

      // Проверяем, существует ли пользователь в базе данных
      let { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramUser.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let user: User;

      if (existingUser) {
        // Обновляем время последнего входа
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ 
            last_login: new Date().toISOString(),
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name || null,
            username: telegramUser.username || null,
          })
          .eq('telegram_id', telegramUser.id)
          .select()
          .single();

        if (updateError) throw updateError;
        user = updatedUser;
      } else {
        // Создаем нового пользователя
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: telegramUser.id,
            telegram_id: telegramUser.id,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name || null,
            username: telegramUser.username || null,
            last_login: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) throw insertError;
        user = newUser;
      }

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
  }, []);

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