import { prisma } from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const todoID = req.query.id;
  if (req.method === 'DELETE') {
    const todo = await prisma.todo.delete({
      where: { id: Number(todoID) },
    });
    res.json(todo);
  } else {
    console.log('Todo could not be created');
  }
  const { title, content } = req.body;
  if (req.method === 'PUT') {
    const todo = await prisma.todo.update({
      where: { id: Number(todoID) },
      data: {
        title: title,
        content: content,
      },
    });
    res.json(todo);
  } else {
    console.log('Todo could not be created');
  }
}
