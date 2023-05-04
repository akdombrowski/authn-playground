import type { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // Get data submitted in request's body.
  const body = req.body;

  // Optional logging to see the responses
  // in the command line where next.js app is running.
  console.log("body: ", body);

  // Guard clause checks for first and last name,
  // and returns early if they are not found
  if (!body.first || !body.last) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "First or last name not found" });
  }

  const pubKeyCredStringify = JSON.stringify(body.pubKeyCred);
  // Found the name.
  // Sends a HTTP success code
  res
    .status(200)
    .json({ data: { email: body.email, pubKeyCred: pubKeyCredStringify } });
};

export default handler;
