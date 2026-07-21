import { useState } from "react";
import { HiBookmark } from "react-icons/hi";
import useAuth from "../../hooks/useAuth";
import { blogService } from "../../services/blogService";

export default function BlogBookmarkButton({ blogId, isBookmarked = false, onToggle }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleToggle = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await blogService.toggleBookmark(blogId);
      setBookmarked(data.bookmarked ?? !bookmarked);
      if (onToggle) onToggle(data);
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
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
        backgroundColor: bookmarked ? "var(--bg-tertiary)" : "var(--bg-secondary)",
        color: bookmarked ? "#00D4D8" : "var(--text-secondary)",
        border: `1px solid ${bookmarked ? "#00D4D8" : "var(--border)"}`,
      }}
    >
      <HiBookmark className={`text-lg ${bookmarked ? "fill-current" : ""}`} />
      <span>{bookmarked ? "Saved" : "Save"}</span>
    </button>
  );
}
