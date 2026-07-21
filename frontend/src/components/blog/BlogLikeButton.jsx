import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiHeart } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import blogService from '../../services/blogService';
import toast from 'react-hot-toast';

const BlogLikeButton = ({ blog, onToggle }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(blog?.likes?.includes(user?._id) || false);
  const [count, setCount] = useState(blog?.likes?.length || 0);
  const [animating, setAnimating] = useState(false);

  const handleToggle = async () => {
    if (!user) {
      toast.error('Please login to like');
      return;
    }
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    try {
      const res = await blogService.toggleLike(blog._id);
      const data = res.data || res;
      setLiked(data.isLiked);
      setCount(data.likeCount ?? data.likes?.length ?? 0);
      onToggle?.({ ...blog, likes: data.likes || blog.likes, isLiked: data.isLiked });
    } catch {
      toast.error('Failed to toggle like');
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
      style={{
        backgroundColor: liked ? '#FEF2F2' : 'var(--bg-secondary)',
        color: liked ? '#EF4444' : 'var(--text-muted)',
        border: '1px solid var(--border)',
      }}
    >
      <motion.div
        animate={animating ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <HiHeart size={18} className={liked ? 'fill-current' : ''} />
      </motion.div>
      <span>{count}</span>
    </motion.button>
  );
};

export default BlogLikeButton;
