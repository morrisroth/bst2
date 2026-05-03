import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import TorahStudy from './pages/TorahStudy';
import Lectures from './pages/Lectures';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Registrations from './pages/admin/Registrations';
import SliderManager from './pages/admin/SliderManager';
import ContactInbox from './pages/admin/ContactInbox';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import PostsList from './pages/admin/PostsList';
import PostForm from './pages/admin/PostForm';
import ImagesManager from './pages/admin/ImagesManager';
import SiteSettings from './pages/admin/SiteSettings';
import EmailSettings from './pages/admin/EmailSettings';

import './index.css';
import './whatsapp.css';

function ProtectedRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/admin" replace />;
}

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main className="page-content">{children}</main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/torah-study" element={<PublicLayout><TorahStudy /></PublicLayout>} />
      <Route path="/lectures" element={<PublicLayout><Lectures /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/blog/:id" element={<PublicLayout><BlogPost /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/posts" element={<ProtectedRoute><PostsList /></ProtectedRoute>} />
      <Route path="/admin/new-post" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
      <Route path="/admin/posts/:id/edit" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
      <Route path="/admin/images" element={<ProtectedRoute><ImagesManager /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><SiteSettings /></ProtectedRoute>} />
      <Route path="/admin/registrations" element={<ProtectedRoute><Registrations /></ProtectedRoute>} />
      <Route path="/admin/slider" element={<ProtectedRoute><SliderManager /></ProtectedRoute>} />
      <Route path="/admin/inbox" element={<ProtectedRoute><ContactInbox /></ProtectedRoute>} />
      <Route path="/admin/email-settings" element={<ProtectedRoute><EmailSettings /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <a
          href="https://wa.me/972522433693"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float"
          aria-label="צור קשר בוואטסאפ"
        >
          <svg viewBox="0 0 32 32" fill="white" width="28" height="28">
            <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.472 2.027 7.774L0 32l8.469-2.001A15.93 15.93 0 0016 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm0 29.268a13.22 13.22 0 01-6.73-1.839l-.482-.286-4.99 1.178 1.232-4.858-.315-.5A13.22 13.22 0 012.732 16C2.732 8.668 8.668 2.732 16 2.732S29.268 8.668 29.268 16 23.332 29.268 16 29.268zm7.24-9.878c-.397-.198-2.348-1.157-2.713-1.29-.364-.13-.63-.198-.895.198-.265.397-1.026 1.29-1.258 1.555-.232.265-.464.298-.861.1-.397-.198-1.676-.617-3.193-1.97-1.18-1.053-1.977-2.353-2.21-2.75-.232-.398-.025-.613.174-.81.18-.178.397-.465.596-.697.199-.232.265-.398.397-.663.132-.265.066-.497-.033-.696-.1-.198-.895-2.157-1.225-2.952-.323-.775-.65-.67-.895-.682l-.763-.013c-.265 0-.696.1-1.06.497-.364.397-1.39 1.357-1.39 3.31s1.424 3.842 1.622 4.107c.199.265 2.803 4.277 6.79 5.998.949.41 1.69.655 2.268.838.953.303 1.82.26 2.505.158.764-.114 2.348-.96 2.679-1.886.33-.927.33-1.722.232-1.886-.1-.165-.364-.265-.763-.464z"/>
          </svg>
          <span className="whatsapp-tooltip">דברו איתנו בוואטסאפ</span>
        </a>
      </BrowserRouter>
    </AuthProvider>
  );
}
