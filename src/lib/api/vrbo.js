export async function searchVrbo(params) {
    const { location, checkIn, checkOut, guests } = params;

    try {
        console.log(`Searching VRBO for: ${location}`);
        // 1. Geocode the location using OpenStreetMap (Nominatim)
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`, {
            headers: {
                'User-Agent': 'BeachTripPlanner/1.0'
            }
        });
        const geoData = await geoRes.json();

        if (!geoData || geoData.length === 0) {
            console.warn('Could not geocode location:', location);
            return [];
        }

        const { lat, lon } = geoData[0];

        // 2. Search VRBO
        const url = new URL('https://vrbo1.p.rapidapi.com/vacation-rental-data/vrbo/search');
        url.searchParams.append('latitude', lat);
        url.searchParams.append('longitude', lon);
        url.searchParams.append('radiusMiles', '1'); // Fixed: Reduced radius to 1 mile
        url.searchParams.append('checkIn', checkIn || '');
        url.searchParams.append('checkOut', checkOut || '');
        url.searchParams.append('adultsCount', guests || 1);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': process.env.RAPIDAPI_HOST_VRBO
            }
        });

        if (!response.ok) {
            throw new Error(`VRBO API Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.listings) return [];

        return data.listings.map(listing => ({
            id: listing.listingId || `vrbo-${Math.random()}`,
            title: listing.propertyMetadata?.headline || 'VRBO Stay',
            price: listing.prices?.perNight?.amount || 0,
            image: listing.images?.[0]?.uri || '',
            rating: listing.averageRating || 0,
            type: 'Vacation Rental',
            specs: {
                beds: listing.bedrooms || 0,
                guests: listing.sleeps || 0
            },
            source: 'vrbo',
            link: listing.detailPageUrl || '#'
        }));

    } catch (error) {
        console.error('VRBO Search Error:', error);
        return [];
    }
}
