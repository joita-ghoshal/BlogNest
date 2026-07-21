import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import blogService from '../services/blogService';
import BlogMeta from '../components/blog/BlogMeta';
import BlogContent from '../components/blog/BlogContent';
import BlogLikeButton from '../components/blog/BlogLikeButton';
import BlogBookmarkButton from '../components/blog/BlogBookmarkButton';
import ShareButtons from '../components/blog/ShareButtons';
import CommentSection from '../components/blog/CommentSection';
import RelatedBlogs from '../components/blog/RelatedBlogs';
import Loading from '../components/common/Loading';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await blogService.getBlog(slug);
        const blogData = res.blog || res.data || res;
        setBlog(blogData);

        if (blogData.category?.slug) {
          try {
            const relRes = await blogService.getBlogs({ category: blogData.category.slug, limit: 3 });
            const relBlogs = (relRes.data || relRes.blogs || []).filter((b) => b._id !== blogData._id);
            setRelated(relBlogs);
          } catch {}
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Blog not found');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) return <Loading text="Loading blog..." />;
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{error}</p>
      </div>
    );
  }
  if (!blog) return null;

  return (
    <>
      <Helmet>
        <title>{blog.title} - BlogNest</title>
        <meta name="description" content={blog.excerpt || blog.title} />
      </Helmet>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {blog.featuredImage?.url && (
          <img
            src={blog.featuredImage.url}
            alt={blog.title}
            className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-2xl mb-6 sm:mb-8"
          />
        )}

        <BlogMeta blog={blog} />

        <div className="mb-8">
          <BlogContent content={blog.content} />
        </div>

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs rounded-full whitespace-nowrap"
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-t border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <BlogLikeButton blog={blog} onToggle={(updated) => setBlog(updated)} />
            <BlogBookmarkButton blog={blog} onToggle={(updated) => setBlog(updated)} />
          </div>
          <ShareButtons blog={blog} />
        </div>

        <CommentSection blogId={blog._id} />

        {related.length > 0 && <RelatedBlogs blogs={related} />}
      </article>
    </>
  );
};

export default BlogDetail;
