"use client";

import { useState, useEffect } from 'react';
import Hero from "../components/Hero";
import ListingCard from "../components/ListingCard";

export default function Home() {
  const [savedListings, setSavedListings] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tripPlannerListings');
    if (saved) {
      setSavedListings(JSON.parse(saved));
    }
  }, []);

  const handleAddListing = (newListing) => {
    const listingWithId = { ...newListing, id: crypto.randomUUID() };
    const updatedList = [listingWithId, ...savedListings];
    setSavedListings(updatedList);
    localStorage.setItem('tripPlannerListings', JSON.stringify(updatedList));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Hero onAddListing={handleAddListing} />

      <section id="saved-listings" className="py-20 bg-gray-50 min-h-[500px]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Your Saved Stays ({savedListings.length})
            </h2>
            {savedListings.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear all saved listings?')) {
                    setSavedListings([]);
                    localStorage.removeItem('tripPlannerListings');
                  }
                }}
                className="text-red-500 hover:text-red-700 font-medium text-sm"
              >
                Clear All
              </button>
            )}
          </div>

          {savedListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
              <p className="text-xl text-gray-400 font-medium mb-2">No listings saved yet.</p>
              <p className="text-gray-500">Paste a link above to get started!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
