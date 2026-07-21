import { HiOutlineClock, HiOutlineEye, HiOutlineCalendar } from "react-icons/hi";
import { formatDate, estimateReadTime } from "../../utils/helpers";

export default function BlogMeta({ blog }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {blog.category && (
          <span className="px-3 py-1 text-sm font-medium rounded-lg bg-[#00D4D8]/10 text-[#00D4D8]">
            {blog.category.name || blog.category}
          </span>
        )}
        {blog.tags?.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-sm rounded-lg"
            style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-muted)" }}
          >
            #{tag}
          </span>
        ))}
      </div>

      <h1
        className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
        style={{ color: "var(--text-primary)" }}
      >
        {blog.title}
      </h1>

      {blog.excerpt && (
        <p className="text-lg sm:text-xl" style={{ color: "var(--text-secondary)" }}>
          {blog.excerpt}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <div className="flex items-center gap-3">
          {blog.author?.avatar ? (
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-[#00D4D8]"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            >
              {blog.author?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {blog.author?.name || "Unknown Author"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
          <span className="flex items-center gap-1">
            <HiOutlineCalendar className="text-base" />
            {formatDate(blog.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <HiOutlineClock className="text-base" />
            {estimateReadTime(blog.content)} min read
          </span>
          <span className="flex items-center gap-1">
            <HiOutlineEye className="text-base" />
            {blog.views || 0} views
          </span>
        </div>
      </div>
    </div>
  );
}
