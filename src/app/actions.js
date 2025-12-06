'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function addListing(formData) {
  const url = formData.get('url');
  const title = formData.get('title');
  const price = parseFloat(formData.get('price'));
  const image = formData.get('image') || '';
  const addedBy = formData.get('addedBy') || 'Anonymous';

  if (!url || !title || !price) {
    return { error: 'Missing required fields' };
  }

  try {
    await prisma.tripListing.create({
      data: {
        url,
        title,
        price,
        image,
        addedBy
      }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to add listing:', error);
    return { error: 'Database error' };
  }
}

export async function toggleVote(listingId, user) {
  if (!user) return;

  try {
    const existingVote = await prisma.vote.findUnique({
      where: {
        tripListingId_user: {
          tripListingId: listingId,
          user: user
        }
      }
    });

    if (existingVote) {
      await prisma.vote.delete({
        where: { id: existingVote.id }
      });
    } else {
      await prisma.vote.create({
        data: {
          tripListingId: listingId,
          user: user
        }
      });
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to vote:', error);
    return { error: 'Vote failed' };
  }
}
