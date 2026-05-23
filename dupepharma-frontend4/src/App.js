import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import api from './services/api';

import Login        from './pages/Login';
import Register     from './pages/Register';
import Products     from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Favorites    from './pages/Favorites';
import SkinProfile  from './pages/SkinProfile';
import Reviews      from './pages/Reviews';
import Pharmacy     from './pages/Pharmacy';
import Admin        from './pages/Admin';
import Profile      from './pages/Profile';

import './styles.css';

function Navbar() {
  const { user, isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">💊 DupePharma</NavLink>
      <div className="navbar-links">
        <NavLink to="/" end>Ürünler</NavLink>
        <NavLink to="/favorites">Favoriler</NavLink>
        <NavLink to="/skin-profile">Cilt Profili</NavLink>
        <NavLink to="/pharmacy">Nöbetçi Eczane</NavLink>
        {isAdmin && <NavLink to="/admin">⚙️ Admin</NavLink>}
        {/* Profil linki — tıklayınca profil sayfasına gider, çıkış orada */}
        <NavLink to="/profile" className="navbar-profile-btn">
          <span className="navbar-avatar">{user?.fullName?.[0]?.toUpperCase() || '?'}</span>
          <span className="navbar-username">{user?.fullName}</span>
        </NavLink>
      </div>
    </nav>
  );
}

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Yükleniyor...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Yükleniyor...</div>;
  return user?.role === 'admin' ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <div className="page-wrapper-outer">
        <Routes>
          <Route path="/login"    element={!user ? <Login />    : <Navigate to="/" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
          <Route path="/"                     element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/products/:id"         element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
          <Route path="/products/:id/reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
          <Route path="/favorites"            element={<PrivateRoute><Favorites /></PrivateRoute>} />
          <Route path="/skin-profile"         element={<PrivateRoute><SkinProfile /></PrivateRoute>} />
          <Route path="/pharmacy"             element={<PrivateRoute><Pharmacy /></PrivateRoute>} />
          <Route path="/profile"              element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin"                element={<AdminRoute><Admin /></AdminRoute>} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
