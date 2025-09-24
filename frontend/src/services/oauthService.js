import axiosClient from '../axios-client';

export const oauthService = {
  // Start Google OAuth login
  loginWithGoogle: () => {
    window.location.href = 'http://localhost:4000/auth/google';
  },

  // Get OAuth user profile
  getProfile: async () => {
    try {
      const response = await axiosClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // OAuth logout
  logout: async () => {
    try {
      const response = await axiosClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};