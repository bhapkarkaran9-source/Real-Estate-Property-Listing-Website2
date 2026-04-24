// src/pages/Favorites.jsx — Saved/Wishlist properties
import { useEffect, useState } from 'react';
import api from '../api/api';
import PropertyCard from '../components/PropertyCard';
import './Favorites.css';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading,   setLoading]   = useState(true);

  const fetchFavorites = () => {
    setLoading(true);
    api.get('/favorites')
      .then(({ data }) => setFavorites(data.data || []))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFavorites(); }, []);

  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="page-header">
        <div className="container">
          <h1>❤️ My Favorites</h1>
          <p>{favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : favorites.length ? (
          <div className="grid-3">
            {favorites.map(p => (
              <PropertyCard key={p.id} property={p} onFavoriteChange={fetchFavorites} />
            ))}
          </div>
        ) : (
          <div className="empty-state fav-empty">
            <div className="empty-icon">🤍</div>
            <h3>No saved properties yet</h3>
            <p>Browse properties and click the heart icon to save them here for easy access.</p>
            <a href="/properties" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
              Browse Properties
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
