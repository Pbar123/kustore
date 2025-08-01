# 🗂️ Подробная настройка Supabase Storage

## 📋 Пошаговая инструкция с скриншотами

### Шаг 1: Откройте панель Supabase
1. Перейдите на https://supabase.com/dashboard
2. Выберите ваш проект
3. В левом меню найдите **"Storage"** и нажмите на него

### Шаг 2: Создайте bucket
1. Нажмите зеленую кнопку **"New bucket"**
2. Заполните форму:
   ```
   Name: product-images
   Public bucket: ✅ (ОБЯЗАТЕЛЬНО включить!)
   File size limit: 10 MB
   Allowed MIME types: оставить пустым (разрешит все типы)
   ```
3. Нажмите **"Create bucket"**

### Шаг 3: Настройте политики безопасности

#### 3.1 Перейдите в раздел политик
1. В левом меню нажмите **"Authentication"**
2. Затем нажмите **"Policies"**
3. Найдите таблицу **"storage.objects"**
4. Нажмите **"New Policy"**

#### 3.2 Создайте политику для чтения (PUBLIC READ)
1. Выберите **"For full customization"**
2. Заполните форму:
   ```
   Policy name: Public read access
   Allowed operation: SELECT
   Target roles: public
   ```
3. В поле **"USING expression"** вставьте:
   ```sql
   bucket_id = 'product-images'
   ```
4. Нажмите **"Review"** → **"Save policy"**

#### 3.3 Создайте политику для загрузки (AUTHENTICATED INSERT)
1. Снова нажмите **"New Policy"**
2. Выберите **"For full customization"**
3. Заполните форму:
   ```
   Policy name: Authenticated users can upload
   Allowed operation: INSERT
   Target roles: authenticated
   ```
4. В поле **"WITH CHECK expression"** вставьте:
   ```sql
   bucket_id = 'product-images'
   ```
5. Нажмите **"Review"** → **"Save policy"**

#### 3.4 Создайте политику для удаления (AUTHENTICATED DELETE)
1. Снова нажмите **"New Policy"**
2. Выберите **"For full customization"**
3. Заполните форму:
   ```
   Policy name: Authenticated users can delete
   Allowed operation: DELETE
   Target roles: authenticated
   ```
4. В поле **"USING expression"** вставьте:
   ```sql
   bucket_id = 'product-images'
   ```
5. Нажмите **"Review"** → **"Save policy"**

### Шаг 4: Проверьте настройки

#### 4.1 Проверьте bucket
1. Вернитесь в **"Storage"**
2. Вы должны увидеть bucket **"product-images"**
3. Рядом с ним должна быть иконка 🌐 (означает публичный)

#### 4.2 Проверьте политики
1. Перейдите в **"Authentication"** → **"Policies"**
2. В таблице **"storage.objects"** должно быть 3 политики:
   - ✅ Public read access (SELECT)
   - ✅ Authenticated users can upload (INSERT)  
   - ✅ Authenticated users can delete (DELETE)

### Шаг 5: Тестирование

#### 5.1 Получите URL для тестирования
Ваши изображения будут доступны по адресу:
```
https://ВАША_ССЫЛКА.supabase.co/storage/v1/object/public/product-images/ПУТЬ_К_ФАЙЛУ
```

#### 5.2 Проверьте в браузере
1. Загрузите тестовое изображение через админ-панель
2. Скопируйте полученный URL
3. Откройте URL в новой вкладке
4. Изображение должно открыться без ошибок

## ❌ Частые ошибки и решения

### Ошибка: "Row Level Security policy violation"
**Причина:** Неправильно настроены политики
**Решение:** 
1. Проверьте, что bucket публичный (🌐)
2. Убедитесь, что политика SELECT существует для роли `public`
3. Проверьте правильность условия `bucket_id = 'product-images'`

### Ошибка: "Bucket not found"
**Причина:** Bucket не создан или неправильное имя
**Решение:**
1. Создайте bucket с именем `product-images`
2. Проверьте правильность имени в коде

### Ошибка: "File too large"
**Причина:** Файл превышает лимит
**Решение:**
1. Уменьшите размер файла
2. Или увеличьте лимит в настройках bucket

### Ошибка: "Invalid file type"
**Причина:** Неподдерживаемый тип файла
**Решение:**
1. Используйте только изображения (JPG, PNG, WebP, GIF)
2. Проверьте настройки MIME types в bucket

## 🎯 Готово!

После выполнения всех шагов у вас будет:
- ✅ Публичный bucket для изображений
- ✅ Политики безопасности
- ✅ Возможность загружать изображения через админ-панель
- ✅ Прямые ссылки на изображения без CORS проблем

Все изображения будут доступны по прямым ссылкам и будут быстро загружаться через CDN Supabase!