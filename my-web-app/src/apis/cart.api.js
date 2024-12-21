import axios from 'axios';

const API_BASE_URL = 'https://service.dev.grp6asm3.com/carts';

export const addItemToCartAPI = async (cartId, newItem) => {
  const response = await axios.post(`${API_BASE_URL}/${cartId}/addItem`, newItem);
  return response.data;
};

export const removeItemFromCartAPI = async (cartId, itemId) => {
  const response = await axios.delete(`${API_BASE_URL}/${cartId}/removeItem`, {
    data: { skuId: itemId },
  });
  return response.data;
};

export const updateItemQuantityAPI = async (cartId, skuId, change) => {
  const response = await axios.put(`${API_BASE_URL}/${cartId}/updateItem`, {
    skuId,
    change,
  });
  return response.data;
};

export const payCartAPI = async (cartId, paymentDetails) => {
  const response = await axios.post(`${API_BASE_URL}/${cartId}/pay`, paymentDetails);
  return response.data;
};

export const submitCartAPI = async (cartId) => {
  const response = await axios.post(`${API_BASE_URL}/${cartId}/submit`);
  return response.data;
};
