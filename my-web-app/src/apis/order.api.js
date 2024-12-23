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
 * List all orders.
 * @returns {Promise<Object[]>} - API response data containing a list of orders.
 */
export const listOrdersAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

/**
 * Get order details by order ID.
 * @param {string} orderId - The ID of the order to retrieve.
 * @returns {Promise<Object>} - API response data containing order details.
 */
export const getOrderDetailAPI = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, { headers: getAuthHeaders() });
    return response.data; // Assuming the response contains the order details
  } catch (error) {
    console.error(`Error fetching order details for orderId: ${orderId}:`, error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

/**
 * Cancel an order by order ID.
 * @param {string} orderId - The ID of the order to cancel.
 * @returns {Promise<Object>} - API response data.
 */
export const cancelOrderAPI = async (orderId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/cancel`, {}, { headers: getAuthHeaders() });
    return response.data; // Assuming the response contains the updated order status
  } catch (error) {
    console.error(`Error canceling order (orderId: ${orderId}):`, error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

/**
 * Reject an order by order ID.
 * @param {string} orderId - The ID of the order to reject.
 * @returns {Promise<Object>} - API response data.
 */
export const rejectOrderAPI = async (orderId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/reject`, {}, { headers: getAuthHeaders() });
    return response.data; // Assuming the response contains the updated order status
  } catch (error) {
    console.error(`Error rejecting order (orderId: ${orderId}):`, error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

/**
 * Complete an order by order ID.
 * @param {string} orderId - The ID of the order to complete.
 * @returns {Promise<Object>} - API response data.
 */
export const completeOrderAPI = async (orderId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/complete`, {}, { headers: getAuthHeaders() });
    return response.data; // Assuming the response contains the updated order status
  } catch (error) {
    console.error(`Error completing order (orderId: ${orderId}):`, error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};