'use client';

import { useState } from 'react';
import { addListing, fetchMetadata } from '@/app/actions';
import { useFavorites } from '@/lib/store';

export default function AddListingForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [formData, setFormData] = useState({ url: '', title: '', price: '', image: '' });
  const { currentUser } = useFavorites();

  const handleUrlBlur = async () => {
    if (!formData.url || formData.title) return; // Don't overwrite if user already typed title

    setIsLoadingMeta(true);
    const meta = await fetchMetadata(formData.url);
    setIsLoadingMeta(false);

    if (!meta.error) {
      setFormData(prev => ({
        ...prev,
        title: meta.title || prev.title,
        image: meta.image || prev.image,
        price: meta.price || prev.price
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white p-5 rounded-full shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] hover:shadow-[0_0_50px_-5px_rgba(59,130,246,0.8)] transition-all z-50 group scale-100 hover:scale-110 duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 group-hover:rotate-90 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-[0_0_100px_-20px_rgba(59,130,246,0.25)] overflow-hidden animation-pop-in">

        {/* Loading Overlay */}
        {isLoadingMeta && (
          <div className="absolute inset-0 z-20 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-blue-400 font-bold animate-pulse">✨ Analyzing Link...</div>
          </div>
        )}

        <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400" />

        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Add a Rental</h2>
              <p className="text-slate-400 text-sm mt-1">Paste a link to auto-fill details.</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form action={async (data) => {
            data.append('addedBy', currentUser);
            await addListing(data);
            setIsOpen(false);
            setFormData({ url: '', title: '', price: '', image: '' }); // Reset
          }} className="flex flex-col gap-6">

            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2 ml-1">Link URL</label>
                <div className="relative">
                  <input
                    name="url"
                    type="url"
                    required
                    value={formData.url}
                    onChange={handleChange}
                    onBlur={handleUrlBlur}
                    placeholder="https://airbnb.com/rooms/..."
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-4 pl-12 text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl grayscale opacity-50">🔗</span>
                </div>
              </div>

              {formData.image && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-700">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs text-white p-1 text-center backdrop-blur-sm">Link Preview</div>
                </div>
              )}

              <div className="group">
                <label className="block text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2 ml-1">Nickname / Title</label>
                <div className="relative">
                  <input
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. The Blue Lagoon House"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-4 pl-12 text-slate-100 placeholder:text-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl grayscale opacity-50">🏠</span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 group">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-green-400 mb-2 ml-1">Price / Night</label>
                  <div className="relative">
                    <input
                      name="price"
                      type="number"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="250"
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-4 pl-10 text-slate-100 placeholder:text-slate-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  </div>
                </div>
                {/* Hidden Image Input to submit the fetched URL */}
                <input type="hidden" name="image" value={formData.image} />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Add to Board</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
