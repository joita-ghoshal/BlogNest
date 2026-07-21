import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      await authService.changePassword({ oldPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <>
      <Helmet><title>Change Password - BlogNest</title></Helmet>
      <div className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Change Password</h1>
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-4" style={{ backgroundColor: 'var(--bg-secondary)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Current Password</label>
            <input {...register('currentPassword', { required: 'Current password is required' })} type="password" className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00D4D8]/50" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            {errors.currentPassword && <p className="text-xs mt-1 text-red-500">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>New Password</label>
            <input {...register('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'At least 6 characters' } })} type="password" className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00D4D8]/50" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            {errors.newPassword && <p className="text-xs mt-1 text-red-500">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Confirm New Password</label>
            <input {...register('confirmPassword', { required: 'Please confirm', validate: (v) => v === newPassword || 'Passwords do not match' })} type="password" className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00D4D8]/50" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            {errors.confirmPassword && <p className="text-xs mt-1 text-red-500">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-70" style={{ backgroundColor: '#00D4D8' }}>
            {isSubmitting ? 'Changing...' : 'Change Password'}
          </button>
        </motion.form>
      </div>
    </>
  );
};

export default ChangePassword;
