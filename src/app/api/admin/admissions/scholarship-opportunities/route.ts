import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
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

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, title, description, eligibility, amount, deadline, type, isActive, order } = req.body;

    const scholarshipItem = await prisma.scholarshipOpportunity.update({
      where: { id },
      data: {
        title,
        description,
        eligibility,
        amount,
        deadline: new Date(deadline),
        type,
        isActive,
        order
      }
    });

    res.status(200).json({
      success: true,
      data: scholarshipItem
    });
  } catch (error) {
    console.error('Error updating scholarship opportunity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update scholarship opportunity'
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'ID parameter is required'
      });
    }

    await prisma.scholarshipOpportunity.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Scholarship opportunity deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting scholarship opportunity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete scholarship opportunity'
    });
  } finally {
    await prisma.$disconnect();
  }
}