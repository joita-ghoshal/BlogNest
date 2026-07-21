import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import blogService from '../services/blogService';
import { PAGE_SIZE } from '../utils/constants';
import BlogCard from '../components/common/BlogCard';
import Pagination from '../components/common/Pagination';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setBlogs([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await blogService.getBlogs({ search: query, page: currentPage, limit: PAGE_SIZE });
        setBlogs(res.data?.blogs || res.blogs || []);
        setTotalPages(res.data?.totalPages || res.totalPages || 1);
      } catch {
        console.error('Search failed');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, currentPage]);

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>{query ? `Search: ${query} - BlogNest` : 'Search - BlogNest'}</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {query ? `Results for "${query}"` : 'Search'}
          </h1>
          {query && (
            <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
              Found {blogs.length} result{blogs.length !== 1 ? 's' : ''} on page {currentPage}
            </p>
          )}

          {!query ? (
            <div className="text-center py-16">
              <p className="text-lg mb-4" style={{ color: 'var(--text-muted)' }}>Enter a search term to find blogs.</p>
              <Link
                to="/blogs"
                className="py-3 px-6 text-base font-semibold rounded-xl transition-colors inline-block"
                style={{ backgroundColor: '#00D4D8', color: '#000' }}
              >
                Browse All Blogs
              </Link>
            </div>
          ) : loading ? (
            <LoadingSkeleton type="blog" count={6} />
          ) : blogs.length === 0 ? (
            <EmptyState
              title="No results found"
              description={`We couldn't find any blogs matching "${query}". Try different keywords.`}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BlogCard blog={blog} />
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 sm:mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default SearchResults;
