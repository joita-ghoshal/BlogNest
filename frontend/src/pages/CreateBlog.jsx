import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import blogService from '../services/blogService';
import categoryService from '../services/categoryService';
import RichTextEditor from '../components/editor/RichTextEditor';
import ImageUpload from '../components/editor/ImageUpload';
import toast from 'react-hot-toast';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState('');
  const draftRef = useRef(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await categoryService.getCategories();
        setCategories(res.data || res.categories || res || []);
      } catch {}
    };
    fetch();
  }, []);

  const onSubmit = async (data) => {
    if (!content || content === '<p><br></p>') {
      toast.error('Content is required');
      return;
    }
    const publishAsDraft = draftRef.current;
    draftRef.current = false;
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', content);
      formData.append('category', data.category);
      formData.append('isPublished', publishAsDraft ? 'false' : 'true');
      if (data.excerpt) formData.append('excerpt', data.excerpt);
      if (featuredImage) formData.append('image', featuredImage);
      if (tags) formData.append('tags', tags);
      const res = await blogService.createBlog(formData);
      toast.success(publishAsDraft ? 'Draft saved!' : 'Blog created!');
      navigate(`/blogs/${res.data?.slug || ''}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create blog');
    }
  };

  return (
    <>
      <Helmet><title>Create Blog - BlogNest</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
        <h1 className="text-2xl font-bold mb-6 sm:mb-8" style={{ color: 'var(--text-primary)' }}>Create New Blog</h1>
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6" style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Title</label>
            <input {...register('title', { required: 'Title is required' })} className="w-full px-4 py-3 rounded-xl text-lg font-semibold outline-none focus:ring-2 focus:ring-[#00D4D8]/50" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} placeholder="Enter blog title" />
            {errors.title && <p className="text-xs mt-1 text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Excerpt</label>
            <textarea {...register('excerpt')} rows={2} className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-[#00D4D8]/50" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} placeholder="Brief summary of your blog..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
              <select {...register('category', { required: 'Category is required' })} className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00D4D8]/50" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <option value="">Select category</option>
                {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
              {errors.category && <p className="text-xs mt-1 text-red-500">{errors.category.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tags (comma separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00D4D8]/50" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} placeholder="react, javascript, web" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Featured Image</label>
            <ImageUpload value={null} onChange={setFeaturedImage} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Content</label>
            <RichTextEditor value={content} onChange={setContent} placeholder="Write your blog content..." />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-70" style={{ backgroundColor: '#00D4D8' }}>
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
            <button type="button" onClick={() => { draftRef.current = true; document.querySelector('form').requestSubmit(); }} disabled={isSubmitting} className="px-6 py-3 text-sm font-medium rounded-xl border transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              Save Draft
            </button>
          </div>
        </motion.form>
      </div>
    </>
  );
};

export default CreateBlog;
