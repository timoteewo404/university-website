import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const timelineItems = await prisma.applicationTimeline.findMany({
      orderBy: [
        { order: 'asc' },
        { date: 'asc' }
      ]
    });

    res.status(200).json({
      success: true,
      data: timelineItems
    });
  } catch (error) {
    console.error('Error fetching application timeline:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch application timeline'
    });
  } finally {
    await prisma.$disconnect();
  }
}