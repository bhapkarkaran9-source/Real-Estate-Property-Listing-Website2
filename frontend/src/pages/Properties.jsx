// src/pages/Properties.jsx — Listing page with filters, sort, pagination
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/api';
import PropertyCard from '../components/PropertyCard';
import './Properties.css';

const CITIES = ['Mumbai','Delhi','Bangalore','Pune','Hyderabad','Chennai','Kolkata','Ahmedabad','Jaipur','Noida','Gurgaon'];
const TYPES  = ['flat','villa','plot','commercial','house'];
const SORT_OPTIONS = [
  { value:'newest',    label:'Newest First' },
  { value:'price_asc', label:'Price: Low to High' },
  { value:'price_desc',label:'Price: High to Low' },
];

export default function Properties({ priceType }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [viewMode,   setViewMode]   = useState('grid'); // 'grid' | 'list'

  // Filters from URL params
  const [filters, setFilters] = useState({
    search:     searchParams.get('search')     || '',
    city:       searchParams.get('city')       || '',
    type:       searchParams.get('type')       || '',
    bhk:        searchParams.get('bhk')        || '',
    min_price:  searchParams.get('min_price')  || '',
    max_price:  searchParams.get('max_price')  || '',
    sort:       searchParams.get('sort')       || 'newest',
    page:       Number(searchParams.get('page')) || 1,
    price_type: priceType || searchParams.get('price_type') || '',
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k,v]) => { if (v) params[k] = v; });
      const { data } = await api.get('/properties', { params });
      setProperties(data.data || []);
      setPagination(data.pagination || {});
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  // Sync filters to URL
  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([k,v]) => { if (v && v !== 1) params[k] = v; });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const setFilter = (k) => (e) =>
    setFilters(p => ({ ...p, [k]: e.target.value, page: 1 }));

  const resetFilters = () =>
    setFilters({ search:'', city:'', type:'', bhk:'', min_price:'', max_price:'', sort:'newest', page:1, price_type: priceType||'' });

  const goPage = (p) => {
    setFilters(f => ({ ...f, page: p }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>{priceType === 'rent' ? '🔑 Rental Properties' : priceType === 'sale' ? '🏡 Properties for Sale' : '🏠 All Properties'}</h1>
          <p>{pagination.total || 0} properties found</p>
        </div>
      </div>

      <div className="container prop-page">
        {/* ── Sidebar Filters ─────────────────────────── */}
        <aside className="prop-page__filters">
          <div className="filter-card">
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="btn btn-ghost btn-sm" onClick={resetFilters}>Reset</button>
            </div>

            <div className="filter-group">
              <label className="form-label">Keyword Search</label>
              <input className="form-control" placeholder="City, area, title…"
                value={filters.search} onChange={setFilter('search')} />
            </div>

            <div className="filter-group">
              <label className="form-label">City</label>
              <select className="form-control" value={filters.city} onChange={setFilter('city')}>
                <option value="">All Cities</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {!priceType && (
              <div className="filter-group">
                <label className="form-label">Buy / Rent</label>
                <select className="form-control" value={filters.price_type} onChange={setFilter('price_type')}>
                  <option value="">Both</option>
                  <option value="sale">Buy</option>
                  <option value="rent">Rent</option>
                </select>
              </div>
            )}

            <div className="filter-group">
              <label className="form-label">Property Type</label>
              <select className="form-control" value={filters.type} onChange={setFilter('type')}>
                <option value="">All Types</option>
                {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label className="form-label">BHK</label>
              <div className="bhk-btns">
                {['','1','2','3','4'].map(b => (
                  <button key={b}
                    className={`bhk-btn ${filters.bhk === b ? 'active' : ''}`}
                    onClick={() => setFilters(p => ({ ...p, bhk: b, page: 1 }))}>
                    {b === '' ? 'Any' : b === '4' ? '4+' : b}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="form-label">Min Price (₹)</label>
              <input className="form-control" type="number" placeholder="e.g. 2500000"
                value={filters.min_price} onChange={setFilter('min_price')} />
            </div>
            <div className="filter-group">
              <label className="form-label">Max Price (₹)</label>
              <input className="form-control" type="number" placeholder="e.g. 10000000"
                value={filters.max_price} onChange={setFilter('max_price')} />
            </div>
          </div>
        </aside>

        {/* ── Main Listing ────────────────────────────── */}
        <div className="prop-page__main">
          {/* Toolbar */}
          <div className="prop-toolbar">
            <p className="prop-count">
              {loading ? 'Loading…' : `${pagination.total || 0} Properties`}
            </p>
            <div className="prop-toolbar__right">
              <select className="form-control" style={{width:'auto'}} value={filters.sort} onChange={setFilter('sort')}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="view-btns">
                <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>⊞</button>
                <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>☰</button>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : properties.length ? (
            <div className={viewMode === 'grid' ? 'grid-3' : 'list-view'}>
              {properties.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No properties found</h3>
              <p>Try adjusting your filters or search terms.</p>
              <button className="btn btn-primary" style={{marginTop:'16px'}} onClick={resetFilters}>Clear Filters</button>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button className="btn btn-ghost btn-sm" disabled={filters.page <= 1} onClick={() => goPage(filters.page - 1)}>← Prev</button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p}
                  className={`page-btn ${filters.page === p ? 'active' : ''}`}
                  onClick={() => goPage(p)}>{p}</button>
              ))}
              <button className="btn btn-ghost btn-sm" disabled={filters.page >= pagination.pages} onClick={() => goPage(filters.page + 1)}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
