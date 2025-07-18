import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Инициализация Supabase...');
console.log('📍 URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '❌ НЕ ЗАДАН');
console.log('🔑 KEY:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : '❌ НЕ ЗАДАН');

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL не найден в переменных окружения!');
  console.error('📝 Добавьте в .env файл: VITE_SUPABASE_URL=https://your-project.supabase.co');
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY не найден в переменных окружения!');
  console.error('📝 Добавьте в .env файл: VITE_SUPABASE_ANON_KEY=your-anon-key');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

if (supabase) {
  console.log('✅ Supabase клиент успешно создан!');
} else {
  console.error('❌ Не удалось создать Supabase клиент - проверьте переменные окружения');
}