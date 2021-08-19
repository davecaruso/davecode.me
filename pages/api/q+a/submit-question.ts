import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body || !req.body.question) {
    return res.status(400).json({
      message: 'Invalid question',
    });
  }

  const email = req.body.email;

  // if email is set, check if it is valid via regex
  if (email) {
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return res.status(400).json({
        message: 'Invalid email',
      });
    }
  }

  const question = req.body.question;

  // check if question is too long
  if (question.length > 8000) {
    return res.status(400).json({
      message: 'Question is too long',
    });
  }

  const { db } = await connectToDatabase();

  // get date in utc
  const date = new Date().getTime();

  const result = await db.collection('question-requests').insertOne({
    d: date,
    q: question,
    mail: email,
  });

  // check if question was added
  if (!result.acknowledged) {
    return res.status(500).json({
      message: 'Question was not added',
    });
  }

  res.json({
    message: 'Question submitted',
    id: result.insertedId,
    date: date,
  });
};
