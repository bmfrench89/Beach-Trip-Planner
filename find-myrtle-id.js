const https = require('https');

const RAPID_KEY = 'db5af111damshda3d83abb4d6c10p109917jsn8013b8d72ca5';

async function findMyrtleId() {
    console.log('\n--- Finding Myrtle Beach ID ---');
    try {
        const destUrl = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=Myrtle%20Beach`;
        const destRes = await fetch(destUrl, {
            headers: { 'x-rapidapi-key': RAPID_KEY, 'x-rapidapi-host': 'booking-com15.p.rapidapi.com' }
        });
        const destData = await destRes.json();

        if (destData.data && destData.data.length > 0) {
            console.log('Found Destinations:', JSON.stringify(destData.data, null, 2));
        } else {
            console.log('No destinations found');
        }

    } catch (e) {
        console.error('Error:', e.message);
    }
}

findMyrtleId();
