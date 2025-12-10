"use client";

import { useState } from 'react';

export default function SearchForm({ onSearch }) {
    const [location, setLocation] = useState('NC');
    const [budget, setBudget] = useState(2000);
    const [showGuestMenu, setShowGuestMenu] = useState(false);
    const [guests, setGuests] = useState({
        adults: 2,
        children: 0,
        babies: 0,
    });

    const totalGuests = guests.adults + guests.children + guests.babies;

    const handleGuestChange = (type, operation) => {
        setGuests(prev => {
            const current = prev[type];
            if (operation === 'decrement' && current === 0) return prev;
            if (operation === 'decrement' && type === 'adults' && current === 1) return prev; // Min 1 adult
            return {
                ...prev,
                [type]: operation === 'increment' ? current + 1 : current - 1
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch({ location, budget, guests, totalGuests });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm p-4 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-4 items-center">

            {/* Location */}
            <div className="flex-1 w-full md:w-auto flex flex-col px-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</label>
                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent text-gray-900 font-semibold focus:outline-none cursor-pointer appearance-none"
                >
                    <option value="NC">North Carolina</option>
                    <option value="SC">South Carolina</option>
                </select>
            </div>

            <div className="hidden md:block w-px h-10 bg-gray-200"></div>

            {/* Guests */}
            <div className="flex-1 w-full md:w-auto flex flex-col px-4 relative">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Guests</label>
                <button
                    type="button"
                    onClick={() => setShowGuestMenu(!showGuestMenu)}
                    className="text-left w-full bg-transparent text-gray-900 font-semibold focus:outline-none"
                >
                    {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
                    <span className="text-gray-400 text-sm ml-2 font-normal">
                        {guests.adults} Ad, {guests.children} Ki, {guests.babies} Ba
                    </span>
                </button>

                {showGuestMenu && (
                    <div className="absolute top-full left-0 mt-4 w-64 bg-white rounded-xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 border border-gray-100">
                        {['adults', 'children', 'babies'].map((type) => (
                            <div key={type} className="flex items-center justify-between mb-4 last:mb-0">
                                <span className="capitalize text-gray-700 font-medium">{type}</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleGuestChange(type, 'decrement')}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-teal-500 hover:text-teal-500 transition disabled:opacity-50"
                                        disabled={type === 'adults' ? guests.adults <= 1 : guests[type] <= 0}
                                    >
                                        -
                                    </button>
                                    <span className="w-6 text-center font-semibold text-gray-900">{guests[type]}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleGuestChange(type, 'increment')}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-teal-500 hover:text-teal-500 transition"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="mt-4 pt-3 border-t border-gray-100 text-right">
                            <button
                                type="button"
                                onClick={() => setShowGuestMenu(false)}
                                className="text-teal-600 font-semibold hover:text-teal-700 text-sm"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="hidden md:block w-px h-10 bg-gray-200"></div>

            {/* Budget */}
            <div className="flex-1 w-full md:w-auto flex flex-col px-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Budget</label>
                <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-semibold">$</span>
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full bg-transparent text-gray-900 font-semibold focus:outline-none"
                        placeholder="2000"
                    />
                </div>
            </div>

            {/* Search Button */}
            <button
                type="submit"
                className="w-full md:w-auto bg-teal-500 hover:bg-teal-400 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <span className="md:hidden font-bold">Search</span>
            </button>

            {/* Close Guest Menu on click outside overlay */}
            {showGuestMenu && (
                <div className="fixed inset-0 z-40" onClick={() => setShowGuestMenu(false)}></div>
            )}
        </form>
    );
}
