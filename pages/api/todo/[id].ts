import { prisma } from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  const todoID = req.query.id;
  if (req.method === 'DELETE') {
    const todo = await prisma.todo.delete({
      where: { id: Number(todoID) },
    });
    res.json(todo);
  } else {
    console.log('Todo could not be Deleted or Edited');
  }
}
