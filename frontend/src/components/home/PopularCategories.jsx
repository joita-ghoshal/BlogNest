import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import categoryService from '../../services/categoryService';
import LoadingSkeleton from '../common/LoadingSkeleton';

const PopularCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await categoryService.getCategories();
        setCategories(res.categories || res.data || res || []);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSkeleton type="text" count={6} />;
  if (!categories.length) return null;

  return (
    <section className="py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Popular Categories
          </h2>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
            Explore topics that interest you
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/category/${cat.slug || cat._id}`}
                className="block p-6 rounded-2xl text-center transition-all hover:shadow-md group"
                style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 text-xl"
                  style={{ backgroundColor: '#00D4D815' }}
                >
                  {cat.icon || '📂'}
                </div>
                <h3 className="text-sm font-semibold group-hover:text-[#00D4D8] transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {cat.name}
                </h3>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {cat.blogCount || 0} blogs
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
