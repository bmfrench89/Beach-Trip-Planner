import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const listings = await prisma.listing.findMany({
            orderBy: {
                votes: 'desc',
            },
        });
        return NextResponse.json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { url, title, price, image, details } = body;

        const listing = await prisma.listing.create({
            data: {
                url,
                title,
                price: parseFloat(price) || 0,
                image,
                details,
                votes: 0
            },
        });

        return NextResponse.json(listing);
    } catch (error) {
        console.error('Error creating listing:', error);
        return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
    }
}
