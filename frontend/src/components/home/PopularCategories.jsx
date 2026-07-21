import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import categoryService from "../../services/categoryService";
import {
  HiCode,
  HiBookOpen,
  HiPhotograph,
  HiDesktopComputer,
  HiMusicNote,
  HiGlobeAlt,
  HiLightBulb,
  HiBeaker,
} from "react-icons/hi";

const iconMap = {
  technology: HiDesktopComputer,
  code: HiCode,
  programming: HiCode,
  lifestyle: HiGlobeAlt,
  travel: HiGlobeAlt,
  photography: HiPhotograph,
  design: HiLightBulb,
  health: HiBeaker,
  music: HiMusicNote,
  education: HiBookOpen,
};

const defaultIcon = HiBookOpen;

export default function PopularCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        const cats = data.categories || data || [];
        setCategories(cats.slice(0, 8));
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getIcon = (name) => {
    const key = (name || "").toLowerCase();
    for (const [k, v] of Object.entries(iconMap)) {
      if (key.includes(k)) return v;
    }
    return defaultIcon;
  };

  if (loading) {
    return (
      <section className="py-14 sm:py-20" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-2xl" style={{ backgroundColor: "var(--bg-tertiary)" }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="py-14 sm:py-20" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Popular Categories
          </h2>
          <p className="mt-2 text-base" style={{ color: "var(--text-secondary)" }}>
            Browse topics that interest you
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => {
            const Icon = getIcon(category.name);
            return (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  to={`/blogs?category=${category.slug || category._id}`}
                  className="block p-5 sm:p-6 rounded-2xl text-center transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)" }}
                >
                  <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center bg-[#00D4D8]/10">
                    <Icon className="text-2xl text-[#00D4D8]" />
                  </div>
                  <h3 className="mt-3 font-semibold text-sm sm:text-base" style={{ color: "var(--text-primary)" }}>
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
                    {category.blogCount || category.count || 0} blogs
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
