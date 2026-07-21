import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import blogService from '../services/blogService';
import BlogCard from '../components/common/BlogCard';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await blogService.getBlogs({ search: query, limit: 20 });
        setBlogs(res.blogs || res.data || []);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [query]);

  return (
    <>
      <Helmet><title>Search: {query} - BlogNest</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Search results for "{query}"
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          {loading ? 'Searching...' : `${blogs.length} result${blogs.length !== 1 ? 's' : ''} found`}
        </p>
        {loading ? (
          <Loading />
        ) : blogs.length === 0 ? (
          <EmptyState icon="🔍" title="No results found" description="Try different keywords." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResults;
