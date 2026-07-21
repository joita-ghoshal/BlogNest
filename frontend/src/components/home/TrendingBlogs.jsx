import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiOutlineHeart } from "react-icons/hi";
import blogService from "../../services/blogService";
import { truncateText } from "../../utils/helpers";

export default function TrendingBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getTrendingBlogs();
        setBlogs(data.blogs || data || []);
      } catch (err) {
        console.error("Failed to fetch trending blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded-lg" style={{ backgroundColor: "var(--bg-tertiary)" }} />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 rounded-2xl" style={{ backgroundColor: "var(--bg-tertiary)" }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!blogs.length) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Trending Now
          </h2>
          <p className="mt-2 text-base" style={{ color: "var(--text-secondary)" }}>
            Most popular articles this week
          </p>
        </motion.div>

        <div className="space-y-4">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                to={`/blog/${blog.slug}`}
                className="flex items-start gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl transition-colors hover:opacity-80"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
              >
                <span
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-[#00D4D8]"
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-base sm:text-lg font-semibold line-clamp-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {blog.title}
                  </h3>
                  <p
                    className="mt-1 text-sm line-clamp-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {truncateText(blog.excerpt || blog.content, 120)}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
                    <span>{blog.author?.name || "Unknown"}</span>
                    <span className="flex items-center gap-1">
                      <HiOutlineHeart className="text-base" />
                      {blog.likes?.length || 0}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
