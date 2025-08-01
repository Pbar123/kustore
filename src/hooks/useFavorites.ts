import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';

export function useFavorites() {
  const { state: authState } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setFavoriteIds(new Set());
      setLoading(false);
    }
  }, [authState.isAuthenticated, authState.user]);

  const fetchFavorites = async () => {
    if (!authState.user) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching favorites for user:', authState.user.telegram_id);

      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          product_id,
          created_at,
          products (*)
        `)
        .eq('user_id', authState.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Favorites data:', data);

      const favoriteProducts = data?.map(item => item.products).filter(Boolean) || [];
      const ids = new Set(favoriteProducts.map(product => product.id));

      setFavorites(favoriteProducts);
      setFavoriteIds(ids);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId: string) => {
    if (!authState.isAuthenticated || !authState.user) {
      setError('Необходимо войти в систему');
      return false;
    }

    try {
      console.log('Adding to favorites:', { userId: authState.user.id, productId });

      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: authState.user.id,
          product_id: productId
        });

      if (error) {
        // Если это ошибка дублирования, просто игнорируем
        if (error.code === '23505') {
          setError('Товар уже в избранном');
          return false;
        }
        console.error('Error adding to favorites:', error);
        throw error;
      }

      console.log('Successfully added to favorites');

      // Обновляем локальное состояние
      setFavoriteIds(prev => new Set([...prev, productId]));
      
      // Перезагружаем избранное для получения полной информации о товаре
      await fetchFavorites();
      
      return true;
    } catch (err) {
      console.error('Error adding to favorites:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при добавлении в избранное';
      setError(errorMessage);
      return false;
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!authState.user) {
      setError('Необходимо войти в систему');
      return false;
    }

    try {
      console.log('Removing from favorites:', { userId: authState.user.id, productId });

      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', authState.user.id)
        .eq('product_id', productId);

      if (error) throw error;

      console.log('Successfully removed from favorites');

      // Обновляем локальное состояние
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      
      setFavorites(prev => prev.filter(product => product.id !== productId));
      
      return true;
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при удалении из избранного');
      return false;
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (favoriteIds.has(productId)) {
      return await removeFromFavorites(productId);
    } else {
      return await addToFavorites(productId);
    }
  };

  const isFavorite = (productId: string) => {
    return favoriteIds.has(productId);
  };

  return {
    favorites,
    favoriteIds,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    refetch: fetchFavorites
  };
}