import { Link } from 'react-router-dom';

const CategoryBadge = ({ category, size = 'sm' }) => {
  if (!category || !category.name) return null;

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-5 py-2 text-sm',
  };

  return (
    <Link
      to={`/category/${category.slug || category._id}`}
      className={`${sizes[size]} rounded-full font-semibold text-white inline-block transition-opacity hover:opacity-90`}
      style={{ backgroundColor: '#00D4D8' }}
    >
      {category.name}
    </Link>
  );
};

export default CategoryBadge;
