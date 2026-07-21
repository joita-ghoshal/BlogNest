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
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
    >
      <div className="relative flex-1">
        <HiSearch
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blogs, categories, authors..."
          autoFocus
          className="w-full pl-12 pr-10 py-3 px-4 text-base rounded-xl border outline-none focus:ring-2 focus:ring-[#00D4D8]/50 transition-all"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            <HiX size={18} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-6 py-3 text-base font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#00D4D8' }}
      >
        Search
      </button>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 text-base font-semibold rounded-xl border transition-colors hover:bg-[var(--bg-secondary)]"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default SearchBar;
