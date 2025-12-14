// src/services/api.js

import { API_CONFIG } from '../constants/config';

export const apiService = {
  async callPublic() {
    const response = await fetch(`${API_CONFIG.baseUrl}/public`);
    return response.json();
  },

  async callProtected(accessToken) {
    const response = await fetch(`${API_CONFIG.baseUrl}/protected`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.json();
  },
};