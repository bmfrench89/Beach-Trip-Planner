import Image from 'next/image';

export default function ListingCard({ listing, onDelete, onVote }) {
    const { title, price, url, image } = listing;

    // Use a placeholder image if none provided (manual listings won't have scraped images yet)
    const displayImage = image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";

    return (
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full relative">
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <Image
                    src={displayImage}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-500"
                />

                {/* Delete Button */}
                {onDelete && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="absolute top-3 left-3 bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-500 p-2 rounded-full shadow-sm transition-colors z-10"
                        title="Remove Listing"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}

                {/* External Link Indicator */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    External
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition mb-1 line-clamp-1">{title}</h3>

                <div className="flex items-center gap-2 mb-3">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onVote?.();
                        }}
                        className="flex items-center gap-1.5 bg-gray-100 hover:bg-teal-50 text-gray-600 hover:text-teal-600 px-3 py-1.5 rounded-full text-sm font-bold transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        {listing.votes || 0}
                    </button>
                    <span className="text-xs text-gray-400 font-medium">{listing.votes === 1 ? 'vote' : 'votes'}</span>
                </div>

                {/* Listing Details */}
                {listing.details && (
                    <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                            {listing.details.bedrooms && (
                                <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                    {listing.details.bedrooms} bd
                                </span>
                            )}
                            {listing.details.bathrooms && (
                                <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {listing.details.bathrooms} ba
                                </span>
                            )}
                        </div>
                        {listing.details.amenities && listing.details.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {listing.details.amenities.slice(0, 3).map((amenity, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                                        {amenity}
                                    </span>
                                ))}
                                {listing.details.amenities.length > 3 && (
                                    <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-xs rounded-md">
                                        +{listing.details.amenities.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <div className="flex items-center gap-1">
                        <span className="text-xl font-bold text-gray-900">${price}</span>
                        <span className="text-sm text-gray-500">/ night</span>
                    </div>

                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-900 hover:bg-teal-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        View Deal
                    </a>
                </div>
            </div>
        </div>
    );
}
