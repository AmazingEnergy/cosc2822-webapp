import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    addItemToCartAPI,
    removeItemFromCartAPI,
    updateItemQuantityAPI,
    payCartAPI,
    submitCartAPI,
  } from '../../apis/cart.api.js';

const loadCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    return JSON.parse(savedCart);
  }
  return {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
  };
};

export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async ({ cartId, newItem }, { rejectWithValue }) => {
    try {
      return await addItemToCartAPI(cartId, newItem);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  'cart/removeItem',
  async ({ cartId, itemId }, { rejectWithValue }) => {
    try {
      return await removeItemFromCartAPI(cartId, itemId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  'cart/updateItem',
  async ({ cartId, skuId, change }, { rejectWithValue }) => {
    try {
      return await updateItemQuantityAPI(cartId, skuId, change);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const payCart = createAsyncThunk(
  'cart/pay',
  async ({ cartId, paymentDetails }, { rejectWithValue }) => {
    try {
      return await payCartAPI(cartId, paymentDetails);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const submitCart = createAsyncThunk(
  'cart/submit',
  async ({ cartId }, { rejectWithValue }) => {
    try {
      return await submitCartAPI(cartId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cart');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCart.fulfilled, (state, action) => {
        const { items, totalQuantity, totalPrice } = action.payload;
        state.items = items;
        state.totalQuantity = totalQuantity;
        state.totalPrice = totalPrice;
        localStorage.setItem('cart', JSON.stringify(state));
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        const { items, totalQuantity, totalPrice } = action.payload;
        state.items = items;
        state.totalQuantity = totalQuantity;
        state.totalPrice = totalPrice;
        localStorage.setItem('cart', JSON.stringify(state));
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        const { items, totalQuantity, totalPrice } = action.payload;
        state.items = items;
        state.totalQuantity = totalQuantity;
        state.totalPrice = totalPrice;
        localStorage.setItem('cart', JSON.stringify(state));
      })
      .addCase(payCart.fulfilled, (state) => {
        state.items = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
        localStorage.removeItem('cart');
      })
      .addCase(submitCart.fulfilled, (state, action) => {
        const { items, totalQuantity, totalPrice } = action.payload;
        state.items = items;
        state.totalQuantity = totalQuantity;
        state.totalPrice = totalPrice;
        localStorage.setItem('cart', JSON.stringify(state));
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
