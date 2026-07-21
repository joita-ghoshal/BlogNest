import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSearch,
  HiMenu,
  HiX,
  HiMoon,
  HiSun,
  HiChevronDown,
  HiOutlineUserCircle,
  HiOutlineDocumentText,
  HiOutlineBookmark,
  HiOutlinePencilAlt,
  HiOutlineCog,
  HiOutlineLogout,
} from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import Avatar from './Avatar';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { user, logout, loggingOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('blognest_dark_mode') === 'true'
  );
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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/blogs', label: 'Blogs' },
  ];

  const userDropdownItems = [
    { to: `/profile/${user?._id}`, label: 'Profile', icon: HiOutlineUserCircle, color: 'var(--text-secondary)' },
    { to: '/my-blogs', label: 'My Blogs', icon: HiOutlineDocumentText, color: 'var(--text-secondary)' },
    { to: '/my-bookmarks', label: 'My Bookmarks', icon: HiOutlineBookmark, color: 'var(--text-secondary)' },
    { to: '/create-blog', label: 'Create Blog', icon: HiOutlinePencilAlt, color: '#00D4D8' },
    ...(user?.role === 'admin'
      ? [{ to: '/admin', label: 'Admin Dashboard', icon: HiOutlineCog, color: '#00D4D8' }]
      : []),
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'shadow-lg backdrop-blur-xl bg-[var(--bg-primary)]/80'
            : 'bg-[var(--bg-primary)]'
        }`}
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Blog<span style={{ color: '#00D4D8' }}>Nest</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-base font-medium transition-colors hover:text-[#00D4D8] relative"
                  style={{
                    color: location.pathname === link.to ? '#00D4D8' : 'var(--text-secondary)',
                  }}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: '#00D4D8' }}
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl transition-colors hover:bg-[var(--bg-secondary)]"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Search"
              >
                <HiSearch size={20} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl transition-colors hover:bg-[var(--bg-secondary)]"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
              </button>

              {user ? (
                <div className="relative ml-1">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2 rounded-xl transition-colors hover:bg-[var(--bg-secondary)]"
                  >
                    <Avatar user={user} size="sm" />
                    <HiChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--text-muted)' }}
                    />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl z-50 overflow-hidden"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          <div
                            className="px-4 py-3"
                            style={{ borderBottom: '1px solid var(--border)' }}
                          >
                            <p
                              className="text-base font-semibold"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {user.name}
                            </p>
                            <p
                              className="text-sm truncate"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {user.email}
                            </p>
                          </div>

                          <div className="py-1">
                            {userDropdownItems.map((item) => (
                              <Link
                                key={item.to}
                                to={item.to}
                                className="flex items-center gap-3 px-4 py-2.5 text-base transition-colors hover:bg-[var(--bg-secondary)]"
                                style={{ color: item.color }}
                              >
                                <item.icon size={18} />
                                {item.label}
                              </Link>
                            ))}
                          </div>

                          <div
                            style={{ borderTop: '1px solid var(--border)' }}
                          >
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-base transition-colors hover:bg-[var(--bg-secondary)]"
                              style={{ color: '#EF4444' }}
                            >
                              <HiOutlineLogout size={18} />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3 ml-1">
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-base font-medium rounded-xl transition-colors hover:bg-[var(--bg-secondary)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2.5 text-base font-semibold rounded-xl text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#00D4D8' }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Search"
              >
                <HiSearch size={20} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2.5 rounded-xl"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Open menu"
              >
                <HiMenu size={24} />
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
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--bg-primary)',
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] shadow-2xl flex flex-col"
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              <div
                className="flex items-center justify-between px-5 h-16 shrink-0"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Blog<span style={{ color: '#00D4D8' }}>Nest</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl transition-colors hover:bg-[var(--bg-secondary)]"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label="Close menu"
                >
                  <HiX size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-5">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-base font-medium py-3 px-3 rounded-xl transition-colors hover:bg-[var(--bg-secondary)]"
                      style={{
                        color: location.pathname === link.to ? '#00D4D8' : 'var(--text-secondary)',
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div
                  className="my-4"
                  style={{ borderTop: '1px solid var(--border)' }}
                />

                {user ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2">
                      <Avatar user={user} size="md" />
                      <div className="min-w-0">
                        <p
                          className="text-base font-semibold truncate"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {user.name}
                        </p>
                        <p
                          className="text-sm truncate"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {userDropdownItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center gap-3 py-3 px-3 text-base rounded-xl transition-colors hover:bg-[var(--bg-secondary)]"
                        style={{ color: item.color }}
                      >
                        <item.icon size={20} />
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 py-3 px-3 text-base rounded-xl transition-colors hover:bg-[var(--bg-secondary)] mt-1"
                      style={{ color: '#EF4444' }}
                    >
                      <HiOutlineLogout size={20} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 px-3">
                    <Link
                      to="/login"
                      className="px-5 py-3 text-center text-base font-medium rounded-xl border transition-colors hover:bg-[var(--bg-secondary)]"
                      style={{
                        borderColor: 'var(--border)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-5 py-3 text-center text-base font-semibold rounded-xl text-white"
                      style={{ backgroundColor: '#00D4D8' }}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16" />

      <AnimatePresence>
        {loggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-6">
                <div className="w-14 h-14 rounded-full border-4 animate-spin" style={{ borderColor: 'var(--bg-tertiary)', borderTopColor: '#00D4D8' }} />
              </div>
              <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Signing you out...</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>See you soon!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
