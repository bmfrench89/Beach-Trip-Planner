"use client";

import { useState, useEffect, useRef } from 'react';
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
    const listingWithId = { ...newListing, id: (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()), votes: 0 };
    const updatedList = [listingWithId, ...savedListings];
    // Keep sorted just in case
    updatedList.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    setSavedListings(updatedList);
    localStorage.setItem('tripPlannerListings', JSON.stringify(updatedList));
  };

  // Ref for debouncing the sort
  const sortTimeoutRef = useRef(null);

  const handleVoteListing = (id) => {
    // 1. Updates votes immediately (visual feedback)
    setSavedListings(currentList => {
      const updatedList = currentList.map(item => {
        if (item.id === id) {
          return { ...item, votes: (item.votes || 0) + 1 };
        }
        return item;
      });
      localStorage.setItem('tripPlannerListings', JSON.stringify(updatedList));
      return updatedList;
    });

    // 2. Debounce the sort (wait for user to stop clicking)
    if (sortTimeoutRef.current) {
      clearTimeout(sortTimeoutRef.current);
    }

    sortTimeoutRef.current = setTimeout(() => {
      setSavedListings(currentList => {
        const sortedList = [...currentList].sort((a, b) => (b.votes || 0) - (a.votes || 0));
        localStorage.setItem('tripPlannerListings', JSON.stringify(sortedList));
        return sortedList;
      });
      sortTimeoutRef.current = null;
    }, 1500);
  };

  const handleDeleteListing = (id) => {
    // Immediate delete for better UX if confirm is blocked
    console.log("Deleting listing", id);
    setSavedListings(currentList => {
      const updatedList = currentList.filter(item => item.id !== id);
      localStorage.setItem('tripPlannerListings', JSON.stringify(updatedList));
      return updatedList;
    });
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
