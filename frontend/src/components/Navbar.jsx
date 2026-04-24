// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin, isSeller } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [dropdownOpen,setDropdownOpen]= useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="logo-icon">🏠</span>
          <span>Real<span className="logo-accent">Estate</span>India</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/buy">Buy Property</NavLink>
          <NavLink to="/rent">Rent Property</NavLink>
          <NavLink to="/agents">Agents</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          {user ? (
            <div className="user-menu" onClick={() => setDropdownOpen(p => !p)}>
              <div className="user-avatar">{user.name[0].toUpperCase()}</div>
              <span className="user-name">{user.name.split(' ')[0]}</span>
              <span className="chevron">▾</span>
              {dropdownOpen && (
                <div className="dropdown" onClick={e => e.stopPropagation()}>
                  <div className="dropdown__header">
                    <strong>{user.name}</strong>
                    <span className={`badge badge-${user.role === 'admin' ? 'red' : user.role === 'seller' ? 'gold' : 'blue'}`}>
                      {user.role}
                    </span>
                  </div>
                  <hr className="divider" />
                  <Link to="/favorites" onClick={() => setDropdownOpen(false)}>❤️ Favorites</Link>
                  {isSeller && <Link to="/sell" onClick={() => setDropdownOpen(false)}>➕ List Property</Link>}
                  {isAdmin  && <Link to="/admin" onClick={() => setDropdownOpen(false)}>⚙️ Admin Panel</Link>}
                  <button className="dropdown__logout" onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login"  className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}

          {/* Sell button */}
          {isSeller && (
            <Link to="/sell" className="btn btn-primary btn-sm sell-btn">+ List Property</Link>
          )}
        </div>

        {/* Hamburger */}
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(p => !p)}>
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/buy">Buy Property</NavLink>
          <NavLink to="/rent">Rent Property</NavLink>
          <NavLink to="/agents">Agents</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <hr className="divider" />
          {user ? (
            <>
              <NavLink to="/favorites">❤️ Favorites</NavLink>
              {isSeller && <NavLink to="/sell">➕ List Property</NavLink>}
              {isAdmin  && <NavLink to="/admin">⚙️ Admin Panel</NavLink>}
              <button onClick={handleLogout}>🚪 Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Sign Up</NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
