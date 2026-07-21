const BlogContent = ({ content }) => {
  if (!content) return null;

  return (
    <div
      className="prose prose-lg max-w-none word-break"
      style={{
        color: 'var(--text-secondary)',
        lineHeight: '1.75',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogContent;
