import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiTrendingUp } from 'react-icons/hi';
import blogService from '../../services/blogService';
import { stripHtml, truncateText } from '../../utils/helpers';
import LoadingSkeleton from '../common/LoadingSkeleton';

const TrendingBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await blogService.getTrendingBlogs();
        setBlogs(res.blogs || res.data || res || []);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSkeleton type="text" count={5} />;
  if (!blogs.length) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <HiTrendingUp size={28} style={{ color: '#00D4D8' }} />
            Trending Blogs
          </h2>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
            What's popular right now
          </p>
        </motion.div>
        <div className="space-y-4">
          {blogs.slice(0, 5).map((blog, i) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/blogs/${blog.slug || blog._id}`}
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all hover:shadow-md group"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <span
                  className="text-xl sm:text-3xl font-bold w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ backgroundColor: '#00D4D815', color: '#00D4D8' }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold group-hover:text-[#00D4D8] transition-colors line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                    {blog.title}
                  </h3>
                  <p className="text-xs sm:text-sm mt-1 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                    {truncateText(stripHtml(blog.content || ''), 100)}
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="line-clamp-1">{blog.author?.name || 'Unknown'}</span>
                    <span className="flex-shrink-0">{blog.likes?.length || 0} likes</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingBlogs;
