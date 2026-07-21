import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value, trend, color = '#00D4D8' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
      style={{ border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{value}</p>
          {trend !== undefined && (
            <p className={`text-xs mt-2 font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={28} style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
