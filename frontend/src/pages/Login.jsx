import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiClipboardCheck } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const fillDemo = (email, password) => {
    setValue('email', email);
    setValue('password', password);
    toast.success('Demo credentials filled!', { duration: 1500 });
  };

  return (
    <>
      <Helmet>
        <title>Login - BlogNest</title>
      </Helmet>

      <div
        className="min-h-[80vh] flex items-center justify-center px-4 py-10 sm:py-16"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start"
        >
          <div className="w-full max-w-md mx-auto md:mx-0 flex-1">
            <div className="text-center mb-8">
              <Link
                to="/"
                className="text-3xl font-bold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Blog<span style={{ color: '#00D4D8' }}>Nest</span>
              </Link>
              <h2
                className="text-2xl sm:text-3xl font-bold mt-6"
                style={{ color: 'var(--text-primary)' }}
              >
                Welcome Back
              </h2>
              <p
                className="mt-2 text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Sign in to your account to continue
              </p>
            </div>

            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <HiMail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--text-muted)' }}
                    />
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+\.\S+$/,
                          message: 'Invalid email address',
                        },
                      })}
                      className="w-full pl-11 pr-4 py-3 rounded-xl text-base outline-none focus:ring-2 focus:ring-[#00D4D8]/50 border"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)',
                      }}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <HiLockClosed
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--text-muted)' }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Password is required',
                      })}
                      className="w-full pl-11 pr-11 py-3 rounded-xl text-base outline-none focus:ring-2 focus:ring-[#00D4D8]/50 border"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)',
                      }}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 text-base font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90"
                  style={{ backgroundColor: '#00D4D8' }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </div>

            <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold hover:underline" style={{ color: '#00D4D8' }}>
                Sign Up
              </Link>
            </p>
          </div>

          <div
            className="w-full md:w-64 lg:w-72 flex-shrink-0 mt-4 md:mt-24 rounded-2xl p-5"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Demo Credentials
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              Quick access to explore the app.
            </p>

            <div className="space-y-3">
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#00D4D8' }}>
                    Admin
                  </span>
                  <button
                    onClick={() => fillDemo('admin@blognest.com', 'admin123')}
                    className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md transition-colors hover:opacity-80"
                    style={{ backgroundColor: 'rgba(0,212,216,0.1)', color: '#00D4D8' }}
                  >
                    <HiClipboardCheck size={12} />
                    Fill
                  </button>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  admin@blognest.com
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  admin123
                </p>
              </div>

              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8B5CF6' }}>
                    User
                  </span>
                  <button
                    onClick={() => fillDemo('user@blognest.com', 'user123456')}
                    className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md transition-colors hover:opacity-80"
                    style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}
                  >
                    <HiClipboardCheck size={12} />
                    Fill
                  </button>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  user@blognest.com
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  user123456
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
