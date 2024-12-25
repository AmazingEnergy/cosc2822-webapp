import axios from 'axios';

const API_BASE_URL = 'https://service.dev.grp6asm3.com';


/**
 * Helper function to get the auth headers.
 * @returns {Object} - Authorization headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('idToken');
  if (!token) {
    throw new Error('Authorization token is missing');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Processes payment for the cart.
 * @param {string} cartId - The ID of the cart.
 * @returns {Promise<Object>} - Returns the client secret for Stripe payment.
 */
export const getPayClientSecretAPI = async (cartId) => {
  const returnUrl = `${API_BASE_URL}/carts/${cartId}/checkout`; 

  try {
    const response = await axios.post(`${API_BASE_URL}/carts/${cartId}/pay`, {
      returnUrl, // Include the returnUrl in the request body
    }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error getting payment's client secret for cartId: ${cartId}:`, error.response?.data || error.message || error);
    throw new Error("Unable to get payment's client secret. Please try again.");
  }
};

/**
 * Get cart.
 * @returns {Promise<Object>} - API response data containing cart details.
 */
export const getCartAPI = async (cartId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/carts/${cartId}`, { headers: getAuthHeaders() });
    return response.data; 
  } catch (error) {
    console.error('Error fetching cart data:', error);
    throw error;  // Rethrow the error to be handled by Redux Thunk or wherever it's used
  }
};

/**
 * Creates a new cart.
 * @returns {Promise<Object>} - API response data containing cart details.
 */
export const createCart = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/carts`, {}, { headers: getAuthHeaders() });

    // Log the entire response data to inspect its structure
    //console.log('API Response:', response.data);

    // Extract the cartId from the response (using `id` as cartId)
    const cartId = response.data.id;

    if (cartId) {
      // Ensure cartId is a string before saving it to localStorage
      const cartIdString = String(cartId);

      // Store the cartId in localStorage
      localStorage.setItem('cartId', cartIdString);
    } else {
      console.error('Error: cartId is missing or not in the expected format');
    }

    return response.data;
  } catch (error) {
    console.error('Error creating cart:', error.response || error.message || error);
    throw new Error('Unable to create cart. Please try again.');
  }
};

/**
 * Adds a new item to the cart. If the cart doesn't exist, it creates a new cart first.
 * @param {string|null} cartId - The ID of the cart. Pass `null` if cart ID is unknown.
 * @param {Object} newItem - The item details to add to the cart.
 * @returns {Promise<Object>} - API response data.
 */
export const addItemToCartAPI = async (cartId, newItem) => {
  try {
    // Check if cartId exists in localStorage
    cartId = localStorage.getItem('cartId');
    if (!cartId) {
      console.log('Cart does not exist. Creating a new cart...');
      const newCart = await createCart(); // Create a new cart if cartId doesn't exist
      cartId = newCart.id;  // Set the new cartId
      console.log('New cart created with ID:', cartId);
    }

    // Log the cartId before making the request to ensure it's valid
    //console.log('Using cartId:', cartId);

    // Add item to the cart using the API
    const response = await axios.post(
      `${API_BASE_URL}/carts/${cartId}/addItem`,
      {
        skuId: newItem.skuId,
        productName: newItem.name,
        stockCode: newItem.stockCode,
        quantity: newItem.quantity,
        productPrice: newItem.price,
      },
      { headers: getAuthHeaders() }
    );
    // Check if response.data is defined
    if (!response.data) {
      throw new Error('No data returned from API');
    }

    // If necessary, update the cartId in localStorage
    if (response.data.cartId) {
      localStorage.setItem('cartId', response.data.cartId);
    }

    return response.data; // Return the response data if needed

  } catch (error) {
    console.error('Error adding item to cart:', error.response?.data || error.message || error);
    throw new Error('Unable to add item to the cart. Please try again.');
  }
};

/**
 * Removes an item from the cart.
 * @param {string} cartId - The ID of the cart.
 * @param {string} itemId - The SKU ID of the item to remove.
 * @returns {Promise<Object>} - API response data.
 */
export const removeItemFromCartAPI = async (cartId, itemId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/carts/${cartId}/removeItem`,
      { skuId: itemId }, 
      { headers: getAuthHeaders() } 
    );
    return response.data.cartItems; 
  } catch (error) {
    console.error(`Error removing item from cart (cartId: ${cartId}, itemId: ${itemId}):`, error.response || error.message || error);
    throw new Error('Unable to remove item from cart. Please try again.');
  }
};
/**
 * Updates the quantity of an item in the cart.
 * @param {string} cartId - The ID of the cart.
 * @param {string} skuId - The SKU ID of the item to update.
 * @param {number} quantity - The quantity change (+/-).
 * @returns {Promise<Object>} - API response data.
 */
export const updateItemQuantityAPI = async (cartId, skuId, quantity) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/carts/${cartId}/updateItem`, {
      skuId,
      quantity,
    }, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error(`Error updating item quantity (cartId: ${cartId}, skuId: ${skuId}):`, error.response || error.message || error);
    throw new Error('Unable to update item quantity. Please try again.');
  }
};

/**
 * Submits the cart for processing.
 * @param {string} cartId - The ID of the cart.
 * @returns {Promise<Object>} - API response data.
 */
export const submitCartAPI = async (cartId, { contactName, email, address, contactPhone }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/carts/${cartId}/submit`, {
      contactName, // Ensure this matches what the API expects
      contactEmail: email, // Map email to contactEmail
      deliveryAddress: address,
      contactPhone:  contactPhone
    }, {
      headers: getAuthHeaders(),
    });

    localStorage.removeItem('cartId');
    return response.data; // Return the response data
  } catch (error) {
    console.error(`Error submitting cart for cartId: ${cartId}:`, error.response || error.message || error);
    throw new Error('Unable to submit cart. Please try again.');
  }
};