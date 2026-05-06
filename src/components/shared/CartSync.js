"use client";

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '@/redux/slices/cartSlice';

export default function CartSync() {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const isInitialMount = useRef(true);

  // Load cart from DB or LocalStorage on mount
  useEffect(() => {
    const initCart = async () => {
      // 1. Try to load from DB if user is logged in
      if (user?._id) {
        try {
          const res = await fetch(`/api/cart?userId=${user._id}`);
          const data = await res.json();
          if (data.success && data.data.items.length > 0) {
            dispatch(setCart({
              items: data.data.items,
              totalAmount: data.data.totalAmount
            }));
            return; // Exit after successful DB load
          }
        } catch (error) {
          console.error('Failed to sync cart from DB:', error);
        }
      }

      // 2. If guest or DB was empty, try to load from LocalStorage
      const savedCart = localStorage.getItem('pharma_cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (parsedCart.items && parsedCart.items.length > 0) {
            dispatch(setCart(parsedCart));
          }
        } catch (e) {
          console.error('Failed to parse saved cart:', e);
        }
      }
    };

    initCart();
  }, [user?._id, dispatch]);

  // Save to DB and LocalStorage whenever items change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Always save to LocalStorage for persistence
    localStorage.setItem('pharma_cart', JSON.stringify({ items, totalAmount }));

    const syncToDB = async () => {
      if (user?._id) {
        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user._id,
              items,
              totalAmount
            })
          });
        } catch (error) {
          console.error('Failed to sync cart to DB:', error);
        }
      }
    };

    const timer = setTimeout(() => {
      syncToDB();
    }, 1000);

    return () => clearTimeout(timer);
  }, [items, totalAmount, user?._id]);

  return null;
}
