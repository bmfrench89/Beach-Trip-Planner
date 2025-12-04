/**
 * Search Vacation Rentals via RapidAPI (Hotels.com)
 * 
 * 1. Maps destination to Hotels.com region IDs.
 * 2. Constructs the complex JSON payload for the API.
 * 3. Fetches properties matching the criteria.
 * 4. Transforms the data into a unified listing format.
 * 
 * @param {Object} params - Search parameters
 * @param {string} params.destination - 'NC' or 'SC'
 * @param {string} params.checkIn - Check-in date (YYYY-MM-DD)
 * @param {string} params.checkOut - Check-out date (YYYY-MM-DD)
 * @param {number} params.adults - Number of adults
 * @param {number} params.kids - Number of children
 * @param {number} params.budget - Max budget
 * @returns {Promise<Array>} Array of rental listings
 */
export async function searchRentals({ destination, checkIn, checkOut, adults, kids, budget }) {
    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST_BOOKING;

    if (!apiKey) {
        console.warn('RapidAPI key missing');
        return [];
    }
    console.log(`Searching Rentals with Host: ${apiHost}`);

    // Mapping destination to Hotels.com Destination IDs (approximate for MVP)
    // Myrtle Beach, SC: 1506246
    // Outer Banks, NC: 1636368 (Using Wilmington 178317 for simpler test)
    const destinationId = destination === 'NC' ? '178317' : '1506246';

    const totalGuests = adults + kids;

    const url = `https://${apiHost}/properties/v2/list`;

    const payload = {
        currency: "USD",
        eapid: 1,
        locale: "en_US",
        siteId: 300000001,
        destination: { regionId: destinationId },
        checkInDate: {
            day: parseInt(checkIn.split('-')[2]),
            month: parseInt(checkIn.split('-')[1]),
            year: parseInt(checkIn.split('-')[0])
        },
        checkOutDate: {
            day: parseInt(checkOut.split('-')[2]),
            month: parseInt(checkOut.split('-')[1]),
            year: parseInt(checkOut.split('-')[0])
        },
        rooms: [
            { adults: adults, children: Array(kids).fill({ age: 10 }) } // Assuming avg kid age
        ],
        resultsStartingIndex: 0,
        resultsSize: 20,
        sort: "PRICE_LOW_TO_HIGH",
        filters: {
            price: {
                max: budget
            }
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!data.data?.propertySearch?.properties) return [];

        return data.data.propertySearch.properties.map(prop => ({
            id: prop.id,
            title: prop.name,
            type: 'Vacation Rental',
            price: prop.price?.lead?.amount || 0,
            currency: 'USD',
            rating: prop.reviews?.score || 'N/A',
            image: prop.propertyImage?.image?.url || null,
            location: destination,
            specs: {
                beds: 'Varies',
                guests: totalGuests
            }
        }));

    } catch (error) {
        console.error('RapidAPI Search Error:', error);
        return [];
    }
}
