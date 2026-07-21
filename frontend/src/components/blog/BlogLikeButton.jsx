import { useState } from "react";
import { HiHeart } from "react-icons/hi";
import useAuth from "../../hooks/useAuth";
import { blogService } from "../../services/blogService";

export default function BlogLikeButton({ blogId, likes = [], onToggle }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const isLiked = user && likes.includes(user._id);

  const handleToggle = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await blogService.toggleLike(blogId);
      if (onToggle) onToggle(data);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={!user || loading}
      className={`flex items-center gap-2 py-2 px-4 rounded-xl font-medium text-sm transition-all ${
        user ? "hover:opacity-80 cursor-pointer" : "opacity-50 cursor-not-allowed"
      }`}
      style={{
        backgroundColor: isLiked ? "#FEE2E2" : "var(--bg-secondary)",
        color: isLiked ? "#EF4444" : "var(--text-secondary)",
        border: `1px solid ${isLiked ? "#FCA5A5" : "var(--border)"}`,
      }}
    >
      <HiHeart className={`text-lg ${isLiked ? "fill-current" : ""}`} />
      <span>{likes.length}</span>
    </button>
  );
}
