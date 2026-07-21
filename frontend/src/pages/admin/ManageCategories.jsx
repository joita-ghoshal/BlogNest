import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import { formatDate } from '../../utils/helpers';
import AdminTable from '../../components/admin/AdminTable';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await adminService.getAllCategories();
        setCategories(res.data?.categories || res.categories || []);
      } catch {
        toast.error('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCat(null);
    reset({ name: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setValue('name', cat.name);
    setValue('description', cat.description || '');
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      if (editingCat) {
        await adminService.updateBlog(editingCat._id, data);
        setCategories((prev) =>
          prev.map((c) =>
            c._id === editingCat._id ? { ...c, name: data.name, description: data.description } : c
          )
        );
        toast.success('Category updated');
      } else {
        const res = await adminService.updateBlog('category', data);
        const newCat = res.data?.category || res.category || res.data || res;
        setCategories((prev) => [...prev, newCat]);
        toast.success('Category created');
      }
      setShowModal(false);
    } catch {
      toast.error('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.adminDeleteComment(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success('Category deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  const columns = ['Name', 'Description', 'Slug', 'Date', 'Actions'];

  const rows = categories.map((cat) => ({
    _id: cat._id,
    cells: [
      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{cat.name}</span>,
      <span className="text-sm truncate block max-w-[250px]" style={{ color: 'var(--text-secondary)' }}>{cat.description || '-'}</span>,
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{cat.slug}</span>,
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{formatDate(cat.createdAt)}</span>,
      <div className="flex items-center gap-2">
        <button onClick={() => openEditModal(cat)} className="p-2 rounded-lg" style={{ color: '#00D4D8' }}><HiPencil className="w-4 h-4" /></button>
        <button onClick={() => setDeleteId(cat._id)} className="p-2 rounded-lg" style={{ color: '#EF4444' }}><HiTrash className="w-4 h-4" /></button>
      </div>,
    ],
  }));

  return (
    <>
      <Helmet>
        <title>Manage Categories - Admin - BlogNest</title>
      </Helmet>

      <div className="p-6 sm:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Manage Categories</h1>
            <button
              onClick={openAddModal}
              className="py-3 px-6 text-base font-semibold rounded-xl flex items-center gap-2"
              style={{ backgroundColor: '#00D4D8', color: '#000' }}
            >
              <HiPlus className="w-5 h-5" /> Add Category
            </button>
          </div>

          <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <AdminTable columns={columns} rows={rows} />
          </div>
        </motion.div>

        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-5"
              style={{ backgroundColor: 'var(--bg-secondary)' }} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingCat ? 'Edit Category' : 'Add Category'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Name</label>
                  <input {...register('name', { required: 'Name is required' })}
                    className="w-full py-3 px-4 text-base rounded-xl outline-none"
                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: errors.name ? '1px solid #EF4444' : '1px solid var(--border)' }} />
                  {errors.name && <p className="text-sm mt-1" style={{ color: '#EF4444' }}>{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
                  <textarea {...register('description')} rows={3}
                    className="w-full py-3 px-4 text-base rounded-xl outline-none resize-none"
                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 px-6 text-base font-medium rounded-xl border"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 py-3 px-6 text-base font-semibold rounded-xl"
                    style={{ backgroundColor: '#00D4D8', color: '#000' }}>
                    {saving ? 'Saving...' : editingCat ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-5"
              style={{ backgroundColor: 'var(--bg-secondary)' }} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>Delete Category?</h3>
              <p className="text-center" style={{ color: 'var(--text-secondary)' }}>Blogs in this category may be affected.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 px-6 text-base font-medium rounded-xl border" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 px-6 text-base font-semibold rounded-xl" style={{ backgroundColor: '#EF4444', color: '#FFF' }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ManageCategories;
