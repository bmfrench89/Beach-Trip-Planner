'use client';

import { useFavorites } from '@/lib/store';

/**
 * Listing Card Component
 * 
 * Displays a single listing with its image, details, and price.
 * Includes a heart button to toggle the favorite status of the listing.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.listing - The listing data object
 * @returns {JSX.Element} The rendered Listing Card
 */
export default function ListingCard({ listing }) {
  const { toggleFavorite, isFavorite, currentUser, toggleVote } = useFavorites();
  const favorite = isFavorite(listing.id);

  const isFavoritesPage = !!listing.votes;
  const voteCount = listing.votes?.length || 0;
  const hasVoted = listing.votes?.some(v => v.user === currentUser);

  return (
    <div className="card listing-card">
      <div className="image-container">
        {listing.image ? (
          <img src={listing.image} alt={listing.title} className="listing-image" />
        ) : (
          <div className="placeholder-image">
            <span>No Image</span>
          </div>
        )}
        <button
          className={`favorite-btn ${favorite ? 'active' : ''}`}
          onClick={() => toggleFavorite(listing)}
        >
          ♥
        </button>
      </div>

      <div className="content">
        <div className="header">
          <h3>{listing.title}</h3>
          <span className="rating">★ {listing.rating}</span>
        </div>

        <div className="specs">
          <span>{listing.type}</span>
          <span>•</span>
          <span>{listing.specs.beds} Beds</span>
          <span>•</span>
          <span>Max {listing.specs.guests} Guests</span>
        </div>

        <div className="footer">
          <div className="price">
            <span className="amount">${Math.round(listing.price).toLocaleString()}</span>
            <span className="period">/total</span>
          </div>

          {isFavoritesPage ? (
            <button
              className={`vote-btn ${hasVoted ? 'voted' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                toggleVote(listing.id);
              }}
            >
              ▲ {voteCount}
            </button>
          ) : (
            <a href="#" className="view-btn">View Details</a>
          )}
        </div>
      </div>

      <style jsx>{`
        .listing-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .image-container {
          position: relative;
          height: 200px;
          background: #334155;
        }

        .listing-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .favorite-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          color: #fff;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .favorite-btn:hover {
          transform: scale(1.1);
          background: rgba(15, 23, 42, 0.8);
        }

        .favorite-btn.active {
          color: var(--accent);
        }

        .content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 12px;
        }

        h3 {
          font-size: 1.125rem;
          line-height: 1.4;
          color: #f8fafc;
        }

        .rating {
          font-size: 0.875rem;
          font-weight: 600;
          color: #fbbf24;
          white-space: nowrap;
        }

        .specs {
          display: flex;
          gap: 8px;
          font-size: 0.875rem;
          color: #94a3b8;
          margin-bottom: 20px;
        }

        .footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price {
          display: flex;
          flex-direction: column;
        }

        .amount {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
        }

        .period {
          font-size: 0.75rem;
          color: #64748b;
        }

        .view-btn {
          font-size: 0.875rem;
          font-weight: 600;
          color: #f8fafc;
          padding: 8px 16px;
          background: #334155;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .view-btn:hover {
          background: #475569;
        }

        .vote-btn {
            background: #334155;
            border: none;
            color: #94a3b8;
            padding: 6px 12px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .vote-btn:hover {
            background: #475569;
            color: #f8fafc;
        }
        .vote-btn.voted {
            background: var(--primary);
            color: white;
        }
      `}</style>
    </div>
  );
}
