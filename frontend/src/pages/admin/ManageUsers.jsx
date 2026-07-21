import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiTrash, HiExclamationCircle } from 'react-icons/hi';
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
  const [updatingRole, setUpdatingRole] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminService.getUsers();
        setUsers(res.data?.users || res.users || []);
      } catch {
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      setUpdatingRole(userId);
      await adminService.updateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    } finally {
      setUpdatingRole(null);
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

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  const columns = ['User', 'Email', 'Role', 'Joined', 'Actions'];

  const rows = users.map((user) => ({
    _id: user._id,
    cells: [
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ color: '#00D4D8' }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</span>
      </div>,
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.email}</span>,
      <select
        value={user.role}
        onChange={(e) => handleRoleChange(user._id, e.target.value)}
        disabled={updatingRole === user._id}
        className="py-1.5 px-2 text-sm rounded-lg outline-none disabled:opacity-50"
        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>,
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{formatDate(user.createdAt)}</span>,
      <button
        onClick={() => setDeleteId(user._id)}
        className="p-2 rounded-lg transition-colors"
        style={{ color: '#EF4444' }}
        title="Delete user"
      >
        <HiTrash className="w-4 h-4" />
      </button>,
    ],
  }));

  return (
    <>
      <Helmet>
        <title>Manage Users - Admin - BlogNest</title>
      </Helmet>

      <div className="p-6 sm:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
            Manage Users
          </h1>

          <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <AdminTable columns={columns} rows={rows} />
          </div>
        </motion.div>

        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
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
      </div>
    </>
  );
};

export default ManageUsers;
