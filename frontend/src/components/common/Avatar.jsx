const Avatar = ({ user, size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-lg', xl: 'w-24 h-24 text-2xl' };
  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  const avatarUrl = typeof user?.avatar === 'string' ? user.avatar : (user?.avatar?.url || '');
  if (avatarUrl) {
    return <img src={avatarUrl} alt={user.name || 'User'} className={`${sizes[size]} rounded-full object-cover ring-2 ring-[#00D4D8]/20`} />;
  }
  return <div className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white bg-[#00D4D8]`}>{initials}</div>;
};
export default Avatar;
