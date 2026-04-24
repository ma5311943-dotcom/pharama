import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    totalQuantity: 0,
  },
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === (newItem._id || newItem.id));
      const price = Number(newItem.price) || 0;
      state.totalQuantity++;

      if (!existingItem) {
        state.items.push({
          id: newItem._id || newItem.id,
          name: newItem.name,
          price: price,
          quantity: 1,
          totalPrice: price,
          image: newItem.image,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = Number(existingItem.totalPrice) + price;
      }
      state.totalAmount = state.items.reduce((total, item) => total + Number(item.totalPrice), 0);
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (!existingItem) return;

      const price = Number(existingItem.price) || 0;
      state.totalQuantity--;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = Number(existingItem.totalPrice) - price;
      }
      state.totalAmount = state.items.reduce((total, item) => total + Number(item.totalPrice), 0);
    },
    setCart(state, action) {
      state.items = action.payload.items?.map(item => ({
        ...item,
        price: Number(item.price) || 0,
        totalPrice: (Number(item.price) || 0) * (Number(item.quantity) || 1)
      })) || [];
      state.totalAmount = state.items.reduce((total, item) => total + Number(item.totalPrice), 0);
      state.totalQuantity = state.items.reduce((q, item) => q + (Number(item.quantity) || 0), 0);
    },
    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },
  },
});

export const { addItemToCart, removeItemFromCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
