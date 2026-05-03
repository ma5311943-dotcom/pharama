"use client";

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '@/redux/slices/cartSlice';

export default function CartSync() {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (user?._id) {
        try {
          const res = await fetch(`/api/cart?userId=${user._id}`);
          const data = await res.json();
          if (data.success && data.data.items.length > 0) {
            dispatch(setCart({
              items: data.data.items,
              totalAmount: data.data.totalAmount
            }));
          }
        } catch (error) {
          console.error('Failed to sync cart from DB:', error);
        }
      }
    };
    fetchCart();
  }, [user?._id, dispatch]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

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
