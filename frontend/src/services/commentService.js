import api from './api';
import { shapeList, shapeItem } from '../utils/shapeList';

const commentService = {
  getComments: async (blogId) => {
    const res = await api.get(`/comments/blog/${blogId}`);
    return shapeList(res.data, 'comments');
  },
  createComment: async (data) => {
    const res = await api.post('/comments', data);
    return shapeItem(res.data, 'comment');
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
