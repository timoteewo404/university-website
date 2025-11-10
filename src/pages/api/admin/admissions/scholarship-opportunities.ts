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
    const scholarshipItems = await prisma.scholarshipOpportunity.findMany({
      orderBy: [
        { order: 'asc' },
        { deadline: 'asc' }
      ]
    });

    res.status(200).json({
      success: true,
      data: scholarshipItems
    });
  } catch (error) {
    console.error('Error fetching scholarship opportunities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scholarship opportunities'
    });
  } finally {
    await prisma.$disconnect();
  }
}