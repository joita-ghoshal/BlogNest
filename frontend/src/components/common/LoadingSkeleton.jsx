const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  const CardSkeleton = () => (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        className="aspect-[16/10] skeleton-pulse"
        style={{ backgroundColor: 'var(--bg-tertiary)' }}
      />
      <div className="p-5 space-y-3">
        <div
          className="h-4 w-16 rounded-full skeleton-pulse"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        />
        <div
          className="h-5 w-3/4 rounded-lg skeleton-pulse"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        />
        <div
          className="h-4 w-full rounded-lg skeleton-pulse"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        />
        <div
          className="h-4 w-2/3 rounded-lg skeleton-pulse"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        />
        <div className="flex items-center gap-3 pt-2">
          <div
            className="w-8 h-8 rounded-full skeleton-pulse"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          />
          <div className="space-y-1.5">
            <div
              className="h-3 w-20 rounded skeleton-pulse"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            />
            <div
              className="h-2.5 w-14 rounded skeleton-pulse"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const TextSkeleton = () => (
    <div className="space-y-3">
      <div
        className="h-6 w-1/2 rounded-lg skeleton-pulse"
        style={{ backgroundColor: 'var(--bg-tertiary)' }}
      />
      <div
        className="h-4 w-full rounded-lg skeleton-pulse"
        style={{ backgroundColor: 'var(--bg-tertiary)' }}
      />
      <div
        className="h-4 w-4/5 rounded-lg skeleton-pulse"
        style={{ backgroundColor: 'var(--bg-tertiary)' }}
      />
      <div
        className="h-4 w-3/5 rounded-lg skeleton-pulse"
        style={{ backgroundColor: 'var(--bg-tertiary)' }}
      />
    </div>
  );

  const AvatarSkeleton = () => (
    <div className="flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-full skeleton-pulse shrink-0"
        style={{ backgroundColor: 'var(--bg-tertiary)' }}
      />
      <div className="space-y-2">
        <div
          className="h-4 w-24 rounded-lg skeleton-pulse"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        />
        <div
          className="h-3 w-16 rounded-lg skeleton-pulse"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        />
      </div>
    </div>
  );

  const skeletons = {
    card: CardSkeleton,
    text: TextSkeleton,
    avatar: AvatarSkeleton,
  };

  const Skeleton = skeletons[type] || CardSkeleton;

  return (
    <div
      className={`grid gap-6 ${
        type === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''
      }`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
