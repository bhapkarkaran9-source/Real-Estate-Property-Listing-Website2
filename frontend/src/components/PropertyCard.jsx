// src/components/PropertyCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import toast from 'react-hot-toast';
import './PropertyCard.css';

const formatPrice = (price, type) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000)   return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString('en-IN')}${type === 'rent' ? '/mo' : ''}`;
};

const typeIcon = { flat: '🏢', villa: '🏡', plot: '🌿', commercial: '🏬', house: '🏠' };

export default function PropertyCard({ property, onFavoriteChange }) {
  const { user } = useAuth();
  const [fav, setFav]       = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleFav = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to save favorites'); return; }
    try {
      const { data } = await api.post(`/favorites/${property.id}`);
      setFav(data.favorited);
      toast.success(data.message);
      onFavoriteChange?.();
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  const img = !imgError && property.primary_image
    ? property.primary_image
    : `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80`;

  return (
    <Link to={`/properties/${property.id}`} className="prop-card fade-in">
      {/* Image */}
      <div className="prop-card__img-wrap">
        <img
          src={img}
          alt={property.title}
          className="prop-card__img"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="prop-card__overlay" />

        {/* Badges */}
        <div className="prop-card__badges">
          <span className={`badge badge-${property.price_type === 'rent' ? 'blue' : 'gold'}`}>
            {property.price_type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
          <span className="badge badge-muted">
            {typeIcon[property.property_type]} {property.property_type}
          </span>
        </div>

        {/* Fav button */}
        <button className={`fav-btn ${fav ? 'fav-btn--active' : ''}`} onClick={handleFav} title="Save to favorites">
          {fav ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Info */}
      <div className="prop-card__body">
        <div className="prop-card__price">
          {formatPrice(property.price, property.price_type)}
        </div>
        <h3 className="prop-card__title">{property.title}</h3>
        <p className="prop-card__loc">📍 {property.location_area ? `${property.location_area}, ` : ''}{property.location_city}</p>
        <div className="prop-card__meta">
          {property.bhk && <span>🛏 {property.bhk} BHK</span>}
          {property.area_sqft && <span>📐 {Number(property.area_sqft).toLocaleString('en-IN')} sq.ft</span>}
          {property.owner_name && <span>👤 {property.owner_name}</span>}
        </div>
      </div>
    </Link>
  );
}
