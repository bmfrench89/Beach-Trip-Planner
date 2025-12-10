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

        // --- 1. Basic Metadata (Fallbacks) ---
        const title =
            $('meta[property="og:title"]').attr('content') ||
            $('meta[name="twitter:title"]').attr('content') ||
            $('title').text() ||
            $('h1').first().text() ||
            new URL(targetUrl).hostname.replace('www.', '') ||
            '';

        let image =
            $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            $('link[rel="image_src"]').attr('href') ||
            '';

        if (!image) {
            $('img').each((i, elem) => {
                let src = $(elem).attr('src') || $(elem).attr('data-src') || $(elem).attr('data-original');
                if (src) {
                    if (src.startsWith('/')) {
                        src = new URL(src, targetUrl).toString();
                    }
                    if (src.startsWith('http') && !src.includes('icon') && !src.includes('logo') && !src.includes('svg')) {
                        image = src;
                        return false;
                    }
                }
            });
        }

        const description =
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            '';

        let price = '';
        const priceRegex = /\$(\d{1,3}(,\d{3})*(\.\d{2})?)/;
        const priceMatch = (title + ' ' + description).match(priceRegex);
        if (priceMatch) {
            price = priceMatch[1].replace(/,/g, '');
        }

        // --- 2. Advanced JSON-LD Extraction ---
        let jsonLdData = {};
        $('script[type="application/ld+json"]').each((i, elem) => {
            try {
                const data = JSON.parse($(elem).html());
                const schemas = Array.isArray(data) ? data : [data];

                // Prioritize specific schema types
                const relevantSchema = schemas.find(s =>
                    ['VacationRental', 'Hotel', 'LodgingBusiness', 'Product', 'Accommodation'].some(type =>
                        s['@type'] && s['@type'].includes(type)
                    )
                );

                if (relevantSchema) {
                    jsonLdData = { ...jsonLdData, ...relevantSchema };
                }
            } catch (e) {
                // Ignore parse errors from individual scripts
                console.warn('JSON-LD parse error:', e);
            }
        });

        // Extract Structured Amenities
        // Data format varies: sometimes literal array of strings, sometimes object list
        let amenities = [];
        if (jsonLdData.amenityFeature) {
            const features = Array.isArray(jsonLdData.amenityFeature) ? jsonLdData.amenityFeature : [jsonLdData.amenityFeature];
            amenities = features.map(f => typeof f === 'string' ? f : f.name || f.value).filter(Boolean);
        }

        // Extract Stats
        let stats = {
            bedrooms: jsonLdData.numberOfRooms || (jsonLdData.bedroom ? jsonLdData.bedroom.length : null),
            bathrooms: null, // Often less standardized in JSON-LD
            occupancy: null
        };


        // --- 3. Heuristic / Graphic Extraction (Fallback) ---
        // Scan full text for missing details
        const headerAndDesc = (title + ' ' + description + ' ' + $('body').text().substring(0, 2000)).toLowerCase(); // Limit body scan

        // Bedrooms
        if (!stats.bedrooms) {
            const bdMatch = headerAndDesc.match(/(\d+)\s*(?:bedroom|bd|br)/i);
            if (bdMatch) stats.bedrooms = parseInt(bdMatch[1]);
        }

        // Bathrooms
        const baMatch = headerAndDesc.match(/(\d+(?:\.\d+)?)\s*(?:bathroom|ba|bath)/i);
        if (baMatch) stats.bathrooms = parseFloat(baMatch[1]);

        // Key Amenities Keywords
        const targetAmenities = [
            { key: 'Pool', regex: /pool/i },
            { key: 'Hot Tub', regex: /hot tub|jacuzzi/i },
            { key: 'Beachfront', regex: /beach\s?front|ocean\s?front|water\s?front/i },
            { key: 'WiFi', regex: /wifi|wi-fi|internet/i },
            { key: 'Kitchen', regex: /kitchen/i },
            { key: 'AC', regex: /air condition|a\/c/i },
            { key: 'Pets Allowed', regex: /pets allowed|pet friendly/i }
        ];

        targetAmenities.forEach(item => {
            if (!amenities.some(a => item.regex.test(a))) { // Don't duplicate if found in JSON-LD
                if (item.regex.test(headerAndDesc)) {
                    amenities.push(item.key);
                }
            }
        });

        return NextResponse.json({
            title: title.trim(),
            image,
            price: price ? Math.round(parseFloat(price)) : '',
            details: {
                bedrooms: stats.bedrooms || null,
                bathrooms: stats.bathrooms || null,
                amenities: [...new Set(amenities)].slice(0, 8), // Top 8 unique
                description: description.substring(0, 150) + (description.length > 150 ? '...' : '')
            }
        });

    } catch (error) {
        console.error('Metadata fetch error:', error);
        return NextResponse.json({
            error: 'Failed to fetch metadata',
            details: error.message
        }, { status: 500 });
    }
}
