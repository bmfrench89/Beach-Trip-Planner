import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Add protocol if missing
        let targetUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            targetUrl = 'https://' + url;
        }

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract Open Graph Data
        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
        const image = $('meta[property="og:image"]').attr('content') || '';
        const description = $('meta[property="og:description"]').attr('content') || '';

        // Attempt to find price (very heuristic/fragile, varies by site)
        // Common patterns: $123, 120 USD, etc. in title or description
        let price = '';
        const priceRegex = /\$(\d{1,3}(,\d{3})*(\.\d{2})?)/;
        const priceMatch = (title + ' ' + description).match(priceRegex);
        if (priceMatch) {
            price = priceMatch[1].replace(/,/g, ''); // Remove commas
        }

        return NextResponse.json({
            title: title.trim(),
            image,
            price: price ? Math.round(parseFloat(price)) : ''
        });

    } catch (error) {
        console.error('Metadata fetch error:', error);
        return NextResponse.json({
            error: 'Failed to fetch metadata',
            details: error.message
        }, { status: 500 });
    }
}
