// src/App.jsx — Router & layout shell
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

import Home          from './pages/Home';
import Properties    from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Login         from './pages/Login';
import Signup        from './pages/Signup';
import SellProperty  from './pages/SellProperty';
import AdminPanel    from './pages/AdminPanel';
import Favorites     from './pages/Favorites';
import About         from './pages/About';
import Contact       from './pages/Contact';
import Agents        from './pages/Agents';

// ── Protected route wrapper ──────────────────────────────────
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user)   return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return <LoadingSpinner fullscreen />;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 70px)' }}>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/buy"         element={<Properties priceType="sale" />} />
          <Route path="/rent"        element={<Properties priceType="rent" />} />
          <Route path="/properties"  element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/about"       element={<About />} />
          <Route path="/contact"     element={<Contact />} />
          <Route path="/agents"      element={<Agents />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/signup"      element={<Signup />} />
          <Route path="/sell"        element={
            <ProtectedRoute roles={['seller','admin']}>
              <SellProperty />
            </ProtectedRoute>
          } />
          <Route path="/favorites"   element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />
          <Route path="/admin"       element={
            <ProtectedRoute roles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
