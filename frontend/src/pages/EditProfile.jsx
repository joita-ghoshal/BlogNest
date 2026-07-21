import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import userService from '../services/userService';
import ImageUpload from '../components/editor/ImageUpload';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(() => {
    if (!user?.avatar) return null;
    return typeof user.avatar === 'string' ? user.avatar : (user.avatar.url || null);
  });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: user?.name || '', bio: user?.bio || '' },
  });

  const handleAvatarChange = (file) => {
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      const avatarUrl = user?.avatar ? (typeof user.avatar === 'string' ? user.avatar : (user.avatar.url || null)) : null;
      setPreview(avatarUrl);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('bio', data.bio);
      if (avatar) formData.append('avatar', avatar);
      const res = await userService.updateProfile(formData);
      updateUser(res.user || res.data || res);
      toast.success('Profile updated!');
      navigate(`/profile/${user._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <>
      <Helmet><title>Edit Profile - BlogNest</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
        <h1 className="text-2xl font-bold mb-6 sm:mb-8" style={{ color: 'var(--text-primary)' }}>Edit Profile</h1>
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6" style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div className="flex justify-center">
            {preview ? (
              <img src={preview} alt="Avatar" className="w-24 h-24 rounded-full object-cover ring-2 ring-[#00D4D8]/20" />
            ) : null}
          </div>
          <ImageUpload value={null} onChange={handleAvatarChange} />
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Name</label>
            <input {...register('name', { required: 'Name is required' })} className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00D4D8]/50" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            {errors.name && <p className="text-xs mt-1 text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Bio</label>
            <textarea {...register('bio')} rows={4} className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00D4D8]/50 resize-none" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} placeholder="Tell us about yourself..." />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-70" style={{ backgroundColor: '#00D4D8' }}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.form>
      </div>
    </>
  );
};

export default EditProfile;
