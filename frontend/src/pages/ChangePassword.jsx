import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import authService from '../services/authService';

const ChangePassword = () => {
  const [changing, setChanging] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const newPassword = watch('newPassword', '');

  const onSubmit = async (data) => {
    try {
      setChanging(true);
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChanging(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Change Password - BlogNest</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
            Change Password
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl p-6 sm:p-8 space-y-6"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Current Password</label>
              <input
                type="password"
                {...register('currentPassword', { required: 'Current password is required' })}
                className="w-full py-3 px-4 text-base rounded-xl outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: errors.currentPassword ? '1px solid #EF4444' : '1px solid var(--border)',
                }}
              />
              {errors.currentPassword && <p className="text-sm mt-1" style={{ color: '#EF4444' }}>{errors.currentPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>New Password</label>
              <input
                type="password"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className="w-full py-3 px-4 text-base rounded-xl outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: errors.newPassword ? '1px solid #EF4444' : '1px solid var(--border)',
                }}
              />
              {errors.newPassword && <p className="text-sm mt-1" style={{ color: '#EF4444' }}>{errors.newPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Confirm New Password</label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === newPassword || 'Passwords do not match',
                })}
                className="w-full py-3 px-4 text-base rounded-xl outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: errors.confirmPassword ? '1px solid #EF4444' : '1px solid var(--border)',
                }}
              />
              {errors.confirmPassword && <p className="text-sm mt-1" style={{ color: '#EF4444' }}>{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={changing}
              className="w-full py-3 px-6 text-base font-semibold rounded-xl transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#00D4D8', color: '#000' }}
            >
              {changing ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default ChangePassword;
