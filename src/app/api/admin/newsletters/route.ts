import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const newsletters = await prisma.newsletter.findMany({
      orderBy: { subscribedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: newsletters
    });
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch newsletters' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json(
          { success: false, error: 'Email is already subscribed' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        const updatedSubscription = await prisma.newsletter.update({
          where: { email },
          data: {
            isActive: true,
            unsubscribedAt: null
          }
        });
        return NextResponse.json({
          success: true,
          data: updatedSubscription,
          message: 'Subscription reactivated successfully'
        }, { status: 200 });
      }
    }

    const newSubscription = await prisma.newsletter.create({
      data: {
        email,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      data: newSubscription,
      message: 'Successfully subscribed to newsletter'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating newsletter subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const body = await request.json();
    const { isActive } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    const updatedSubscription = await prisma.newsletter.update({
      where: { email },
      data: {
        isActive,
        unsubscribedAt: isActive ? null : new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedSubscription
    });
  } catch (error) {
    console.error('Error updating newsletter subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    await prisma.newsletter.delete({
      where: { email }
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting newsletter subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscription' },
      { status: 500 }
    );
  }
}