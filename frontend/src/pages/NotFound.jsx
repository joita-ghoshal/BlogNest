import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found - BlogNest</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-8xl sm:text-9xl font-bold mb-4" style={{ color: '#00D4D8' }}>
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Page Not Found
          </h2>
          <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="py-3 px-6 text-base font-semibold rounded-xl inline-block transition-colors"
            style={{ backgroundColor: '#00D4D8', color: '#000' }}
          >
            Go Home
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
