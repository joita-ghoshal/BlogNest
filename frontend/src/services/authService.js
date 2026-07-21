import api from './api';

const authService = {
  login: async (data) => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  changePassword: async (data) => {
    const res = await api.put('/auth/change-password', data);
    return res.data;
  },
};

export default authService;
