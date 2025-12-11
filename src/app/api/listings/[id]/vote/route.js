import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const listing = await prisma.listing.update({
            where: { id },
            data: {
                votes: {
                    increment: 1,
                },
            },
        });
        return NextResponse.json(listing);
    } catch (error) {
        console.error('Error voting for listing:', error);
        return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
    }
}
