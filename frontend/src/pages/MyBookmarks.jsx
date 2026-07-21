import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import blogService from '../services/blogService';
import BlogCard from '../components/common/BlogCard';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';

const MyBookmarks = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await blogService.getBookmarks();
        setBlogs(res.blogs || res.data || []);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <Helmet><title>My Bookmarks - BlogNest</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>My Bookmarks</h1>
        {loading ? (
          <Loading />
        ) : blogs.length === 0 ? (
          <EmptyState icon="🔖" title="No bookmarks yet" description="Save blogs you love to read later!" actionLabel="Browse Blogs" actionTo="/blogs" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
          </div>
        )}
      </div>
    </>
  );
};

export default MyBookmarks;
