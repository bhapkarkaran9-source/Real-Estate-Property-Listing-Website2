// src/components/SearchBar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const CITIES = ['Mumbai','Delhi','Bangalore','Pune','Hyderabad','Chennai','Kolkata','Ahmedabad','Jaipur','Noida','Gurgaon','Navi Mumbai'];
const TYPES  = ['flat','villa','plot','commercial','house'];
const BHKS   = ['1','2','3','4+'];

export default function SearchBar({ inline }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ search:'', city:'', type:'', bhk:'', price_type:'sale' });

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([k, v]) => { if (v) params.set(k, v); });
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <form className={`search-bar ${inline ? 'search-bar--inline' : ''}`} onSubmit={handleSearch}>
      <div className="search-bar__fields">
        <div className="search-bar__field search-bar__field--text">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search by city, area, locality…"
            value={form.search}
            onChange={set('search')}
          />
        </div>

        <select className="search-select" value={form.city} onChange={set('city')}>
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="search-select" value={form.type} onChange={set('type')}>
          <option value="">Property Type</option>
          {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
        </select>

        <select className="search-select" value={form.bhk} onChange={set('bhk')}>
          <option value="">BHK</option>
          {BHKS.map(b => <option key={b} value={b === '4+' ? '4' : b}>{b} BHK</option>)}
        </select>

        <select className="search-select" value={form.price_type} onChange={set('price_type')}>
          <option value="sale">Buy</option>
          <option value="rent">Rent</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary search-bar__btn">Search Properties</button>
    </form>
  );
}
