import axios from 'axios';

const API_BASE_URL = 'https://service.dev.grp6asm3.com';

// Helper function to get the auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('idToken');
  if (!token) {
    throw new Error('Authorization token is missing');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Fetch the list of promotion codes
export const getListPromotionCodeAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/promotion/codes`, {
      headers: getAuthHeaders(),
    });
    
    // Log the entire response for debugging
    console.log('Response from getListPromotionCodeAPI:', response.data);

    // Check if the response contains items and is an array
    if (!response.data || !Array.isArray(response.data.items)) {
      throw new Error('Invalid response data');
    }

    // Extract the promotion codes from the items
    const promotionCodes = response.data.items.map(item => item.code);
    console.log('Extracted promotion codes:', promotionCodes);
    return promotionCodes; // Return the array of promotion codes
  } catch (error) {
    console.error(`Error getting list promotion for code:`, error.response?.data || error.message || error);
    throw new Error(`Failed to retrieve promotion codes: Error: ${error.message}`);
  }
};

// Fetch details for a specific promotion code
export const getPromotionCodeAPI = async (code) => {
  if (!code || typeof code !== 'string') {
    throw new Error('Invalid promotion code');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/promotion/codes/${code}`, {
      headers: getAuthHeaders(),
    });
    
    // Log the response for debugging
    console.log(`Response from getPromotionCodeAPI for code ${code}:`, response.data);

    // Check if the response data is valid
    if (!response.data) {
      throw new Error('Invalid response data');
    }

    // Return the promotion details directly
    return response.data; // This should be the promotion object
  } catch (error) {
    console.error(`Error getting promotion for code: ${code}:`, error.response?.data || error.message || error);
    throw new Error(`Failed to retrieve promotion code: ${code}. Error: ${error.message}`);
  }
};
