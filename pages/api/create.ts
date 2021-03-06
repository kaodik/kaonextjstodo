import { prisma } from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content } = req.body;
  try {
    console.log(title);
    await prisma.todo.create({
      data: {
        title,
        content,
      },
    });
    res.status(200).json({ message: 'Todo created' });
  } catch (error) {
    console.log('Failure');
    console.error(error);
  }
}
