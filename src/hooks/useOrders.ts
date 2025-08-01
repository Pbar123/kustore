import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

export function useOrders() {
  const { state: authState } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [authState.isAuthenticated, authState.user]);

  const fetchOrders = async () => {
    if (!authState.user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', authState.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  const getActiveOrders = () => {
    const activeStatuses: Order['status'][] = ['new', 'confirmed', 'paid', 'shipped'];
    return orders.filter(order => activeStatuses.includes(order.status));
  };

  const getCompletedOrders = () => {
    return orders.filter(order => order.status === 'delivered');
  };

  const getCancelledOrders = () => {
    return orders.filter(order => order.status === 'cancelled');
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return {
    orders,
    loading,
    error,
    getOrdersByStatus,
    getActiveOrders,
    getCompletedOrders,
    getCancelledOrders,
    getOrderById,
    refetch: fetchOrders
  };
}