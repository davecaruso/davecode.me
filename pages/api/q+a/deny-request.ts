import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../utils/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({
      message: "You must be logged in to access this resource"
    });
  }

  const { db } = await connectToDatabase();

  const result = await db.collection('question-requests').findOneAndDelete({ _id: new ObjectId(req.body.id) });
  if (result.value) {
    console.log('deny ', result.value)
    if (result.value.mail) {
      // TODO: send mail
    }
  }

  res.send('done')
};

export interface QuestionRequest {
  _id: string;
  d: number;
  q: string;
  mail?: string;
}

export interface QAGetRequestsResponse {
  questions: QuestionRequest[];
}