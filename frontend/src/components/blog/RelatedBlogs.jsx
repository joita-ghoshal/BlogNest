import BlogCard from '../common/BlogCard';
import EmptyState from '../common/EmptyState';

const RelatedBlogs = ({ blogs = [] }) => {
  if (!blogs.length) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        Related Blogs
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <BlogCard key={blog._id} blog={blog} index={index} />
        ))}
      </div>
    </div>
  );
};

export default RelatedBlogs;
