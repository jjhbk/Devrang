"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Customer, CartItem, Booking, BookingStatus, Product } from '../types';
import { MOCK_CUSTOMERS } from '../constants';

interface AppContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  updateCartItem: (productId: string, quantity: number, customPrice?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addCustomer = useCallback((customerData: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = { ...customerData, id: `cust_${Date.now()}` };
    setCustomers(prev => [...prev, newCustomer]);
  }, []);

  const updateCustomer = useCallback((updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  }, []);

  const deleteCustomer = useCallback((customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  }, []);

  const addToCart = useCallback((product: Product, quantity: number) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const updateCartItem = useCallback((productId: string, quantity: number, customPrice?: number) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity, customPrice: customPrice !== undefined ? customPrice : item.customPrice }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);
  
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const addBooking = useCallback((bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking_${Date.now()}`,
      createdAt: new Date(),
      paymentLink: bookingData.customer !== 'self' ? `https://pay.example.com/link_${Date.now()}` : undefined
    };
    setBookings(prev => [newBooking, ...prev]);
  }, []);


  return (
    <AppContext.Provider value={{
      customers, addCustomer, updateCustomer, deleteCustomer,
      cart, addToCart, updateCartItem, removeFromCart, clearCart,
      bookings, addBooking
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
