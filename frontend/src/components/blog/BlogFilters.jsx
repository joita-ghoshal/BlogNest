import { SORT_OPTIONS } from '../../utils/constants';

const BlogFilters = ({ categories = [], selectedCategory, onCategoryChange, sortBy, onSortChange, selectedTags = [], onTagToggle }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <select
        value={selectedCategory || ''}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[#00D4D8]/50"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)',
        }}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.slug}>{cat.name}</option>
        ))}
      </select>

      <select
        value={sortBy || 'latest'}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[#00D4D8]/50"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)',
        }}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default BlogFilters;
