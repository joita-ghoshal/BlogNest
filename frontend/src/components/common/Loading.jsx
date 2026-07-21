const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 animate-spin" style={{ borderColor: 'var(--bg-tertiary)', borderTopColor: '#00D4D8' }} />
      </div>
      <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>{text}</p>
    </div>
  );
};
export default Loading;
