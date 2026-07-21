import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiX } from 'react-icons/hi';
import useDebounce from '../../hooks/useDebounce';

const SearchBar = ({ onClose, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <HiSearch
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blogs, categories, authors..."
          autoFocus
          className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#00D4D8]/50 transition-all"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          >
            <HiX size={16} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-6 py-3 text-sm font-medium text-white rounded-xl"
        style={{ backgroundColor: '#00D4D8' }}
      >
        Search
      </button>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-3 text-sm font-medium rounded-xl border"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default SearchBar;
