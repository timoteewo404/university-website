require('dotenv').config();

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('API called: /api/admin/news-events');
  try {
    const newsEvents = await prisma.newsEvent.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: newsEvents
    });
  } catch (error) {
    console.error('Error fetching news/events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news/events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, 
      title, 
      description, 
      content, 
      imageUrl, 
      category, 
      eventDate, 
      location, 
      isActive, 
      isFeatured, 
      order,
      // New podcast fields
      podcastDuration,
      podcastPlatforms,
      audioUrl,
      // New report fields
      reportUrl,
      // New author fields
      author,
      role
    } = body;

    if (!type || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'Type, title, and description are required' },
        { status: 400 }
      );
    }

    if (!['news', 'event', 'podcast', 'report'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Type must be one of: news, event, podcast, report' },
        { status: 400 }
      );
    }

    const newNewsEvent = await prisma.newsEvent.create({
      data: {
        type,
        title,
        description,
        content,
        imageUrl,
        category,
        eventDate: eventDate ? new Date(eventDate) : null,
        location,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        order: order || 1,
        podcastDuration: podcastDuration || null,
        podcastPlatforms: podcastPlatforms || null,
        audioUrl: audioUrl || null,
        reportUrl: reportUrl || null,
        author: author || null,
        role: role || null
      }
    });

    return NextResponse.json({
      success: true,
      data: newNewsEvent
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating news/event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create news/event' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { 
      type, 
      title, 
      description, 
      content, 
      imageUrl, 
      category, 
      eventDate, 
      location, 
      isActive, 
      isFeatured, 
      order,
      // New podcast fields
      podcastDuration,
      podcastPlatforms,
      audioUrl,
      // New report fields
      reportUrl,
      // New author fields
      author,
      role
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'News/Event ID is required' },
        { status: 400 }
      );
    }

    const existingItem = await prisma.newsEvent.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: 'News/Event not found' },
        { status: 404 }
      );
    }

    if (type && !['news', 'event', 'podcast', 'report'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Type must be one of: news, event, podcast, report' },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.newsEvent.update({
      where: { id },
      data: {
        type: type || existingItem.type,
        title: title || existingItem.title,
        description: description || existingItem.description,
        content: content !== undefined ? content : existingItem.content,
        imageUrl: imageUrl !== undefined ? imageUrl : existingItem.imageUrl,
        category: category !== undefined ? category : existingItem.category,
        eventDate: eventDate !== undefined ? (eventDate ? new Date(eventDate) : null) : existingItem.eventDate,
        location: location !== undefined ? location : existingItem.location,
        isActive: isActive !== undefined ? isActive : existingItem.isActive,
        isFeatured: isFeatured !== undefined ? isFeatured : existingItem.isFeatured,
        order: order !== undefined ? order : existingItem.order,
        podcastDuration: podcastDuration !== undefined ? podcastDuration : existingItem.podcastDuration,
        podcastPlatforms: podcastPlatforms !== undefined ? podcastPlatforms : existingItem.podcastPlatforms,
        audioUrl: audioUrl !== undefined ? audioUrl : existingItem.audioUrl,
        reportUrl: reportUrl !== undefined ? reportUrl : existingItem.reportUrl,
        author: author !== undefined ? author : existingItem.author,
        role: role !== undefined ? role : existingItem.role
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating news/event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update news/event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'News/Event ID is required' },
        { status: 400 }
      );
    }

    const existingItem = await prisma.newsEvent.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: 'News/Event not found' },
        { status: 404 }
      );
    }

    await prisma.newsEvent.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'News/Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting news/event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete news/event' },
      { status: 500 }
    );
  }
}