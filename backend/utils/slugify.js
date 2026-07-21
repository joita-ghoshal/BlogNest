const slugify = (text) => {
  const baseSlug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomStr}`;
};

module.exports = slugify;
