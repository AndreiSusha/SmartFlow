import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  loading: false,
  isAdmin: false,
  user: null,

  login: async (email, password) => {
    set({ loading: true });

    try {
      const response = await fetch(`${API_IP}api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const userData = {
        name: data.username,
        email: data.email,
        customer: data.customer_id,
        role_id: data.role_id,
      };

      set({
        isAdmin: data.role_id === 1,
        user: userData,
        isAuthenticated: true,
      });

      await AsyncStorage.setItem('isAuthenticated', 'true');
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please try again.');
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('isAuthenticated');
    await AsyncStorage.removeItem('user');
    set({ isAuthenticated: false, user: null, isAdmin: false });
  },

  loadAuthState: async () => {
    const authState = await AsyncStorage.getItem('isAuthenticated');
    const userJson = await AsyncStorage.getItem('user');

    if (authState === 'true' && userJson) {
      const restoredUser = JSON.parse(userJson);
      set({
        isAuthenticated: true,
        user: restoredUser,
        isAdmin: restoredUser.role_id === 1,
      });
    } else {
      set({ isAuthenticated: false, user: null, isAdmin: false });
    }
  },
}));

useAuthStore.getState().loadAuthState();