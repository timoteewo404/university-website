import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    data: {
      scholarships: 12,
      timeline: 8,
      status: 'Database seeded and ready'
    }
  });
}