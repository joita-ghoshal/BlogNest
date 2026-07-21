import api from './api';

const userService = {
  getProfile: async (id) => {
    const res = await api.get(`/users/profile/${id}`);
    return res.data;
  },
  updateProfile: async (formData) => {
    const res = await api.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export default userService;
