// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">🏠 Real<span>Estate</span>India</div>
            <p>India's most trusted platform to Buy, Sell &amp; Rent properties. Connecting millions of buyers and sellers across the country.</p>
            <div className="footer__socials">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📸</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>

          {/* Quick links */}
          <div className="footer__col">
            <h4>Quick Links</h4>
            <Link to="/buy">Buy Property</Link>
            <Link to="/rent">Rent Property</Link>
            <Link to="/sell">Sell Property</Link>
            <Link to="/agents">Agents &amp; Builders</Link>
            <Link to="/about">About Us</Link>
          </div>

          {/* Property Types */}
          <div className="footer__col">
            <h4>Property Types</h4>
            <Link to="/properties?type=flat">Flats &amp; Apartments</Link>
            <Link to="/properties?type=villa">Villas</Link>
            <Link to="/properties?type=plot">Plots &amp; Land</Link>
            <Link to="/properties?type=commercial">Commercial</Link>
            <Link to="/properties?type=house">Independent Houses</Link>
          </div>

          {/* Top Cities */}
          <div className="footer__col">
            <h4>Top Cities</h4>
            <Link to="/properties?city=Mumbai">Mumbai</Link>
            <Link to="/properties?city=Delhi">Delhi / NCR</Link>
            <Link to="/properties?city=Bangalore">Bangalore</Link>
            <Link to="/properties?city=Pune">Pune</Link>
            <Link to="/properties?city=Hyderabad">Hyderabad</Link>
            <Link to="/properties?city=Chennai">Chennai</Link>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} RealEstateIndia. All rights reserved.</p>
          <div className="footer__bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
