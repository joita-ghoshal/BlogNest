export default function BlogContent({ content }) {
  return (
    <div
      className="prose prose-lg max-w-none"
      style={{
        color: "var(--text-primary)",
        ["--tw-prose-body"]: "var(--text-primary)",
        ["--tw-prose-headings"]: "var(--text-primary)",
        ["--tw-prose-links"]: "#00D4D8",
        ["--tw-prose-bold"]: "var(--text-primary)",
        ["--tw-prose-code"]: "var(--text-primary)",
        ["--tw-prose-quotes"]: "var(--text-secondary)",
        ["--tw-prose-quote-borders"]: "#00D4D8",
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
