import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <HiChevronLeft size={18} />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
            style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)' }}
          >
            1
          </button>
          {start > 2 && <span style={{ color: 'var(--text-muted)' }}>...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: currentPage === page ? '#00D4D8' : 'var(--bg-secondary)',
            color: currentPage === page ? '#fff' : 'var(--text-secondary)',
          }}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ color: 'var(--text-muted)' }}>...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
            style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)' }}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <HiChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
