import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChartBar, HiOutlineUsers, HiOutlineDocumentText, HiOutlineCollection, HiOutlineChatAlt, HiX } from 'react-icons/hi';

const links = [
  { to: '/admin', icon: HiOutlineChartBar, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: HiOutlineUsers, label: 'Users' },
  { to: '/admin/blogs', icon: HiOutlineDocumentText, label: 'Blogs' },
  { to: '/admin/categories', icon: HiOutlineCollection, label: 'Categories' },
  { to: '/admin/comments', icon: HiOutlineChatAlt, label: 'Comments' },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <NavLink to="/" className="text-xl font-bold">
          Blog<span style={{ color: '#00D4D8' }}>Nest</span>
        </NavLink>
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg" style={{ color: 'var(--text-muted)' }}>
          <HiX size={20} />
        </button>
      </div>
      <p className="px-6 pt-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        Admin Panel
      </p>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'text-white' : ''
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#00D4D8' : 'transparent',
              color: isActive ? '#fff' : 'var(--text-secondary)',
            })}
            onClick={onClose}
          >
            <link.icon size={20} />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <div className="hidden lg:flex lg:w-64 flex-col fixed inset-y-0 left-0 z-30" style={{ backgroundColor: 'var(--bg-primary)', borderRight: '1px solid var(--border)' }}>
        {content}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="absolute left-0 top-0 h-full w-64 shadow-xl"
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
