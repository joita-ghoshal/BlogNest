import api from './api';
import { shapeList } from '../utils/shapeList';

const blogService = {
  getBlogs: async (params) => {
    const res = await api.get('/blogs', { params });
    return shapeList(res.data, 'blogs');
  },
  getBlog: async (slug) => {
    const res = await api.get(`/blogs/${slug}`);
    return res.data;
  },
  getFeaturedBlogs: async () => {
    const res = await api.get('/blogs/featured');
    return shapeList(res.data, 'blogs');
  },
  getTrendingBlogs: async () => {
    const res = await api.get('/blogs/trending');
    return shapeList(res.data, 'blogs');
  },
  getLatestBlogs: async () => {
    const res = await api.get('/blogs/latest');
    return shapeList(res.data, 'blogs');
  },
  getMyBlogs: async (params) => {
    const res = await api.get('/blogs/my', { params });
    return shapeList(res.data, 'blogs');
  },
  createBlog: async (formData) => {
    const res = await api.post('/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  updateBlog: async (id, formData) => {
    const res = await api.put(`/blogs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  deleteBlog: async (id) => {
    const res = await api.delete(`/blogs/${id}`);
    return res.data;
  },
  toggleLike: async (id) => {
    const res = await api.put(`/blogs/${id}/like`);
    return res.data;
  },
  toggleBookmark: async (id) => {
    const res = await api.put(`/blogs/${id}/bookmark`);
    return res.data;
  },
  getBookmarks: async (params) => {
    const res = await api.get('/blogs/bookmarks', { params });
    return shapeList(res.data, 'blogs');
  },
};

export default blogService;
