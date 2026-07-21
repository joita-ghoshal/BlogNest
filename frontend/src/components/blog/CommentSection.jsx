import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import commentService from "../../services/commentService";
import { timeAgo } from "../../utils/helpers";
import CommentItem from "./CommentItem";
import { Link } from "react-router-dom";

export default function CommentSection({ blogId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await commentService.getComments(blogId);
        setComments(data.comments || data || []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoading(false);
      }
    };
    if (blogId) fetchComments();
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      const data = await commentService.createComment({ blogId, content: content.trim() });
      const newComment = data.comment || data;
      setComments((prev) => [{ ...newComment, author: user }, ...prev]);
      setContent("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  const handleReply = (parentId, reply) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === parentId
          ? { ...c, replies: [...(c.replies || []), { ...reply, author: user }] }
          : c
      )
    );
  };

  return (
    <section className="py-10 sm:py-12 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
          Comments ({comments.length})
        </h2>

        {user ? (
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-[#00D4D8] flex-shrink-0"
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
                >
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  className="w-full py-3 px-4 text-base rounded-xl border outline-none transition-colors resize-none"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!content.trim() || submitting}
                    className="py-2 px-5 text-sm font-medium rounded-xl transition-colors disabled:opacity-50 bg-[#00D4D8] text-gray-900 hover:bg-[#00BFC2]"
                  >
                    {submitting ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div
            className="mb-8 p-5 rounded-2xl text-center"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Please{" "}
              <Link to="/login" className="text-[#00D4D8] font-medium hover:underline">
                sign in
              </Link>{" "}
              to leave a comment.
            </p>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-4 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)" }}>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full" style={{ backgroundColor: "var(--bg-tertiary)" }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 rounded" style={{ backgroundColor: "var(--bg-tertiary)" }} />
                    <div className="h-3 w-full rounded" style={{ backgroundColor: "var(--bg-tertiary)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div className="space-y-4" layout>
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUserId={user?._id}
                onDelete={handleDelete}
                onReply={handleReply}
                blogId={blogId}
              />
            ))}
            {!comments.length && (
              <p className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
