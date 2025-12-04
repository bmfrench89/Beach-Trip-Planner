const https = require('https');

// Keys
const AMADEUS_ID = 'NPVrh8tnf3dPdTzW6GuiU8WV84qKN42g';
const AMADEUS_SECRET = 'blKWo3fFK0KdtAhB';
const RAPID_KEY = 'db5af111damshda3d83abb4d6c10p109917jsn8013b8d72ca5';

// Params from user debug info
const CHECK_IN = '2026-01-04';
const CHECK_OUT = '2026-01-09';
const ADULTS = 2;

async function testAmadeus() {
    console.log('\n--- Testing Amadeus (NC/SC) ---');
    try {
        // Auth
        const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=client_credentials&client_id=${AMADEUS_ID}&client_secret=${AMADEUS_SECRET}`
        });
        const tokenData = await tokenRes.json();
        const token = tokenData.access_token;

        // Test NC (ILM)
        console.log('Searching Amadeus NC (ILM)...');
        const ncUrl = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=ILM&radius=20&radiusUnit=KM`;
        const ncRes = await fetch(ncUrl, { headers: { Authorization: `Bearer ${token}` } });
        const ncData = await ncRes.json();
        console.log(`Amadeus NC Hotels Found: ${ncData.data ? ncData.data.length : 0}`);

        if (ncData.data && ncData.data.length > 0) {
            const hotelId = ncData.data[0].hotelId;
            const offersUrl = `https://test.api.amadeus.com/v2/shopping/hotel-offers?hotelIds=${hotelId}&adults=${ADULTS}&checkInDate=${CHECK_IN}&checkOutDate=${CHECK_OUT}`;
            const offersRes = await fetch(offersUrl, { headers: { Authorization: `Bearer ${token}` } });
            const offersData = await offersRes.json();
            console.log(`Amadeus NC Offers: ${offersData.data ? offersData.data.length : 0}`);
            if (offersData.errors) console.error('Amadeus Errors:', offersData.errors);
        }

    } catch (e) {
        console.error('Amadeus Error:', e.message);
    }
}

async function testRapidBooking() {
    console.log('\n--- Testing Booking.com (NC/SC) ---');
    try {
        // Test NC (Wilmington)
        console.log('Searching Booking NC (Wilmington)...');
        const destUrl = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=Wilmington`;
        const destRes = await fetch(destUrl, {
            headers: { 'x-rapidapi-key': RAPID_KEY, 'x-rapidapi-host': 'booking-com15.p.rapidapi.com' }
        });
        const destData = await destRes.json();

        if (destData.data && destData.data.length > 0) {
            const destId = destData.data[0].dest_id;
            const searchType = destData.data[0].search_type;
            console.log(`Found Dest ID: ${destId}`);

            const searchUrl = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=${destId}&search_type=${searchType}&arrival_date=${CHECK_IN}&departure_date=${CHECK_OUT}&adults_number=${ADULTS}&room_qty=1`;
            const searchRes = await fetch(searchUrl, {
                headers: { 'x-rapidapi-key': RAPID_KEY, 'x-rapidapi-host': 'booking-com15.p.rapidapi.com' }
            });
            const searchData = await searchRes.json();
            console.log(`Booking NC Results: ${searchData.data && searchData.data.hotels ? searchData.data.hotels.length : 0}`);
        } else {
            console.log('Booking NC Dest Search Failed');
        }

    } catch (e) {
        console.error('Booking Error:', e.message);
    }
}

async function testVrbo() {
    console.log('\n--- Testing VRBO (NC/SC) ---');
    try {
        // Test NC (Geocoding 'NC')
        console.log('Geocoding "NC"...');
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=NC&format=json&limit=1`, {
            headers: { 'User-Agent': 'BeachTripPlanner/1.0' }
        });
        const geoData = await geoRes.json();

        if (geoData && geoData.length > 0) {
            const { lat, lon } = geoData[0];
            console.log(`Coords: ${lat}, ${lon}`);

            const url = `https://vrbo1.p.rapidapi.com/vacation-rental-data/vrbo/search?latitude=${lat}&longitude=${lon}&radiusMiles=1&checkIn=${CHECK_IN}&checkOut=${CHECK_OUT}&adultsCount=${ADULTS}`;
            const res = await fetch(url, {
                headers: { 'x-rapidapi-key': RAPID_KEY, 'x-rapidapi-host': 'vrbo1.p.rapidapi.com' }
            });
            const data = await res.json();
            console.log(`VRBO NC Results: ${data.listings ? data.listings.length : 0}`);
        }

    } catch (e) {
        console.error('VRBO Error:', e.message);
    }
}

async function run() {
    await testAmadeus();
    await testRapidBooking();
    await testVrbo();
}

run();
