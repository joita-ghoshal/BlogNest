import { HiOutlineFilter } from "react-icons/hi";

export default function BlogFilters({ categories = [], filters, onFilterChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <select
          value={filters.category || ""}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="w-full py-3 px-4 pr-10 text-base rounded-xl border outline-none appearance-none transition-colors cursor-pointer"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug || cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <HiOutlineFilter
          className="absolute right-3 top-1/2 -translate-y-1/2 text-base pointer-events-none"
          style={{ color: "var(--text-muted)" }}
        />
      </div>

      <div className="relative flex-1 sm:flex-initial sm:w-48">
        <select
          value={filters.sort || "latest"}
          onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
          className="w-full py-3 px-4 pr-10 text-base rounded-xl border outline-none appearance-none transition-colors cursor-pointer"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Popular</option>
          <option value="discussed">Most Discussed</option>
        </select>
        <HiOutlineFilter
          className="absolute right-3 top-1/2 -translate-y-1/2 text-base pointer-events-none"
          style={{ color: "var(--text-muted)" }}
        />
      </div>
    </div>
  );
}
