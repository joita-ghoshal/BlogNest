import api from './api';

const commentService = {
  getComments: async (blogId) => {
    const res = await api.get(`/comments/blog/${blogId}`);
    return res.data;
  },
  createComment: async (data) => {
    const res = await api.post('/comments', data);
    return res.data;
  },
  deleteComment: async (id) => {
    const res = await api.delete(`/comments/${id}`);
    return res.data;
  },
  toggleLike: async (id) => {
    const res = await api.put(`/comments/${id}/like`);
    return res.data;
  },
};

export default commentService;
