import api from './api';
import type { User, AuthResponse } from '../types';

export type { User, AuthResponse };

const authService = {
  async register(data: { name: string; phone_number: string; email?: string; password: string; user_type: string }) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(data: { phone_number?: string; email?: string, password: string }) {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  async verify(data: { phone_number?: string; email?: string; code: string }) {
    const res = await api.post('/auth/verify', data);
    return res.data;
  },

  async resendOTP(data: { phone_number?: string; email?: string }) {
    const res = await api.post('/auth/resend-otp', data);
    return res.data;
  },

  async updateAccount(data: FormData) {
    const res = await api.put('/auth/update', data);
    return res.data;
  },

  async deleteAccount() {
    const res = await api.delete('/auth/delete');
    return res.data;
  },
};

export default authService;
