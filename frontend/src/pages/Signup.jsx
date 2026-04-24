// src/pages/Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Signup() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', password: '', phone: '', role: 'buyer' });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [showPwd, setShowPwd] = useState(false);

  const set = k => e => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setErrors(p => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                  e.name     = 'Name is required';
    if (!/\S+@\S+\.\S+/.test(form.email))  e.email    = 'Valid email required';
    if (form.password.length < 6)           e.password = 'Password must be at least 6 characters';
    if (form.phone && !/^\d{10}$/.test(form.phone)) e.phone = '10-digit phone number required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Account created! Welcome, ${user.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-logo">🏠</div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join thousands of property seekers on RealEstateIndia</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-control" required value={form.name}
                onChange={set('name')} placeholder="Ramesh Kumar" />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-control" value={form.phone}
                onChange={set('phone')} placeholder="9876543210" maxLength={10} />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input className="form-control" type="email" required value={form.email}
              onChange={set('email')} placeholder="your@email.com" />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <input className="form-control" type={showPwd ? 'text' : 'password'} required
                value={form.password} onChange={set('password')} placeholder="Min 6 characters"
                style={{ paddingRight: '42px' }} />
              <button type="button" className="pwd-toggle" onClick={() => setShowPwd(p => !p)}>
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">I want to</label>
            <div className="role-btns">
              {[{v:'buyer',l:'🔍 Buy / Rent Property'},{v:'seller',l:'🏡 Sell / List Property'}].map(r => (
                <button key={r.v} type="button"
                  className={`role-btn ${form.role === r.v ? 'active' : ''}`}
                  onClick={() => setForm(p => ({...p, role: r.v}))}>
                  {r.l}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
