import React from 'react';
import { Store, Truck, CreditCard, Phone, Mail, MapPin } from 'lucide-react';

export function InfoPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Информация о магазине</h1>
        <p className="text-lg text-gray-600">Все что нужно знать о KUSTORE</p>
      </div>

      <div className="space-y-8">
        {/* О магазине */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Store className="h-6 w-6 text-gray-900 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">О магазине</h2>
          </div>
          <div className="prose text-gray-600">
            <p className="mb-4">
              KUSTORE — это современный интернет-магазин минималистичной одежды. 
              Мы предлагаем качественные вещи в стиле минимализм для тех, кто ценит 
              простоту, комфорт и элегантность.
            </p>
            <p>
              Наша миссия — предоставить вам одежду высокого качества по доступным ценам, 
              которая подчеркнет ваш индивидуальный стиль и будет служить долго.
            </p>
          </div>
        </section>

        {/* Доставка */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Truck className="h-6 w-6 text-gray-900 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Доставка</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Способы доставки:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Boxberry</strong> — доставка в пункты выдачи по всей России</li>
                <li>• <strong>Почта России</strong> — доставка до двери</li>
                <li>• <strong>СДЭК</strong> — быстрая доставка в пункты выдачи и курьером</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Сроки доставки:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• По Москве и МО: 1-2 рабочих дня</li>
                <li>• По России: 3-7 рабочих дней</li>
                <li>• Отдаленные регионы: до 14 рабочих дней</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Оплата */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="h-6 w-6 text-gray-900 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Оплата</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Способы оплаты:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Банковский перевод на карту</li>
                <li>• Перевод на расчетный счет</li>
                <li>• Оплата при получении (для некоторых регионов)</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Важно:</strong> После оформления заказа с вами свяжется наш менеджер 
                для подтверждения деталей и предоставления реквизитов для оплаты.
              </p>
            </div>
          </div>
        </section>

        {/* Возврат и обмен */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Возврат и обмен</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Условия возврата:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Возврат возможен в течение 14 дней с момента получения</li>
                <li>• Товар должен быть в первоначальном виде с бирками</li>
                <li>• Стоимость обратной доставки оплачивает покупатель</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Обмен размера:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Обмен возможен при наличии нужного размера на складе</li>
                <li>• Доплата за доставку при обмене не взимается</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Контакты */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Phone className="h-6 w-6 text-gray-900 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Контакты</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Телефон</p>
                  <p className="text-gray-600">+7 (999) 123-45-67</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-600">info@kustore.ru</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Адрес</p>
                  <p className="text-gray-600">г. Москва, ул. Примерная, д. 1</p>
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-900">Время работы</p>
                <p className="text-gray-600">Пн-Пт: 10:00-19:00</p>
                <p className="text-gray-600">Сб-Вс: 11:00-18:00</p>
              </div>
            </div>
          </div>
        </section>

        {/* Размерная сетка */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Размерная сетка</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Одежда (см)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b">Размер</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b">Грудь</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b">Талия</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b">Бедра</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr><td className="px-4 py-2 text-sm">XS</td><td className="px-4 py-2 text-sm">82-86</td><td className="px-4 py-2 text-sm">62-66</td><td className="px-4 py-2 text-sm">88-92</td></tr>
                    <tr><td className="px-4 py-2 text-sm">S</td><td className="px-4 py-2 text-sm">86-90</td><td className="px-4 py-2 text-sm">66-70</td><td className="px-4 py-2 text-sm">92-96</td></tr>
                    <tr><td className="px-4 py-2 text-sm">M</td><td className="px-4 py-2 text-sm">90-94</td><td className="px-4 py-2 text-sm">70-74</td><td className="px-4 py-2 text-sm">96-100</td></tr>
                    <tr><td className="px-4 py-2 text-sm">L</td><td className="px-4 py-2 text-sm">94-98</td><td className="px-4 py-2 text-sm">74-78</td><td className="px-4 py-2 text-sm">100-104</td></tr>
                    <tr><td className="px-4 py-2 text-sm">XL</td><td className="px-4 py-2 text-sm">98-102</td><td className="px-4 py-2 text-sm">78-82</td><td className="px-4 py-2 text-sm">104-108</td></tr>
                    <tr><td className="px-4 py-2 text-sm">XXL</td><td className="px-4 py-2 text-sm">102-106</td><td className="px-4 py-2 text-sm">82-86</td><td className="px-4 py-2 text-sm">108-112</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}