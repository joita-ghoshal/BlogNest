import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import blogService from "../../services/blogService";
import BlogCard from "../common/BlogCard";

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getLatestBlogs();
        setBlogs(data.blogs || data || []);
      } catch (err) {
        console.error("Failed to fetch latest blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-14 sm:py-20" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded-lg" style={{ backgroundColor: "var(--bg-tertiary)" }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-2xl" style={{ backgroundColor: "var(--bg-tertiary)" }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!blogs.length) return null;

  return (
    <section className="py-14 sm:py-20" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
              Latest Blogs
            </h2>
            <p className="mt-2 text-base" style={{ color: "var(--text-secondary)" }}>
              Fresh content published recently
            </p>
          </div>
          <Link
            to="/blogs"
            className="hidden sm:flex items-center gap-1 text-[#00D4D8] font-medium hover:underline"
          >
            View All
            <HiArrowRight className="text-lg" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 sm:hidden text-center">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1 text-[#00D4D8] font-medium hover:underline"
          >
            View All
            <HiArrowRight className="text-lg" />
          </Link>
        </div>
      </div>
    </section>
  );
}
