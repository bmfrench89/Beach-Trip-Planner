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

export async function fetchMetadata(url) {
  if (!url) return { error: 'Invalid URL' };

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) return { error: 'Failed to access link' };

    const html = await response.text();

    const titleMatch = html.match(/<meta property="og:title" content="([^"]*)"/i) || html.match(/<title>([^<]*)<\/title>/i);
    const imageMatch = html.match(/<meta property="og:image" content="([^"]*)"/i);
    const priceMatch = html.match(/"price":\s*(\d+)/i) || html.match(/"amount":\s*(\d+)/i);

    return {
      title: titleMatch ? titleMatch[1] : '',
      image: imageMatch ? imageMatch[1] : '',
      price: priceMatch ? priceMatch[1] : ''
    };
  } catch (error) {
    console.error('Metadata fetch failed:', error);
    return { error: 'Could not fetch metadata' };
  }
}
