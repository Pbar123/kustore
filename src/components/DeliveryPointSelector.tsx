import React, { useState, useEffect } from 'react';
import { MapPin, Search, X } from 'lucide-react';

interface DeliveryPoint {
  id: string;
  name: string;
  address: string;
  workingHours: string;
  phone?: string;
  coordinates: [number, number];
  paymentMethods: string[];
}

interface DeliveryPointSelectorProps {
  deliveryMethod: 'boxberry' | 'cdek' | 'russian_post' | 'yandex_market';
  isOpen: boolean;
  onClose: () => void;
  onSelectPoint: (point: DeliveryPoint) => void;
  userLocation?: [number, number];
}

// Моковые данные для демонстрации
const mockDeliveryPoints: Record<string, DeliveryPoint[]> = {
  boxberry: [
    {
      id: 'bb_001',
      name: 'Boxberry - Пятерочка',
      address: 'ул. Ленина, 15, Москва',
      workingHours: 'Пн-Вс: 08:00-22:00',
      phone: '+7 (495) 123-45-67',
      coordinates: [55.7558, 37.6176],
      paymentMethods: ['Наличные', 'Карта']
    },
    {
      id: 'bb_002',
      name: 'Boxberry - Магнит',
      address: 'пр. Мира, 45, Москва',
      workingHours: 'Пн-Вс: 09:00-21:00',
      coordinates: [55.7700, 37.6400],
      paymentMethods: ['Наличные', 'Карта']
    },
    {
      id: 'bb_003',
      name: 'Boxberry - Перекресток',
      address: 'ул. Тверская, 12, Москва',
      workingHours: 'Пн-Вс: 08:00-23:00',
      coordinates: [55.7600, 37.6100],
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
      coordinates: [55.7520, 37.5900],
      paymentMethods: ['Наличные', 'Карта', 'Безналичный']
    },
    {
      id: 'cdek_002',
      name: 'СДЭК - Центральный офис',
      address: 'Красная площадь, 1, Москва',
      workingHours: 'Пн-Вс: 10:00-20:00',
      coordinates: [55.7539, 37.6208],
      paymentMethods: ['Наличные', 'Карта']
    }
  ],
  russian_post: [
    {
      id: 'rp_001',
      name: 'Почта России - Отделение 101000',
      address: 'ул. Мясницкая, 26, Москва',
      workingHours: 'Пн-Пт: 08:00-20:00, Сб: 09:00-18:00',
      phone: '+7 (495) 345-67-89',
      coordinates: [55.7640, 37.6350],
      paymentMethods: ['Наличные']
    },
    {
      id: 'rp_002',
      name: 'Почта России - Отделение 101001',
      address: 'Тверской бульвар, 15, Москва',
      workingHours: 'Пн-Пт: 09:00-18:00, Сб: 10:00-16:00',
      coordinates: [55.7580, 37.6050],
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
      coordinates: [55.7890, 37.6700],
      paymentMethods: ['Наличные', 'Карта', 'Яндекс.Деньги']
    },
    {
      id: 'ym_002',
      name: 'Яндекс.Маркет - ПВЗ Китай-город',
      address: 'ул. Маросейка, 13, Москва',
      workingHours: 'Пн-Вс: 09:00-21:00',
      coordinates: [55.7570, 37.6280],
      paymentMethods: ['Наличные', 'Карта']
    }
  ]
};

const deliveryMethodNames = {
  boxberry: 'Boxberry',
  cdek: 'СДЭК',
  russian_post: 'Почта России',
  yandex_market: 'Яндекс.Маркет'
};

export function DeliveryPointSelector({ 
  deliveryMethod, 
  isOpen, 
  onClose, 
  onSelectPoint,
  userLocation 
}: DeliveryPointSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<DeliveryPoint | null>(null);
  const [filteredPoints, setFilteredPoints] = useState<DeliveryPoint[]>([]);

  const points = mockDeliveryPoints[deliveryMethod] || [];

  useEffect(() => {
    if (searchTerm) {
      const filtered = points.filter(point =>
        point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPoints(filtered);
    } else {
      setFilteredPoints(points);
    }
  }, [searchTerm, points]);

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
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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
              {filteredPoints.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Пункты выдачи не найдены
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
                          <p className="text-xs text-gray-500 mt-1">
                            {point.workingHours}
                          </p>
                          {point.phone && (
                            <p className="text-xs text-gray-500">
                              {point.phone}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {point.paymentMethods.map((method) => (
                              <span
                                key={method}
                                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                              >
                                {method}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="w-1/2 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Карта пунктов выдачи</p>
              <p className="text-sm">
                {selectedPoint 
                  ? `Выбран: ${selectedPoint.name}`
                  : 'Выберите пункт из списка'
                }
              </p>
              {selectedPoint && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-sm max-w-sm mx-auto">
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