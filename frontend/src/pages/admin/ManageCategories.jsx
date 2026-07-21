import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import adminService from '../../services/adminService';
import categoryService from '../../services/categoryService';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await adminService.getAllCategories();
      setCategories(res.categories || res.data || []);
    } catch {} finally { setLoading(false); }
  };

  const openModal = (cat = null) => {
    setEditingCategory(cat);
    setName(cat?.name || '');
    setDescription(cat?.description || '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, { name, description });
        setCategories((prev) => prev.map((c) => c._id === editingCategory._id ? { ...c, name, description } : c));
        toast.success('Category updated');
      } else {
        const res = await categoryService.createCategory({ name, description });
        setCategories((prev) => [...prev, res.data || res.category || res]);
        toast.success('Category created');
      }
      setModalOpen(false);
      setName('');
      setDescription('');
    } catch { toast.error('Failed to save category'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await categoryService.deleteCategory(deleteId);
      setCategories((prev) => prev.filter((c) => c._id !== deleteId));
      toast.success('Category deleted');
    } catch { toast.error('Failed to delete category'); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{row.name}</span> },
    { key: 'description', label: 'Description', render: (row) => <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{row.description || '-'}</span> },
    { key: 'blogCount', label: 'Blogs', render: (row) => <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{row.blogCount || 0}</span> },
    { key: 'actions', label: 'Actions', render: (row) => (
      <div className="flex gap-2">
        <button onClick={() => openModal(row)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)]" style={{ color: 'var(--text-muted)' }}><HiPencil size={16} /></button>
        <button onClick={() => setDeleteId(row._id)} className="p-1.5 rounded-lg hover:bg-red-50" style={{ color: '#EF4444' }}><HiTrash size={16} /></button>
      </div>
    )},
  ];

  return (
    <>
      <Helmet><title>Manage Categories - Admin - BlogNest</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Manage Categories</h1>
          <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl" style={{ backgroundColor: '#00D4D8' }}>
            <HiPlus size={18} /> Add Category
          </button>
        </div>
        {loading ? <Loading /> : <AdminTable columns={columns} data={categories} />}
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Category" message="Are you sure you want to delete this category?" />

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md rounded-2xl p-6 shadow-xl" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{editingCategory ? 'Edit' : 'Add'} Category</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00D4D8]/50" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} placeholder="Category name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-[#00D4D8]/50" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} placeholder="Optional description" />
                </div>
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
                <button onClick={handleSave} disabled={!name.trim() || saving} className="px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-70" style={{ backgroundColor: '#00D4D8' }}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ManageCategories;
