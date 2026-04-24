// src/pages/Agents.jsx — Agents & Builders directory
import { Link } from 'react-router-dom';
import './Agents.css';

const AGENTS = [
  { name:'Rajesh Kumar',    city:'Mumbai',    specialty:'Luxury Flats',      deals:120, rating:4.9, emoji:'👨‍💼', verified:true },
  { name:'Meera Iyer',      city:'Bangalore', specialty:'IT Corridor Homes', deals:95,  rating:4.8, emoji:'👩‍💼', verified:true },
  { name:'Suresh Gupta',    city:'Delhi NCR', specialty:'Plots & Villas',    deals:80,  rating:4.7, emoji:'🧑‍💼', verified:true },
  { name:'Anita Joshi',     city:'Pune',      specialty:'Residential Flats', deals:70,  rating:4.8, emoji:'👩‍💼', verified:true },
  { name:'Vivek Nair',      city:'Hyderabad', specialty:'Commercial Spaces', deals:65,  rating:4.6, emoji:'👨‍💼', verified:false },
  { name:'Priya Desai',     city:'Chennai',   specialty:'Independent Houses',deals:55,  rating:4.7, emoji:'👩‍💼', verified:true },
];

const BUILDERS = [
  { name:'Lodha Group',       city:'Mumbai',    projects:12, tagline:'Luxury Living Redefined' },
  { name:'Prestige Estates',  city:'Bangalore', projects:18, tagline:'Quality Homes for Everyone' },
  { name:'DLF Limited',       city:'Delhi',     projects:15, tagline:'Building India Since 1946' },
  { name:'Godrej Properties', city:'Pune',      projects:9,  tagline:'Good Homes, Good Life' },
];

export default function Agents() {
  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>🤝 Agents & Builders</h1>
          <p>Connect with India's top real estate professionals and trusted builders</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        {/* Top Agents */}
        <section style={{ marginBottom: '60px' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Top <span>Agents</span></h2>
              <p className="section-subtitle">Verified real estate professionals across India</p>
            </div>
          </div>
          <div className="grid-3">
            {AGENTS.map(a => (
              <div key={a.name} className="agent-card card">
                <div className="agent-header">
                  <div className="agent-avatar">{a.emoji}</div>
                  <div>
                    <div className="agent-name-row">
                      <h3>{a.name}</h3>
                      {a.verified && <span className="verified-badge">✓ Verified</span>}
                    </div>
                    <p className="agent-city">📍 {a.city}</p>
                  </div>
                </div>
                <div className="agent-specialty">🏠 {a.specialty}</div>
                <div className="agent-stats">
                  <div className="agent-stat">
                    <strong>{a.deals}+</strong>
                    <small>Deals Closed</small>
                  </div>
                  <div className="agent-stat">
                    <strong>⭐ {a.rating}</strong>
                    <small>Rating</small>
                  </div>
                  <div className="agent-stat">
                    <strong>5 yrs</strong>
                    <small>Experience</small>
                  </div>
                </div>
                <div className="agent-actions">
                  <Link to="/contact" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    📞 Contact
                  </Link>
                  <Link to={`/properties?city=${a.city.split(' ')[0]}`} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    🏠 Listings
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Builders */}
        <section style={{ marginBottom: '60px' }}>
          <h2 className="section-title" style={{ marginBottom: '8px' }}>Trusted <span>Builders</span></h2>
          <p className="section-subtitle" style={{ marginBottom: '32px' }}>India's leading property developers</p>
          <div className="grid-2">
            {BUILDERS.map(b => (
              <div key={b.name} className="builder-card card">
                <div className="builder-icon">🏗️</div>
                <div className="builder-info">
                  <h3>{b.name}</h3>
                  <p className="builder-tagline">{b.tagline}</p>
                  <div className="builder-meta">
                    <span>📍 {b.city}</span>
                    <span>🏠 {b.projects} Active Projects</span>
                  </div>
                </div>
                <Link to="/contact" className="btn btn-outline btn-sm">Enquire</Link>
              </div>
            ))}
          </div>
        </section>

        {/* Become an agent */}
        <section className="become-agent">
          <div className="become-agent__inner">
            <div>
              <h2>Become a Listed Agent</h2>
              <p>Join thousands of agents on RealEstateIndia and get access to verified buyers and sellers across India.</p>
              <ul className="agent-perks">
                {['Free profile listing','Access to qualified leads','Marketing support','Dedicated account manager'].map(p => (
                  <li key={p}><span style={{ color: 'var(--green)' }}>✓</span> {p}</li>
                ))}
              </ul>
            </div>
            <Link to="/signup" className="btn btn-primary btn-lg">Register as Agent</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
