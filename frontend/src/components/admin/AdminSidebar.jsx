import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiHome, HiUsers, HiDocumentText, HiCollection, HiChatAlt2, HiX, HiMenu } from 'react-icons/hi';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: HiHome, end: true },
  { path: '/admin/users', label: 'Users', icon: HiUsers },
  { path: '/admin/blogs', label: 'Blogs', icon: HiDocumentText },
  { path: '/admin/categories', label: 'Categories', icon: HiCollection },
  { path: '/admin/comments', label: 'Comments', icon: HiChatAlt2 },
];

const AdminSidebar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="h-full flex flex-col py-6">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold" style={{ backgroundColor: '#00D4D8', color: '#000' }}>
            B
          </div>
          <div>
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>BlogNest</span>
            <span className="block text-xs font-medium" style={{ color: '#00D4D8' }}>Admin Panel</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 py-3 px-4 text-sm font-medium rounded-xl transition-colors"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'rgba(0,212,216,0.1)' : 'transparent',
              color: isActive ? '#00D4D8' : 'var(--text-secondary)',
            })}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <NavLink
          to="/"
          className="block py-2 text-sm font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          &larr; Back to Site
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <HiMenu className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
      </button>

      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 z-40 border-r" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-6 right-4 p-1 rounded-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                <HiX className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
