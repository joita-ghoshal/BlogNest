import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiAdjustments, HiX } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';
import blogService from '../services/blogService';
import categoryService from '../services/categoryService';
import { PAGE_SIZE, SORT_OPTIONS } from '../utils/constants';
import SearchBar from '../components/common/SearchBar';
import BlogFilters from '../components/blog/BlogFilters';
import BlogCard from '../components/common/BlogCard';
import Pagination from '../components/common/Pagination';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const searchQuery = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const tag = searchParams.get('tag') || '';

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: PAGE_SIZE };
      if (searchQuery) params.search = searchQuery;
      if (category) params.category = category;
      if (sort) params.sort = sort;
      if (tag) params.tag = tag;

      const res = await blogService.getBlogs(params);
      setBlogs(res.data?.blogs || res.blogs || []);
      setTotalPages(res.data?.totalPages || res.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, category, sort, tag]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data?.categories || res.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSearch = (query) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({ page: '1' });
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = searchQuery || category || sort || tag;

  return (
    <>
      <Helmet>
        <title>Browse Blogs - BlogNest</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Explore Blogs
          </h1>
          <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onSearch={handleSearch}
              placeholder="Search blogs..."
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="py-3 px-6 text-base font-medium rounded-xl border flex items-center justify-center gap-2 transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)' }}
          >
            <HiAdjustments className="w-5 h-5" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00D4D8' }} />
            )}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <BlogFilters
                categories={categories}
                selectedCategory={category}
                selectedSort={sort}
                selectedTag={tag}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                sortOptions={SORT_OPTIONS}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {hasActiveFilters && !showFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 py-1 px-3 text-sm rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                Search: {searchQuery}
                <button onClick={() => handleSearch('')}><HiX className="w-4 h-4" /></button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 py-1 px-3 text-sm rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                Category: {category}
                <button onClick={() => handleFilterChange('category', '')}><HiX className="w-4 h-4" /></button>
              </span>
            )}
            {sort && (
              <span className="inline-flex items-center gap-1 py-1 px-3 text-sm rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                Sort: {sort}
                <button onClick={() => handleFilterChange('sort', '')}><HiX className="w-4 h-4" /></button>
              </span>
            )}
            {tag && (
              <span className="inline-flex items-center gap-1 py-1 px-3 text-sm rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                Tag: {tag}
                <button onClick={() => handleFilterChange('tag', '')}><HiX className="w-4 h-4" /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-sm font-medium" style={{ color: '#00D4D8' }}>
              Clear all
            </button>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton type="blog" count={6} />
        ) : blogs.length === 0 ? (
          <EmptyState
            title="No blogs found"
            description={hasActiveFilters ? 'Try adjusting your filters or search terms.' : 'Be the first to write a blog post!'}
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
      </div>
    </>
  );
};

export default Blogs;
