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

  // Convert params to numbers
  const numAdults = parseInt(adults || '2');
  const numKids = parseInt(kids || '0');
  const numBudget = parseInt(budget || '10000');

  // Fetch data in parallel
  // Fetch data for both NC and SC in parallel
  const [
    hotelsNC, hotelsSC,
    rentalsNC, rentalsSC,
    vrboNC, vrboSC
  ] = await Promise.all([
    // Hotels
    searchHotels({ destination: 'NC', checkIn, checkOut, adults: numAdults, budget: numBudget }),
    searchHotels({ destination: 'SC', checkIn, checkOut, adults: numAdults, budget: numBudget }),

    // Booking.com Rentals
    searchRentals({ destination: 'NC', checkIn, checkOut, adults: numAdults, kids: numKids, budget: numBudget }),
    searchRentals({ destination: 'SC', checkIn, checkOut, adults: numAdults, kids: numKids, budget: numBudget }),

    // VRBO
    searchVrbo({ location: 'NC', checkIn, checkOut, guests: numAdults + numKids }),
    searchVrbo({ location: 'SC', checkIn, checkOut, guests: numAdults + numKids })
  ]);

  const allListings = [
    ...hotelsNC, ...hotelsSC,
    ...rentalsNC, ...rentalsSC,
    ...vrboNC, ...vrboSC
  ];

  return (
    <SearchResults
      listings={allListings}
      destination={destination}
      numGuests={numAdults + numKids}
      budget={numBudget}
    />
  );
}
