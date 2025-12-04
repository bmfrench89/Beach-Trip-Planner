'use client';

import ListingCard from '@/components/ListingCard';
import Link from 'next/link';

/**
 * Search Results Component
 * 
 * Displays the grid of listing cards based on the search results.
 * Handles empty states and provides navigation back to search or to favorites.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.listings - Array of listing objects to display
 * @param {string} props.destination - Current destination filter
 * @param {number} props.numGuests - Total number of guests
 * @param {number} props.budget - Max budget filter
 * @returns {JSX.Element} The rendered Search Results grid
 */
export default function SearchResults({ listings, destination, numGuests, budget }) {
  return (
    <div className="search-page">
      <header className="results-header">
        <div className="container">
          <div className="header-content">
            <Link href="/" className="back-link">← Back to Search</Link>
            <h1>
              {destination === 'NC' ? 'North Carolina' : 'South Carolina'} Stays
            </h1>
            <p className="stats">
              Found {listings.length} results for {numGuests} guests under ${budget.toLocaleString()}
            </p>
          </div>
          <Link href="/favorites" className="favorites-link">
            View Favorites ♥
          </Link>
        </div>
      </header>

      <main className="container results-grid">
        {listings.length > 0 ? (
          listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <div className="no-results">
            <h2>No listings found</h2>
            <p>Try adjusting your budget or dates.</p>
            <p className="api-note">Note: If you haven't added API keys yet, results will be empty.</p>
          </div>
        )}
      </main>

      <style jsx>{`
        .search-page {
          min-height: 100vh;
          padding-bottom: 80px;
        }

        .results-header {
          background: #1e293b;
          padding: 32px 0;
          margin-bottom: 40px;
          border-bottom: 1px solid #334155;
        }

        .header-content h1 {
          font-size: 2.5rem;
          margin: 12px 0 8px;
        }

        .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .back-link {
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .back-link:hover {
          color: var(--primary);
        }

        .stats {
          color: #94a3b8;
        }

        .favorites-link {
          padding: 12px 24px;
          background: rgba(244, 114, 182, 0.1);
          color: var(--accent);
          border-radius: 50px;
          font-weight: 600;
          border: 1px solid var(--accent);
          transition: all 0.2s;
        }

        .favorites-link:hover {
          background: var(--accent);
          color: #fff;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 32px;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 0;
          color: #94a3b8;
        }

        .api-note {
          margin-top: 16px;
          font-size: 0.875rem;
          color: #64748b;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
