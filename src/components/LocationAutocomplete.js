'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Location Autocomplete Component
 * 
 * Provides a text input that fetches location suggestions from the server.
 * Allows user to select a specific location which returns:
 * - label (Display name)
 * - id (Booking.com dest_id)
 * - type (search_type)
 * - lat/lon (needed for VRBO)
 */
export default function LocationAutocomplete({ onSelect, defaultValue = '' }) {
    const [query, setQuery] = useState(defaultValue);
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    // Debouce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2 && isOpen) {
                fetchSuggestions(query);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, isOpen]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);


    async function fetchSuggestions(searchTerm) {
        setLoading(true);
        try {
            const res = await fetch(`/api/places?term=${encodeURIComponent(searchTerm)}`);
            const data = await res.json();
            setSuggestions(data.suggestions || []);
        } catch (error) {
            console.error('Error fetching places:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setIsOpen(true);
        // Clear the previous selection if user starts typing again
        // We pass null to indicate "raw text input" vs "selected location"
        // However the parent might still prefer the text.
        // Ideally we want to force selection for best results, but allow fallback.
    };

    const handleSelect = (item) => {
        setQuery(item.label);
        setSuggestions([]);
        setIsOpen(false);
        onSelect(item);
    };

    return (
        <div className="location-autocomplete-wrapper" ref={wrapperRef}>
            <div className="input-group">
                <input
                    type="text"
                    className="location-input"
                    placeholder="e.g. Myrtle Beach, Maui"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                />
                <span className="location-icon">📍</span>
                {loading && <span className="spinner">↻</span>}
            </div>

            {isOpen && suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((item) => (
                        <li key={item.id} onClick={() => handleSelect(item)}>
                            <span className="suggestion-icon">Location</span>
                            <div className="suggestion-details">
                                <span className="suggestion-main">{item.label}</span>
                                <span className="suggestion-sub">{item.type}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <style jsx>{`
        .location-autocomplete-wrapper {
            position: relative;
            width: 100%;
        }

        .input-group {
            position: relative;
            display: flex;
            align-items: center;
        }

        .location-input {
            width: 100%;
            background: #0f172a;
            border: 1px solid #334155;
            color: #f8fafc;
            padding: 12px 12px 12px 40px;
            border-radius: 8px;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.2s;
        }

        .location-input:focus {
            border-color: #38bdf8;
        }

        .location-icon {
            position: absolute;
            left: 12px;
            font-size: 1.2rem;
            pointer-events: none;
        }

        .spinner {
            position: absolute;
            right: 12px;
            color: #94a3b8;
            font-size: 1.2rem;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .suggestions-list {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 8px;
            margin-top: 4px;
            max-height: 300px;
            overflow-y: auto;
            z-index: 50;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
            list-style: none;
            padding: 0;
        }

        .suggestions-list li {
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            border-bottom: 1px solid #334155;
            transition: background 0.2s;
        }

        .suggestions-list li:last-child {
            border-bottom: none;
        }

        .suggestions-list li:hover {
            background: #334155;
        }

        .suggestion-details {
            display: flex;
            flex-direction: column;
        }

        .suggestion-main {
            color: #f8fafc;
            font-weight: 500;
        }

        .suggestion-sub {
            color: #94a3b8;
            font-size: 0.8rem;
            text-transform: capitalize;
        }
      `}</style>
        </div>
    );
}
