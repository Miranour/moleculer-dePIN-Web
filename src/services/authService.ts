import axios from 'axios';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'researcher';
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Giriş yapılamadı, sunucuya ulaşılamıyor.');
    }
  },
  
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, {
        email,
        password,
        name,
      });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Kayıt yapılamadı, sunucuya ulaşılamıyor.');
    }
  },

  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/google`, {
        id_token: idToken,
      });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Google ile giriş yapılamadı.');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};
