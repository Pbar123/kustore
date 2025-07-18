import React from 'react';

function App() {
  React.useEffect(() => {
    console.log('App component mounted');
    console.log('Environment check:', {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing',
      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
    });
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">KUSTORE</h1>
        <p className="text-lg text-gray-600 mb-8">Тестовая страница загружена успешно!</p>
        
        <div className="bg-gray-100 p-4 rounded-lg text-left max-w-md">
          <h3 className="font-semibold mb-2">Проверка переменных окружения:</h3>
          <p className="text-sm">
            SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Установлен' : '❌ Отсутствует'}
          </p>
          <p className="text-sm">
            SUPABASE_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Установлен' : '❌ Отсутствует'}
          </p>
        </div>
        
        <button 
          onClick={() => {
            console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
            console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
            alert('Проверьте консоль браузера (F12)');
          }}
          className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Показать переменные в консоли
        </button>
      </div>
    </div>
  );
}

export default App;