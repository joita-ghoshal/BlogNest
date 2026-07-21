import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import blogService from '../../services/blogService';
import BlogCard from '../common/BlogCard';
import LoadingSkeleton from '../common/LoadingSkeleton';

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await blogService.getLatestBlogs();
        setBlogs(res.blogs || res.data || res || []);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSkeleton type="card" count={3} />;
  if (!blogs.length) return null;

  return (
    <section className="py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Latest Blogs
            </h2>
            <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
              Fresh perspectives and new ideas
            </p>
          </div>
          <Link
            to="/blogs"
            className="text-sm font-medium hover:underline"
            style={{ color: '#00D4D8' }}
          >
            View All
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.slice(0, 6).map((blog, i) => (
            <BlogCard key={blog._id} blog={blog} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlogs;
