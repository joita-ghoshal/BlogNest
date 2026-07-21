import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiMail } from 'react-icons/hi';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password - BlogNest</title></Helmet>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold">Blog<span style={{ color: '#00D4D8' }}>Nest</span></Link>
            <h2 className="text-2xl font-bold mt-6" style={{ color: 'var(--text-primary)' }}>Forgot Password</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Enter your email to receive a reset link</p>
          </div>

          {sent ? (
            <div className="text-center p-8 rounded-2xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Check Your Email</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>We've sent a password reset link to your email address.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" style={{ backgroundColor: 'var(--bg-secondary)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <div className="relative">
                  <HiMail size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} type="email" className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00D4D8]/50" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} placeholder="you@example.com" />
                </div>
                {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-70" style={{ backgroundColor: '#00D4D8' }}>
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            Remember your password? <Link to="/login" className="font-semibold" style={{ color: '#00D4D8' }}>Sign In</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;
