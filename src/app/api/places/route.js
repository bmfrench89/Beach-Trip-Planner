import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('term');

    if (!query) {
        return NextResponse.json({ suggestions: [] });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST_BOOKING;

    if (!apiKey) {
        return NextResponse.json({ error: 'API key missing' }, { status: 500 });
    }

    try {
        const url = `https://${apiHost}/api/v1/hotels/searchDestination?query=${encodeURIComponent(query)}`;

        const response = await fetch(url, {
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            }
        });

        if (!response.ok) {
            throw new Error(`Upstream API failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.data) {
            return NextResponse.json({ suggestions: [] });
        }

        // Transform to simple format
        const suggestions = data.data.map(item => ({
            id: item.dest_id,
            label: item.label,
            type: item.dest_type, // 'city', 'district', 'landmark' etc
            lat: item.latitude,
            lon: item.longitude,
            searchType: item.search_type
        }));

        return NextResponse.json({ suggestions });

    } catch (error) {
        console.error('Autocomplete API Error:', error);
        return NextResponse.json({ suggestions: [] }); // Return empty on error to handle gracefully
    }
}
