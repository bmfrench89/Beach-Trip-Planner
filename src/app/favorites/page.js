'use client';

import { useFavorites } from '@/lib/store';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';

/**
 * Favorites Page Component
 * 
'use client';

import { useFavorites } from '@/lib/store';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';

/**
 * Favorites Page Component
 * 
 * Displays the list of listings that the user has favorited.
 * Uses the `useFavorites` hook to access the global state.
 * 
 * @returns {JSX.Element} The rendered Favorites page
 */
export default function FavoritesPage() {
  const { favorites } = useFavorites();

  // Group favorites by user
  const favoritesByUser = favorites.reduce((acc, listing) => {
    const user = listing.addedBy || 'Anonymous';
    if (!acc[user]) acc[user] = [];
    acc[user].push(listing);
    return acc;
  }, {});

  return (
    <div className="favorites-page">
      <header className="favorites-header">
        <div className="container">
          <div className="header-content">
            <Link href="/" className="back-link">← Back to Search</Link>
            <h1>Our Top Picks</h1>
            <p className="subtitle">
              Vote on your favorites to help the group decide!
            </p>
          </div>
        </div>
      </header>

      <main className="container">
        {favorites.length > 0 ? (
          <div className="columns-container">
            {Object.entries(favoritesByUser).map(([user, userFavorites]) => (
              <div key={user} className="user-column">
                <h2 className="column-title">{user}'s Picks</h2>
                <div className="favorites-grid">
                  {userFavorites.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No favorites yet</h2>
            <p>Go back and heart some listings to save them here.</p>
            <Link href="/" className="btn btn-primary">Start Searching</Link>
          </div>
        )}
      </main>

      <style jsx>{`
        .favorites-page {
          min-height: 100vh;
          padding-bottom: 80px;
        }

        .favorites-header {
          background: #1e293b;
          padding: 32px 0;
          margin-bottom: 40px;
          border-bottom: 1px solid #334155;
        }

        .header-content h1 {
          font-size: 2.5rem;
          margin: 12px 0 8px;
        }

        .subtitle {
          color: #94a3b8;
        }

        .back-link {
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .back-link:hover {
          color: var(--primary);
        }

        .columns-container {
            display: flex;
            gap: 32px;
            overflow-x: auto;
            padding-bottom: 20px;
        }

        .user-column {
            min-width: 350px;
            flex: 1;
            background: rgba(30, 41, 59, 0.5);
            border-radius: 16px;
            padding: 24px;
            border: 1px solid #334155;
        }

        .column-title {
            font-size: 1.5rem;
            margin-bottom: 24px;
            color: var(--primary);
            border-bottom: 2px solid #334155;
            padding-bottom: 12px;
        }

        .favorites-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .empty-state {
          text-align: center;
          padding: 80px 0;
          color: #94a3b8;
        }

        .empty-state h2 {
          color: #f8fafc;
          margin-bottom: 12px;
        }

        .empty-state p {
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
}
