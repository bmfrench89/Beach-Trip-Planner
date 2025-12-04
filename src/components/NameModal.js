'use client';

import { useState, useEffect } from 'react';
import { useFavorites } from '@/lib/store';

/**
 * Name Modal Component
 * 
 * Prompts the user to enter their name if it hasn't been set yet.
 * This name is used to track who added which favorites.
 * 
 * @returns {JSX.Element|null} The modal or null if name is already set
 */
export default function NameModal() {
    const { currentUser, setCurrentUser } = useFavorites();
    const [name, setName] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Small delay to prevent flash if loading from local storage
        const timer = setTimeout(() => {
            if (!currentUser) {
                setIsOpen(true);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            setCurrentUser(name.trim());
            setIsOpen(false);
        }
    };

    if (!isOpen && currentUser) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Welcome! 👋</h2>
                <p>Please enter your name so your friends know who's picking favorites.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Your First Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        required
                    />
                    <button type="submit" className="btn btn-primary">
                        Start Planning
                    </button>
                </form>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: #1e293b;
                    padding: 40px;
                    border-radius: 24px;
                    width: 90%;
                    max-width: 400px;
                    text-align: center;
                    border: 1px solid #334155;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                h2 {
                    font-size: 2rem;
                    margin-bottom: 16px;
                    color: #f8fafc;
                }

                p {
                    color: #94a3b8;
                    margin-bottom: 32px;
                    line-height: 1.5;
                }

                form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                input {
                    width: 100%;
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: #f8fafc;
                    padding: 16px;
                    border-radius: 12px;
                    font-size: 1.125rem;
                    text-align: center;
                    outline: none;
                    transition: border-color 0.2s;
                }

                input:focus {
                    border-color: var(--primary);
                }

                button {
                    width: 100%;
                    padding: 16px;
                    font-size: 1.125rem;
                }
            `}</style>
        </div>
    );
}
