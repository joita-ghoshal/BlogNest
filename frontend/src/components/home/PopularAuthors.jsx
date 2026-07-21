import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Avatar from '../common/Avatar';

const PopularAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/users/authors/popular');
        setAuthors(res.data?.authors || res.data || res.authors || res || []);
      } catch {
        setAuthors([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full skeleton-pulse" style={{ backgroundColor: 'var(--bg-tertiary)' }} />
                <div className="h-3 w-16 rounded skeleton-pulse" style={{ backgroundColor: 'var(--bg-tertiary)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!authors.length) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Popular Authors
          </h2>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
            Follow writers you love
          </p>
        </motion.div>
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
          {authors.slice(0, 8).map((author, i) => (
            <motion.div
              key={author._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/author/${author._id}`}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl transition-all hover:shadow-md min-w-[120px]"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <Avatar user={author} size="lg" />
                <p className="text-sm font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
                  {author.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {author.blogCount || 0} blogs
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularAuthors;
