'use client';

import { useState } from 'react';
import { addListing } from '@/app/actions';
import { useFavorites } from '@/lib/store';

export default function AddListingForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useFavorites();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all z-50 flex items-center gap-2 font-bold"
      >
        <span>+</span> Add Place
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add a Rental</h2>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form action={async (formData) => {
          formData.append('addedBy', currentUser);
          await addListing(formData);
          setIsOpen(false);
        }} className="flex flex-col gap-4">

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Link URL</label>
            <input name="url" type="url" required placeholder="https://airbnb.com/..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Title (Nickname)</label>
            <input name="title" type="text" required placeholder="The Blue House" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-400 mb-1">Price / Night</label>
              <input name="price" type="number" required placeholder="250" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-400 mb-1">Image URL (Opt)</label>
              <input name="image" type="url" placeholder="https://..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
            </div>
          </div>

          <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all">
            Add to Board
          </button>
        </form>
      </div>
    </div>
  );
}
