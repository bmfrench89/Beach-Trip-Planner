'use client';

import { toggleVote } from '@/app/actions';
import { useFavorites } from '@/lib/store';

export default function BoardCard({ listing }) {
    const { currentUser } = useFavorites();
    const voteCount = listing.votes.length;
    const hasVoted = listing.votes.some(v => v.user === currentUser);

    const handleVote = async () => {
        if (!currentUser) return;
        await toggleVote(listing.id, currentUser);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all group">
            <a href={listing.url} target="_blank" rel="noopener noreferrer" className="block relative h-48 bg-slate-800 overflow-hidden">
                {listing.image ? (
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-slate-700">🏠</div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white">
                    ${listing.price} / night
                </div>
            </a>

            <div className="p-4">
                <div className="flex justify-between items-start gap-4 mb-2">
                    <a href={listing.url} target="_blank" rel="noopener noreferrer" className="font-bold text-lg hover:text-blue-400 transition-colors line-clamp-1">
                        {listing.title}
                    </a>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="text-xs text-slate-500">
                        Added by <span className="text-slate-400">{listing.addedBy}</span>
                    </div>

                    <button
                        onClick={handleVote}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${hasVoted
                                ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        <span>▲</span>
                        <span>{voteCount}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
