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
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      set({
        isAdmin: data.role_id === 1,
        user: {
          name: data.username,
          email: data.email,
          customer: data.customer_id,
        },
      });

      await AsyncStorage.setItem('isAuthenticated', 'true');
      set({ isAuthenticated: true });
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please try again.');
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('isAuthenticated');
    set({ isAuthenticated: false, user: null });
  },

  loadAuthState: async () => {
    const authState = await AsyncStorage.getItem('isAuthenticated');
    set({ isAuthenticated: authState === 'true' });
  },
}));

useAuthStore.getState().loadAuthState();
