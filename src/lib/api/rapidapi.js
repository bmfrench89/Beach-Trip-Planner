/**
 * Search Vacation Rentals via RapidAPI (Booking.com)
 * 
 * 1. Search for the destination ID (e.g., "Myrtle Beach")
 * 2. Search for hotels/rentals using that ID
 * 3. Transform data to unified format
 */
export async function searchRentals({ destination, checkIn, checkOut, adults, kids, budget }) {
    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST_BOOKING;

    if (!apiKey) {
        console.warn('RapidAPI key missing');
        return [];
    }
    console.log(`Searching Rentals with Host: ${apiHost}`);

    try {
        // 1. Get Destination ID
        const query = destination;
        console.log(`Booking.com: Searching Destination '${query}'`);

        const destUrl = `https://${apiHost}/api/v1/hotels/searchDestination?query=${encodeURIComponent(query)}`;
        const destRes = await fetch(destUrl, {
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            }
        });
        const destData = await destRes.json();

        if (!destData.data || destData.data.length === 0) {
            console.warn('Booking.com: No destination found');
            return [];
        }

        const destId = destData.data[0].dest_id;
        const searchType = destData.data[0].search_type;

        // 2. Search Properties
        const searchUrl = new URL(`https://${apiHost}/api/v1/hotels/searchHotels`);
        searchUrl.searchParams.append('dest_id', destId);
        searchUrl.searchParams.append('search_type', searchType);
        searchUrl.searchParams.append('arrival_date', checkIn);
        searchUrl.searchParams.append('departure_date', checkOut);
        searchUrl.searchParams.append('adults_number', adults);
        searchUrl.searchParams.append('room_qty', '1');
        searchUrl.searchParams.append('sort_by', 'price');
        searchUrl.searchParams.append('categories_filter_ids', 'class::2,class::4,free_cancellation::1');

        const searchRes = await fetch(searchUrl.toString(), {
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            }
        });
        const searchData = await searchRes.json();

        if (!searchData.data || !searchData.data.hotels) {
            console.warn(`Booking.com: No hotels found for ${query}`);
            return [];
        }

        console.log(`Booking.com: Found ${searchData.data.hotels.length} raw results for ${query}`);

        // 3. Transform and Filter
        const results = searchData.data.hotels.map(prop => {
            const price = prop.property.priceBreakdown?.grossPrice?.value || 0;
            return {
                id: prop.property.id || `booking-${Math.random()}`,
                title: prop.property.name,
                type: 'Vacation Rental',
                price: price,
                currency: prop.property.priceBreakdown?.grossPrice?.currency || 'USD',
                rating: prop.property.reviewScore || 'N/A',
                image: prop.property.photoUrls?.[0] || '',
                location: destination,
                specs: {
                    beds: 'Varies',
                    guests: adults + kids
                },
                source: 'booking',
                link: '#'
            };
        });

        console.log(`Booking.com: ${results.length} items before filter. Budget: ${budget}`);
        const filtered = results.filter(r => {
            const keep = r.price <= budget;
            if (!keep) console.log(`Booking.com: Dropped '${r.title}' (Price: ${r.price} > ${budget})`);
            return keep;
        });
        console.log(`Booking.com: ${filtered.length} items after filter`);

        return filtered;

    } catch (error) {
        console.error('RapidAPI Search Error:', error);
        return [];
    }
}
