import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { favoriteId, user } = body;

        if (!favoriteId || !user) {
            return NextResponse.json({ error: 'Missing favoriteId or user' }, { status: 400 });
        }

        // Check if vote exists
        const existingVote = await prisma.vote.findUnique({
            where: {
                favoriteId_user: {
                    favoriteId,
                    user,
                },
            },
        });

        if (existingVote) {
            // Remove vote
            await prisma.vote.delete({
                where: {
                    id: existingVote.id,
                },
            });
            return NextResponse.json({ voted: false });
        } else {
            // Add vote
            await prisma.vote.create({
                data: {
                    favoriteId,
                    user,
                },
            });
            return NextResponse.json({ voted: true });
        }
    } catch (error) {
        console.error('Error toggling vote:', error);
        return NextResponse.json({ error: 'Failed to toggle vote' }, { status: 500 });
    }
}
