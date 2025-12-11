import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await prisma.listing.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting listing:', error);
        return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
    }
}
