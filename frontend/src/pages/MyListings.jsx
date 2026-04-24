// src/pages/MyListings.jsx — Seller's own property dashboard
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './MyListings.css';

const fmt = (price, type) =>
  price >= 10000000
    ? `₹${(price / 10000000).toFixed(2)} Cr${type === 'rent' ? '/mo' : ''}`
    : price >= 100000
    ? `₹${(price / 100000).toFixed(1)} L${type === 'rent' ? '/mo' : ''}`
    : `₹${price?.toLocaleString('en-IN')}`;

const typeIcon = { flat: '🏢', villa: '🏡', plot: '🌿', commercial: '🏬', house: '🏠' };

export default function MyListings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [deleting, setDeleting]     = useState(null); // id being deleted

  const fetchMyProperties = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/properties/my');
      setProperties(data.data || []);
    } catch {
      toast.error('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyProperties(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/properties/${id}`);
      toast.success('Property deleted successfully');
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete property');
    } finally {
      setDeleting(null);
    }
  };

  const statusColor = (s) =>
    s === 'approved' ? 'green' : s === 'rejected' ? 'red' : 'gold';

  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <h1>📋 My Listings</h1>
          <p>Manage the properties you have listed</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
        {/* Top bar */}
        <div className="my-listings-bar">
          <span className="ml-count">
            {loading ? '…' : `${properties.length} Listing${properties.length !== 1 ? 's' : ''}`}
          </span>
          <Link to="/sell" className="btn btn-primary btn-sm">
            ➕ Add New Property
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="spinner-wrap" style={{ paddingTop: '80px' }}>
            <div className="spinner" />
          </div>
        )}

        {/* Empty state */}
        {!loading && properties.length === 0 && (
          <div className="empty-state" style={{ paddingTop: '80px' }}>
            <div className="empty-icon">🏠</div>
            <h3>No listings yet</h3>
            <p>Start by adding your first property.</p>
            <Link to="/sell" className="btn btn-primary" style={{ marginTop: '16px' }}>
              ➕ List a Property
            </Link>
          </div>
        )}

        {/* Property cards grid */}
        {!loading && properties.length > 0 && (
          <div className="ml-grid">
            {properties.map(prop => (
              <div key={prop.id} className="ml-card">
                {/* Image */}
                <Link to={`/properties/${prop.id}`} className="ml-card__img-wrap">
                  <img
                    src={prop.primary_image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600'}
                    alt={prop.title}
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600'}
                  />
                  <span className={`ml-status badge badge-${statusColor(prop.status)}`}>
                    {prop.status}
                  </span>
                </Link>

                {/* Info */}
                <div className="ml-card__body">
                  <div className="ml-card__top">
                    <span className="ml-type">
                      {typeIcon[prop.property_type]} {prop.property_type}
                    </span>
                    <span className={`badge badge-${prop.price_type === 'rent' ? 'blue' : 'gold'}`}>
                      {prop.price_type === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                  </div>
                  <div className="ml-card__price">{fmt(prop.price, prop.price_type)}</div>
                  <h3 className="ml-card__title">{prop.title}</h3>
                  <p className="ml-card__loc">
                    📍 {prop.location_area ? `${prop.location_area}, ` : ''}{prop.location_city}
                  </p>
                  <div className="ml-card__meta">
                    {prop.bhk      && <span>🛏 {prop.bhk} BHK</span>}
                    {prop.area_sqft && <span>📐 {Number(prop.area_sqft).toLocaleString('en-IN')} sq.ft</span>}
                    <span>👁 {prop.views} views</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="ml-card__actions">
                  <Link
                    to={`/properties/${prop.id}`}
                    className="btn btn-ghost btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    👁 View
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                    disabled={deleting === prop.id}
                    onClick={() => handleDelete(prop.id, prop.title)}
                  >
                    {deleting === prop.id ? '⏳ Deleting…' : '🗑 Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
