# 🗂️ Настройка Supabase Storage

## 📋 Пошаговая инструкция

### 1. **Откройте панель Supabase**
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID
```

### 2. **Перейдите в Storage**
- В левом меню нажмите **"Storage"**
- Нажмите **"Create a new bucket"**

### 3. **Создайте bucket для изображений**
```
Bucket name: product-images
Public bucket: ✅ (включить)
File size limit: 10MB
Allowed MIME types: image/*
```

### 4. **Настройте RLS политики**
Перейдите в **"Policies"** и создайте политики:

#### Политика для чтения (всем пользователям):
```sql
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
```

#### Политика для загрузки (только аутентифицированным):
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

#### Политика для удаления (только аутентифицированным):
```sql
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

### 5. **Проверьте настройки**
- Bucket должен быть **публичным**
- Политики должны быть **активными**
- URL должен выглядеть как: `https://your-project.supabase.co/storage/v1/object/public/product-images/...`

## 🧪 Тестирование

### 1. **Откройте админ-панель**
```
http://localhost:5173/admin
```

### 2. **Попробуйте загрузить изображение**
- Перетащите файл в область загрузки
- Или нажмите для выбора файла

### 3. **Проверьте в консоли**
Должны появиться логи:
```
Uploading to Supabase Storage: products/1234567890-abc123.jpg
Upload successful: { path: "products/1234567890-abc123.jpg" }
Generated public URL: https://your-project.supabase.co/storage/v1/object/public/product-images/products/1234567890-abc123.jpg
```

## ❌ Возможные ошибки

### "Row Level Security policy violation"
**Решение:** Проверьте RLS политики в Storage > Policies

### "Bucket not found"
**Решение:** Создайте bucket с именем `product-images`

### "File too large"
**Решение:** Уменьшите размер файла до 10MB или измените лимит в bucket

### "Invalid file type"
**Решение:** Используйте только изображения (JPG, PNG, WebP, GIF)

## 🎯 Готово!

После настройки вы сможете:
- ✅ Загружать изображения через админ-панель
- ✅ Получать прямые ссылки на изображения
- ✅ Автоматически оптимизировать изображения
- ✅ Использовать CDN для быстрой загрузки

Все изображения будут доступны по прямым ссылкам без CORS проблем!