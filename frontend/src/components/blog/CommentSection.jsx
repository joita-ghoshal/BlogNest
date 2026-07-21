import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import commentService from '../../services/commentService';
import CommentItem from './CommentItem';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';

const CommentSection = ({ blogId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const res = await commentService.getComments(blogId);
      setComments(res.comments || res.data || res || []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const data = { blogId: blogId, content: text, parentCommentId: replyTo || undefined };
      const res = await commentService.createComment(data);
      const newComment = res.comment || res.data || res;
      if (replyTo) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === replyTo
              ? { ...c, replies: [...(c.replies || []), newComment] }
              : c
          )
        );
      } else {
        setComments((prev) => [newComment, ...prev]);
      }
      setText('');
      setReplyTo(null);
      toast.success('Comment added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments((prev) =>
        prev
          .filter((c) => c._id !== commentId)
          .map((c) => ({
            ...c,
            replies: (c.replies || []).filter((r) => r._id !== commentId),
          }))
      );
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const handleLike = async (commentId) => {
    try {
      const res = await commentService.toggleLike(commentId);
      const data = res.data || res;
      setComments((prev) =>
        prev.map((c) => {
          if (c._id === commentId) return { ...c, likes: data.likes || [] };
          return {
            ...c,
            replies: (c.replies || []).map((r) => (r._id === commentId ? { ...r, likes: data.likes || [] } : r)),
          };
        })
      );
    } catch {
      toast.error('Failed to like comment');
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        Comments ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {replyTo && (
            <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: '#00D4D8' }}>
              Replying to comment
              <button type="button" onClick={() => setReplyTo(null)} className="underline" style={{ color: 'var(--text-muted)' }}>Cancel</button>
            </div>
          )}
          <div className="flex gap-3">
            <div className="hidden sm:block">
              <Avatar user={user} size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="sm:hidden mb-2">
                <Avatar user={user} size="sm" />
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border text-sm resize-none outline-none focus:ring-2 focus:ring-[#00D4D8]/50 transition-all"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!text.trim() || submitting}
                  className="px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#00D4D8' }}
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Please <a href="/login" className="text-[#00D4D8] underline">login</a> to leave a comment.
        </p>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full skeleton-pulse" style={{ backgroundColor: 'var(--bg-tertiary)' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 rounded skeleton-pulse" style={{ backgroundColor: 'var(--bg-tertiary)' }} />
                  <div className="h-3 w-full rounded skeleton-pulse" style={{ backgroundColor: 'var(--bg-tertiary)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUser={user}
              onDelete={handleDelete}
              onLike={handleLike}
              onReply={(id) => { setReplyTo(id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
