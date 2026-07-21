import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiChat, HiClock } from 'react-icons/hi';
import Avatar from './Avatar';
import CategoryBadge from './CategoryBadge';
import { formatDate, stripHtml, truncateText, estimateReadTime } from '../../utils/helpers';

const BlogCard = ({ blog, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const title = blog.title || 'Untitled';
  const excerpt = truncateText(stripHtml(blog.content || blog.excerpt || ''), 120);
  const author = blog.author || {};
  const category = blog.category || {};
  const imageObj = blog.featuredImage || {};
  const image = typeof imageObj === 'string' ? imageObj : (imageObj.url || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl overflow-hidden transition-shadow hover:shadow-lg"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
      }}
    >
      <Link to={`/blogs/${blog.slug || blog._id}`} className="block">
        <div className="relative overflow-hidden aspect-[16/10]">
          {image ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 skeleton-pulse" style={{ backgroundColor: 'var(--bg-tertiary)' }} />
              )}
              <img
                src={image}
                alt={title}
                className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <span className="text-4xl" style={{ color: 'var(--text-muted)' }}>📝</span>
            </div>
          )}
          {category.name && (
            <div className="absolute top-3 left-3">
              <CategoryBadge category={category} />
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/blogs/${blog.slug || blog._id}`}>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-[#00D4D8] transition-colors" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
        </Link>

        {excerpt && (
          <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
            {excerpt}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Link to={`/author/${author._id}`} className="flex items-center gap-2">
            <Avatar user={author} size="sm" />
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {author.name || 'Unknown'}
            </span>
          </Link>
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1">
              <HiClock size={14} />
              {estimateReadTime(blog.content)}
            </span>
            <span className="flex items-center gap-1">
              <HiHeart size={14} />
              {blog.likes?.length || blog.likesCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <HiChat size={14} />
              {blog.comments?.length || blog.commentsCount || 0}
            </span>
          </div>
        </div>

        {blog.createdAt && (
          <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
            {formatDate(blog.createdAt)}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default BlogCard;
