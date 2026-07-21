# BlogNest

A modern, production-ready MERN stack blog application with premium UI/UX, rich text editor, admin dashboard, and full authentication system.

## Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- Tailwind CSS v4
- Axios
- React Hook Form
- React Quill (Rich Text Editor)
- React Icons
- Framer Motion
- React Hot Toast
- React Helmet Async

### Backend
- Node.js + Express.js
- MongoDB Atlas (Mongoose)
- JWT Authentication
- bcryptjs
- Cloudinary (Image Upload)
- Multer
- Nodemailer
- Express Validator
- Helmet (Security)
- CORS
- Morgan (Logging)
- Rate Limiting

## Features

### Authentication
- Register / Login / Logout
- JWT (Access + Refresh Tokens)
- Protected Routes
- Forgot Password / Reset Password
- Change Password
- Update Profile / Upload Avatar

### Blog Features
- Create, Edit, Delete Blogs
- Rich Text Editor (Bold, Italic, Headings, Lists, Quotes, Code Blocks, Links, Images)
- Featured Image Upload
- Categories & Tags
- Like / Bookmark / Share
- Comment System with Nested Replies
- Search, Filter, Sort, Pagination

### Admin Dashboard
- Dashboard Overview (Stats)
- Manage Users (Change Role, Delete)
- Manage Blogs (Publish/Unpublish, Delete)
- Manage Categories (CRUD)
- Manage Comments (Delete)

### Design
- Modern, Minimal, Premium UI
- Dark Mode / Light Mode
- Fully Responsive (Mobile, Tablet, Desktop)
- Framer Motion Animations
- Glassmorphism Effects
- Loading Skeletons
- Toast Notifications
- SEO Optimized

## Project Structure

```
BlogNest/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── backend/           # Node.js + Express
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account (for image uploads)
- Gmail account (for email sending)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to the backend at `http://localhost:5000`.

### Environment Variables

#### Backend (.env)

| Variable | Description |
|---|---|
| PORT | Server port (default: 5000) |
| MONGODB_URI | MongoDB Atlas connection string |
| JWT_SECRET | JWT access token secret |
| JWT_REFRESH_SECRET | JWT refresh token secret |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |
| SMTP_HOST | SMTP host (smtp.gmail.com) |
| SMTP_PORT | SMTP port (587) |
| SMTP_EMAIL | Gmail address |
| SMTP_PASSWORD | Gmail app password |
| FRONTEND_URL | Frontend URL (http://localhost:5173) |

## Default Admin Account

To create an admin account, register a new user and then manually update the role in MongoDB:

```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## API Routes

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password
- `PUT /api/auth/reset-password/:token` - Reset password
- `PUT /api/auth/change-password` - Change password

### Blogs
- `GET /api/blogs` - Get all blogs (with pagination, search, filter)
- `GET /api/blogs/featured` - Featured blogs
- `GET /api/blogs/trending` - Trending blogs
- `GET /api/blogs/latest` - Latest blogs
- `GET /api/blogs/my` - Current user's blogs
- `GET /api/blogs/bookmarks` - Current user's bookmarks
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/blogs` - Create blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `PUT /api/blogs/:id/like` - Toggle like
- `PUT /api/blogs/:id/bookmark` - Toggle bookmark

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create (admin)
- `PUT /api/categories/:id` - Update (admin)
- `DELETE /api/categories/:id` - Delete (admin)

### Comments
- `GET /api/comments/blog/:blogId` - Get comments
- `POST /api/comments` - Create comment
- `DELETE /api/comments/:id` - Delete comment
- `PUT /api/comments/:id/like` - Toggle like

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/authors/popular` - Popular authors

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - All users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/blogs` - All blogs
- `PUT /api/admin/blogs/:id` - Update blog
- `DELETE /api/admin/blogs/:id` - Delete blog
- `GET /api/admin/comments` - All comments
- `DELETE /api/admin/comments/:id` - Delete comment
- `GET /api/admin/categories` - All categories

## License

MIT
