import { supabase } from '../lib/supabase';
import { TelegramUser } from '../types/telegram';

export interface User {
  id: string;
  telegram_id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  created_at: string;
  last_login: string;
}

export async function authenticateWithTelegram(telegramUser: TelegramUser): Promise<User> {
  try {
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
      // Обновляем время последнего входа и данные пользователя
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

    return user;
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Пользователь не найден
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    throw error;
  }
}

export async function updateUserLastLogin(telegramId: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('telegram_id', telegramId);

    if (error) throw error;
  } catch (error) {
    console.error('Ошибка обновления времени входа:', error);
    throw error;
  }
}