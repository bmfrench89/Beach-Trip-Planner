'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);

    // Load from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('beach_trip_favorites');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    }, []);

    // Save to LocalStorage whenever favorites change
    useEffect(() => {
        localStorage.setItem('beach_trip_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (listing) => {
        setFavorites(prev => {
            const exists = prev.find(f => f.id === listing.id);
            if (exists) {
                return prev.filter(f => f.id !== listing.id);
            }
            return [...prev, listing];
        });
    };

    const isFavorite = (id) => {
        return favorites.some(f => f.id === id);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}
