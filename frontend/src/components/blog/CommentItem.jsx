import { useState } from "react";
import { HiOutlineHeart, HiHeart, HiOutlineReply, HiOutlineTrash } from "react-icons/hi";
import commentService from "../../services/commentService";
import { timeAgo } from "../../utils/helpers";

export default function CommentItem({ comment, currentUserId, onDelete, onReply, blogId }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [liked, setLiked] = useState(
    comment.likes?.includes(currentUserId) || false
  );
  const [likeCount, setLikeCount] = useState(comment.likes?.length || 0);
  const [submitting, setSubmitting] = useState(false);

  const isAuthor = currentUserId && comment.author?._id === currentUserId;

  const handleLike = async () => {
    if (!currentUserId) return;
    try {
      await commentService.toggleLike(comment._id);
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await commentService.deleteComment(comment._id);
      onDelete(comment._id);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || submitting) return;
    setSubmitting(true);
    try {
      const data = await commentService.createComment({
        blogId,
        content: replyContent.trim(),
        parentComment: comment._id,
      });
      onReply(comment._id, data.comment || data);
      setReplyContent("");
      setShowReplyForm(false);
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div
        className="p-4 sm:p-5 rounded-2xl"
        style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
      >
        <div className="flex gap-3">
          {comment.author?.avatar ? (
            <img
              src={comment.author.avatar}
              alt={comment.author.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-[#00D4D8] flex-shrink-0"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            >
              {comment.author?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {comment.author?.name || "Unknown"}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {comment.content}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-xs transition-colors hover:opacity-80"
                style={{ color: liked ? "#EF4444" : "var(--text-muted)" }}
              >
                {liked ? <HiHeart className="text-sm fill-current" /> : <HiOutlineHeart className="text-sm" />}
                {likeCount > 0 && <span>{likeCount}</span>}
              </button>
              {currentUserId && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-1 text-xs transition-colors hover:opacity-80"
                  style={{ color: "var(--text-muted)" }}
                >
                  <HiOutlineReply className="text-sm" />
                  Reply
                </button>
              )}
              {isAuthor && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-xs transition-colors hover:opacity-80"
                  style={{ color: "#EF4444" }}
                >
                  <HiOutlineTrash className="text-sm" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="ml-12 mt-3">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            rows={2}
            className="w-full py-3 px-4 text-sm rounded-xl border outline-none resize-none transition-colors"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          />
          <div className="mt-2 flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowReplyForm(false);
                setReplyContent("");
              }}
              className="py-2 px-4 text-sm rounded-xl"
              style={{ color: "var(--text-muted)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!replyContent.trim() || submitting}
              className="py-2 px-4 text-sm font-medium rounded-xl bg-[#00D4D8] text-gray-900 hover:bg-[#00BFC2] transition-colors disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Reply"}
            </button>
          </div>
        </form>
      )}

      {comment.replies?.length > 0 && (
        <div className="ml-8 sm:ml-12 mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              currentUserId={currentUserId}
              onDelete={(id) => {
                onDelete(id);
              }}
              onReply={onReply}
              blogId={blogId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
