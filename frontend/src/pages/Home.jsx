// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import EMICalculator from '../components/EMICalculator';
import './Home.css';

const STATS = [
  { icon: '🏠', value: '50,000+', label: 'Properties Listed' },
  { icon: '👥', value: '2 Lakh+', label: 'Happy Customers' },
  { icon: '🏙️', value: '50+',     label: 'Cities Covered' },
  { icon: '🤝', value: '5,000+',  label: 'Trusted Agents' },
];

const CITIES = [
  { name:'Mumbai',    img:'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&q=80' },
  { name:'Delhi',     img:'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80' },
  { name:'Bangalore', img:'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80' },
  { name:'Pune',      img:'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400&q=80' },
  { name:'Hyderabad', img:'https://images.unsplash.com/photo-1574788395993-46f8f17bfed6?w=400&q=80' },
  { name:'Chennai',   img:'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80' },
];

const FEATURES = [
  { icon:'🔒', title:'100% Verified',    desc:'All listings are verified by our expert team before going live.' },
  { icon:'💰', title:'Best Prices',       desc:'Get the most competitive prices with zero hidden charges.' },
  { icon:'⚡', title:'Instant Connect',  desc:'Contact sellers or agents directly within seconds.' },
  { icon:'📱', title:'Mobile Friendly',  desc:'Search and manage properties on any device, anywhere.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/properties/featured')
      .then(({ data }) => setFeatured(data.data || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__content container">
          <div className="hero__text fade-in">
            <span className="hero__tag">🇮🇳 India's #1 Property Platform</span>
            <h1 className="hero__title">
              Find Your Dream<br />
              <span className="hero__title-accent">Home in India</span>
            </h1>
            <p className="hero__sub">
              Explore thousands of verified properties across Mumbai, Delhi, Bangalore, Pune &amp; more.
              Buy, Sell or Rent — all in one place.
            </p>
          </div>

          <div className="hero__search fade-in">
            <SearchBar />
          </div>

          <div className="hero__tags fade-in">
            {['Flat','Villa','Plot','Commercial','2 BHK','3 BHK','Ready to Move'].map(t => (
              <Link key={t} to={`/properties?search=${t}`} className="hero__quick-tag">{t}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="stats-bar">
        <div className="container stats-bar__inner">
          {STATS.map(s => (
            <div key={s.label} className="stat-item">
              <span className="stat-icon">{s.icon}</span>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Properties ──────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured <span>Properties</span></h2>
              <p className="section-subtitle">Handpicked premium properties across India</p>
            </div>
            <Link to="/properties" className="btn btn-outline">View All →</Link>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : featured.length ? (
            <div className="grid-3 prop-grid">
              {featured.slice(0,6).map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏠</div>
              <h3>No featured properties yet</h3>
            </div>
          )}
        </div>
      </section>

      {/* ── Browse by City ───────────────────────────────────── */}
      <section className="section city-section">
        <div className="container">
          <h2 className="section-title" style={{textAlign:'center'}}>Browse by <span>City</span></h2>
          <p className="section-subtitle" style={{textAlign:'center',marginBottom:'36px'}}>Explore properties in India's top metro cities</p>
          <div className="city-grid">
            {CITIES.map(c => (
              <Link key={c.name} to={`/properties?city=${c.name}`} className="city-card">
                <img src={c.img} alt={c.name} loading="lazy" onError={e => e.target.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'} />
                <div className="city-card__overlay" />
                <span className="city-card__name">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Buy vs Rent ──────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="burent-grid">
            <Link to="/buy" className="burent-card burent-card--buy">
              <div className="burent-icon">🏡</div>
              <h3>Buy a Property</h3>
              <p>Find your forever home from thousands of verified listings across India.</p>
              <span className="btn btn-primary btn-sm" style={{alignSelf:'flex-start',marginTop:'12px'}}>Explore →</span>
            </Link>
            <Link to="/rent" className="burent-card burent-card--rent">
              <div className="burent-icon">🔑</div>
              <h3>Rent a Property</h3>
              <p>Discover the perfect rental home — furnished, semi-furnished or unfurnished.</p>
              <span className="btn btn-outline btn-sm" style={{alignSelf:'flex-start',marginTop:'12px'}}>Explore →</span>
            </Link>
            <Link to="/sell" className="burent-card burent-card--sell">
              <div className="burent-icon">💼</div>
              <h3>Sell / List Property</h3>
              <p>List your property for free and connect with thousands of genuine buyers.</p>
              <span className="btn btn-ghost btn-sm" style={{alignSelf:'flex-start',marginTop:'12px'}}>List Now →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Us ───────────────────────────────────────────── */}
      <section className="section why-section">
        <div className="container">
          <h2 className="section-title" style={{textAlign:'center'}}>Why <span>RealEstateIndia</span>?</h2>
          <p className="section-subtitle" style={{textAlign:'center',marginBottom:'40px'}}>Trusted by lakhs of Indians to find their dream home</p>
          <div className="grid-4">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMI Calculator ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="emi-section">
            <div className="emi-section__text">
              <h2 className="section-title">Plan Your <span>EMI</span></h2>
              <p className="section-subtitle" style={{marginBottom:'20px'}}>Use our EMI calculator to plan your home loan budget before buying.</p>
              <ul className="emi-tips">
                <li>💡 Most banks offer 80–90% financing</li>
                <li>💡 Home loan interest rates start from ~8.5%</li>
                <li>💡 Loan tenures up to 30 years available</li>
                <li>💡 Tax benefits under Section 80C &amp; 24(b)</li>
              </ul>
            </div>
            <div className="emi-section__calc">
              <EMICalculator />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <h2>Ready to Find Your Dream Home?</h2>
            <p>Join over 2 lakh satisfied customers who found their perfect property on RealEstateIndia.</p>
            <div className="cta-btns">
              <Link to="/properties" className="btn btn-primary btn-lg">Browse Properties</Link>
              <Link to="/contact"    className="btn btn-outline btn-lg">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
