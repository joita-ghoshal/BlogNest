import { useState } from 'react';
import { FiTwitter, FiLinkedin, FiFacebook, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ShareButtons = ({ blog }) => {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const title = blog?.title || 'BlogNest Blog';

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const buttons = [
    { icon: FiTwitter, onClick: shareTwitter, color: '#1DA1F2', label: 'Twitter' },
    { icon: FiFacebook, onClick: shareFacebook, color: '#1877F2', label: 'Facebook' },
    { icon: FiLinkedin, onClick: shareLinkedIn, color: '#0A66C2', label: 'LinkedIn' },
    { icon: FiLink, onClick: copyLink, color: '#00D4D8', label: 'Copy Link' },
  ];

  return (
    <div className="flex items-center gap-2">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          onClick={btn.onClick}
          title={`Share on ${btn.label}`}
          className="p-2.5 rounded-xl transition-all hover:scale-105"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: btn.color,
            border: '1px solid var(--border)',
          }}
        >
          <btn.icon size={18} />
        </button>
      ))}
    </div>
  );
};

export default ShareButtons;
