// src/pages/Contact.jsx
import { useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Contact.css';

const OFFICES = [
  { city: 'Mumbai (HQ)', addr: '14th Floor, BKC Tower, Bandra Kurla Complex, Mumbai – 400051', phone: '+91 22 4567 8900', icon: '🏢' },
  { city: 'Delhi',       addr: 'Connaught Place, Block B, New Delhi – 110001',                 phone: '+91 11 4567 8900', icon: '🏛️' },
  { city: 'Bangalore',   addr: '3rd Floor, Prestige Tower, MG Road, Bengaluru – 560001',       phone: '+91 80 4567 8900', icon: '🌇' },
];

export default function Contact() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name:    user?.name  || '',
    email:   user?.email || '',
    phone:   '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message)
      return toast.error('Please fill all required fields');
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent! We will get back to you within 24 hours. 📧');
      setForm(p => ({ ...p, message: '' }));
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="page-header">
        <div className="container">
          <h1>📞 Contact Us</h1>
          <p>Have a question? We're here to help. Reach out to us anytime.</p>
        </div>
      </div>

      <div className="container contact-layout">
        {/* Left: offices + info */}
        <div className="contact-info">
          <h2 style={{ marginBottom: '24px' }}>Get in <span style={{ color: 'var(--gold)' }}>Touch</span></h2>

          {OFFICES.map(o => (
            <div key={o.city} className="office-card">
              <div className="office-icon">{o.icon}</div>
              <div>
                <h4>{o.city}</h4>
                <p>{o.addr}</p>
                <a href={`tel:${o.phone.replace(/\s/g,'')}`}>{o.phone}</a>
              </div>
            </div>
          ))}

          <div className="contact-channels">
            <a href="mailto:support@realestateindia.com" className="channel-card">
              <span>✉️</span>
              <div>
                <strong>Email Support</strong>
                <small>support@realestateindia.com</small>
              </div>
            </a>
            <a href="https://wa.me/919999999999" className="channel-card" target="_blank" rel="noreferrer">
              <span>💬</span>
              <div>
                <strong>WhatsApp</strong>
                <small>+91 99999 99999</small>
              </div>
            </a>
            <div className="channel-card">
              <span>🕐</span>
              <div>
                <strong>Working Hours</strong>
                <small>Mon–Sat, 9 AM – 7 PM IST</small>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="contact-form-wrap">
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ marginBottom: '24px' }}>Send Us a Message</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-control" required value={form.name}
                    onChange={set('name')} placeholder="Ramesh Sharma" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={form.phone}
                    onChange={set('phone')} placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-control" type="email" required value={form.email}
                  onChange={set('email')} placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea className="form-control" required rows={5} value={form.message}
                  onChange={set('message')} placeholder="How can we help you? Tell us about the property you're looking for, or any questions you have…" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '13px' }} disabled={loading}>
                {loading ? 'Sending…' : '📨 Send Message'}
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div className="faq-section">
            <h3 style={{ marginBottom: '16px' }}>Frequently Asked Questions</h3>
            {[
              { q:'How do I list my property?', a:"Create a seller account, click 'List Property', fill in the details and submit. Our team reviews and approves within 24 hours." },
              { q:'Is listing free?',            a:'Yes! Listing your property on RealEstateIndia is completely free. We only charge for premium placement.' },
              { q:'How do I contact a seller?',  a:"Visit the property detail page and use the 'Send Enquiry' form or click the phone number directly." },
              { q:'Are properties verified?',    a:'Our team manually verifies all listings before they go live. We also encourage sellers to upload legal documents.' },
            ].map(f => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
