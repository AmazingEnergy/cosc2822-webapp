import { createSlice } from '@reduxjs/toolkit';

// Load the cart from localStorage (if available)
const loadCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    return JSON.parse(savedCart); // If found, parse and return it
  }
  return {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
  }; // Return initial state if no cart is saved
};

const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.skuId === newItem.skuId);
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }

      state.totalQuantity += newItem.quantity;
      state.totalPrice += newItem.price * newItem.quantity;

      // Save the updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeItem(state, action) {
      const itemId = action.payload;
      const existingItem = state.items.find(item => item.skuId === itemId);

      if (existingItem) {
        state.items = state.items.filter(item => item.skuId !== itemId);
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.price * existingItem.quantity;
      }

      // Save the updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    updateItemQuantity(state, action) {
      const { skuId, change } = action.payload;
      const existingItem = state.items.find(item => item.skuId === skuId);

      if (existingItem) {
        existingItem.quantity += change;
        existingItem.quantity = Math.max(existingItem.quantity, 1); // Ensure quantity doesn't go below 1
        state.totalQuantity += change;
        state.totalPrice += existingItem.price * change;
      }

      // Save the updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;

      // Clear cart data from localStorage
      localStorage.removeItem('cart');
    }
  }
});

export const { addItem, removeItem, updateItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
