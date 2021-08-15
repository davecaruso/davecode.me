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
    if (result.value.mail) {
      // TODO: send mail
    }

    await db.collection('questions').insertOne(req.body.response);
  }

  res.send('done')
};
