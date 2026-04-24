// src/components/LoadingSpinner.jsx
import './LoadingSpinner.css';

export default function LoadingSpinner({ fullscreen }) {
  if (fullscreen) {
    return (
      <div className="spinner-fullscreen">
        <div className="spinner-logo">🏠</div>
        <div className="spinner" />
        <p>Loading Real Estate India…</p>
      </div>
    );
  }
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
    </div>
  );
}
