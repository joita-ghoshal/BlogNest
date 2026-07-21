import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { HiMenuAlt2 } from 'react-icons/hi';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64">
        <div className="lg:hidden p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg" style={{ color: 'var(--text-primary)' }}>
            <HiMenuAlt2 size={24} />
          </button>
        </div>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
