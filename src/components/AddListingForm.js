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
    if (!formData.url || formData.title) return;

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
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform z-50 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    );
  }

  // VRBO-style Input Field Helper
  const VrboInput = ({ label, name, type, placeholder, icon, value, onChange, onBlur, required, prefix }) => (
    <div className="relative group bg-slate-800/50 border border-slate-600 rounded-full flex items-center px-4 py-3 focus-within:ring-2 focus-within:ring-white focus-within:border-transparent transition-all hover:bg-slate-800">
      <div className="text-slate-400 mr-3">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 leading-none">
          {label}
        </label>
        <div className="flex items-center">
          {prefix && <span className="text-slate-100 font-medium mr-1">{prefix}</span>}
          <input
            name={name}
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className="w-full bg-transparent border-none p-0 text-slate-100 placeholder:text-slate-600 font-semibold text-sm focus:ring-0 leading-tight"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Loading Overlay */}
        {isLoadingMeta && (
          <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-blue-400 text-sm font-bold animate-pulse">Fetching Details...</div>
            </div>
          </div>
        )}

        <div className="p-6 pt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Add a Rental</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form action={async (data) => {
            data.append('addedBy', currentUser);
            await addListing(data);
            setIsOpen(false);
            setFormData({ url: '', title: '', price: '', image: '' });
          }} className="flex flex-col gap-4">

            <VrboInput
              label="Link URL"
              name="url"
              type="url"
              required={true}
              value={formData.url}
              onChange={handleChange}
              onBlur={handleUrlBlur}
              placeholder="Paste link here..."
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>}
            />

            {formData.image && (
              <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-slate-700 shadow-inner">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-md text-[10px] uppercase font-bold text-white backdrop-blur-md">Preview</div>
              </div>
            )}

            <VrboInput
              label="Property Title"
              name="title"
              type="text"
              required={true}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Seaside Villa"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>}
            />

            <div className="grid grid-cols-2 gap-3">
              <VrboInput
                label="Price"
                name="price"
                type="number"
                required={true}
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                prefix="$"
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              {/* Hidden Image Input to submit the fetched URL */}
              <input type="hidden" name="image" value={formData.image} />
            </div>

            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
            >
              Add Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
