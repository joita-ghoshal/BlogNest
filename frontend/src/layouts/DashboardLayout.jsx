import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { HiMenuAlt2, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 lg:ml-64">
        <div
          className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <button
            onClick={openSidebar}
            className="p-2 rounded-xl transition-colors hover:opacity-80"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Open sidebar"
          >
            <HiMenuAlt2 size={24} />
          </button>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Blog<span style={{ color: '#00D4D8' }}>Nest</span>
          </span>
        </div>

        <main
          className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <Outlet />
        </main>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={closeSidebar}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute inset-y-0 left-0 w-64"
              onClick={(e) => e.stopPropagation()}
            >
              <AdminSidebar isOpen={true} onClose={closeSidebar} />
            </motion.div>

            <button
              onClick={closeSidebar}
              className="absolute top-3 right-3 p-2 rounded-xl"
              style={{
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-secondary)',
              }}
              aria-label="Close sidebar"
            >
              <HiX size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
