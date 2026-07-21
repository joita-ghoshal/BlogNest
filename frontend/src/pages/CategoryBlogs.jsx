import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import blogService from '../services/blogService';
import BlogCard from '../components/common/BlogCard';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';

const CategoryBlogs = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await blogService.getBlogs({ category: slug, limit: 12 });
        setBlogs(res.blogs || res.data || []);
        if (res.category) setCategory(res.category);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  return (
    <>
      <Helmet><title>{category?.name || 'Category'} - BlogNest</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
          {category?.name || slug}
        </h1>
        {loading ? (
          <Loading text="Loading blogs..." />
        ) : blogs.length === 0 ? (
          <EmptyState icon="📂" title="No blogs in this category" description="Check back later for new content." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryBlogs;
