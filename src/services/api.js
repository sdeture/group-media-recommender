import axios from 'axios';

// This would typically be in an environment variable in a production app
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const getRecommendations = async (userData, groupPreferences) => {
  try {
    const response = await axios.post(`${API_URL}/recommendations`, {
      users: userData,
      preferences: groupPreferences
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};
