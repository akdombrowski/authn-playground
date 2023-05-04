import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  // Get data submitted in request's body.
  const body = req.body;

  // Optional logging to see the responses
  // in the command line where next.js app is running.
  console.log("body: ", body);

  // Guard clause checks for email,
  // and returns early if not found
  if (!body.email) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "email not provided", success: false });
  }

  // Guard clause checks for password,
  // and returns early if not found
  if (!body.password) {
    return res
      .status(400)
      .json({ data: "password not provided", success: false });
  }

  // Found the name.
  // Sends a HTTP success code
  res
    .status(200)
    .json({ data: { email: body.email, success: true, session: session } });
};

export default handler;
