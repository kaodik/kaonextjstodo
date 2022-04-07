import { prisma } from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  console.log(body);
  try {
    await prisma.todo.update({
      where: { id: Number(body.id) },
      data: { title: body.title, content: body.content },
    });
    res.status(200).json({ message: 'Todo created' });
  } catch (error) {
    console.log('Failure');
    console.error(error);
  }
}
