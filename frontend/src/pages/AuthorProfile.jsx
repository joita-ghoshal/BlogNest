import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import userService from '../services/userService';
import blogService from '../services/blogService';
import { formatDate } from '../utils/helpers';
import BlogCard from '../components/common/BlogCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const AuthorProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileRes = await userService.getProfile(id);
        const userData = profileRes.data?.user || profileRes.user || profileRes.data || profileRes;
        setProfile(userData);

        const blogsRes = await blogService.getBlogs({ author: id, isPublished: true });
        setBlogs(blogsRes.data?.blogs || blogsRes.blogs || []);
      } catch (err) {
        console.error('Failed to load author:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <LoadingSkeleton type="profile" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      <Helmet>
        <title>{profile.name} - BlogNest</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold" style={{ color: '#00D4D8' }}>
                {profile.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {profile.name}
          </h1>
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{profile.email}</p>
          {profile.bio && (
            <p className="text-base max-w-lg mx-auto mb-3" style={{ color: 'var(--text-secondary)' }}>
              {profile.bio}
            </p>
          )}
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Joined {formatDate(profile.createdAt)}
          </p>
        </motion.div>

        <div className="mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
            Blogs by {profile.name}
          </h2>

          {blogs.length === 0 ? (
            <p className="text-base text-center py-8" style={{ color: 'var(--text-muted)' }}>No blogs yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthorProfile;
