import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiMenu, HiX, HiMoon, HiSun, HiChevronDown } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import Avatar from './Avatar';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('blognest_dark_mode') === 'true');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('blognest_dark_mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/blogs', label: 'Blogs' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-md' : ''
        }`}
        style={{
          backgroundColor: scrolled ? undefined : 'var(--bg-primary)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Blog<span style={{ color: '#00D4D8' }}>Nest</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium transition-colors hover:text-[#00D4D8]"
                  style={{
                    color: location.pathname === link.to ? '#00D4D8' : 'var(--text-secondary)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                <HiSearch size={20} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                {darkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
                  >
                    <Avatar user={user} size="sm" />
                    <HiChevronDown
                      size={16}
                      className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--text-muted)' }}
                    />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg py-2 z-50"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                        </div>
                        <Link to={`/profile/${user._id}`} className="block px-4 py-2 text-sm hover:bg-[var(--bg-secondary)]" style={{ color: 'var(--text-secondary)' }}>Profile</Link>
                        <Link to="/my-blogs" className="block px-4 py-2 text-sm hover:bg-[var(--bg-secondary)]" style={{ color: 'var(--text-secondary)' }}>My Blogs</Link>
                        <Link to="/my-bookmarks" className="block px-4 py-2 text-sm hover:bg-[var(--bg-secondary)]" style={{ color: 'var(--text-secondary)' }}>My Bookmarks</Link>
                        <Link to="/create-blog" className="block px-4 py-2 text-sm hover:bg-[var(--bg-secondary)]" style={{ color: '#00D4D8' }}>Create Blog</Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-[var(--bg-secondary)]" style={{ color: '#00D4D8' }}>Admin Dashboard</Link>
                        )}
                        <div style={{ borderTop: '1px solid var(--border)' }}>
                          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-secondary)]" style={{ color: '#EF4444' }}>Logout</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 text-sm font-medium rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-2 text-sm font-medium rounded-lg text-white" style={{ backgroundColor: '#00D4D8' }}>
                    Register
                  </Link>
                </div>
              )}
            </div>

            <div className="flex md:hidden items-center gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
                <HiSearch size={20} />
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
                {darkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
                {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-primary)' }}
            >
              <div className="max-w-7xl mx-auto px-4 py-3">
                <SearchBar onClose={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="absolute right-0 top-0 h-full w-72 shadow-xl p-6 flex flex-col"
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              <div className="flex justify-end mb-6">
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
                  <HiX size={24} />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-base font-medium py-2"
                    style={{
                      color: location.pathname === link.to ? '#00D4D8' : 'var(--text-secondary)',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link to={`/profile/${user._id}`} className="text-base font-medium py-2" style={{ color: 'var(--text-secondary)' }}>Profile</Link>
                    <Link to="/my-blogs" className="text-base font-medium py-2" style={{ color: 'var(--text-secondary)' }}>My Blogs</Link>
                    <Link to="/my-bookmarks" className="text-base font-medium py-2" style={{ color: 'var(--text-secondary)' }}>My Bookmarks</Link>
                    <Link to="/create-blog" className="text-base font-medium py-2" style={{ color: '#00D4D8' }}>Create Blog</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="text-base font-medium py-2" style={{ color: '#00D4D8' }}>Admin Dashboard</Link>
                    )}
                    <button onClick={handleLogout} className="text-left text-base font-medium py-2" style={{ color: '#EF4444' }}>Logout</button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <Link to="/login" className="px-4 py-2 text-center text-sm font-medium rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Login</Link>
                    <Link to="/register" className="px-4 py-2 text-center text-sm font-medium rounded-lg text-white" style={{ backgroundColor: '#00D4D8' }}>Register</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-16" />
    </>
  );
};

export default Navbar;
