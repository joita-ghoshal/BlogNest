import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiOutlinePencil } from "react-icons/hi";
import blogService from "../../services/blogService";

export default function PopularAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await blogService.getFeaturedBlogs();
        const blogs = data.blogs || data || [];
        const authorMap = new Map();
        blogs.forEach((blog) => {
          if (blog.author && !authorMap.has(blog.author._id)) {
            authorMap.set(blog.author._id, blog.author);
          }
        });
        setAuthors(Array.from(authorMap.values()).slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch authors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-40 h-32 rounded-2xl" style={{ backgroundColor: "var(--bg-tertiary)" }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!authors.length) return null;

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
            Popular Authors
          </h2>
          <p className="mt-2 text-base" style={{ color: "var(--text-secondary)" }}>
            Follow writers who inspire you
          </p>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {authors.map((author, index) => (
          <motion.div
            key={author._id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="flex-shrink-0"
          >
            <Link
              to={`/profile/${author._id}`}
              className="block w-40 p-5 rounded-2xl text-center transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
            >
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-16 h-16 rounded-full mx-auto object-cover"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-xl font-bold text-[#00D4D8]"
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
                >
                  {author.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <h3
                className="mt-3 font-semibold text-sm line-clamp-1"
                style={{ color: "var(--text-primary)" }}
              >
                {author.name}
              </h3>
              <p className="mt-1 flex items-center justify-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                <HiOutlinePencil className="text-xs" />
                {author.blogCount || 0} blogs
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
