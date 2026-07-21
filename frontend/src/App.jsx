import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import CategoryBlogs from './pages/CategoryBlogs';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import MyBlogs from './pages/MyBlogs';
import MyBookmarks from './pages/MyBookmarks';
import AuthorProfile from './pages/AuthorProfile';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBlogs from './pages/admin/ManageBlogs';
import ManageCategories from './pages/admin/ManageCategories';
import ManageComments from './pages/admin/ManageComments';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/category/:slug" element={<CategoryBlogs />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        <Route path="/create-blog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
        <Route path="/edit-blog/:id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
        <Route path="/my-blogs" element={<ProtectedRoute><MyBlogs /></ProtectedRoute>} />
        <Route path="/my-bookmarks" element={<ProtectedRoute><MyBookmarks /></ProtectedRoute>} />
        <Route path="/author/:id" element={<AuthorProfile />} />
        <Route path="/search" element={<SearchResults />} />
      </Route>
      <Route element={<AdminRoute><DashboardLayout /></AdminRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/blogs" element={<ManageBlogs />} />
        <Route path="/admin/categories" element={<ManageCategories />} />
        <Route path="/admin/comments" element={<ManageComments />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                fontFamily: "'Inter', sans-serif",
              },
              success: {
                iconTheme: { primary: '#00D4D8', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#fff' },
              },
            }}
          />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
