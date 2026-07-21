import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail } from 'react-icons/hi';
import toast from 'react-hot-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Subscribed successfully!');
      setEmail('');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
          style={{
            background: 'linear-gradient(135deg, #00D4D8 0%, #00B8BC 100%)',
          }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 bg-white" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-20 bg-white" />

          <div className="relative">
            <HiMail size={40} className="mx-auto mb-4 text-white/80" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              Get the latest blogs and updates delivered straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl text-sm outline-none min-w-0"
                style={{ backgroundColor: '#ffffff', color: '#111827', border: 'none' }}
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 text-sm font-semibold rounded-xl transition-colors disabled:opacity-70"
                style={{ backgroundColor: '#111827', color: '#fff' }}
              >
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
