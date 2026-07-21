import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed successfully!');
    setEmail('');
  };

  return (
    <footer
      className="border-t mt-auto"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold inline-block">
              Blog<span style={{ color: '#00D4D8' }}>Nest</span>
            </Link>
            <p
              className="mt-4 text-base leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              Discover ideas, share your story, and connect with passionate writers
              from around the world.
            </p>
            <div className="flex gap-3 mt-6">
              {[FiTwitter, FiLinkedin, FiGithub, FiInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2.5 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3
              className="text-base font-semibold mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/blogs', label: 'Browse Blogs' },
                { to: '/create-blog', label: 'Write a Blog' },
                { to: '/register', label: 'Sign Up' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-base hover:text-[#00D4D8] transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="text-base font-semibold mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { href: '#', label: 'Help Center' },
                { href: '#', label: 'Privacy Policy' },
                { href: '#', label: 'Terms of Service' },
                { href: '#', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-base hover:text-[#00D4D8] transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="text-base font-semibold mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              Newsletter
            </h3>
            <p
              className="text-base mb-4"
              style={{ color: 'var(--text-muted)' }}
            >
              Stay updated with the latest blogs and news.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 text-base rounded-xl border outline-none focus:ring-2 focus:ring-[#00D4D8]/50 transition-all"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="submit"
                className="w-full px-6 py-3 text-base font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#00D4D8' }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div
          className="mt-12 pt-8 border-t text-center"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-base" style={{ color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} BlogNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
