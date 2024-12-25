import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addItemToCartAPI,
  removeItemFromCartAPI,
  updateItemQuantityAPI,
  //payCartAPI,
  submitCartAPI,
  getCartAPI,
} from '../../apis/cart.api.js';

// Initial State
const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  cartId: null,
  status: 'idle',
  error: null,
};

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      console.log('Clearing cart...');
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.cartId = null;
      state.status = 'idle';
      localStorage.removeItem('cartId');
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Item to Cart
      .addCase(addItemToCart.pending, (state) => {
        //console.log('Adding item to cart...');
        state.status = 'loading';
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        //console.log('Item added to cart:', action.payload);
        const cartItems = action.payload || [];
        state.items = cartItems;
        const totals = calculateCartTotals(cartItems);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
        state.status = 'succeeded';
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        console.error('Failed to add item to cart:', action.payload);
        state.error = action.payload;
        state.status = 'failed';
      })

      // Remove Item from Cart
      .addCase(removeItemFromCart.pending, (state) => {
        console.log('Removing item from cart...');
        state.status = 'loading';
      })

      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        console.log('Item removed from cart:', action.payload);
        const cartItems = action.payload || []; // Ensure this is the updated cart items
        state.items = cartItems; // Update the items with the new cart items
        const totals = calculateCartTotals(cartItems);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
        state.status = 'succeeded';
      })

      .addCase(removeItemFromCart.rejected, (state, action) => {
        console.error('Failed to remove item from cart:', action.payload);
        state.error = action.payload;
        state.status = 'failed';
      })

      // Update Item Quantity
      .addCase(updateItemQuantity.pending, (state) => {
        console.log('Updating item quantity...');
        state.status = 'loading';
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        //console.log('Item quantity updated:', action.payload);
        const cartItems = action.payload || [];
        state.items = cartItems; // Update the items with the new cart items
        const totals = calculateCartTotals(cartItems);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
        state.status = 'succeeded';
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        console.error('Failed to update item quantity:', action.payload);
        state.error = action.payload;
        state.status = 'failed';
      })
      // // Pay Cart
      // .addCase(payCart.pending, (state) => {
      //   console.log('Processing payment...');
      //   state.status = 'loading';
      // })
      // .addCase(payCart.fulfilled, (state) => {
      //   console.log('Payment processed successfully.');
      //   state.items = [];
      //   state.totalQuantity = 0;
      //   state.totalPrice = 0;
      //   state.cartId = null;
      //   state.status = 'succeeded';
      //   localStorage.removeItem('cartId');
      // })
      // .addCase(payCart.rejected, (state, action) => {
      //   console.error('Failed to process payment:', action.payload);
      //   state.error = action.payload;
      //   state.status = 'failed';
      // })
      // Submit Cart
      .addCase(submitCart.pending, (state) => {
        console.log('Submitting cart...');
        state.status = 'loading';
      })
      .addCase(submitCart.fulfilled, (state, action) => {
        // Handle successful submission
        //console.log('Cart submitted successfully:', action.payload);
        state.items = []; // Clear items after successful submission
        state.totalQuantity = 0;
        state.totalPrice = 0;
        state.status = 'succeeded';
      })
      .addCase(submitCart.rejected, (state, action) => {
        console.error('Failed to submit cart:', action.payload);
        state.error = action.payload;
        state.status = 'failed';
      })
      // Load Cart from API
      .addCase(loadCartFromAPI.pending, (state) => {
        //console.log('Loading cart from API...');
        state.status = 'loading';
      })

      .addCase(loadCartFromAPI.fulfilled, (state, action) => {
        const cartItems = Array.isArray(action.payload) ? action.payload : []; 
        //console.log('Cart items loaded from API:', cartItems);
        state.items = cartItems;
        const totals = calculateCartTotals(cartItems);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
        state.cartId = localStorage.getItem('cartId');
        state.status = 'succeeded';
      })
      .addCase(loadCartFromAPI.rejected, (state, action) => {
        console.error('Failed to load cart from API:', action.payload);
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

// Export Actions and Reducer
export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Async Thunks
export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async ({ cartId, newItem }, { rejectWithValue }) => {
    try {
      const response = await addItemToCartAPI(cartId, newItem);
      //console.log('Response from addItemToCartAPI:', response);

      if (!response || !response.cartItems) {
        throw new Error('Invalid response structure: cartItems not found');
      }

      return response.cartItems; 
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const removeItemFromCart = createAsyncThunk(
  'cart/removeItem',
  async ({ cartId, itemId }, { rejectWithValue }) => {
    try {
      const response = await removeItemFromCartAPI(cartId, itemId);
      return response; 
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ cartId, skuId, quantity }, { rejectWithValue }) => {
    try {
      const response = await updateItemQuantityAPI(cartId, skuId, quantity);
      
      // Check if response has the expected structure
      if (!response || !Array.isArray(response.cartItems)) {
        throw new Error('Invalid response structure: cartItems is not an array');
      }

      return response.cartItems; // Return the updated cart items
    } catch (error) {
      console.error('Error updating item quantity:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// export const payCart = createAsyncThunk(
//   'cart/pay',
//   async ({ cartId, paymentDetails }, { rejectWithValue }) => {
//     try {
//       const response = await payCartAPI(cartId, paymentDetails);
//       return response.data;
//     } catch (error) {
//       console.error('Error processing payment:', error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

export const submitCart = createAsyncThunk(
  'cart/submitCart',
  async ({ cartId, contactName, email, address, contactPhone }, { rejectWithValue }) => {
    try {
      const response = await submitCartAPI(cartId, { contactName, email, address, contactPhone });
      return response; // Return the response data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loadCartFromAPI = createAsyncThunk(
  'cart/loadCart',
  async (_, { rejectWithValue }) => {
    try {
      const cartId = localStorage.getItem('cartId');
      if (!cartId) {
        throw new Error('No cartId found in localStorage');
      }
      const response = await getCartAPI(cartId);
      //console.log('API Response:', response); 

      if (!response || !Array.isArray(response.cartItems)) {
        throw new Error('Invalid response structure: cartItems is not an array');
      }

      return response.cartItems; 
    } catch (error) {
      console.error('Error loading cart from API:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const calculateCartTotals = (cartItems) => {
  if (!Array.isArray(cartItems)) {
    console.error('Expected cartItems to be an array, but got:', cartItems);
    return { totalQuantity: 0, totalPrice: 0 };
  }

  const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  const totalPrice = cartItems.reduce((total, item) => {
    const price = parseFloat(item.productPrice) || 0;
    const quantity = parseInt(item.quantity, 10) || 0;
    return total + price * quantity;
  }, 0);

  return { totalQuantity, totalPrice };
};