import api from './api';
import { shapeList } from '../utils/shapeList';

const categoryService = {
  getCategories: async () => {
    const res = await api.get('/categories');
    return shapeList(res.data, 'categories');
  },
  createCategory: async (data) => {
    const res = await api.post('/categories', data);
    return res.data;
  },
  updateCategory: async (id, data) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data;
  },
  deleteCategory: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },
};

export default categoryService;
