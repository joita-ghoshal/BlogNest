import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiBookmark } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import blogService from '../../services/blogService';
import toast from 'react-hot-toast';

const BlogBookmarkButton = ({ blog, onToggle }) => {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(blog?.bookmarks?.includes(user?._id) || false);
  const [animating, setAnimating] = useState(false);

  const handleToggle = async () => {
    if (!user) {
      toast.error('Please login to bookmark');
      return;
    }
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    try {
      const res = await blogService.toggleBookmark(blog._id);
      const data = res.data || res;
      const isBookmarked = data.isBookmarked;
      setBookmarked(isBookmarked);
      onToggle?.({ ...blog, isBookmarked });
      toast.success(isBookmarked ? 'Added to bookmarks' : 'Removed from bookmarks');
    } catch {
      toast.error('Failed to toggle bookmark');
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
      style={{
        backgroundColor: bookmarked ? '#ECFDF5' : 'var(--bg-secondary)',
        color: bookmarked ? '#00D4D8' : 'var(--text-muted)',
        border: '1px solid var(--border)',
      }}
    >
      <motion.div
        animate={animating ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <HiBookmark size={18} className={bookmarked ? 'fill-current' : ''} />
      </motion.div>
      <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
    </motion.button>
  );
};

export default BlogBookmarkButton;
