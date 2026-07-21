import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import userService from '../services/userService';
import blogService from '../services/blogService';
import Avatar from '../components/common/Avatar';
import BlogCard from '../components/common/BlogCard';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/helpers';

const AuthorProfile = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const profileRes = await userService.getProfile(id);
        const profileData = profileRes.data || profileRes;
        setAuthor(profileData.user || profileData);
        setBlogs(profileData.blogs || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <Loading text="Loading author profile..." />;
  if (!author) return <EmptyState icon="👤" title="Author not found" />;

  return (
    <>
      <Helmet><title>{author.name} - BlogNest</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="rounded-2xl p-8 mb-10 text-center" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <Avatar user={author} size="xl" />
          <h1 className="text-2xl font-bold mt-4" style={{ color: 'var(--text-primary)' }}>{author.name}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{author.email}</p>
          {author.bio && <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>{author.bio}</p>}
          <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>Joined {formatDate(author.createdAt)} · {blogs.length} blog{blogs.length !== 1 ? 's' : ''}</p>
        </div>

        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Articles by {author.name}</h2>
        {blogs.length === 0 ? (
          <EmptyState icon="📝" title="No blogs yet" description="This author hasn't published any blogs." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
          </div>
        )}
      </div>
    </>
  );
};

export default AuthorProfile;
