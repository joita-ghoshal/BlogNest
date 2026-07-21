import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import adminService from '../../services/adminService';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loading from '../../components/common/Loading';
import Avatar from '../../components/common/Avatar';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.users || res.data || []);
    } catch {} finally { setLoading(false); }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await adminService.updateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role } : u));
      toast.success('Role updated');
    } catch { toast.error('Failed to update role'); }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteUser(deleteId);
      setUsers((prev) => prev.filter((u) => u._id !== deleteId));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete user'); }
  };

  const columns = [
    { key: 'user', label: 'User', render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar user={row} size="sm" />
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{row.name}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{row.email}</p>
        </div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (row) => (
      <select value={row.role} onChange={(e) => handleRoleChange(row._id, e.target.value)} className="px-3 py-1 text-xs rounded-lg border outline-none" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    )},
    { key: 'createdAt', label: 'Joined', render: (row) => <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{formatDate(row.createdAt)}</span> },
    { key: 'actions', label: 'Actions', render: (row) => (
      <button onClick={() => setDeleteId(row._id)} className="px-3 py-1 text-xs font-medium text-white rounded-lg" style={{ backgroundColor: '#EF4444' }}>Delete</button>
    )},
  ];

  return (
    <>
      <Helmet><title>Manage Users - Admin - BlogNest</title></Helmet>
      <div>
        <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Manage Users</h1>
        {loading ? <Loading /> : <AdminTable columns={columns} data={users} />}
      </div>
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete User" message="Are you sure you want to delete this user? This action cannot be undone." />
    </>
  );
};

export default ManageUsers;
