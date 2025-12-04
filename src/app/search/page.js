import { searchHotels } from '@/lib/api/amadeus';
import { searchRentals } from '@/lib/api/rapidapi';
import { searchVrbo } from '@/lib/api/vrbo';
import SearchResults from '@/components/SearchResults';

/**
 * Search Page Component
 * 
 * Fetches and displays search results from both Amadeus (hotels) and RapidAPI (rentals).
 * Data fetching is performed in parallel for better performance.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.searchParams - URL search parameters (destination, dates, guests, budget)
 * @returns {JSX.Element} The rendered Search page with results
 */
export default async function SearchPage({ searchParams }) {
  const { destination, checkIn, checkOut, adults, kids, babies, budget } = searchParams;

  // Default to next month if dates are missing
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

  // Fetch data for both NC and SC in parallel
  const [
    hotelsNC, hotelsSC,
    rentalsNC, rentalsSC,
    vrboNC, vrboSC
  ] = await Promise.all([
    // Hotels
    searchHotels({ destination: 'NC', checkIn: validCheckIn, checkOut: validCheckOut, adults: numAdults, budget: numBudget }),
    searchHotels({ destination: 'SC', checkIn: validCheckIn, checkOut: validCheckOut, adults: numAdults, budget: numBudget }),

    // Booking.com Rentals
    searchRentals({ destination: 'NC', checkIn: validCheckIn, checkOut: validCheckOut, adults: numAdults, kids: numKids, budget: numBudget }),
    searchRentals({ destination: 'SC', checkIn: validCheckIn, checkOut: validCheckOut, adults: numAdults, kids: numKids, budget: numBudget }),

    // VRBO
    searchVrbo({ location: 'NC', checkIn: validCheckIn, checkOut: validCheckOut, guests: numAdults + numKids }),
    searchVrbo({ location: 'SC', checkIn: validCheckIn, checkOut: validCheckOut, guests: numAdults + numKids })
  ]);

  const allListings = [
    ...hotelsNC, ...hotelsSC,
    ...rentalsNC, ...rentalsSC,
    ...vrboNC, ...vrboSC
  ];

  const debugInfo = {
    params: { checkIn: validCheckIn, checkOut: validCheckOut, adults: numAdults },
    results: {
      hotelsNC: hotelsNC.length,
      hotelsSC: hotelsSC.length,
      rentalsNC: rentalsNC.length,
      rentalsSC: rentalsSC.length,
      vrboNC: vrboNC.length,
      vrboSC: vrboSC.length
    }
  };

  return (
    <SearchResults
      listings={allListings}
      destination={destination || 'Carolinas'}
      numGuests={numAdults + numKids}
      budget={numBudget}
      debugInfo={debugInfo}
    />
  );
}
