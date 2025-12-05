'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Search Form Component
 * 
 * A complex form that captures user preferences for the trip:
 * - Destination (NC vs SC)
 * - Dates (Check-in/Check-out)
 * - Guest counts (Adults, Kids, Babies)
 * - Budget slider
 * 
 * Updates the URL query parameters on submission to trigger a search.
 * 
 * @returns {JSX.Element} The rendered Search Form
 */
export default function SearchForm() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState('');
  const [kids, setKids] = useState('');
  const [babies, setBabies] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      adults,
      kids,
      babies,
      budget,
    });
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="form-group">
        <label>Where to?</label>
        <div className="location-input-wrapper">
          <input
            type="text"
            placeholder="e.g. Myrtle Beach, Maui, Destin"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="location-input"
          />
          <span className="location-icon">📍</span>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Check-in</label>
          <input
            type="date"
            required
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Check-out</label>
          <input
            type="date"
            required
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Guests</label>
        <div className="guests-grid">
          <div className="guest-input">
            <span>Adults</span>
            <input
              type="number"
              min="1"
              value={adults}
              onChange={(e) => setAdults(parseInt(e.target.value))}
            />
          </div>
          <div className="guest-input">
            <span>Kids</span>
            <input
              type="number"
              min="0"
              value={kids}
              onChange={(e) => setKids(parseInt(e.target.value))}
            />
          </div>
          <div className="guest-input">
            <span>Babies</span>
            <input
              type="number"
              min="0"
              value={babies}
              onChange={(e) => setBabies(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Max Budget: ${budget.toLocaleString()}</label>
        <input
          type="range"
          min="1000"
          max="20000"
          step="500"
          value={budget}
          onChange={(e) => setBudget(parseInt(e.target.value))}
          className="budget-slider"
        />
      </div>

      <button type="submit" className="btn btn-primary search-btn">
        Find Our Beach House
      </button>

      <style jsx>{`
        .search-form {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(12px);
          padding: 32px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          width: 100%;
          max-width: 500px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        input[type="date"],
        input[type="number"] {
          width: 100%;
          background: #0f172a;
          border: 1px solid #334155;
          color: #f8fafc;
          padding: 12px;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }

        input:focus {
          border-color: var(--primary);
        }

        .radio-group {
          display: flex;
          gap: 12px;
        }

        .radio-btn {
          flex: 1;
          background: #0f172a;
          border: 1px solid #334155;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
          color: #cbd5e1;
          text-transform: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .radio-btn input {
          display: none;
        }

        .radio-btn.active {
          background: rgba(56, 189, 248, 0.1);
          border-color: var(--primary);
          color: var(--primary);
        }

        .guests-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }

        .guest-input span {
          display: block;
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 4px;
        }

        .budget-slider {
          width: 100%;
          height: 6px;
          background: #334155;
          border-radius: 3px;
          appearance: none;
          outline: none;
        }

        .budget-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: var(--primary);
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.1s;
        }

        .budget-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .search-btn {
          width: 100%;
          margin-top: 12px;
          font-size: 1.125rem;
          padding: 16px;
        }

        .location-input-wrapper {
          position: relative;
        }

        .location-input {
          width: 100%;
          padding: 12px 12px 12px 40px !important; /* Make room for icon */
        }

        .location-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
        }
      `}</style>
    </form>
  );
}
