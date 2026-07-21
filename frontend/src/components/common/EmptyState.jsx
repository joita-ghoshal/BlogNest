import { Link } from 'react-router-dom';
const EmptyState = ({ icon, title, description, actionLabel, actionTo }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-5xl">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title || 'Nothing here yet'}</h3>
      <p className="text-sm mb-6 max-w-md" style={{ color: 'var(--text-muted)' }}>{description || 'Check back later!'}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="px-6 py-3 text-sm font-semibold text-white rounded-xl" style={{ backgroundColor: '#00D4D8' }}>{actionLabel}</Link>
      )}
    </div>
  );
};
export default EmptyState;
