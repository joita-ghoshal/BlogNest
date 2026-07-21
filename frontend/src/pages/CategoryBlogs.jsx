import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import blogService from '../services/blogService';
import categoryService from '../services/categoryService';
import { PAGE_SIZE } from '../utils/constants';
import BlogCard from '../components/common/BlogCard';
import Pagination from '../components/common/Pagination';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const CategoryBlogs = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const blogRes = await blogService.getBlogs({ category: slug, page: currentPage, limit: PAGE_SIZE });
        setBlogs(blogRes.data?.blogs || blogRes.blogs || []);
        setTotalPages(blogRes.data?.totalPages || blogRes.totalPages || 1);

        const catRes = await categoryService.getCategories();
        const allCats = catRes.data?.categories || catRes.categories || [];
        const found = allCats.find((c) => c.slug === slug || c.name?.toLowerCase() === slug?.toLowerCase());
        if (found) setCategory(found);
      } catch {
        console.error('Failed to fetch category blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>{category ? `${category.name} - BlogNest` : `Category - BlogNest`}</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {category?.name || slug}
          </h1>
          {category?.description && (
            <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>{category.description}</p>
          )}

          {loading ? (
            <LoadingSkeleton type="blog" count={6} />
          ) : blogs.length === 0 ? (
            <EmptyState
              title="No blogs in this category"
              description="Check back later for new posts."
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

export default CategoryBlogs;
