'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

/**
 * User Provider Component
 * (Formerly FavoritesProvider)
 * 
 * Manages the "Identity" of the current user.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The Context Provider
 */
export function FavoritesProvider({ children }) {
    const [currentUser, setCurrentUser] = useState('');

    // Load user from LocalStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('beach_trip_user');
        if (savedUser) {
            setCurrentUser(savedUser);
        } else {
            const newUser = `Guest-${Math.floor(Math.random() * 10000)}`;
            setCurrentUser(newUser);
            localStorage.setItem('beach_trip_user', newUser);
        }
    }, []);

    // Save user to LocalStorage
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('beach_trip_user', currentUser);
        }
    }, [currentUser]);

    // Stub functions to prevent crashes if any old components are lingering (just in case)
    const toggleFavorite = () => { };
    const isFavorite = () => false;
    const toggleVote = () => { };
    const favorites = [];

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, currentUser, setCurrentUser, toggleVote }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}
