import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...submitData } = data;
      await registerUser(submitData);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - BlogNest</title>
      </Helmet>

      <div
        className="min-h-[80vh] flex items-center justify-center px-4 py-10 sm:py-16"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md mx-auto"
        >
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
              Create Account
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              Join the community of writers and readers
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
                  Full Name
                </label>
                <div className="relative">
                  <HiUser
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <input
                    type="text"
                    {...register('name', {
                      required: 'Name is required',
                    })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-base outline-none focus:ring-2 focus:ring-[#00D4D8]/50 border"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p
                    className="text-xs mt-1.5"
                    style={{ color: '#ef4444' }}
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                  <p
                    className="text-xs mt-1.5"
                    style={{ color: '#ef4444' }}
                  >
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
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className="w-full pl-11 pr-11 py-3 rounded-xl text-base outline-none focus:ring-2 focus:ring-[#00D4D8]/50 border"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="Min 6 characters"
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
                  <p
                    className="text-xs mt-1.5"
                    style={{ color: '#ef4444' }}
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <HiLockClosed
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (v) =>
                        v === password || 'Passwords do not match',
                    })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-base outline-none focus:ring-2 focus:ring-[#00D4D8]/50 border"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p
                    className="text-xs mt-1.5"
                    style={{ color: '#ef4444' }}
                  >
                    {errors.confirmPassword.message}
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
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>

          <p
            className="text-center mt-6 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{ color: '#00D4D8' }}
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Register;
