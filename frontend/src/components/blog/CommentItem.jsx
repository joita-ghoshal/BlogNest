import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiHeart, HiReply, HiTrash } from 'react-icons/hi';
import Avatar from '../common/Avatar';
import { timeAgo } from '../../utils/helpers';

const CommentItem = ({ comment, currentUser, onDelete, onLike, onReply, depth = 0 }) => {
  const [showReplies, setShowReplies] = useState(true);
  const author = comment.user || comment.author || {};
  const replies = comment.replies || [];
  const isLiked = comment.likes?.includes(currentUser?._id);
  const isOwner = currentUser?._id === author._id;
  const isAdmin = currentUser?.role === 'admin';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${depth > 0 ? 'ml-8 md:ml-12' : ''}`}
    >
      <div
        className="p-4 rounded-xl"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-start gap-3">
          <Avatar user={author} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {author.name || 'Unknown'}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm mt-1 whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
              {comment.content}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => onLike(comment._id)}
                className="flex items-center gap-1 text-xs transition-colors"
                style={{ color: isLiked ? '#00D4D8' : 'var(--text-muted)' }}
              >
                <HiHeart size={14} className={isLiked ? 'fill-current' : ''} />
                {comment.likes?.length || 0}
              </button>
              {currentUser && depth === 0 && (
                <button
                  onClick={() => onReply(comment._id)}
                  className="flex items-center gap-1 text-xs transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <HiReply size={14} />
                  Reply
                </button>
              )}
              {(isOwner || isAdmin) && (
                <button
                  onClick={() => onDelete(comment._id)}
                  className="flex items-center gap-1 text-xs transition-colors"
                  style={{ color: '#EF4444' }}
                >
                  <HiTrash size={14} />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {replies.length > 0 && depth === 0 && (
        <div className="mt-3 space-y-3">
          {!showReplies ? (
            <button
              onClick={() => setShowReplies(true)}
              className="text-xs font-medium ml-12"
              style={{ color: '#00D4D8' }}
            >
              Show {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowReplies(false)}
                className="text-xs font-medium ml-12"
                style={{ color: '#00D4D8' }}
              >
                Hide replies
              </button>
              {replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  currentUser={currentUser}
                  onDelete={onDelete}
                  onLike={onLike}
                  onReply={onReply}
                  depth={1}
                />
              ))}
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CommentItem;
