// src/pages/About.jsx
import { Link } from 'react-router-dom';
import './About.css';

const TEAM = [
  { name:'Arjun Sharma',  role:'CEO & Co-Founder',     emoji:'👨‍💼', city:'Mumbai' },
  { name:'Priya Patel',   role:'CTO & Co-Founder',     emoji:'👩‍💻', city:'Bangalore' },
  { name:'Ravi Mehta',    role:'Head of Operations',   emoji:'👨‍🔧', city:'Delhi' },
  { name:'Sunita Rao',    role:'Head of Sales',         emoji:'👩‍💼', city:'Pune' },
];

const MILESTONES = [
  { year:'2019', text:'Founded with a mission to simplify Indian real estate' },
  { year:'2020', text:'Reached 10,000 listings across 10 Indian cities' },
  { year:'2021', text:'Launched mobile-first experience, 1 lakh users' },
  { year:'2022', text:'Expanded to 50 cities, introduced builder partnerships' },
  { year:'2023', text:'2 lakh+ happy customers, ₹5,000 Cr in transactions' },
  { year:'2024', text:'AI-powered property recommendations launched' },
];

export default function About() {
  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '16px', display: 'inline-block' }}>🇮🇳 Made in India</span>
          <h1>India's Most Trusted <span style={{ color: 'var(--gold)' }}>Real Estate Platform</span></h1>
          <p>Since 2019, we have been connecting millions of Indians with their dream homes — making the process of buying, selling and renting property simple, transparent and affordable.</p>
          <div className="about-hero__stats">
            {[['2 Lakh+','Happy Customers'],['50,000+','Properties Listed'],['50+','Cities Covered'],['₹5,000 Cr+','In Transactions']].map(([v,l]) => (
              <div key={l} className="about-stat">
                <strong>{v}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div className="about-mission">
            <div>
              <h2 className="section-title">Our <span>Mission</span></h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginTop: '12px' }}>
                We believe every Indian deserves access to safe, affordable and quality housing. Our platform eliminates the middlemen, provides transparent pricing, and connects buyers directly with verified sellers — saving both time and money.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginTop: '12px' }}>
                From a ₹20 lakh 1 BHK in Pune to a ₹10 crore villa in Mumbai, we cater to every budget, every city, and every dream.
              </p>
              <Link to="/properties" className="btn btn-primary" style={{ marginTop: '24px' }}>
                Explore Properties →
              </Link>
            </div>
            <div className="mission-visual">
              <div className="mission-card"><span>🏠</span><strong>50,000+</strong><small>Verified Listings</small></div>
              <div className="mission-card"><span>🔒</span><strong>100%</strong><small>Verified Properties</small></div>
              <div className="mission-card"><span>⚡</span><strong>24 hrs</strong><small>Avg. Response Time</small></div>
              <div className="mission-card"><span>💰</span><strong>₹0</strong><small>Listing Fee</small></div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section" style={{ background: 'var(--bg-secondary)', marginTop: '0' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Our <span>Journey</span></h2>
          <div className="timeline">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-year">{m.year}</div>
                <div className="timeline-content">{m.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Meet Our <span>Team</span></h2>
          <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '40px' }}>The people building the future of Indian real estate</p>
          <div className="grid-4">
            {TEAM.map(m => (
              <div key={m.name} className="team-card card">
                <div className="team-emoji">{m.emoji}</div>
                <h3 className="team-name">{m.name}</h3>
                <p className="team-role">{m.role}</p>
                <span className="badge badge-muted">📍 {m.city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="about-cta">
            <h2>Join the RealEstateIndia Family</h2>
            <p>Whether you're a buyer, seller or agent — we have the tools to help you succeed.</p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '24px' }}>
              <Link to="/signup"  className="btn btn-primary btn-lg">Get Started Free</Link>
              <Link to="/contact" className="btn btn-outline btn-lg">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
