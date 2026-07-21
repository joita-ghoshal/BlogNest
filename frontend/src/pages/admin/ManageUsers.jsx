import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiTrash, HiExclamationCircle, HiPencil, HiCheck, HiX } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import { formatDate } from '../../utils/helpers';
import AdminTable from '../../components/admin/AdminTable';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', bio: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers();
      const userList = res.data?.users || res.users || res.data || [];
      setUsers(Array.isArray(userList) ? userList : []);
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      setUpdatingId(userId);
      await adminService.updateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      setUpdatingId(userId);
      const res = await adminService.toggleUserActive(userId);
      const updatedUser = res.data;
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isActive: updatedUser.isActive } : u)));
      toast.success(updatedUser.isActive ? 'User activated' : 'User deactivated');
    } catch {
      toast.error('Failed to update user status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const startEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({ name: user.name || '', email: user.email || '', bio: user.bio || '' });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '', bio: '' });
  };

  const saveEdit = async (userId) => {
    try {
      setUpdatingId(userId);
      await adminService.updateUser(userId, editForm);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, ...editForm } : u)));
      toast.success('User updated');
      cancelEdit();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  const columns = ['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'];

  const rows = users.map((user) => ({
    _id: user._id,
    cells: [
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          {user.avatar?.url ? (
            <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ color: '#00D4D8' }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {editingUser === user._id ? (
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
            className="py-1 px-2 text-sm rounded-lg outline-none w-32"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid #00D4D8' }}
          />
        ) : (
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</span>
        )}
      </div>,
      editingUser === user._id ? (
        <input
          type="email"
          value={editForm.email}
          onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
          className="py-1 px-2 text-sm rounded-lg outline-none w-40"
          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid #00D4D8' }}
        />
      ) : (
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
      ),
      <select
        value={user.role}
        onChange={(e) => handleRoleChange(user._id, e.target.value)}
        disabled={updatingId === user._id}
        className="py-1.5 px-2 text-sm rounded-lg outline-none disabled:opacity-50"
        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>,
      <button
        onClick={() => handleToggleActive(user._id)}
        disabled={updatingId === user._id}
        className="py-1 px-3 text-xs font-semibold rounded-full transition-colors disabled:opacity-50"
        style={{
          backgroundColor: user.isActive !== false ? 'rgba(0,212,216,0.1)' : 'rgba(239,68,68,0.1)',
          color: user.isActive !== false ? '#00D4D8' : '#EF4444',
        }}
      >
        {user.isActive !== false ? 'Active' : 'Inactive'}
      </button>,
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{formatDate(user.createdAt)}</span>,
      <div className="flex items-center gap-1">
        {editingUser === user._id ? (
          <>
            <button
              onClick={() => saveEdit(user._id)}
              disabled={updatingId === user._id}
              className="p-2 rounded-lg transition-colors"
              style={{ color: '#00D4D8' }}
              title="Save"
            >
              <HiCheck className="w-4 h-4" />
            </button>
            <button onClick={cancelEdit} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }} title="Cancel">
              <HiX className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => startEdit(user)} className="p-2 rounded-lg transition-colors" style={{ color: '#3B82F6' }} title="Edit user">
              <HiPencil className="w-4 h-4" />
            </button>
            <button onClick={() => setDeleteId(user._id)} className="p-2 rounded-lg transition-colors" style={{ color: '#EF4444' }} title="Delete user">
              <HiTrash className="w-4 h-4" />
            </button>
          </>
        )}
      </div>,
    ],
  }));

  return (
    <>
      <Helmet>
        <title>Manage Users - Admin - BlogNest</title>
      </Helmet>

      <div className="p-6 sm:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Manage Users
            </h1>
            <span className="text-sm px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
              {users.length} total
            </span>
          </div>

          <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <AdminTable columns={columns} rows={rows} />
          </div>
        </motion.div>

        <AnimatePresence>
          {deleteId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={() => setDeleteId(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-5"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <HiExclamationCircle className="w-12 h-12 mx-auto" style={{ color: '#EF4444' }} />
                <h3 className="text-xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>Delete User?</h3>
                <p className="text-center" style={{ color: 'var(--text-secondary)' }}>This user and their blogs will be permanently removed.</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-3 px-6 text-base font-medium rounded-xl border"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteId)}
                    className="flex-1 py-3 px-6 text-base font-semibold rounded-xl"
                    style={{ backgroundColor: '#EF4444', color: '#FFF' }}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ManageUsers;
