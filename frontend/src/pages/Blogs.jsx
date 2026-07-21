import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import blogService from '../services/blogService';
import categoryService from '../services/categoryService';
import BlogCard from '../components/common/BlogCard';
import BlogFilters from '../components/blog/BlogFilters';
import Pagination from '../components/common/Pagination';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import SearchBar from '../components/common/SearchBar';
import { PAGE_SIZE } from '../utils/constants';

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const page = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'latest';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        setCategories(res.categories || res.data || res || []);
      } catch {}
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const params = { page, limit: PAGE_SIZE, sort };
        if (category) params.category = category;
        if (search) params.search = search;
        const res = await blogService.getBlogs(params);
        setBlogs(res.data || res.blogs || []);
        setTotalPages(res.pagination?.pages || res.totalPages || res.pages || 1);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [page, category, sort, search]);

  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <>
      <Helmet>
        <title>Browse Blogs - BlogNest</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Browse Blogs</h1>

        <div className="mb-6">
          <SearchBar initialValue={search} onClose={() => {}} />
        </div>

        <BlogFilters
          categories={categories}
          selectedCategory={category}
          onCategoryChange={(val) => updateParams('category', val)}
          sortBy={sort}
          onSortChange={(val) => updateParams('sort', val)}
        />

        {loading ? (
          <LoadingSkeleton type="card" count={6} />
        ) : blogs.length === 0 ? (
          <EmptyState
            icon="📝"
            title="No blogs found"
            description="Try adjusting your filters or search terms."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, i) => (
                <BlogCard key={blog._id} blog={blog} index={i} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => updateParams('page', p.toString())}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Blogs;
