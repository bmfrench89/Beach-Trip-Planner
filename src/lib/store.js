'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

/**
 * Favorites Provider Component
 * 
 * Manages the global state for favorited listings.
 * Fetches favorites from the SQLite database via API.
 * Persists the user name to LocalStorage.
 * Provides `favorites`, `toggleFavorite`, `isFavorite`, `currentUser`, and `setCurrentUser` to the context.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The Context Provider
 */
export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);
    const [currentUser, setCurrentUser] = useState('');

    // Load favorites from API and user from LocalStorage on mount
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await fetch('/api/favorites');
                if (res.ok) {
                    const data = await res.json();
                    setFavorites(data);
                }
            } catch (error) {
                console.error('Failed to fetch favorites:', error);
            }
        };

        fetchFavorites();

        const savedUser = localStorage.getItem('beach_trip_user');
        if (savedUser) {
            setCurrentUser(savedUser);
        }
    }, []);

    // Save user to LocalStorage
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('beach_trip_user', currentUser);
        }
    }, [currentUser]);

    const toggleFavorite = async (listing) => {
        if (!currentUser) return;

        const exists = favorites.find(f => f.listingId === listing.id);

        if (exists) {
            // Optimistic update
            setFavorites(prev => prev.filter(f => f.listingId !== listing.id));

            try {
                await fetch(`/api/favorites?id=${listing.id}`, { method: 'DELETE' });
            } catch (error) {
                console.error('Failed to delete favorite:', error);
                // Revert if failed (could be improved)
            }
        } else {
            // Optimistic update
            const newFavorite = { ...listing, listingId: listing.id, addedBy: currentUser };
            setFavorites(prev => [...prev, newFavorite]);

            try {
                const res = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...listing, addedBy: currentUser }),
                });
                if (res.ok) {
                    const savedFavorite = await res.json();
                    // Update with real ID from DB
                    setFavorites(prev => prev.map(f => f.listingId === listing.id ? savedFavorite : f));
                }
            } catch (error) {
                console.error('Failed to add favorite:', error);
            }
        }
    };

    const isFavorite = (id) => {
        return favorites.some(f => f.listingId === id);
    };

    const toggleVote = async (favoriteId) => {
        if (!currentUser) return;

        // Optimistic update
        setFavorites(prev => prev.map(f => {
            if (f.id === favoriteId) {
                const hasVoted = f.votes?.some(v => v.user === currentUser);
                const newVotes = hasVoted
                    ? f.votes.filter(v => v.user !== currentUser)
                    : [...(f.votes || []), { user: currentUser }];
                return { ...f, votes: newVotes };
            }
            return f;
        }));

        try {
            await fetch('/api/favorites/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ favoriteId, user: currentUser }),
            });
        } catch (error) {
            console.error('Failed to toggle vote:', error);
            // Revert if needed
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, currentUser, setCurrentUser, toggleVote }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}
