import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch } from 'react-icons/hi';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f7fa 30%, #ffffff 70%, #f0fdfa 100%)',
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background: 'linear-gradient(135deg, #0a1a1f 0%, #0d2129 30%, #111827 70%, #0a1a1f 100%)',
        }}
      />
      <div
        className="absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: '#00D4D8' }}
      />
      <div
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: '#00D4D8' }}
      />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ backgroundColor: '#00D4D815', color: '#00B8BC' }}
          >
            Welcome to BlogNest
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Discover Ideas &{' '}
          <span style={{ color: '#00D4D8' }}>Share Your Story</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          style={{ color: 'var(--text-muted)' }}
        >
          Explore a world of thought-provoking articles, share your perspective, and connect with passionate writers.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSearch}
          className="flex items-center gap-2 max-w-xl mx-auto"
        >
          <div className="relative flex-1">
            <HiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for blogs, topics, or authors..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00D4D8]/50 shadow-md transition-all"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
            />
          </div>
          <button
            type="submit"
            className="px-8 py-4 text-sm font-semibold text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: '#00D4D8' }}
          >
            Search
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-8 mt-10 text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          <span><strong className="text-[#00D4D8]">10K+</strong> Articles</span>
          <span><strong className="text-[#00D4D8]">5K+</strong> Writers</span>
          <span><strong className="text-[#00D4D8]">50+</strong> Categories</span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
