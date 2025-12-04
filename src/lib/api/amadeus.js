const AMADEUS_BASE_URL = 'https://test.api.amadeus.com/v2';

let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }

    const clientId = process.env.AMADEUS_CLIENT_ID;
    const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.warn('Amadeus API keys missing');
        return null;
    }

    try {
        const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
        });

        const data = await response.json();
        if (data.access_token) {
            accessToken = data.access_token;
            tokenExpiry = Date.now() + (data.expires_in * 1000);
            return accessToken;
        }
    } catch (error) {
        console.error('Failed to get Amadeus token:', error);
    }
    return null;
}

export async function searchHotels({ destination, checkIn, checkOut, adults, budget }) {
    const token = await getAccessToken();
    if (!token) return [];

    // Map destination to IATA codes (Simplified for MVP)
    const cityCode = destination === 'NC' ? 'CLT' : 'MYR'; // Charlotte (NC) or Myrtle Beach (SC)
    // Note: In a real app, we'd search for specific beach towns. 
    // For MVP, we'll use Myrtle Beach (MYR) for SC and Wilmington (ILM) for NC.
    const airportCode = destination === 'NC' ? 'ILM' : 'MYR';

    try {
        // 1. Find hotels in the city
        const hotelsUrl = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${airportCode}&radius=20&radiusUnit=KM`;
        const hotelsRes = await fetch(hotelsUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const hotelsData = await hotelsRes.json();

        if (!hotelsData.data) return [];

        // Limit to 10 hotels to avoid rate limits/timeouts
        const hotelIds = hotelsData.data.slice(0, 10).map(h => h.hotelId).join(',');

        // 2. Get offers for these hotels
        const offersUrl = `${AMADEUS_BASE_URL}/shopping/hotel-offers?hotelIds=${hotelIds}&adults=${adults}&checkInDate=${checkIn}&checkOutDate=${checkOut}`;
        const offersRes = await fetch(offersUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const offersData = await offersRes.json();

        if (!offersData.data) return [];

        // Transform to our app's format
        return offersData.data.map(offer => ({
            id: offer.hotel.hotelId,
            title: offer.hotel.name,
            type: 'Hotel',
            price: parseFloat(offer.offers[0].price.total),
            currency: offer.offers[0].price.currency,
            rating: offer.hotel.rating || 'N/A',
            image: offer.hotel.media?.[0]?.uri || null, // Amadeus often lacks images in test tier
            location: destination,
            specs: {
                beds: offer.offers[0].room.typeEstimated?.beds || 1,
                guests: adults
            }
        })).filter(h => h.price <= budget);

    } catch (error) {
        console.error('Amadeus Search Error:', error);
        return [];
    }
}
