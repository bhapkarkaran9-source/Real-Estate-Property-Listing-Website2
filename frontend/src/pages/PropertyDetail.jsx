// src/pages/PropertyDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import EMICalculator from '../components/EMICalculator';
import toast from 'react-hot-toast';
import './PropertyDetail.css';

const fmt = (v, t) => v >= 10000000 ? `₹${(v/10000000).toFixed(2)} Cr${t==='rent'?'/mo':''}` : v >= 100000 ? `₹${(v/100000).toFixed(1)} L${t==='rent'?'/mo':''}` : `₹${v?.toLocaleString('en-IN')}`;

export default function PropertyDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user }  = useAuth();

  const [prop,      setProp]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [fav,       setFav]       = useState(false);
  const [contact,   setContact]   = useState({ name: user?.name||'', email: user?.email||'', phone:'', message:'' });
  const [sending,   setSending]   = useState(false);
  const [showEMI,   setShowEMI]   = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/properties/${id}`)
      .then(({ data }) => {
        setProp(data.data);
        if (user) {
          api.get(`/favorites/check/${id}`).then(r => setFav(r.data.favorited)).catch(() => {});
        }
      })
      .catch(() => navigate('/properties'))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const toggleFav = async () => {
    if (!user) { toast.error('Please login to save favorites'); return; }
    try {
      const { data } = await api.post(`/favorites/${id}`);
      setFav(data.favorited);
      toast.success(data.message);
    } catch { toast.error('Failed to update'); }
  };

  const sendContact = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contact', { ...contact, property_id: id });
      toast.success('Enquiry sent! The owner will contact you soon.');
      setContact(p => ({ ...p, message: '' }));
    } catch { toast.error('Failed to send enquiry'); }
    finally { setSending(false); }
  };

  if (loading) return <div className="spinner-wrap" style={{paddingTop:'200px'}}><div className="spinner" /></div>;
  if (!prop)   return null;

  const images = prop.images?.length
    ? prop.images
    : [{ image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', is_primary: 1 }];

  const amenities = typeof prop.amenities === 'string'
    ? JSON.parse(prop.amenities || '[]')
    : prop.amenities || [];

  return (
    <div className="detail-page" style={{ paddingTop: '70px' }}>
      <div className="container" style={{ paddingTop: '32px' }}>
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> › <Link to="/properties">Properties</Link> › {prop.title}
        </div>

        <div className="detail-layout">
          {/* ── LEFT ────────────────────────────────────── */}
          <div className="detail-main">
            {/* Gallery */}
            <div className="gallery">
              <div className="gallery__main">
                <img
                  src={images[activeImg]?.image_url}
                  alt={prop.title}
                  onError={e => e.target.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                />
                <button className={`fav-btn-lg ${fav ? 'fav-btn-lg--active' : ''}`} onClick={toggleFav}>
                  {fav ? '❤️ Saved' : '🤍 Save'}
                </button>
              </div>
              {images.length > 1 && (
                <div className="gallery__thumbs">
                  {images.map((img, i) => (
                    <img key={i} src={img.image_url} alt="" onClick={() => setActiveImg(i)}
                      className={i === activeImg ? 'active' : ''}
                      onError={e => e.target.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'} />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="detail-info card" style={{ padding: '28px', marginTop: '24px' }}>
              <div className="detail-info__header">
                <div>
                  <div className="detail-price">{fmt(prop.price, prop.price_type)}</div>
                  <h1 className="detail-title">{prop.title}</h1>
                  <p className="detail-loc">📍 {prop.location_address || `${prop.location_area ? prop.location_area+', ' : ''}${prop.location_city}`}</p>
                </div>
                <div className="detail-badges">
                  <span className={`badge badge-${prop.price_type==='rent'?'blue':'gold'}`}>
                    {prop.price_type === 'rent' ? 'For Rent' : 'For Sale'}
                  </span>
                  <span className="badge badge-muted">{prop.property_type}</span>
                </div>
              </div>

              {/* Key stats */}
              <div className="detail-stats">
                {prop.bhk       && <div className="d-stat"><span>🛏</span><strong>{prop.bhk} BHK</strong><small>Bedrooms</small></div>}
                {prop.area_sqft && <div className="d-stat"><span>📐</span><strong>{Number(prop.area_sqft).toLocaleString('en-IN')}</strong><small>Sq.Ft</small></div>}
                <div className="d-stat"><span>🏠</span><strong>{prop.property_type}</strong><small>Type</small></div>
                <div className="d-stat"><span>👁</span><strong>{prop.views}</strong><small>Views</small></div>
              </div>

              <hr className="divider" />

              {/* Description */}
              <h3 style={{ marginBottom: '10px' }}>Description</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{prop.description || 'No description provided.'}</p>

              {/* Amenities */}
              {amenities.length > 0 && (
                <>
                  <h3 style={{ margin: '20px 0 12px' }}>Amenities</h3>
                  <div className="amenities-grid">
                    {amenities.map(a => <span key={a} className="amenity-chip">✓ {a}</span>)}
                  </div>
                </>
              )}

              {/* Map placeholder */}
              <h3 style={{ margin: '20px 0 12px' }}>Location</h3>
              <div className="map-placeholder">
                <div className="map-inner">
                  <span>📍</span>
                  <p>{prop.location_city}</p>
                  <small>{prop.latitude && prop.longitude ? `${prop.latitude}, ${prop.longitude}` : 'Map view — Google Maps integration'}</small>
                </div>
              </div>
            </div>

            {/* EMI Calculator toggle */}
            {prop.price_type === 'sale' && (
              <div style={{ marginTop: '24px' }}>
                <button className="btn btn-outline" onClick={() => setShowEMI(p => !p)}>
                  🧮 {showEMI ? 'Hide' : 'Calculate'} EMI
                </button>
                {showEMI && <div style={{ marginTop: '16px' }}><EMICalculator defaultPrice={prop.price} /></div>}
              </div>
            )}
          </div>

          {/* ── RIGHT ───────────────────────────────────── */}
          <div className="detail-sidebar">
            {/* Owner card */}
            <div className="owner-card card" style={{ padding: '24px' }}>
              <h3 style={{ marginBottom: '16px' }}>Contact Owner / Agent</h3>
              <div className="owner-info">
                <div className="owner-avatar">{prop.owner_name?.[0]?.toUpperCase()}</div>
                <div>
                  <strong>{prop.owner_name}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Property Owner</p>
                </div>
              </div>
              {prop.owner_phone && (
                <a href={`tel:${prop.owner_phone}`} className="btn btn-primary" style={{ marginTop: '14px', justifyContent: 'center', width: '100%' }}>
                  📞 {prop.owner_phone}
                </a>
              )}
              <a href={`mailto:${prop.owner_email}`} className="btn btn-outline btn-sm" style={{ marginTop: '8px', justifyContent: 'center', width: '100%' }}>
                ✉️ Send Email
              </a>
            </div>

            {/* Enquiry form */}
            <div className="card" style={{ padding: '24px', marginTop: '20px' }}>
              <h3 style={{ marginBottom: '16px' }}>Send Enquiry</h3>
              <form onSubmit={sendContact} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input className="form-control" required value={contact.name}
                    onChange={e => setContact(p => ({...p, name: e.target.value}))} placeholder="Full name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" required value={contact.email}
                    onChange={e => setContact(p => ({...p, email: e.target.value}))} placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={contact.phone}
                    onChange={e => setContact(p => ({...p, phone: e.target.value}))} placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-control" required rows={4} value={contact.message}
                    onChange={e => setContact(p => ({...p, message: e.target.value}))}
                    placeholder={`I'm interested in "${prop.title}". Please contact me.`} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={sending}>
                  {sending ? 'Sending…' : '📨 Send Enquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
