import { useState, useEffect } from 'react';

const useBlogs = (fetchFn, params = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async (queryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn({ ...params, ...queryParams, page });
      const blogData = res.blogs || res.data || res;
      const blogsArray = Array.isArray(blogData) ? blogData : blogData.docs || blogData.blogs || [];
      setBlogs(blogsArray);
      setTotalPages(res.totalPages || res.pages || Math.ceil((res.total || blogsArray.length) / (params.limit || 9)) || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  return { blogs, loading, error, page, setPage, totalPages, setBlogs, fetchBlogs };
};

export default useBlogs;
