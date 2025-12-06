import { PrismaClient } from '@prisma/client';
import AddListingForm from '@/components/AddListingForm';
import BoardCard from '@/components/BoardCard';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function Home() {
  const listings = await prisma.tripListing.findMany({
    include: { votes: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <header className="py-8 bg-slate-900/50 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                2026 Trip Board 🏖️
            </h1>
            <div className="text-sm font-medium text-slate-400">
                {listings.length} Places Found
            </div>
        </div>
      </header>

      {/* Grid */}
      <div className="container mx-auto px-4 mt-8">
        {listings.length === 0 ? (
            <div className="text-center py-20 opacity-50">
                <div className="text-6xl mb-4">🗺️</div>
                <h2 className="text-xl font-medium">Nothing here yet!</h2>
                <p>Click the button below to add the first rental you found.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(listing => (
                    <BoardCard key={listing.id} listing={listing} />
                ))}
            </div>
        )}
      </div>

      <AddListingForm />
    </main>
  );
}
