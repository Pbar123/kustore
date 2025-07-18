import React, { useState, useEffect } from 'react';
import { MapPin, Search, X, Phone, Clock, CreditCard } from 'lucide-react';

interface DeliveryPoint {
  id: string;
  name: string;
  address: string;
  workingHours: string;
  phone?: string;
  coordinates: [number, number];
  paymentMethods: string[];
  distance?: number;
}

interface DeliveryPointSelectorProps {
  deliveryMethod: 'boxberry' | 'cdek' | 'russian_post' | 'yandex_market';
  isOpen: boolean;
  onClose: () => void;
  onSelectPoint: (point: DeliveryPoint) => void;
  userLocation?: [number, number];
}

const deliveryMethodNames = {
  boxberry: 'Boxberry',
  cdek: 'СДЭК',
  russian_post: 'Почта России',
  yandex_market: 'Яндекс.Маркет'
};

// API endpoints для каждой службы
const API_ENDPOINTS = {
  boxberry: 'https://api.boxberry.ru/json.php?token=YOUR_TOKEN&method=ListPoints&CityCode=',
  cdek: 'https://api.cdek.ru/v2/deliverypoints',
  russian_post: 'https://otpravka-api.pochta.ru/1.0/offices',
  yandex_market: 'https://api.partner.market.yandex.ru/v2/campaigns/YOUR_CAMPAIGN/outlets'
};

export function DeliveryPointSelector({ 
  deliveryMethod, 
  isOpen, 
  onClose, 
  onSelectPoint,
  userLocation = [55.7558, 37.6176] // Москва по умолчанию
}: DeliveryPointSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<DeliveryPoint | null>(null);
  const [points, setPoints] = useState<DeliveryPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка пунктов выдачи при открытии модального окна
  useEffect(() => {
    if (isOpen && deliveryMethod) {
      loadDeliveryPoints();
    }
  }, [isOpen, deliveryMethod]);

  const loadDeliveryPoints = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let deliveryPoints: DeliveryPoint[] = [];
      
      switch (deliveryMethod) {
        case 'boxberry':
          deliveryPoints = await loadBoxberryPoints();
          break;
        case 'cdek':
          deliveryPoints = await loadCdekPoints();
          break;
        case 'russian_post':
          deliveryPoints = await loadRussianPostPoints();
          break;
        case 'yandex_market':
          deliveryPoints = await loadYandexMarketPoints();
          break;
      }
      
      setPoints(deliveryPoints);
    } catch (err) {
      console.error('Ошибка загрузки пунктов выдачи:', err);
      setError('Не удалось загрузить пункты выдачи. Попробуйте позже.');
      // Показываем моковые данные в случае ошибки
      setPoints(getMockPoints(deliveryMethod));
    } finally {
      setLoading(false);
    }
  };

  // API для Boxberry
  const loadBoxberryPoints = async (): Promise<DeliveryPoint[]> => {
    // Для демонстрации используем тестовый API
    // В реальном проекте нужен токен от Boxberry
    const response = await fetch(`https://api.boxberry.ru/json.php?method=ListPoints&CityCode=77`);
    
    if (!response.ok) {
      throw new Error('Boxberry API error');
    }
    
    const data = await response.json();
    
    return data.map((point: any) => ({
      id: point.Code,
      name: `Boxberry - ${point.Name}`,
      address: point.Address,
      workingHours: point.WorkShedule,
      phone: point.Phone,
      coordinates: [parseFloat(point.GPS.split(',')[0]), parseFloat(point.GPS.split(',')[1])],
      paymentMethods: point.PaymentType === '1' ? ['Наличные', 'Карта'] : ['Наличные']
    }));
  };

  // API для СДЭК
  const loadCdekPoints = async (): Promise<DeliveryPoint[]> => {
    // Для СДЭК нужна авторизация через OAuth 2.0
    const response = await fetch('https://api.cdek.ru/v2/deliverypoints?city_code=44', {
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
      }
    });
    
    if (!response.ok) {
      throw new Error('CDEK API error');
    }
    
    const data = await response.json();
    
    return data.map((point: any) => ({
      id: point.code,
      name: `СДЭК - ${point.name}`,
      address: point.location.address_full,
      workingHours: point.work_time,
      phone: point.phone,
      coordinates: [point.location.latitude, point.location.longitude],
      paymentMethods: point.allowed_cod ? ['Наличные', 'Карта'] : ['Карта']
    }));
  };

  // API для Почты России
  const loadRussianPostPoints = async (): Promise<DeliveryPoint[]> => {
    // Для Почты России нужен API ключ
    const response = await fetch('https://otpravka-api.pochta.ru/1.0/offices', {
      headers: {
        'Authorization': 'AccessToken YOUR_TOKEN',
        'X-User-Authorization': 'Basic YOUR_AUTH'
      }
    });
    
    if (!response.ok) {
      throw new Error('Russian Post API error');
    }
    
    const data = await response.json();
    
    return data.map((point: any) => ({
      id: point.index,
      name: `Почта России - ${point.index}`,
      address: point.address,
      workingHours: point.workTime,
      phone: point.phone,
      coordinates: [point.latitude, point.longitude],
      paymentMethods: ['Наличные']
    }));
  };

  // API для Яндекс.Маркет
  const loadYandexMarketPoints = async (): Promise<DeliveryPoint[]> => {
    // Для Яндекс.Маркет нужен OAuth токен
    const response = await fetch('https://api.partner.market.yandex.ru/v2/campaigns/YOUR_CAMPAIGN/outlets', {
      headers: {
        'Authorization': 'OAuth YOUR_TOKEN'
      }
    });
    
    if (!response.ok) {
      throw new Error('Yandex Market API error');
    }
    
    const data = await response.json();
    
    return data.outlets.map((point: any) => ({
      id: point.id.toString(),
      name: `Яндекс.Маркет - ${point.name}`,
      address: point.address.fullAddress,
      workingHours: point.workingSchedule.workingDays.join(', '),
      phone: point.phones?.[0]?.number,
      coordinates: [point.coords.lat, point.coords.lon],
      paymentMethods: ['Наличные', 'Карта', 'Яндекс.Деньги']
    }));
  };

  // Моковые данные для демонстрации
  const getMockPoints = (method: string): DeliveryPoint[] => {
    const mockData = {
      boxberry: [
        {
          id: 'bb_001',
          name: 'Boxberry - Пятерочка',
          address: 'ул. Ленина, 15, Москва',
          workingHours: 'Пн-Вс: 08:00-22:00',
          phone: '+7 (495) 123-45-67',
          coordinates: [55.7558, 37.6176] as [number, number],
          paymentMethods: ['Наличные', 'Карта']
        },
        {
          id: 'bb_002',
          name: 'Boxberry - Магнит',
          address: 'пр. Мира, 45, Москва',
          workingHours: 'Пн-Вс: 09:00-21:00',
          coordinates: [55.7700, 37.6400] as [number, number],
          paymentMethods: ['Наличные', 'Карта']
        }
      ],
      cdek: [
        {
          id: 'cdek_001',
          name: 'СДЭК - Офис на Арбате',
          address: 'ул. Арбат, 25, Москва',
          workingHours: 'Пн-Пт: 09:00-19:00, Сб: 10:00-16:00',
          phone: '+7 (495) 234-56-78',
          coordinates: [55.7520, 37.5900] as [number, number],
          paymentMethods: ['Наличные', 'Карта', 'Безналичный']
        }
      ],
      russian_post: [
        {
          id: 'rp_001',
          name: 'Почта России - Отделение 101000',
          address: 'ул. Мясницкая, 26, Москва',
          workingHours: 'Пн-Пт: 08:00-20:00, Сб: 09:00-18:00',
          phone: '+7 (495) 345-67-89',
          coordinates: [55.7640, 37.6350] as [number, number],
          paymentMethods: ['Наличные']
        }
      ],
      yandex_market: [
        {
          id: 'ym_001',
          name: 'Яндекс.Маркет - ПВЗ Сокольники',
          address: 'Сокольническая площадь, 4А, Москва',
          workingHours: 'Пн-Вс: 10:00-22:00',
          phone: '+7 (495) 456-78-90',
          coordinates: [55.7890, 37.6700] as [number, number],
          paymentMethods: ['Наличные', 'Карта', 'Яндекс.Деньги']
        }
      ]
    };
    
    return mockData[method as keyof typeof mockData] || [];
  };

  const filteredPoints = points.filter(point =>
    point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPoint = (point: DeliveryPoint) => {
    setSelectedPoint(point);
  };

  const handleConfirmSelection = () => {
    if (selectedPoint) {
      onSelectPoint(selectedPoint);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Выберите пункт выдачи - {deliveryMethodNames[deliveryMethod]}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar with points list */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Поиск по адресу или названию..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            {/* Points list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                  <p className="text-gray-600">Загрузка пунктов выдачи...</p>
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-600">
                  <p className="mb-2">{error}</p>
                  <button 
                    onClick={loadDeliveryPoints}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Попробовать снова
                  </button>
                </div>
              ) : filteredPoints.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm ? 'Пункты выдачи не найдены' : 'Нет доступных пунктов выдачи'}
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {filteredPoints.map((point) => (
                    <div
                      key={point.id}
                      onClick={() => handleSelectPoint(point)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPoint?.id === point.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm">
                            {point.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {point.address}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {point.workingHours}
                          </div>
                          {point.phone && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {point.phone}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {point.paymentMethods.map((method) => (
                              <span
                                key={method}
                                className="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                              >
                                <CreditCard className="h-3 w-3 mr-1" />
                                {method}
                              </span>
                            ))}
                          </div>
                          {point.distance && (
                            <p className="text-xs text-blue-600 mt-1">
                              ~{point.distance} км от вас
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map area */}
          <div className="w-1/2 bg-gray-100 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500 max-w-sm">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Интерактивная карта</p>
                <p className="text-sm mb-4">
                  {selectedPoint 
                    ? `Выбран: ${selectedPoint.name}`
                    : 'Выберите пункт из списка для отображения на карте'
                  }
                </p>
                
                {/* Инструкции по интеграции */}
                <div className="bg-blue-50 p-4 rounded-lg text-left">
                  <h4 className="font-medium text-blue-900 mb-2">Для интеграции реальной карты:</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Подключите API {deliveryMethodNames[deliveryMethod]}</li>
                    <li>• Добавьте Яндекс.Карты или Google Maps</li>
                    <li>• Настройте отображение точек на карте</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {selectedPoint && (
              <div className="p-4 bg-white border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  {selectedPoint.name}
                </h4>
                <p className="text-sm text-gray-600 mb-1">
                  {selectedPoint.address}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedPoint.workingHours}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedPoint}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedPoint
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Выбрать пункт выдачи
          </button>
        </div>
      </div>
    </div>
  );
}