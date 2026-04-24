// src/components/EMICalculator.jsx
import { useState, useMemo } from 'react';
import './EMICalculator.css';

export default function EMICalculator({ defaultPrice = 5000000 }) {
  const [price,    setPrice]    = useState(defaultPrice);
  const [down,     setDown]     = useState(20);     // % down payment
  const [rate,     setRate]     = useState(8.5);    // annual interest %
  const [tenure,   setTenure]   = useState(20);     // years

  const { emi, totalAmount, totalInterest, loanAmount } = useMemo(() => {
    const loan = price * (1 - down / 100);
    const r    = rate / 12 / 100;
    const n    = tenure * 12;
    const emi  = r === 0 ? loan / n : (loan * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
    return {
      loanAmount:    loan,
      emi:           Math.round(emi),
      totalAmount:   Math.round(emi * n),
      totalInterest: Math.round(emi * n - loan),
    };
  }, [price, down, rate, tenure]);

  const fmt = (v) => v >= 10000000
    ? `₹${(v/10000000).toFixed(2)} Cr`
    : `₹${(v/100000).toFixed(1)} L`;

  return (
    <div className="emi-calc">
      <h3 className="emi-calc__title">🧮 EMI Calculator</h3>

      <div className="emi-calc__field">
        <label>Property Price: <strong>{fmt(price)}</strong></label>
        <input type="range" min="500000" max="100000000" step="100000"
          value={price} onChange={e => setPrice(+e.target.value)} />
      </div>

      <div className="emi-calc__field">
        <label>Down Payment: <strong>{down}%</strong> ({fmt(price * down / 100)})</label>
        <input type="range" min="5" max="90" step="5"
          value={down} onChange={e => setDown(+e.target.value)} />
      </div>

      <div className="emi-calc__field">
        <label>Interest Rate: <strong>{rate}% p.a.</strong></label>
        <input type="range" min="6" max="15" step="0.1"
          value={rate} onChange={e => setRate(+e.target.value)} />
      </div>

      <div className="emi-calc__field">
        <label>Loan Tenure: <strong>{tenure} years</strong></label>
        <input type="range" min="1" max="30" step="1"
          value={tenure} onChange={e => setTenure(+e.target.value)} />
      </div>

      <div className="emi-calc__result">
        <div className="emi-result-item emi-result-item--highlight">
          <span>Monthly EMI</span>
          <strong>₹{emi.toLocaleString('en-IN')}</strong>
        </div>
        <div className="emi-result-item">
          <span>Loan Amount</span>
          <strong>{fmt(loanAmount)}</strong>
        </div>
        <div className="emi-result-item">
          <span>Total Interest</span>
          <strong>{fmt(totalInterest)}</strong>
        </div>
        <div className="emi-result-item">
          <span>Total Payable</span>
          <strong>{fmt(totalAmount)}</strong>
        </div>
      </div>

      <p className="emi-calc__note">* Approximate values for reference only. Actual rates may vary.</p>
    </div>
  );
}
