const BlogContent = ({ content }) => {
  if (!content) return null;

  return (
    <div
      className="prose prose-lg max-w-none"
      style={{
        color: 'var(--text-secondary)',
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogContent;
