import { Link } from 'react-router-dom';

const CategoryBadge = ({ category, size = 'sm' }) => {
  if (!category || !category.name) return null;

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <Link
      to={`/category/${category.slug || category._id}`}
      className={`${sizes[size]} rounded-full font-medium text-white inline-block hover:opacity-90 transition-opacity`}
      style={{ backgroundColor: '#00D4D8' }}
    >
      {category.name}
    </Link>
  );
};

export default CategoryBadge;
