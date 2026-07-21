import { Link } from 'react-router-dom';
import { HiCalendar, HiClock, HiEye } from 'react-icons/hi';
import Avatar from '../common/Avatar';
import CategoryBadge from '../common/CategoryBadge';
import { formatDate, estimateReadTime } from '../../utils/helpers';

const BlogMeta = ({ blog }) => {
  const author = blog?.author || {};
  const category = blog?.category || {};

  return (
    <div className="space-y-4 mb-8">
      {category.name && <CategoryBadge category={category} size="md" />}
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
        {blog?.title}
      </h1>

      <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
        {blog?.excerpt || ''}
      </p>

      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 pt-2">
        <Link to={`/author/${author._id}`} className="flex items-center gap-3">
          <Avatar user={author} size="md" />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{author.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Author</p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1">
            <HiCalendar size={16} />
            {formatDate(blog?.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <HiClock size={16} />
            {estimateReadTime(blog?.content)}
          </span>
          <span className="flex items-center gap-1">
            <HiEye size={16} />
            {blog?.viewsCount || blog?.views || 0} views
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogMeta;
