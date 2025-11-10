import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, generateVisitConfirmationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const visitRequests = await prisma.visitRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Parse interests JSON for each request
    const formattedRequests = visitRequests.map((request) => ({
      ...request,
      interests: JSON.parse(request.interests)
    }));

    return NextResponse.json({
      success: true,
      data: formattedRequests
    });
  } catch (error) {
    console.error('Error fetching visit requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch visit requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      preferredDate, 
      preferredTime, 
      groupSize, 
      interests, 
      specialRequests 
    } = body;

    if (!firstName || !lastName || !email || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { success: false, error: 'First name, last name, email, preferred date, and time are required' },
        { status: 400 }
      );
    }

    const newVisitRequest = await prisma.visitRequest.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || '',
        preferredDate,
        preferredTime,
        groupSize: groupSize || 1,
        interests: JSON.stringify(interests || []),
        specialRequests,
        status: 'pending'
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...newVisitRequest,
        interests: JSON.parse(newVisitRequest.interests)
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating visit request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create visit request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { status, adminNotes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Visit request ID is required' },
        { status: 400 }
      );
    }

    const existingRequest = await prisma.visitRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      return NextResponse.json(
        { success: false, error: 'Visit request not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (status !== undefined) {
      updateData.status = status;
      updateData.respondedAt = new Date();
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    const updatedRequest = await prisma.visitRequest.update({
      where: { id },
      data: updateData
    });

    // Send confirmation email if status changed to approved
    if (status === 'approved') {
      try {
        const emailHtml = generateVisitConfirmationEmail(updatedRequest);
        await sendEmail({
          to: updatedRequest.email,
          subject: 'Your Visit Request Has Been Approved!',
          html: emailHtml
        });
        console.log('Visit confirmation email sent to:', updatedRequest.email);
      } catch (emailError) {
        console.error('Failed to send visit confirmation email:', emailError);
        // Don't fail the request if email fails, just log it
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...updatedRequest,
        interests: JSON.parse(updatedRequest.interests)
      }
    });
  } catch (error) {
    console.error('Error updating visit request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update visit request' },
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
        { success: false, error: 'Visit request ID is required' },
        { status: 400 }
      );
    }

    const existingRequest = await prisma.visitRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      return NextResponse.json(
        { success: false, error: 'Visit request not found' },
        { status: 404 }
      );
    }

    await prisma.visitRequest.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Visit request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting visit request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete visit request' },
      { status: 500 }
    );
  }
}