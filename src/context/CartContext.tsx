import React, { createContext, useContext, useReducer } from 'react';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size: string } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; size: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size } = action.payload;
      
      // Check stock availability
      const stockQuantity = product.stock_quantity?.[size] || 0;
      const currentCartQuantity = state.items.find(
        item => item.product.id === product.id && item.size === size
      )?.quantity || 0;
      
      if (currentCartQuantity >= stockQuantity) {
        // Don't add if we've reached stock limit
        return state;
      }

      const existingItem = state.items.find(
        item => item.product.id === product.id && item.size === size
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > stockQuantity) {
          // Don't exceed stock quantity
          return state;
        }
        
        const updatedItems = state.items.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: newQuantity }
            : item
        );
        const total = updatedItems.reduce((sum, item) => {
          return sum + item.product.real_price * item.quantity;
        }, 0);
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        return { items: updatedItems, total, itemCount };
      }

      const newItems = [...state.items, { product, size, quantity: 1 }];
      const total = newItems.reduce((sum, item) => {
        return sum + item.product.real_price * item.quantity;
      }, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      return { items: newItems, total, itemCount };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(
        item => !(item.product.id === action.payload.productId && item.size === action.payload.size)
      );
      const total = updatedItems.reduce((sum, item) => {
        return sum + item.product.real_price * item.quantity;
      }, 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      return { items: updatedItems, total, itemCount };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, size, quantity } = action.payload;
      
      // Find the product to check stock
      const item = state.items.find(item => item.product.id === productId && item.size === size);
      if (!item) return state;
      
      const stockQuantity = item.product.stock_quantity?.[size] || 0;
      const finalQuantity = Math.min(quantity, stockQuantity);
      
      const updatedItems = state.items.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity: finalQuantity }
          : item
      );
      const total = updatedItems.reduce((sum, item) => {
        return sum + item.product.real_price * item.quantity;
      }, 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      return { items: updatedItems, total, itemCount };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}