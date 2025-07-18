import React, { useState } from 'react';
import { X, Plus, Minus, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Ruler } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { FavoriteButton } from './FavoriteButton';
import { ProductCard } from './ProductCard';
import { supabase } from '../lib/supabase';

interface ProductModalProps {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

export function ProductModal({ product, allProducts, onClose, onProductClick }: ProductModalProps) {
  const { dispatch, state } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [measurements, setMeasurements] = useState<Record<string, Record<string, number>>>({});
  const [measurementsLoading, setMeasurementsLoading] = useState(false);

  // Получаем рекомендации - сначала из той же категории, потом из других категорий
  const recommendations = React.useMemo(() => {
    if (!product) return [];
    
    // Сначала пытаемся найти товары из той же категории
    let sameCategoryProducts = allProducts.filter(p => 
      p.category === product.category && 
      p.id !== product.id && 
      p.in_stock
    );
    
    // Если товаров из той же категории мало, добавляем из других категорий
    if (sameCategoryProducts.length < 4) {
      const otherCategoryProducts = allProducts.filter(p => 
        p.category !== product.category && 
        p.id !== product.id && 
        p.in_stock
      );
      sameCategoryProducts = [...sameCategoryProducts, ...otherCategoryProducts];
    }
    
    return sameCategoryProducts.slice(0, 4);
  }, [allProducts, product]);

  // Загружаем замеры при открытии товара
  React.useEffect(() => {
    if (product && isSizeGuideOpen) {
      loadMeasurements();
    }
  }, [product, isSizeGuideOpen]);

  const loadMeasurements = async () => {
    if (!product) return;
    
    setMeasurementsLoading(true);
    try {
      const { data, error } = await supabase
        .from('measurements')
        .select('*')
        .eq('product_id', product.id);
      
      if (error) throw error;
      
      const measurementsMap: Record<string, Record<string, number>> = {};
      data?.forEach(measurement => {
        measurementsMap[measurement.size] = {
          A: measurement.measurement_a,
          B: measurement.measurement_b,
          C: measurement.measurement_c,
          D: measurement.measurement_d
        };
      });
      
      setMeasurements(measurementsMap);
    } catch (error) {
      console.error('Error loading measurements:', error);
    } finally {
      setMeasurementsLoading(false);
    }
  };

  // Схемы замеров по категориям
  const getMeasurementSchema = (category: string) => {
    const schemas = {
      'shirts': {
        image: '/measurements/tshirt-schema.jpg',
        labels: { A: 'Ширина груди', B: 'Длина изделия', C: 'Длина рукава' }
      },
      'sweaters': {
        image: '/measurements/hoodie-schema.jpg',
        labels: { A: 'Ширина груди', B: 'Длина изделия', C: 'Длина рукава', D: 'Глубина капюшона' }
      },
      'jeans': {
        image: '/measurements/pants-schema.jpg',
        labels: { A: 'Талия', B: 'Общая длина', C: 'Бедра', D: 'Длина по внутреннему шву' }
      },
      'shorts': {
        image: '/measurements/shorts-schema.jpg',
        labels: { A: 'Талия', B: 'Длина', C: 'Бедра' }
      },
      'shoes': {
        image: '/measurements/shoes-schema.jpg',
        labels: { A: 'Длина стопы', B: 'Ширина стопы' }
      }
    };
    return schemas[category as keyof typeof schemas];
  };

  if (!product) return null;

  const images = product.images || [product.image_url];
  const altTexts = product.image_alt_texts || [product.name];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_ITEM', payload: { product, size: selectedSize } });
    }
    onClose();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const getStockQuantity = (size: string) => {
    if (!product.stock_quantity || !product.stock_quantity[size]) {
      return 0;
    }
    return product.stock_quantity[size];
  };

  const getCartQuantityForSize = (size: string) => {
    const cartItem = state.items.find(
      item => item.product.id === product.id && item.size === size
    );
    return cartItem ? cartItem.quantity : 0;
  };

  const getAvailableQuantity = (size: string) => {
    const stockQty = getStockQuantity(size);
    const cartQty = getCartQuantityForSize(size);
    return Math.max(0, stockQty - cartQty);
  };

  const maxQuantityForSelectedSize = selectedSize ? getAvailableQuantity(selectedSize) : 0;
  const availableSizes = product.sizes.filter(size => getStockQuantity(size) > 0);
  const measurementSchema = getMeasurementSchema(product.category);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Детали товара</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Images Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                <img
                  src={images[currentImageIndex]}
                  alt={altTexts[currentImageIndex] || product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/products/placeholder.jpg';
                  }}
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 8).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? 'border-black'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={altTexts[index] || `${product.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/products/placeholder.jpg';
                        }}
                      />
                    </button>
                  ))}
                  {images.length > 8 && (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                      +{images.length - 8}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                  <span className="text-2xl font-semibold text-gray-900">{product.real_price} руб.</span>
                  <span className="text-xl text-gray-400 line-through">{product.fake_original_price} руб.</span>
                  {product.is_new && (
                    <span className="bg-black text-white text-sm px-2 py-1 rounded">NEW</span>
                  )}
                  </div>
                  <FavoriteButton productId={product.id} size="lg" />
                </div>
              </div>

              <p className="text-gray-600">{product.description}</p>

              {/* Size Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Размер</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.sizes.map((size) => (
                    <div key={size} className="relative flex flex-col items-center">
                      <button
                        onClick={() => {
                          setSelectedSize(size);
                          setQuantity(1); // Reset quantity when size changes
                        }}
                        disabled={getStockQuantity(size) === 0}
                        className={`px-4 py-2 border rounded-lg transition-colors relative ${
                          selectedSize === size
                            ? 'bg-black text-white border-black'
                            : getStockQuantity(size) === 0
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-900 border-gray-300 hover:border-black'
                        }`}
                      >
                        {size}
                        {getStockQuantity(size) === 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            ×
                          </span>
                        )}
                      </button>
                      {getStockQuantity(size) > 0 && getStockQuantity(size) <= 2 && (
                        <div className="mt-1 text-xs text-orange-600 whitespace-nowrap text-center">
                          Осталось: {getAvailableQuantity(size)} шт.
                        </div>
                      )}
                      {getStockQuantity(size) === 0 && (
                        <div className="mt-1 text-xs text-red-600 whitespace-nowrap text-center">
                          Нет в наличии
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Количество</h3>
                {selectedSize && maxQuantityForSelectedSize === 0 && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      Товар размера {selectedSize} закончился на складе или уже добавлен в корзину в максимальном количестве
                    </p>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className={`p-2 border rounded-lg transition-colors ${
                      quantity <= 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => {
                      setQuantity(Math.min(maxQuantityForSelectedSize, quantity + 1));
                    }}
                    disabled={!selectedSize || quantity >= maxQuantityForSelectedSize}
                    className={`p-2 border rounded-lg transition-colors ${
                      !selectedSize || quantity >= maxQuantityForSelectedSize
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {selectedSize && maxQuantityForSelectedSize > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Доступно для добавления: {maxQuantityForSelectedSize} шт.
                  </p>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || maxQuantityForSelectedSize === 0}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  selectedSize && maxQuantityForSelectedSize > 0
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {!selectedSize 
                  ? 'Выберите размер' 
                  : maxQuantityForSelectedSize === 0 
                  ? 'Нет в наличии' 
                  : 'Добавить в корзину'
                }
              </button>

              {/* Product Features */}
              {product.features && product.features.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Особенности товара</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Size Guide */}
              {measurementSchema && availableSizes.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={() => setIsSizeGuideOpen(!isSizeGuideOpen)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <Ruler className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-medium text-gray-900">Размерная сетка</h3>
                    </div>
                    {isSizeGuideOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  
                  {isSizeGuideOpen && (
                    <div className="mt-4 space-y-4">
                      {/* Measurement Schema Image */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <img
                          src={measurementSchema.image}
                          alt="Схема замеров"
                          className="w-full max-w-md mx-auto"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                      
                      {/* Measurements Table */}
                      {measurementsLoading ? (
                        <div className="text-center py-4">
                          <div className="text-sm text-gray-600">Загрузка замеров...</div>
                        </div>
                      ) : availableSizes.length > 0 && Object.keys(measurements).length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b">
                                  Размер
                                </th>
                                {Object.keys(measurementSchema.labels).map(key => (
                                  <th key={key} className="px-4 py-2 text-center text-sm font-medium text-gray-900 border-b">
                                    {key}
                                    <div className="text-xs text-gray-600 font-normal">
                                      {measurementSchema.labels[key]}
                                    </div>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {availableSizes.map(size => (
                                <tr key={size} className={selectedSize === size ? 'bg-blue-50' : ''}>
                                  <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                    {size}
                                  </td>
                                  {Object.keys(measurementSchema.labels).map(key => (
                                    <td key={key} className="px-4 py-2 text-sm text-gray-600 text-center">
                                      {measurements[size]?.[key] ? `${measurements[size][key]} см` : '—'}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <p className="text-sm">Замеры для этого товара не указаны</p>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                        <p><strong>Как измерять:</strong> Все замеры указаны в сантиметрах. Измеряйте одежду в разложенном виде.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Рекомендации - всегда показываем, даже если мало товаров */}
        <div className="border-t border-gray-200 pt-8 mt-8 px-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {recommendations.some(p => p.category === product.category) 
              ? 'Похожие товары' 
              : 'Рекомендуемые товары'
            }
          </h3>
          
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendations.map((recommendedProduct) => (
                <div key={recommendedProduct.id} className="cursor-pointer">
                  <ProductCard
                    product={recommendedProduct}
                    onProductClick={(clickedProduct) => {
                      onProductClick(clickedProduct);
                      // Сбрасываем состояние модального окна для нового товара
                      setSelectedSize('');
                      setQuantity(1);
                      setCurrentImageIndex(0);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Рекомендации временно недоступны</p>
              <p className="text-sm mt-2">Попробуйте просмотреть другие разделы каталога</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}