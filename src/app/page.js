import Hero from '@/components/Hero';
import SearchResults from '@/components/SearchResults';
import { searchRentals } from '@/lib/api/rapidapi';
import { searchVrbo } from '@/lib/api/vrbo';

export default async function Home({ searchParams }) {
  const { destination, checkIn, checkOut, adults, kids, babies, budget } = searchParams;

  let allListings = [];
  let debugInfo = null;
  const hasSearchParams = checkIn || adults;

  if (hasSearchParams) {
    // Default to next month if dates are missing but other params exist
    const today = new Date();
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    const defaultCheckIn = nextMonth.toISOString().split('T')[0];
    const nextWeek = new Date(nextMonth.setDate(nextMonth.getDate() + 5));
    const defaultCheckOut = nextWeek.toISOString().split('T')[0];

    const validCheckIn = checkIn || defaultCheckIn;
    const validCheckOut = checkOut || defaultCheckOut;

    // Convert params to numbers
    const numAdults = parseInt(adults || '2');
    const numKids = parseInt(kids || '0');
    const numBudget = parseInt(budget || '10000');

    // Fetch data (Single API Key - RapidAPI only)
    const [rentals, vrbo] = await Promise.all([
      // Booking.com Rentals (RapidAPI)
      searchRentals({ destination: destination || 'Myrtle Beach, SC', checkIn: validCheckIn, checkOut: validCheckOut, adults: numAdults, kids: numKids, budget: numBudget }),

      // VRBO (RapidAPI)
      searchVrbo({ location: destination || 'Myrtle Beach, SC', checkIn: validCheckIn, checkOut: validCheckOut, guests: numAdults + numKids })
    ]);

    allListings = [...rentals, ...vrbo];

    debugInfo = {
      params: { checkIn: validCheckIn, checkOut: validCheckOut, adults: numAdults },
      results: {
        rentals: rentals.length,
        vrbo: vrbo.length
      }
    };
  }

  return (
    <main className="main">
      <Hero />

      {hasSearchParams && (
        <div id="results" className="container" style={{ paddingBottom: '80px' }}>
          <SearchResults
            listings={allListings}
            destination={destination || 'Carolinas'}
            numGuests={parseInt(adults || 0) + parseInt(kids || 0)}
            budget={parseInt(budget || 0)}
            debugInfo={debugInfo}
          />
        </div>
      )}

      {/* Global styles for the main page layout */}
      <style>{`
        .main {
          min-height: 100vh;
          background: radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%);
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
      `}</style>
    </main>
  );
}
