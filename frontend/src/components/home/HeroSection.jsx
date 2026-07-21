import { useState } from "react";
import { motion } from "framer-motion";
import { HiSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Articles", value: "10K+" },
  { label: "Writers", value: "5K+" },
  { label: "Categories", value: "50+" },
];

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00D4D8]/10 via-transparent to-[#00D4D8]/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#00D4D8]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00D4D8]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Discover Ideas &{" "}
            <span className="text-[#00D4D8]">Share Your Story</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Explore a world of knowledge, inspiration, and creativity. Read
            thought-provoking articles and join our community of passionate
            writers.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSearch}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <div className="relative flex-1">
              <HiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-lg"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics, authors..."
                className="w-full py-4 px-5 pl-12 text-base rounded-xl border outline-none transition-colors"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <button
              type="submit"
              className="py-4 px-8 bg-[#00D4D8] text-gray-900 font-semibold rounded-xl hover:bg-[#00BFC2] transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-wrap justify-center gap-8 sm:gap-12"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="text-2xl sm:text-3xl font-bold text-[#00D4D8]"
                >
                  {stat.value}
                </p>
                <p
                  className="mt-1 text-sm sm:text-base"
                  style={{ color: "var(--text-muted)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
