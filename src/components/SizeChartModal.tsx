import React from 'react';
import { X } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export function SizeChartModal({ isOpen, onClose, category }: SizeChartModalProps) {
  if (!isOpen) return null;

  const getClothingSizeChart = () => {
    return {
      title: 'Размерная сетка для одежды',
      measurements: [
        { label: 'A - Длина', key: 'length' },
        { label: 'B - Ширина груди', key: 'chest' },
        { label: 'C - Длина рукава', key: 'sleeve' }
      ],
      sizes: {
        'XS': { length: 61, chest: 64, sleeve: 52 },
        'S': { length: 65, chest: 65, sleeve: 56 },
        'M': { length: 66, chest: 69, sleeve: 58 },
        'L': { length: 69, chest: 73, sleeve: 60 },
        'XL': { length: 69, chest: 75, sleeve: 61 }
      }
    };
  };

  const getPantsSizeChart = () => {
    return {
      title: 'Размерная сетка для брюк и шорт',
      measurements: [
        { label: 'Талия', key: 'waist' },
        { label: 'Бедра', key: 'hips' },
        { label: 'Длина', key: 'length' }
      ],
      sizes: {
        '26': { waist: 66, hips: 92, length: 102 },
        '27': { waist: 69, hips: 95, length: 102 },
        '28': { waist: 71, hips: 97, length: 102 },
        '29': { waist: 74, hips: 100, length: 102 },
        '30': { waist: 76, hips: 102, length: 102 },
        '31': { waist: 79, hips: 105, length: 102 },
        '32': { waist: 81, hips: 107, length: 102 },
        '33': { waist: 84, hips: 110, length: 102 },
        '34': { waist: 86, hips: 112, length: 102 },
        '36': { waist: 91, hips: 117, length: 102 },
        '38': { waist: 96, hips: 122, length: 102 }
      }
    };
  };

  const getSizeChart = () => {
    const clothingCategories = ['shirts', 'sweaters', 'jackets', 'dresses'];
    const pantsCategories = ['jeans', 'pants', 'shorts'];
    
    if (clothingCategories.includes(category)) {
      return getClothingSizeChart();
    } else if (pantsCategories.includes(category)) {
      return getPantsSizeChart();
    } else {
      return null;
    }
  };

  const sizeChart = getSizeChart();

  if (!sizeChart) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Размерная сетка</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-600">Размерная сетка для данной категории товаров недоступна.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{sizeChart.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Схема измерений для одежды */}
          {category === 'shirts' || category === 'sweaters' || category === 'jackets' || category === 'dresses' ? (
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <svg width="300" height="400" viewBox="0 0 300 400" className="border rounded-lg bg-gray-50">
                  {/* Контур худи */}
                  <path
                    d="M150 40 C130 40, 120 50, 120 60 L120 80 C120 85, 115 90, 110 90 L90 90 C80 90, 70 100, 70 110 L70 350 C70 360, 80 370, 90 370 L210 370 C220 370, 230 360, 230 350 L230 110 C230 100, 220 90, 210 90 L190 90 C185 90, 180 85, 180 80 L180 60 C180 50, 170 40, 150 40 Z"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="2"
                  />
                  
                  {/* Капюшон */}
                  <path
                    d="M120 60 C120 30, 135 20, 150 20 C165 20, 180 30, 180 60"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="2"
                  />
                  
                  {/* Карман */}
                  <rect x="120" y="200" width="60" height="40" fill="none" stroke="#d1d5db" strokeWidth="1"/>
                  
                  {/* Линия A - Длина */}
                  <line x1="150" y1="40" x2="150" y2="370" stroke="#22c55e" strokeWidth="2"/>
                  <text x="155" y="200" fill="#22c55e" fontSize="20" fontWeight="bold">A</text>
                  
                  {/* Линия B - Ширина груди */}
                  <line x1="70" y1="140" x2="230" y2="140" stroke="#22c55e" strokeWidth="2"/>
                  <text x="145" y="135" fill="#22c55e" fontSize="20" fontWeight="bold">B</text>
                  
                  {/* Линия C - Длина рукава */}
                  <line x1="70" y1="110" x2="70" y2="350" stroke="#22c55e" strokeWidth="2"/>
                  <text x="45" y="230" fill="#22c55e" fontSize="20" fontWeight="bold">C</text>
                  
                  {/* Стрелки */}
                  <polygon points="150,35 145,45 155,45" fill="#22c55e"/>
                  <polygon points="150,375 145,365 155,365" fill="#22c55e"/>
                  <polygon points="65,140 75,135 75,145" fill="#22c55e"/>
                  <polygon points="235,140 225,135 225,145" fill="#22c55e"/>
                  <polygon points="70,105 65,115 75,115" fill="#22c55e"/>
                  <polygon points="70,355 65,345 75,345" fill="#22c55e"/>
                </svg>
              </div>
            </div>
          ) : null}

          {/* Таблица размеров */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">см</th>
                  {Object.keys(sizeChart.sizes).map(size => (
                    <th key={size} className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b">
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sizeChart.measurements.map(measurement => (
                  <tr key={measurement.key}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {measurement.label}
                    </td>
                    {Object.entries(sizeChart.sizes).map(([size, measurements]) => (
                      <td key={size} className="px-4 py-3 text-center text-sm text-gray-600">
                        {measurements[measurement.key as keyof typeof measurements]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Как измерить:</strong> Все измерения проводятся в сантиметрах. 
              Для получения точных размеров рекомендуется измерять одежду в разложенном виде.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}