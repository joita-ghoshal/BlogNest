import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value, color, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl p-6 sm:p-8 space-y-4"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
          {value}
        </p>
      </div>
      {trend !== undefined && (
        <p className="text-xs font-medium" style={{ color: trend >= 0 ? '#10B981' : '#EF4444' }}>
          {trend >= 0 ? '+' : ''}{trend}% from last month
        </p>
      )}
    </motion.div>
  );
};

export default StatsCard;
