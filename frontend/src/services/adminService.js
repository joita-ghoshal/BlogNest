import api from './api';

const adminService = {
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  getUsers: async (params) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },
  updateUserRole: async (id, role) => {
    const res = await api.put(`/admin/users/${id}/role`, { role });
    return res.data;
  },
  updateUser: async (id, data) => {
    const res = await api.put(`/admin/users/${id}`, data);
    return res.data;
  },
  toggleUserActive: async (id) => {
    const res = await api.patch(`/admin/users/${id}/toggle-active`);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
  getAllBlogs: async (params) => {
    const res = await api.get('/admin/blogs', { params });
    return res.data;
  },
  updateBlog: async (id, data) => {
    const res = await api.put(`/admin/blogs/${id}`, data);
    return res.data;
  },
  adminDeleteBlog: async (id) => {
    const res = await api.delete(`/admin/blogs/${id}`);
    return res.data;
  },
  getAllComments: async (params) => {
    const res = await api.get('/admin/comments', { params });
    return res.data;
  },
  adminDeleteComment: async (id) => {
    const res = await api.delete(`/admin/comments/${id}`);
    return res.data;
  },
  getAllCategories: async () => {
    const res = await api.get('/admin/categories');
    return res.data;
  },
};

export default adminService;
