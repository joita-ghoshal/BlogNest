import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import userService from '../services/userService';
import useAuth from '../hooks/useAuth';
import ImageUpload from '../components/editor/ImageUpload';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({ name: user.name || '', bio: user.bio || '' });
      if (user.avatar) setPreviewUrl(user.avatar);
      setLoading(false);
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('bio', data.bio || '');
      if (avatar) formData.append('avatar', avatar);

      const res = await userService.updateProfile(formData);
      const updatedUser = res.data?.user || res.user || res.data || res;
      updateUser(updatedUser);
      toast.success('Profile updated');
      navigate(`/profile/${user._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <LoadingSkeleton type="form" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Profile - BlogNest</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
            Edit Profile
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl p-6 sm:p-8 space-y-6"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Avatar</label>
              <ImageUpload
                file={avatar}
                previewUrl={previewUrl}
                onUpload={(file, url) => { setAvatar(file); setPreviewUrl(url); }}
                onRemove={() => { setAvatar(null); setPreviewUrl(''); }}
                accept="image/*"
                isAvatar
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full py-3 px-4 text-base rounded-xl outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: errors.name ? '1px solid #EF4444' : '1px solid var(--border)',
                }}
              />
              {errors.name && <p className="text-sm mt-1" style={{ color: '#EF4444' }}>{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Bio</label>
              <textarea
                {...register('bio')}
                rows={4}
                placeholder="Tell us about yourself"
                className="w-full py-3 px-4 text-base rounded-xl outline-none transition-colors resize-none"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="py-3 px-6 text-base font-medium rounded-xl border transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-tertiary)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="py-3 px-6 text-base font-semibold rounded-xl transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#00D4D8', color: '#000' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default EditProfile;
