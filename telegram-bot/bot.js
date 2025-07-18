require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');

// Конфигурация
const BOT_TOKEN = process.env.TELEGRAM_ADMIN_BOT_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

// Инициализация
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Проверяем переменные окружения
if (!BOT_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_KEY || !ADMIN_CHAT_ID) {
  console.error('❌ Отсутствуют необходимые переменные окружения:');
  console.error('BOT_TOKEN:', BOT_TOKEN ? '✅' : '❌');
  console.error('SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
  console.error('SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? '✅' : '❌');
  console.error('ADMIN_CHAT_ID:', ADMIN_CHAT_ID ? '✅' : '❌');
  console.error('\n📝 Инструкции по настройке:');
  console.error('1. Создайте бота через @BotFather в Telegram');
  console.error('2. Получите токен бота и добавьте его в .env как TELEGRAM_ADMIN_BOT_TOKEN');
  console.error('3. Узнайте ваш Chat ID (например, через @userinfobot) и добавьте как TELEGRAM_ADMIN_CHAT_ID');
  console.error('4. Добавьте данные Supabase из основного .env файла проекта');
  process.exit(1);
}

// Проверяем формат токена бота
if (!BOT_TOKEN.match(/^\d+:[A-Za-z0-9_-]{35}$/)) {
  console.error('❌ Неверный формат токена бота!');
  console.error('Токен должен иметь формат: 123456789:ABCdefGHIjklMNOpqrSTUvwxYZ123456789');
  console.error('Получите правильный токен через @BotFather в Telegram');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Хранилище состояний пользователей
const userStates = new Map();

// Состояния для добавления товара
const ADD_PRODUCT_STATES = {
  WAITING_NAME: 'waiting_name',
  WAITING_PRICE: 'waiting_price',
  WAITING_FAKE_PRICE: 'waiting_fake_price',
  WAITING_CATEGORY: 'waiting_category',
  WAITING_SUBCATEGORY: 'waiting_subcategory',
  WAITING_COLOR: 'waiting_color',
  WAITING_BRAND: 'waiting_brand',
  WAITING_DESCRIPTION: 'waiting_description',
  WAITING_SIZES: 'waiting_sizes',
  WAITING_STOCK: 'waiting_stock',
  WAITING_MEASUREMENTS_SIZE: 'waiting_measurements_size',
  WAITING_MEASUREMENTS_VALUES: 'waiting_measurements_values',
  WAITING_IMAGES: 'waiting_images',
  WAITING_FEATURES: 'waiting_features',
  WAITING_IS_NEW: 'waiting_is_new',
  CONFIRM: 'confirm'
};

// Состояния для редактирования товара
const EDIT_PRODUCT_STATES = {
  WAITING_PRODUCT_ID: 'waiting_product_id',
  WAITING_FIELD: 'waiting_field',
  WAITING_VALUE: 'waiting_value'
};

// Состояния для промокодов
const PROMO_CODE_STATES = {
  WAITING_CODE: 'waiting_code',
  WAITING_NAME: 'waiting_name',
  WAITING_DESCRIPTION: 'waiting_description',
  WAITING_DISCOUNT_TYPE: 'waiting_discount_type',
  WAITING_DISCOUNT_VALUE: 'waiting_discount_value',
  WAITING_MIN_ORDER: 'waiting_min_order',
  WAITING_MIN_ITEMS: 'waiting_min_items',
  WAITING_CATEGORIES: 'waiting_categories',
  WAITING_MAX_USES: 'waiting_max_uses',
  WAITING_VALID_UNTIL: 'waiting_valid_until',
  CONFIRM: 'confirm'
};

// Категории товаров
const CATEGORIES = [
  'shirts', 'sweaters', 'jeans', 'shorts', 'accessories', 'shoes'
];

// Размеры по категориям
const SIZES_BY_CATEGORY = {
  'shirts': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  'sweaters': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  'jeans': ['26', '27', '28', '29', '30', '31', '32', '33', '34', '36', '38'],
  'shorts': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  'accessories': ['One Size'],
  'shoes': ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44']
};

// Замеры по категориям (какие замеры нужны)
const MEASUREMENTS_BY_CATEGORY = {
  'shirts': ['A', 'B', 'C'], // A-ширина, B-длина, C-рукав
  'sweaters': ['A', 'B', 'C', 'D'], // A-ширина, B-длина, C-рукав, D-капюшон
  'jeans': ['A', 'B', 'C', 'D'], // A-талия, B-длина, C-бедра, D-длина по внутреннему шву
  'shorts': ['A', 'B', 'C'], // A-талия, B-длина, C-бедра
  'accessories': [], // Без замеров
  'shoes': ['A', 'B'] // A-длина стопы, B-ширина стопы
};

// Проверка администратора
function isAdmin(chatId) {
  return chatId.toString() === ADMIN_CHAT_ID;
}

// Главное меню
function getMainMenu() {
  return {
    reply_markup: {
      keyboard: [
        ['➕ Добавить товар', '✏️ Редактировать товар'],
        ['🎫 Управление промокодами', '👁️ Скрыть/Показать товар'],
        ['📋 Список товаров', '📊 Статистика'],
        ['❌ Отмена']
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };
}

// Меню категорий
function getCategoryMenu() {
  const keyboard = [];
  for (let i = 0; i < CATEGORIES.length; i += 2) {
    const row = [CATEGORIES[i]];
    if (CATEGORIES[i + 1]) row.push(CATEGORIES[i + 1]);
    keyboard.push(row);
  }
  keyboard.push(['❌ Отмена']);
  
  return {
    reply_markup: {
      keyboard,
      resize_keyboard: true,
      one_time_keyboard: true
    }
  };
}

// Меню размеров для категории
function getSizesMenu(category) {
  const sizes = SIZES_BY_CATEGORY[category] || ['XS', 'S', 'M', 'L', 'XL'];
  const keyboard = [];
  
  for (let i = 0; i < sizes.length; i += 3) {
    const row = sizes.slice(i, i + 3);
    keyboard.push(row);
  }
  keyboard.push(['✅ Готово', '❌ Отмена']);
  
  return {
    reply_markup: {
      keyboard,
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };
}

// Меню да/нет
function getYesNoMenu() {
  return {
    reply_markup: {
      keyboard: [
        ['✅ Да', '❌ Нет']
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  };
}

// Меню промокодов
function getPromoCodeMenu() {
  return {
    reply_markup: {
      keyboard: [
        ['➕ Создать промокод', '📋 Список промокодов'],
        ['✏️ Редактировать промокод', '🗑️ Удалить промокод'],
        ['❌ Назад в главное меню']
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };
}

// Меню типов скидки
function getDiscountTypeMenu() {
  return {
    reply_markup: {
      keyboard: [
        ['📊 Процент (%)', '💰 Фиксированная сумма (руб.)'],
        ['❌ Отмена']
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  };
}
// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAdmin(chatId)) {
    bot.sendMessage(chatId, '❌ У вас нет доступа к этому боту.');
    return;
  }
  
  bot.sendMessage(chatId, 
    '🛍️ *Добро пожаловать в панель управления KUSTORE!*\n\n' +
    'Выберите действие:', 
    { ...getMainMenu(), parse_mode: 'Markdown' }
  );
});

// Обработка сообщений
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  if (!isAdmin(chatId)) return;
  
  const userState = userStates.get(chatId) || {};
  
  try {
    // Главное меню
    if (text === '➕ Добавить товар') {
      await startAddProduct(chatId);
    } else if (text === '✏️ Редактировать товар') {
      await startEditProduct(chatId);
    } else if (text === '🎫 Управление промокодами') {
      await showPromoCodeMenu(chatId);
    } else if (text === '👁️ Скрыть/Показать товар') {
      await startHideProduct(chatId);
    } else if (text === '📋 Список товаров') {
      await showProductsList(chatId);
    } else if (text === '📊 Статистика') {
      await showStatistics(chatId);
    } else if (text === '❌ Отмена') {
      userStates.delete(chatId);
      bot.sendMessage(chatId, '✅ Операция отменена.', getMainMenu());
    }
    // Обработка состояний добавления товара
    else if (userState.action === 'add_product') {
      await handleAddProductState(chatId, text, userState);
    }
    // Обработка состояний редактирования товара
    else if (userState.action === 'edit_product') {
      await handleEditProductState(chatId, text, userState);
    }
    // Обработка промокодов
    else if (userState.action === 'promo_menu') {
      await handlePromoMenuState(chatId, text, userState);
    }
    else if (userState.action === 'add_promo') {
      await handleAddPromoState(chatId, text, userState);
    }
    // Обработка скрытия товара
    else if (userState.action === 'hide_product') {
      await handleHideProductState(chatId, text, userState);
    }
  } catch (error) {
    console.error('Error handling message:', error);
    bot.sendMessage(chatId, '❌ Произошла ошибка. Попробуйте еще раз.');
    userStates.delete(chatId);
  }
});

// Начать добавление товара
async function startAddProduct(chatId) {
  userStates.set(chatId, {
    action: 'add_product',
    state: ADD_PRODUCT_STATES.WAITING_NAME,
    product: {}
  });
  
  bot.sendMessage(chatId, 
    '➕ *Добавление нового товара*\n\n' +
    '📝 Введите название товара:', 
    { parse_mode: 'Markdown' }
  );
}

// Обработка состояний добавления товара
async function handleAddProductState(chatId, text, userState) {
  const { state, product } = userState;
  
  switch (state) {
    case ADD_PRODUCT_STATES.WAITING_NAME:
      product.name = text;
      userState.state = ADD_PRODUCT_STATES.WAITING_PRICE;
      bot.sendMessage(chatId, '💰 Введите цену товара (в рублях):');
      break;
      
    case ADD_PRODUCT_STATES.WAITING_PRICE:
      const price = parseFloat(text);
      if (isNaN(price) || price <= 0) {
        bot.sendMessage(chatId, '❌ Введите корректную цену (число больше 0):');
        return;
      }
      product.real_price = price;
      userState.state = ADD_PRODUCT_STATES.WAITING_FAKE_PRICE;
      bot.sendMessage(chatId, 
        '🏷️ Введите зачеркнутую цену (должна быть больше реальной):'
      );
      break;
      
    case ADD_PRODUCT_STATES.WAITING_FAKE_PRICE:
      const fakePrice = parseFloat(text);
      if (isNaN(fakePrice) || fakePrice <= product.real_price) {
        bot.sendMessage(chatId, '❌ Зачеркнутая цена должна быть больше реальной цены:');
        return;
      }
      product.fake_original_price = fakePrice;
      userState.state = ADD_PRODUCT_STATES.WAITING_CATEGORY;
      bot.sendMessage(chatId, '📂 Выберите категорию товара:', getCategoryMenu());
      break;
      
    case ADD_PRODUCT_STATES.WAITING_CATEGORY:
      if (!CATEGORIES.includes(text)) {
        bot.sendMessage(chatId, '❌ Выберите категорию из предложенных:', getCategoryMenu());
        return;
      }
      product.category = text;
      userState.state = ADD_PRODUCT_STATES.WAITING_SUBCATEGORY;
      bot.sendMessage(chatId, 
        '📁 Введите подкategорию (или "нет" если не нужна):'
      );
      break;
      
    case ADD_PRODUCT_STATES.WAITING_SUBCATEGORY:
      if (text.toLowerCase() !== 'нет') {
        product.subcategory = text;
      }
      userState.state = ADD_PRODUCT_STATES.WAITING_COLOR;
      bot.sendMessage(chatId, '🎨 Введите цвет товара (или "нет"):');
      break;
      
    case ADD_PRODUCT_STATES.WAITING_COLOR:
      if (text.toLowerCase() !== 'нет') {
        product.color = text;
      }
      userState.state = ADD_PRODUCT_STATES.WAITING_BRAND;
      bot.sendMessage(chatId, '🏷️ Введите бренд (по умолчанию "KUSTORE"):');
      break;
      
    case ADD_PRODUCT_STATES.WAITING_BRAND:
      product.brand = text === 'нет' ? 'KUSTORE' : text;
      userState.state = ADD_PRODUCT_STATES.WAITING_DESCRIPTION;
      bot.sendMessage(chatId, '📝 Введите описание товара:');
      break;
      
    case ADD_PRODUCT_STATES.WAITING_DESCRIPTION:
      product.description = text;
      userState.state = ADD_PRODUCT_STATES.WAITING_SIZES;
      userState.selectedSizes = [];
      bot.sendMessage(chatId, 
        '📏 Выберите размеры (нажимайте на размеры, затем "Готово"):', 
        getSizesMenu(product.category)
      );
      break;
      
    case ADD_PRODUCT_STATES.WAITING_SIZES:
      if (text === '✅ Готово') {
        if (userState.selectedSizes.length === 0) {
          bot.sendMessage(chatId, '❌ Выберите хотя бы один размер!');
          return;
        }
        product.sizes = userState.selectedSizes;
        userState.state = ADD_PRODUCT_STATES.WAITING_STOCK;
        userState.stockIndex = 0;
        bot.sendMessage(chatId, 
          `📦 Введите количество на складе для размера ${product.sizes[0]}:`
        );
      } else if (SIZES_BY_CATEGORY[product.category]?.includes(text)) {
        if (!userState.selectedSizes.includes(text)) {
          userState.selectedSizes.push(text);
          bot.sendMessage(chatId, `✅ Размер ${text} добавлен. Выбрано: ${userState.selectedSizes.join(', ')}`);
        }
      }
      break;
      
    case ADD_PRODUCT_STATES.WAITING_STOCK:
      const stock = parseInt(text);
      if (isNaN(stock) || stock < 0) {
        bot.sendMessage(chatId, '❌ Введите корректное количество (число >= 0):');
        return;
      }
      
      if (!product.stock_quantity) product.stock_quantity = {};
      product.stock_quantity[product.sizes[userState.stockIndex]] = stock;
      
      userState.stockIndex++;
      if (userState.stockIndex < product.sizes.length) {
        bot.sendMessage(chatId, 
          `📦 Введите количество на складе для размера ${product.sizes[userState.stockIndex]}:`
        );
      } else {
        // Проверяем, нужны ли замеры для этой категории
        const needsMeasurements = MEASUREMENTS_BY_CATEGORY[product.category] && 
                                 MEASUREMENTS_BY_CATEGORY[product.category].length > 0;
        
        if (needsMeasurements) {
          userState.state = ADD_PRODUCT_STATES.WAITING_MEASUREMENTS_VALUES;
          userState.measurementIndex = 0;
          userState.currentMeasurements = {};
          bot.sendMessage(chatId, 
            `📏 Теперь добавим замеры для размера ${product.sizes[0]}\n\n` +
            `Нужные замеры для категории "${product.category}": ${MEASUREMENTS_BY_CATEGORY[product.category].join(', ')}\n\n` +
            `Введите замер A в сантиметрах (например: 52.5):`
          );
        } else {
          userState.state = ADD_PRODUCT_STATES.WAITING_IMAGES;
          bot.sendMessage(chatId, 
            '🖼️ Введите пути к изображениям через запятую\n' +
            'Пример: /images/products/shirts/shirt1.jpg, /images/products/shirts/shirt2.jpg'
          );
        }
      }
      break;
      
    case ADD_PRODUCT_STATES.WAITING_MEASUREMENTS_VALUES:
      const measurementValue = parseFloat(text);
      if (isNaN(measurementValue) || measurementValue <= 0) {
        bot.sendMessage(chatId, '❌ Введите корректное значение замера (число больше 0):');
        return;
      }
      
      const currentSize = product.sizes[Math.floor(userState.measurementIndex / MEASUREMENTS_BY_CATEGORY[product.category].length)];
      const currentMeasurement = MEASUREMENTS_BY_CATEGORY[product.category][userState.measurementIndex % MEASUREMENTS_BY_CATEGORY[product.category].length];
      
      if (!userState.currentMeasurements[currentSize]) {
        userState.currentMeasurements[currentSize] = {};
      }
      userState.currentMeasurements[currentSize][currentMeasurement] = measurementValue;
      
      userState.measurementIndex++;
      
      const totalMeasurements = product.sizes.length * MEASUREMENTS_BY_CATEGORY[product.category].length;
      
      if (userState.measurementIndex < totalMeasurements) {
        const nextSize = product.sizes[Math.floor(userState.measurementIndex / MEASUREMENTS_BY_CATEGORY[product.category].length)];
        const nextMeasurement = MEASUREMENTS_BY_CATEGORY[product.category][userState.measurementIndex % MEASUREMENTS_BY_CATEGORY[product.category].length];
        
        bot.sendMessage(chatId, 
          `📏 Замер для размера ${nextSize}\n` +
          `Введите замер ${nextMeasurement} в сантиметрах:`
        );
      } else {
        userState.state = ADD_PRODUCT_STATES.WAITING_IMAGES;
        bot.sendMessage(chatId, 
          '🖼️ Введите пути к изображениям через запятую\n' +
          'Пример: /images/products/shirts/shirt1.jpg, /images/products/shirts/shirt2.jpg'
        );
      }
      break;
      
    case ADD_PRODUCT_STATES.WAITING_IMAGES:
      const imagePaths = text.split(',').map(path => path.trim());
      product.images = imagePaths;
      product.image_url = imagePaths[0]; // Первое изображение как основное
      product.image_alt_texts = imagePaths.map(() => product.name);
      
      userState.state = ADD_PRODUCT_STATES.WAITING_FEATURES;
      bot.sendMessage(chatId, 
        '✨ Введите особенности товара через запятую (или "нет" если не нужны)\n' +
        'Пример: Высокое качество материалов, Удобная посадка, Легкий уход'
      );
      break;
      
    case ADD_PRODUCT_STATES.WAITING_FEATURES:
      if (text.toLowerCase() !== 'нет') {
        product.features = text.split(',').map(feature => feature.trim());
      } else {
        product.features = [];
      }
      userState.state = ADD_PRODUCT_STATES.WAITING_IS_NEW;
      bot.sendMessage(chatId, '🆕 Это новинка?', getYesNoMenu());
      break;
      
    case ADD_PRODUCT_STATES.WAITING_IS_NEW:
      product.is_new = text === '✅ Да';
      product.in_stock = true; // По умолчанию в наличии
      
      userState.state = ADD_PRODUCT_STATES.CONFIRM;
      await showProductPreview(chatId, product);
      break;
      
    case ADD_PRODUCT_STATES.CONFIRM:
      if (text === '✅ Сохранить') {
        await saveProduct(chatId, product);
      } else if (text === '❌ Отменить') {
        userStates.delete(chatId);
        bot.sendMessage(chatId, '❌ Добавление товара отменено.', getMainMenu());
      } else {
        bot.sendMessage(chatId, '❌ Выберите "Сохранить" или "Отменить".');
      }
      break;
  }
  
  userStates.set(chatId, userState);
}

// Показать превью товара
async function showProductPreview(chatId, product) {
  const preview = `
🛍️ *Превью товара:*

📝 *Название:* ${product.name}
💰 *Реальная цена:* ${product.real_price} руб.
🏷️ *Зачеркнутая цена:* ${product.fake_original_price} руб.
📂 *Категория:* ${product.category}
${product.subcategory ? `📁 *Подкатегория:* ${product.subcategory}\n` : ''}
${product.color ? `🎨 *Цвет:* ${product.color}\n` : ''}
🏷️ *Бренд:* ${product.brand}
📝 *Описание:* ${product.description}
📏 *Размеры:* ${product.sizes.join(', ')}
📦 *Остатки:* ${Object.entries(product.stock_quantity).map(([size, qty]) => `${size}: ${qty}`).join(', ')}
🖼️ *Изображения:* ${product.images.length} шт.
${product.features && product.features.length > 0 ? `✨ *Особенности:* ${product.features.join(', ')}\n` : ''}
🆕 *Новинка:* ${product.is_new ? 'Да' : 'Нет'}
  `;
  
  bot.sendMessage(chatId, preview, {
    parse_mode: 'Markdown',
    reply_markup: {
      keyboard: [
        ['✅ Сохранить', '❌ Отменить']
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
}

// Сохранить товар в базу данных
async function saveProduct(chatId, product) {
  try {
    // Сначала сохраняем товар
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
    
    if (error) throw error;
    
    const savedProduct = data[0];
    
    // Затем сохраняем замеры, если они есть
    if (userStates.get(chatId)?.currentMeasurements) {
      const measurements = userStates.get(chatId).currentMeasurements;
      const measurementRecords = [];
      
      for (const [size, values] of Object.entries(measurements)) {
        measurementRecords.push({
          product_id: savedProduct.id,
          size: size,
          measurement_a: values['A'] || null,
          measurement_b: values['B'] || null,
          measurement_c: values['C'] || null,
          measurement_d: values['D'] || null
        });
      }
      
      if (measurementRecords.length > 0) {
        const { error: measurementError } = await supabase
          .from('measurements')
          .insert(measurementRecords);
        
        if (measurementError) {
          console.error('Error saving measurements:', measurementError);
          // Не прерываем процесс, просто логируем ошибку
        }
      }
    }
    
    userStates.delete(chatId);
    bot.sendMessage(chatId, 
      `✅ *Товар успешно добавлен с замерами!*\n\n` +
      `🆔 ID: ${savedProduct.id}\n` +
      `📝 Название: ${product.name}`, 
      { ...getMainMenu(), parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error('Error saving product:', error);
    bot.sendMessage(chatId, 
      `❌ Ошибка при сохранении товара: ${error.message}\n\n` +
      'Попробуйте еще раз.'
    );
  }
}

// Начать редактирование товара
async function startEditProduct(chatId) {
  userStates.set(chatId, {
    action: 'edit_product',
    state: EDIT_PRODUCT_STATES.WAITING_PRODUCT_ID
  });
  
  bot.sendMessage(chatId, 
    '✏️ *Редактирование товара*\n\n' +
    '🆔 Введите ID товара или часть названия для поиска:', 
    { parse_mode: 'Markdown' }
  );
}

// Обработка редактирования товара
async function handleEditProductState(chatId, text, userState) {
  const { state } = userState;
  
  switch (state) {
    case EDIT_PRODUCT_STATES.WAITING_PRODUCT_ID:
      await findAndSelectProduct(chatId, text, userState);
      break;
      
    case EDIT_PRODUCT_STATES.WAITING_FIELD:
      await selectFieldToEdit(chatId, text, userState);
      break;
      
    case EDIT_PRODUCT_STATES.WAITING_VALUE:
      await updateProductField(chatId, text, userState);
      break;
  }
}

// Найти и выбрать товар для редактирования
async function findAndSelectProduct(chatId, searchTerm, userState) {
  try {
    let query = supabase.from('products').select('*');
    
    // Если это UUID, ищем по ID
    if (searchTerm.length === 36 && searchTerm.includes('-')) {
      query = query.eq('id', searchTerm);
    } else {
      // Иначе ищем по названию
      query = query.ilike('name', `%${searchTerm}%`);
    }
    
    const { data, error } = await query.limit(10);
    
    if (error) throw error;
    
    if (data.length === 0) {
      bot.sendMessage(chatId, '❌ Товары не найдены. Попробуйте другой запрос:');
      return;
    }
    
    if (data.length === 1) {
      userState.product = data[0];
      userState.state = EDIT_PRODUCT_STATES.WAITING_FIELD;
      await showEditMenu(chatId, data[0]);
    } else {
      // Показать список найденных товаров
      let message = '📋 *Найденные товары:*\n\n';
      data.forEach((product, index) => {
        message += `${index + 1}. ${product.name} (${product.price} руб.)\n`;
        message += `   ID: \`${product.id}\`\n\n`;
      });
      message += 'Введите точный ID товара для редактирования:';
      
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }
    
    userStates.set(chatId, userState);
  } catch (error) {
    console.error('Error finding product:', error);
    bot.sendMessage(chatId, '❌ Ошибка поиска товара. Попробуйте еще раз.');
  }
}

// Показать меню редактирования
async function showEditMenu(chatId, product) {
  const message = `
✏️ *Редактирование товара:*
📝 ${product.name}

Выберите поле для редактирования:
  `;
  
  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: {
      keyboard: [
        ['📝 Название', '💰 Цена'],
        ['🏷️ Цена со скидкой', '📂 Категория'],
        ['🎨 Цвет', '📝 Описание'],
        ['📏 Размеры', '📦 Остатки'],
        ['✨ Особенности', '🖼️ Изображения'],
        ['🆕 Новинка', '🏷️ Распродажа'],
        ['👁️ Скрыть/Показать', '❌ Отмена']
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
}

// Выбрать поле для редактирования
async function selectFieldToEdit(chatId, fieldName, userState) {
  const fieldMap = {
    '📝 Название': 'name',
    '💰 Цена': 'real_price',
    '🏷️ Зачеркнутая цена': 'fake_original_price',
    '📂 Категория': 'category',
    '🎨 Цвет': 'color',
    '📝 Описание': 'description',
    '📏 Размеры': 'sizes',
    '📦 Остатки': 'stock_quantity',
    '✨ Особенности': 'features',
    '🖼️ Изображения': 'images',
    '🆕 Новинка': 'is_new',
    '👁️ Скрыть/Показать': 'in_stock'
  };
  
  const field = fieldMap[fieldName];
  if (!field) {
    bot.sendMessage(chatId, '❌ Выберите поле из предложенных.');
    return;
  }
  
  userState.editField = field;
  userState.state = EDIT_PRODUCT_STATES.WAITING_VALUE;
  
  let prompt = '';
  const currentValue = userState.product[field];
  
  switch (field) {
    case 'name':
      prompt = `📝 Текущее название: ${currentValue}\nВведите новое название:`;
      break;
    case 'real_price':
      prompt = `💰 Текущая цена: ${currentValue} руб.\nВведите новую цену:`;
      break;
    case 'fake_original_price':
      prompt = `🏷️ Текущая зачеркнутая цена: ${currentValue} руб.\nВведите новую зачеркнутую цену:`;
      break;
    case 'category':
      prompt = `📂 Текущая категория: ${currentValue}\nВыберите новую категорию:`;
      bot.sendMessage(chatId, prompt, getCategoryMenu());
      return;
    case 'color':
      prompt = `🎨 Текущий цвет: ${currentValue || 'не указан'}\nВведите новый цвет:`;
      break;
    case 'description':
      prompt = `📝 Текущее описание: ${currentValue}\nВведите новое описание:`;
      break;
    case 'features':
      prompt = `✨ Текущие особенности: ${currentValue && currentValue.length > 0 ? currentValue.join(', ') : 'не указаны'}\nВведите новые особенности через запятую:`;
      break;
    case 'images':
      prompt = `🖼️ Текущие изображения: ${currentValue && currentValue.length > 0 ? currentValue.length + ' шт.' : 'не указаны'}\nВведите новые пути к изображениям через запятую:`;
      break;
    case 'is_new':
    case 'in_stock':
      const labels = {
        'is_new': 'новинка',
        'in_stock': 'наличие на складе'
      };
      prompt = `Текущее значение (${labels[field]}): ${currentValue ? 'Да' : 'Нет'}\nИзменить на:`;
      bot.sendMessage(chatId, prompt, getYesNoMenu());
      return;
    default:
      prompt = `Введите новое значение для поля ${fieldName}:`;
  }
  
  bot.sendMessage(chatId, prompt);
  userStates.set(chatId, userState);
}

// Обновить поле товара
async function updateProductField(chatId, newValue, userState) {
  try {
    const { product, editField } = userState;
    let processedValue = newValue;
    
    // Обработка значений по типу поля
    switch (editField) {
      case 'real_price':
        processedValue = parseFloat(newValue);
        if (isNaN(processedValue) || processedValue <= 0) {
          bot.sendMessage(chatId, '❌ Введите корректную цену (число больше 0):');
          return;
        }
        break;
        
      case 'fake_original_price':
        processedValue = parseFloat(newValue);
        if (isNaN(processedValue) || processedValue <= 0) {
          bot.sendMessage(chatId, '❌ Введите корректную зачеркнутую цену:');
          return;
        }
        break;
        
      case 'features':
        if (newValue.toLowerCase() === 'удалить' || newValue.toLowerCase() === 'нет') {
          processedValue = [];
        } else {
          processedValue = newValue.split(',').map(feature => feature.trim());
        }
        break;
        
      case 'images':
        processedValue = newValue.split(',').map(path => path.trim());
        // Обновляем также основное изображение
        await supabase
          .from('products')
          .update({ 
            images: processedValue,
            image_url: processedValue[0],
            image_alt_texts: processedValue.map(() => product.name)
          })
          .eq('id', product.id);
        
        userStates.delete(chatId);
        bot.sendMessage(chatId, 
          `✅ *Изображения товара обновлены!*\n\n` +
          `📝 Товар: ${product.name}\n` +
          `🖼️ Количество изображений: ${processedValue.length}`, 
          { ...getMainMenu(), parse_mode: 'Markdown' }
        );
        return;
        
      case 'is_new':
      case 'in_stock':
        processedValue = newValue === '✅ Да';
        break;
    }
    
    // Обновляем товар в базе данных
    const { error } = await supabase
      .from('products')
      .update({ [editField]: processedValue })
      .eq('id', product.id);
    
    if (error) throw error;
    
    userStates.delete(chatId);
    bot.sendMessage(chatId, 
      `✅ *Товар успешно обновлен!*\n\n` +
      `📝 Товар: ${product.name}\n` +
      `🔄 Поле: ${editField}\n` +
      `✨ Новое значение: ${processedValue}`, 
      { ...getMainMenu(), parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    bot.sendMessage(chatId, 
      `❌ Ошибка при обновлении товара: ${error.message}`
    );
  }
}

// Начать скрытие товара
async function startHideProduct(chatId) {
  userStates.set(chatId, {
    action: 'hide_product'
  });
  
  bot.sendMessage(chatId, 
    '👁️ *Управление видимостью товара*\n\n' +
    '🆔 Введите ID товара или часть названия:', 
    { parse_mode: 'Markdown' }
  );
}

// Обработка скрытия товара
async function handleHideProductState(chatId, text, userState) {
  await findAndToggleProductVisibility(chatId, text);
}

// Найти и переключить видимость товара
async function findAndToggleProductVisibility(chatId, searchTerm) {
  try {
    let query = supabase.from('products').select('*');
    
    if (searchTerm.length === 36 && searchTerm.includes('-')) {
      query = query.eq('id', searchTerm);
    } else {
      query = query.ilike('name', `%${searchTerm}%`);
    }
    
    const { data, error } = await query.limit(10);
    
    if (error) throw error;
    
    if (data.length === 0) {
      bot.sendMessage(chatId, '❌ Товары не найдены.');
      return;
    }
    
    if (data.length === 1) {
      const product = data[0];
      const newStatus = !product.in_stock;
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ in_stock: newStatus })
        .eq('id', product.id);
      
      if (updateError) throw updateError;
      
      userStates.delete(chatId);
      bot.sendMessage(chatId, 
        `✅ *Статус товара изменен!*\n\n` +
        `📝 Товар: ${product.name}\n` +
        `👁️ Статус: ${newStatus ? '✅ Показан' : '🙈 Скрыт'}`, 
        { ...getMainMenu(), parse_mode: 'Markdown' }
      );
    } else {
      let message = '📋 *Найденные товары:*\n\n';
      data.forEach((product, index) => {
        const status = product.in_stock ? '✅ Показан' : '🙈 Скрыт';
        message += `${index + 1}. ${product.name} - ${status}\n`;
        message += `   ID: \`${product.id}\`\n\n`;
      });
      message += 'Введите точный ID товара:';
      
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }
  } catch (error) {
    console.error('Error toggling product visibility:', error);
    bot.sendMessage(chatId, '❌ Ошибка при изменении статуса товара.');
  }
}

// Показать список товаров
async function showProductsList(chatId) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, real_price, category, in_stock')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    if (data.length === 0) {
      bot.sendMessage(chatId, '📋 Товары не найдены.');
      return;
    }
    
    let message = '📋 *Список товаров (последние 20):*\n\n';
    data.forEach((product, index) => {
      const status = product.in_stock ? '👁️' : '🙈';
      message += `${index + 1}. ${status} ${product.name}\n`;
      message += `   💰 ${product.real_price} руб. | 📂 ${product.category}\n`;
      message += `   🆔 \`${product.id}\`\n\n`;
    });
    
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error fetching products list:', error);
    bot.sendMessage(chatId, '❌ Ошибка при получении списка товаров.');
  }
}

// Показать статистику
async function showStatistics(chatId) {
  try {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
    
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*');
    
    if (productsError) throw productsError;
    if (ordersError) throw ordersError;
    
    const totalProducts = products.length;
    const visibleProducts = products.filter(p => p.in_stock).length;
    const newProducts = products.filter(p => p.is_new).length;
    
    const totalOrders = orders.length;
    const newOrders = orders.filter(o => o.status === 'new').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    
    // Статистика по промокодам
    const { data: promoCodes } = await supabase
      .from('promo_codes')
      .select('*');
    
    const activePromoCodes = promoCodes ? promoCodes.filter(p => p.is_active).length : 0;
    const totalPromoCodes = promoCodes ? promoCodes.length : 0;
    
    const message = `
📊 *Статистика магазина:*

🛍️ *Товары:*
• Всего товаров: ${totalProducts}
• Видимых: ${visibleProducts}
• Новинок: ${newProducts}


🎫 *Промокоды:*
• Всего промокодов: ${totalPromoCodes}
• Активных: ${activePromoCodes}

📦 *Заказы:*
• Всего заказов: ${totalOrders}
• Новых: ${newOrders}
• Выполненных: ${completedOrders}

💰 *Выручка:*
• Общая выручка: ${totalRevenue.toFixed(2)} руб.
• Средний чек: ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0} руб.
    `;
    
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    bot.sendMessage(chatId, '❌ Ошибка при получении статистики.');
  }
}

// Показать меню промокодов
async function showPromoCodeMenu(chatId) {
  userStates.set(chatId, {
    action: 'promo_menu'
  });
  
  bot.sendMessage(chatId, 
    '🎫 *Управление промокодами*\n\n' +
    'Выберите действие:', 
    { ...getPromoCodeMenu(), parse_mode: 'Markdown' }
  );
}

// Обработка меню промокодов
async function handlePromoMenuState(chatId, text, userState) {
  switch (text) {
    case '➕ Создать промокод':
      await startAddPromoCode(chatId);
      break;
    case '📋 Список промокодов':
      await showPromoCodesList(chatId);
      break;
    case '✏️ Редактировать промокод':
      bot.sendMessage(chatId, '🚧 Функция в разработке');
      break;
    case '🗑️ Удалить промокод':
      bot.sendMessage(chatId, '🚧 Функция в разработке');
      break;
    case '❌ Назад в главное меню':
      userStates.delete(chatId);
      bot.sendMessage(chatId, '✅ Возврат в главное меню.', getMainMenu());
      break;
    default:
      bot.sendMessage(chatId, '❌ Выберите действие из меню.', getPromoCodeMenu());
  }
}

// Начать создание промокода
async function startAddPromoCode(chatId) {
  userStates.set(chatId, {
    action: 'add_promo',
    state: PROMO_CODE_STATES.WAITING_CODE,
    promo: {}
  });
  
  bot.sendMessage(chatId, 
    '➕ *Создание промокода*\n\n' +
    '🏷️ Введите код промокода (например: SHIRTS10):', 
    { parse_mode: 'Markdown' }
  );
}

// Обработка создания промокода
async function handleAddPromoState(chatId, text, userState) {
  const { state, promo } = userState;
  
  switch (state) {
    case PROMO_CODE_STATES.WAITING_CODE:
      promo.code = text.toUpperCase();
      userState.state = PROMO_CODE_STATES.WAITING_NAME;
      bot.sendMessage(chatId, '📝 Введите название промокода:');
      break;
      
    case PROMO_CODE_STATES.WAITING_NAME:
      promo.name = text;
      userState.state = PROMO_CODE_STATES.WAITING_DESCRIPTION;
      bot.sendMessage(chatId, '📄 Введите описание промокода:');
      break;
      
    case PROMO_CODE_STATES.WAITING_DESCRIPTION:
      promo.description = text;
      userState.state = PROMO_CODE_STATES.WAITING_DISCOUNT_TYPE;
      bot.sendMessage(chatId, '💰 Выберите тип скидки:', getDiscountTypeMenu());
      break;
      
    case PROMO_CODE_STATES.WAITING_DISCOUNT_TYPE:
      if (text === '📊 Процент (%)') {
        promo.discount_type = 'percentage';
        userState.state = PROMO_CODE_STATES.WAITING_DISCOUNT_VALUE;
        bot.sendMessage(chatId, '📊 Введите размер скидки в процентах (например: 10):');
      } else if (text === '💰 Фиксированная сумма (руб.)') {
        promo.discount_type = 'fixed_amount';
        userState.state = PROMO_CODE_STATES.WAITING_DISCOUNT_VALUE;
        bot.sendMessage(chatId, '💰 Введите размер скидки в рублях (например: 500):');
      } else {
        bot.sendMessage(chatId, '❌ Выберите тип скидки из предложенных:', getDiscountTypeMenu());
        return;
      }
      break;
      
    case PROMO_CODE_STATES.WAITING_DISCOUNT_VALUE:
      const discountValue = parseFloat(text);
      if (isNaN(discountValue) || discountValue <= 0) {
        bot.sendMessage(chatId, '❌ Введите корректное значение скидки (число больше 0):');
        return;
      }
      if (promo.discount_type === 'percentage' && discountValue > 100) {
        bot.sendMessage(chatId, '❌ Процент скидки не может быть больше 100:');
        return;
      }
      promo.discount_value = discountValue;
      userState.state = PROMO_CODE_STATES.WAITING_MIN_ORDER;
      bot.sendMessage(chatId, '📦 Введите минимальную сумму заказа (или 0 если нет ограничения):');
      break;
      
    case PROMO_CODE_STATES.WAITING_MIN_ORDER:
      const minOrder = parseFloat(text);
      if (isNaN(minOrder) || minOrder < 0) {
        bot.sendMessage(chatId, '❌ Введите корректную минимальную сумму (число >= 0):');
        return;
      }
      promo.min_order_amount = minOrder;
      userState.state = PROMO_CODE_STATES.WAITING_MIN_ITEMS;
      bot.sendMessage(chatId, '🛍️ Введите минимальное количество товаров (по умолчанию 1):');
      break;
      
    case PROMO_CODE_STATES.WAITING_MIN_ITEMS:
      const minItems = parseInt(text);
      if (isNaN(minItems) || minItems < 1) {
        bot.sendMessage(chatId, '❌ Введите корректное количество товаров (число >= 1):');
        return;
      }
      promo.min_items_count = minItems;
      userState.state = PROMO_CODE_STATES.WAITING_CATEGORIES;
      bot.sendMessage(chatId, 
        '📂 Выберите категории товаров (через запятую на английском) или "все" для всех категорий:\n' +
        'Доступные: ' + CATEGORIES.join(', ')
      );
      break;
      
    case PROMO_CODE_STATES.WAITING_CATEGORIES:
      if (text.toLowerCase() === 'все') {
        promo.categories = [];
      } else {
        const categories = text.split(',').map(cat => cat.trim().toLowerCase());
        const validCategories = categories.filter(cat => CATEGORIES.includes(cat));
        if (validCategories.length === 0) {
          bot.sendMessage(chatId, '❌ Введите корректные категории из списка или "все":');
          return;
        }
        promo.categories = validCategories;
      }
      userState.state = PROMO_CODE_STATES.WAITING_MAX_USES;
      bot.sendMessage(chatId, '🔢 Введите максимальное количество использований (или "без ограничений"):');
      break;
      
    case PROMO_CODE_STATES.WAITING_MAX_USES:
      if (text.toLowerCase() === 'без ограничений') {
        promo.max_uses = null;
      } else {
        const maxUses = parseInt(text);
        if (isNaN(maxUses) || maxUses < 1) {
          bot.sendMessage(chatId, '❌ Введите корректное количество или "без ограничений":');
          return;
        }
        promo.max_uses = maxUses;
      }
      userState.state = PROMO_CODE_STATES.WAITING_VALID_UNTIL;
      bot.sendMessage(chatId, '📅 Введите дату окончания действия (в формате ДД.ММ.ГГГГ):');
      break;
      
    case PROMO_CODE_STATES.WAITING_VALID_UNTIL:
      const dateMatch = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
      if (!dateMatch) {
        bot.sendMessage(chatId, '❌ Введите дату в формате ДД.ММ.ГГГГ (например: 31.12.2024):');
        return;
      }
      
      const [, day, month, year] = dateMatch;
      const validUntil = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      if (validUntil <= new Date()) {
        bot.sendMessage(chatId, '❌ Дата должна быть в будущем:');
        return;
      }
      
      promo.valid_until = validUntil.toISOString();
      promo.current_uses = 0;
      promo.is_active = true;
      
      userState.state = PROMO_CODE_STATES.CONFIRM;
      await showPromoCodePreview(chatId, promo);
      break;
      
    case PROMO_CODE_STATES.CONFIRM:
      if (text === '✅ Сохранить') {
        await savePromoCode(chatId, promo);
      } else if (text === '❌ Отменить') {
        userStates.delete(chatId);
        bot.sendMessage(chatId, '❌ Создание промокода отменено.', getPromoCodeMenu());
      } else {
        bot.sendMessage(chatId, '❌ Выберите "Сохранить" или "Отменить".');
      }
      break;
  }
  
  userStates.set(chatId, userState);
}

// Показать превью промокода
async function showPromoCodePreview(chatId, promo) {
  const discountText = promo.discount_type === 'percentage' 
    ? `${promo.discount_value}%` 
    : `${promo.discount_value} руб.`;
    
  const categoriesText = promo.categories.length === 0 
    ? 'Все товары' 
    : promo.categories.join(', ');
    
  const maxUsesText = promo.max_uses === null 
    ? 'Без ограничений' 
    : promo.max_uses.toString();
  
  const preview = `
🎫 *Превью промокода:*

🏷️ *Код:* ${promo.code}
📝 *Название:* ${promo.name}
📄 *Описание:* ${promo.description}
💰 *Скидка:* ${discountText}
📦 *Минимальная сумма:* ${promo.min_order_amount} руб.
🛍️ *Минимум товаров:* ${promo.min_items_count} шт.
📂 *Категории:* ${categoriesText}
🔢 *Максимум использований:* ${maxUsesText}
📅 *Действует до:* ${new Date(promo.valid_until).toLocaleDateString('ru-RU')}
  `;
  
  bot.sendMessage(chatId, preview, {
    parse_mode: 'Markdown',
    reply_markup: {
      keyboard: [
        ['✅ Сохранить', '❌ Отменить']
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
}

// Сохранить промокод
async function savePromoCode(chatId, promo) {
  try {
    const { data, error } = await supabase
      .from('promo_codes')
      .insert([promo])
      .select();
    
    if (error) throw error;
    
    userStates.delete(chatId);
    bot.sendMessage(chatId, 
      `✅ *Промокод успешно создан!*\n\n` +
      `🏷️ Код: ${promo.code}\n` +
      `📝 Название: ${promo.name}`, 
      { ...getPromoCodeMenu(), parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error('Error saving promo code:', error);
    bot.sendMessage(chatId, 
      `❌ Ошибка при сохранении промокода: ${error.message}\n\n` +
      'Попробуйте еще раз.'
    );
  }
}

// Показать список промокодов
async function showPromoCodesList(chatId) {
  try {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    if (data.length === 0) {
      bot.sendMessage(chatId, '🎫 Промокоды не найдены.');
      return;
    }
    
    let message = '🎫 *Список промокодов (последние 10):*\n\n';
    data.forEach((promo, index) => {
      const status = promo.is_active ? '✅' : '❌';
      const discountText = promo.discount_type === 'percentage' 
        ? `${promo.discount_value}%` 
        : `${promo.discount_value} руб.`;
      
      message += `${index + 1}. ${status} ${promo.code} (-${discountText})\n`;
      message += `   📝 ${promo.name}\n`;
      message += `   📅 До ${new Date(promo.valid_until).toLocaleDateString('ru-RU')}\n`;
      message += `   🔢 Использований: ${promo.current_uses}${promo.max_uses ? `/${promo.max_uses}` : ''}\n\n`;
    });
    
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error fetching promo codes list:', error);
    bot.sendMessage(chatId, '❌ Ошибка при получении списка промокодов.');
  }
}

// Обработка ошибок
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('🤖 Telegram Admin Bot запущен!');