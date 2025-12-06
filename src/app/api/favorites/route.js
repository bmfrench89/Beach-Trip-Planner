import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const favorites = await prisma.favorite.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                votes: true,
            },
        });
        return NextResponse.json(favorites);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, title, image, price, rating, location, type, specs, addedBy } = body;

        const favorite = await prisma.favorite.create({
            data: {
                listingId: String(id), // Ensure it's a string
                title,
                image,
                price,
                rating: typeof rating === 'number' ? rating : null,
                location,
                type,
                beds: specs?.beds ? String(specs.beds) : null,
                guests: specs?.guests || 0,
                addedBy,
            },
        });

        return NextResponse.json(favorite);
    } catch (error) {
        console.error('Error creating favorite:', error);
        return NextResponse.json({ error: 'Failed to create favorite' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // We need to find the record by listingId first since we use that in the frontend
        // Or we can just delete by listingId if we ensure uniqueness.
        // The schema has `id` as primary key (cuid), but frontend passes `listingId`.
        // Let's delete by listingId for simplicity to match frontend logic.

        await prisma.favorite.deleteMany({
            where: { listingId: id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting favorite:', error);
        return NextResponse.json({ error: 'Failed to delete favorite' }, { status: 500 });
    }
}
