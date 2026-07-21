import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <>
      <Helmet><title>404 Not Found - BlogNest</title></Helmet>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="text-8xl font-bold mb-4" style={{ color: '#00D4D8' }}>404</div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Page Not Found</h1>
          <p className="text-sm mb-8 max-w-md" style={{ color: 'var(--text-muted)' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="px-8 py-3 text-sm font-semibold text-white rounded-xl transition-colors inline-block"
            style={{ backgroundColor: '#00D4D8' }}
          >
            Go Home
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
