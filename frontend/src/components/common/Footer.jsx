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
    <footer className="border-t mt-auto" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold">
              Blog<span style={{ color: '#00D4D8' }}>Nest</span>
            </Link>
            <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              Discover ideas, share your story, and connect with passionate writers from around the world.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]" style={{ color: 'var(--text-muted)' }}>
                <FiTwitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]" style={{ color: 'var(--text-muted)' }}>
                <FiLinkedin size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]" style={{ color: 'var(--text-muted)' }}>
                <FiGithub size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]" style={{ color: 'var(--text-muted)' }}>
                <FiInstagram size={18} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-[#00D4D8] transition-colors" style={{ color: 'var(--text-muted)' }}>Home</Link></li>
              <li><Link to="/blogs" className="text-sm hover:text-[#00D4D8] transition-colors" style={{ color: 'var(--text-muted)' }}>Browse Blogs</Link></li>
              <li><Link to="/create-blog" className="text-sm hover:text-[#00D4D8] transition-colors" style={{ color: 'var(--text-muted)' }}>Write a Blog</Link></li>
              <li><Link to="/register" className="text-sm hover:text-[#00D4D8] transition-colors" style={{ color: 'var(--text-muted)' }}>Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-[#00D4D8] transition-colors" style={{ color: 'var(--text-muted)' }}>Help Center</a></li>
              <li><a href="#" className="text-sm hover:text-[#00D4D8] transition-colors" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:text-[#00D4D8] transition-colors" style={{ color: 'var(--text-muted)' }}>Terms of Service</a></li>
              <li><a href="#" className="text-sm hover:text-[#00D4D8] transition-colors" style={{ color: 'var(--text-muted)' }}>Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Newsletter</h3>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Stay updated with the latest blogs.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-[#00D4D8]/50 min-w-0"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white rounded-lg whitespace-nowrap" style={{ backgroundColor: '#00D4D8' }}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t text-center" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} BlogNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
