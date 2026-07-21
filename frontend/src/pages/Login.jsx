import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <Helmet><title>Login - BlogNest</title></Helmet>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold">
              Blog<span style={{ color: '#00D4D8' }}>Nest</span>
            </Link>
            <h2 className="text-2xl font-bold mt-6" style={{ color: 'var(--text-primary)' }}>Welcome Back</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" style={{ backgroundColor: 'var(--bg-secondary)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <div className="relative">
                <HiMail size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00D4D8]/50"
                  style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <HiLockClosed size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00D4D8]/50"
                  style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  placeholder="Enter password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1 text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-end">
              <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-70"
              style={{ backgroundColor: '#00D4D8' }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold" style={{ color: '#00D4D8' }}>Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
