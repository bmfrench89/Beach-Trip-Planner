"use client";

import { useState } from 'react';

export default function AddListingForm({ onAdd }) {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fetchedData, setFetchedData] = useState(null); // { title, image, price }
    const [error, setError] = useState('');

    // Manual override states
    const [manualTitle, setManualTitle] = useState('');
    const [manualPrice, setManualPrice] = useState('');
    const [manualBedrooms, setManualBedrooms] = useState('');
    const [manualBathrooms, setManualBathrooms] = useState('');
    const [manualAmenities, setManualAmenities] = useState('');

    const fetchMetadata = async (inputUrl) => {
        if (!inputUrl) return;
        setIsLoading(true);
        setError('');
        setFetchedData(null);

        try {
            const res = await fetch('/api/metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: inputUrl }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to fetch');

            setFetchedData(data);
            setManualTitle(data.title || ''); // Allow empty if really nothing found
            setManualPrice(data.price || '');

            // Populate details if available
            if (data.details) {
                setManualBedrooms(data.details.bedrooms || '');
                setManualBathrooms(data.details.bathrooms || '');
                setManualAmenities(data.details.amenities ? data.details.amenities.join(', ') : '');
            } else {
                setManualBedrooms('');
                setManualBathrooms('');
                setManualAmenities('');
            }

        } catch (err) {
            // Quietly handle error by defaulting to manual entry
            setFetchedData({});
            setError('Could not auto-fetch details. Please review.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUrlPaste = (e) => {
        const inputUrl = e.target.value;
        setUrl(inputUrl);
        // Debounce or just wait for user to finish? 
        // Let's optimize: check if it looks like a URL, then fetch
        if (inputUrl.length > 10 && inputUrl.includes('http')) {
            // Clear previous data
            setFetchedData(null);
        }
    };

    const handleMagicAdd = (e) => {
        e.preventDefault();
        if (!url) return;
        fetchMetadata(url);
    };

    const handleConfirmAdd = () => {
        if (onAdd && fetchedData) {
            onAdd({
                url,
                title: manualTitle,
                price: manualPrice,
                image: fetchedData.image,
                details: {
                    bedrooms: manualBedrooms ? parseInt(manualBedrooms) : null,
                    bathrooms: manualBathrooms ? parseFloat(manualBathrooms) : null,
                    amenities: manualAmenities.split(',').map(s => s.trim()).filter(Boolean)
                }
            });
            // Reset
            setUrl('');
            setFetchedData(null);
            setManualTitle('');
            setManualPrice('');
            setManualBedrooms('');
            setManualBathrooms('');
            setManualAmenities('');
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (onAdd) {
            onAdd({
                url,
                title: manualTitle,
                price: manualPrice,
                image: '' // No image for pure manual
            });
            // Reset everything
            setUrl('');
            setFetchedData(null);
            setManualTitle('');
            setManualPrice('');
        }
    }

    // If we have fetched data, show the "Review & Confirm" state
    if (fetchedData) {
        return (
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-2xl w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-gray-900 font-bold text-lg mb-4">Review Details</h3>

                {error && (
                    <div className="mb-4 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg text-sm border border-yellow-200">
                        Could not auto-fetch details. Please enter them manually.
                    </div>
                )}

                {/* Image Preview */}
                {fetchedData.image && (
                    <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden">
                        <img src={fetchedData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                        <input
                            type="text"
                            value={manualTitle}
                            onChange={(e) => setManualTitle(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
                            placeholder="Property Name (optional)"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Price / Night ($)</label>
                            <input
                                type="number"
                                value={manualPrice}
                                onChange={(e) => setManualPrice(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
                                placeholder="e.g. 250"
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Bedrooms</label>
                                <input
                                    type="number"
                                    value={manualBedrooms}
                                    onChange={(e) => setManualBedrooms(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="#"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Bathrooms</label>
                                <input
                                    type="number"
                                    value={manualBathrooms}
                                    onChange={(e) => setManualBathrooms(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="#"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Amenities (comma separated)</label>
                        <input
                            type="text"
                            value={manualAmenities}
                            onChange={(e) => setManualAmenities(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
                            placeholder="Pool, Wifi, Beachfront..."
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => setFetchedData(null)}
                        className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmAdd}
                        className="flex-1 py-3 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl shadow-lg transition"
                    >
                        Add to Trip
                    </button>
                </div>
            </div>
        );
    }

    // Initial State: Just the URL bar
    return (
        <div className="w-full max-w-3xl mx-auto">
            <form onSubmit={handleMagicAdd} className="relative bg-white/95 backdrop-blur-sm p-2 pl-6 rounded-full shadow-2xl flex items-center gap-2">
                <div className="flex-1 flex flex-col justify-center">
                    <input
                        type="url"
                        value={url}
                        onChange={handleUrlPaste}
                        className="w-full bg-transparent text-gray-900 text-lg font-semibold focus:outline-none placeholder-gray-400 h-10"
                        placeholder="Paste link from Airbnb, VRBO, etc..."
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-teal-500 hover:bg-teal-400 text-white font-bold h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Fetching...
                        </span>
                    ) : (
                        <>
                            <span>Add Listing</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
