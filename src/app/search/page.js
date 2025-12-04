import { searchHotels } from '@/lib/api/amadeus';
import { searchRentals } from '@/lib/api/rapidapi';
import SearchResults from '@/components/SearchResults';

export default async function SearchPage({ searchParams }) {
  const { destination, checkIn, checkOut, adults, kids, babies, budget } = searchParams;

  // Convert params to numbers
  const numAdults = parseInt(adults || '2');
  const numKids = parseInt(kids || '0');
  const numBudget = parseInt(budget || '10000');

  // Fetch data in parallel
  const [hotels, rentals] = await Promise.all([
    searchHotels({
      destination,
      checkIn,
      checkOut,
      adults: numAdults,
      budget: numBudget
    }),
    searchRentals({
      destination,
      checkIn,
      checkOut,
      adults: numAdults,
      kids: numKids,
      budget: numBudget
    })
  ]);

  const allListings = [...hotels, ...rentals];

  return (
    <SearchResults
      listings={allListings}
      destination={destination}
      numGuests={numAdults + numKids}
      budget={numBudget}
    />
  );
}
