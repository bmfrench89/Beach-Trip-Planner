"use client";

import { useState, useEffect, useRef } from 'react';
import Hero from "../components/Hero";
import ListingCard from "../components/ListingCard";

export default function Home() {
  const [savedListings, setSavedListings] = useState([]);

  // Load from API on mount
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/listings');
      if (res.ok) {
        const data = await res.json();
        setSavedListings(data);
      }
    } catch (error) {
      console.error('Failed to fetch listings', error);
    }
  };

  const handleAddListing = async (newListing) => {
    // Optimistic UI update could be done here, but for simplicity we'll wait for API
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListing),
      });

      if (res.ok) {
        const savedListing = await res.json();
        setSavedListings(prev => [savedListing, ...prev].sort((a, b) => (b.votes || 0) - (a.votes || 0)));
      }
    } catch (error) {
      console.error('Failed to add listing', error);
    }
  };

  const handleVoteListing = async (id) => {
    // Optimistic update
    setSavedListings(currentList =>
      currentList.map(item =>
        item.id === id ? { ...item, votes: (item.votes || 0) + 1 } : item
      ).sort((a, b) => (b.votes || 0) - (a.votes || 0)) // Re-sort after vote? Maybe annoying if jumping around.
      // Let's decide to NOT re-sort immediately or it jumps under your mouse.
      // Just map it first.
    );

    try {
      await fetch(`/api/listings/${id}/vote`, { method: 'PATCH' });
      // Ideally we re-fetch or validate, but optimistic is fine for now
    } catch (error) {
      console.error('Failed to vote', error);
      // Revert if failed?
    }
  };

  const handleDeleteListing = async (id) => {
    // Optimistic delete
    setSavedListings(currentList => currentList.filter(item => item.id !== id));

    try {
      await fetch(`/api/listings/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete', error);
    }
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
          </div>

          {savedListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedListings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onDelete={() => handleDeleteListing(listing.id)}
                  onVote={() => handleVoteListing(listing.id)}
                />
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
