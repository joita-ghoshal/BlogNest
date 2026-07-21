import { useState } from "react";
import { HiLink } from "react-icons/hi";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
} from "react-icons/fa";

export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title || "");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition-all hover:opacity-80"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        <FaTwitter className="text-base" />
        <span className="hidden sm:inline">Twitter</span>
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition-all hover:opacity-80"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        <FaFacebookF className="text-base" />
        <span className="hidden sm:inline">Facebook</span>
      </a>

      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition-all hover:opacity-80"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        <FaLinkedinIn className="text-base" />
        <span className="hidden sm:inline">LinkedIn</span>
      </a>

      <button
        onClick={copyLink}
        className="flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition-all hover:opacity-80"
        style={{
          backgroundColor: copied ? "#00D4D8" : "var(--bg-secondary)",
          color: copied ? "white" : "var(--text-secondary)",
          border: `1px solid ${copied ? "#00D4D8" : "var(--border)"}`,
        }}
      >
        <HiLink className="text-base" />
        <span>{copied ? "Copied!" : "Copy Link"}</span>
      </button>
    </div>
  );
}
