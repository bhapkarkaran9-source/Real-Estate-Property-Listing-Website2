// src/pages/SellProperty.jsx — Form to list a new property
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import './SellProperty.css';

const CITIES  = ['Mumbai','Delhi','Bangalore','Pune','Hyderabad','Chennai','Kolkata','Ahmedabad','Jaipur','Noida','Gurgaon','Navi Mumbai'];
const TYPES   = ['flat','villa','plot','commercial','house'];
const AMENITY_LIST = ['Swimming Pool','Gym','Parking','Lift/Elevator','24x7 Security','CCTV','Power Backup','Club House','Children Play Area','Garden','Wi-Fi','Gas Pipeline','Intercom','Rain Water Harvesting','Visitor Parking'];

export default function SellProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images,  setImages]  = useState([]);
  const [previews,setPreviews]= useState([]);
  const [form, setForm] = useState({
    title:'', description:'', price:'', price_type:'sale', property_type:'flat',
    bhk:'', area_sqft:'', location_city:'', location_area:'',
    location_address:'', amenities: [],
  });

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const toggleAmenity = (a) =>
    setForm(p => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter(x => x !== a)
        : [...p.amenities, a],
    }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location_city || !form.property_type)
      return toast.error('Please fill all required fields');
    if (Number(form.price) <= 0)
      return toast.error('Price must be a positive number');

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'amenities') fd.append(k, JSON.stringify(v));
        else if (v !== '') fd.append(k, v);
      });
      images.forEach(img => fd.append('images', img));

      const { data } = await api.post('/properties', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Property submitted for approval! 🎉');
      navigate('/properties');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="page-header">
        <div className="container">
          <h1>📋 List Your Property</h1>
          <p>Fill in the details below to list your property. Our team will review and approve it shortly.</p>
        </div>
      </div>

      <div className="container sell-layout">
        <form onSubmit={handleSubmit} className="sell-form">
          {/* Basic Info */}
          <div className="sell-section">
            <h2 className="sell-section__title">Basic Information</h2>
            <div className="sell-grid">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Property Title *</label>
                <input className="form-control" required value={form.title}
                  onChange={set('title')} placeholder="e.g. Spacious 3 BHK Flat in Bandra West" />
              </div>
              <div className="form-group">
                <label className="form-label">Property Type *</label>
                <select className="form-control" required value={form.property_type} onChange={set('property_type')}>
                  {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Listing Type *</label>
                <select className="form-control" value={form.price_type} onChange={set('price_type')}>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              {!['plot','commercial'].includes(form.property_type) && (
                <div className="form-group">
                  <label className="form-label">BHK</label>
                  <select className="form-control" value={form.bhk} onChange={set('bhk')}>
                    <option value="">Select BHK</option>
                    {[1,2,3,4,5].map(b => <option key={b} value={b}>{b} BHK</option>)}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Area (Sq.Ft)</label>
                <input className="form-control" type="number" min="1" value={form.area_sqft}
                  onChange={set('area_sqft')} placeholder="e.g. 1200" />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={4} value={form.description}
                onChange={set('description')} placeholder="Describe the property — features, surroundings, highlights…" />
            </div>
          </div>

          {/* Pricing */}
          <div className="sell-section">
            <h2 className="sell-section__title">Pricing</h2>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <div style={{ position: 'relative' }}>
                <span className="price-prefix">₹</span>
                <input className="form-control" type="number" required min="1" value={form.price}
                  onChange={set('price')} placeholder={form.price_type === 'rent' ? 'Monthly rent e.g. 35000' : 'Sale price e.g. 7500000'}
                  style={{ paddingLeft: '28px' }} />
              </div>
              {form.price && (
                <small style={{ color: 'var(--gold)', marginTop: '4px', display: 'block' }}>
                  = {Number(form.price) >= 10000000 ? `₹${(form.price/10000000).toFixed(2)} Crore` : Number(form.price) >= 100000 ? `₹${(form.price/100000).toFixed(1)} Lakh` : `₹${Number(form.price).toLocaleString('en-IN')}`}
                </small>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="sell-section">
            <h2 className="sell-section__title">Location</h2>
            <div className="sell-grid">
              <div className="form-group">
                <label className="form-label">City *</label>
                <select className="form-control" required value={form.location_city} onChange={set('location_city')}>
                  <option value="">Select City</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Area / Locality</label>
                <input className="form-control" value={form.location_area}
                  onChange={set('location_area')} placeholder="e.g. Bandra West" />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Full Address</label>
                <input className="form-control" value={form.location_address}
                  onChange={set('location_address')} placeholder="Street, area, pin code…" />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="sell-section">
            <h2 className="sell-section__title">Amenities</h2>
            <div className="amenities-picker">
              {AMENITY_LIST.map(a => (
                <button key={a} type="button"
                  className={`amenity-pick-btn ${form.amenities.includes(a) ? 'active' : ''}`}
                  onClick={() => toggleAmenity(a)}>
                  {form.amenities.includes(a) ? '✓ ' : ''}{a}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="sell-section">
            <h2 className="sell-section__title">Property Images (up to 10)</h2>
            <label className="img-upload-label">
              <input type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
              <div className="img-upload-box">
                <span>📸</span>
                <p>Click to upload images</p>
                <small>JPEG, PNG, WEBP — max 5 MB each</small>
              </div>
            </label>
            {previews.length > 0 && (
              <div className="img-previews">
                {previews.map((src, i) => (
                  <div key={i} className="img-preview-wrap">
                    <img src={src} alt="" />
                    {i === 0 && <span className="primary-badge">Primary</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sell-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Submitting…' : '🚀 Submit for Approval'}
            </button>
          </div>
        </form>

        {/* Tips sidebar */}
        <aside className="sell-tips">
          <div className="card" style={{ padding: '24px' }}>
            <h3>📌 Listing Tips</h3>
            <ul style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Add high-quality photos to get 3x more enquiries','Write a detailed description highlighting key features','Mention nearby landmarks, schools and metro stations','Set a competitive price to attract more buyers','Add all amenities to improve search visibility'].map(t => (
                <li key={t} style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--green)' }}>✓</span>{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="card" style={{ padding: '24px', marginTop: '16px', background: 'linear-gradient(135deg,#1a2c1a,#0f1f0f)', borderColor: '#2d5a2d' }}>
            <h3>🔒 Listing Process</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
              {['Submit your property details','Admin reviews within 24 hours','Property goes live after approval','Buyers contact you directly'].map((s,i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ width: '24px', height: '24px', background: 'var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#0b1120', flexShrink: 0 }}>{i+1}</span>
                  <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
