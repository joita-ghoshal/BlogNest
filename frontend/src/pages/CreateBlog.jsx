import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import blogService from '../services/blogService';
import categoryService from '../services/categoryService';
import RichTextEditor from '../components/editor/RichTextEditor';
import ImageUpload from '../components/editor/ImageUpload';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [tags, setTags] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        setCategories(res.data?.categories || res.categories || []);
      } catch {
        // ignore
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data, isDraft = false) => {
    if (!content || content === '<p><br></p>') {
      toast.error('Please add some content');
      return;
    }

    try {
      setPublishing(true);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('content', content);
      formData.append('category', data.category);
      formData.append('isPublished', String(!isDraft));

      if (tags) {
        tags.split(',').forEach((t) => {
          const trimmed = t.trim();
          if (trimmed) formData.append('tags', trimmed);
        });
      }

      if (featuredImage) {
        formData.append('featuredImage', featuredImage);
      }

      const res = await blogService.createBlog(formData);
      toast.success(isDraft ? 'Draft saved successfully' : 'Blog published successfully');
      navigate('/my-blogs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create blog');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Blog - BlogNest</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
            Create New Blog
          </h1>

          <form className="rounded-2xl p-6 sm:p-8 space-y-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Title
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                placeholder="Enter blog title"
                className="w-full py-3 px-4 text-base rounded-xl outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: errors.title ? '1px solid #EF4444' : '1px solid var(--border)',
                }}
              />
              {errors.title && <p className="text-sm mt-1" style={{ color: '#EF4444' }}>{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Excerpt
              </label>
              <textarea
                {...register('excerpt', { required: 'Excerpt is required' })}
                placeholder="Brief description of your blog"
                rows={3}
                className="w-full py-3 px-4 text-base rounded-xl outline-none transition-colors resize-none"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: errors.excerpt ? '1px solid #EF4444' : '1px solid var(--border)',
                }}
              />
              {errors.excerpt && <p className="text-sm mt-1" style={{ color: '#EF4444' }}>{errors.excerpt.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Category
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full py-3 px-4 text-base rounded-xl outline-none transition-colors appearance-none"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    border: errors.category ? '1px solid #EF4444' : '1px solid var(--border)',
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-sm mt-1" style={{ color: '#EF4444' }}>{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Tags (comma separated)
                </label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="react, javascript, web"
                  className="w-full py-3 px-4 text-base rounded-xl outline-none transition-colors"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Featured Image
              </label>
              <ImageUpload
                file={featuredImage}
                previewUrl={previewUrl}
                onUpload={(file, url) => { setFeaturedImage(file); setPreviewUrl(url); }}
                onRemove={() => { setFeaturedImage(null); setPreviewUrl(''); }}
                accept="image/*"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Content
              </label>
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your blog content here..."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, true))}
                disabled={publishing}
                className="py-3 px-6 text-base font-medium rounded-xl border transition-colors disabled:opacity-50"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-tertiary)' }}
              >
                {publishing ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, false))}
                disabled={publishing}
                className="py-3 px-6 text-base font-semibold rounded-xl transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#00D4D8', color: '#000' }}
              >
                {publishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default CreateBlog;
