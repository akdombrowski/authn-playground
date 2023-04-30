import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  // Get data submitted in request's body.
  const body = req.body;

  if (!body) {
    return res.status(400).json({ data: "No data found" });
  }

  const email = body.email;
  const pubKeyCred = body.pubKeyCred;

  // Guard clause checks for first and last name,
  // and returns early if they are not found
  if (!email) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log("email not found");
    console.log("body: ", body);
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Email not found" });
  }

  if (!pubKeyCred) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log("pubKeyCred not found");
    console.log("body: ", body);
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Cred not found" });
  }

  if (!pubKeyCred.authenticatorAttachment) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log("authenticatorAttachment not found");
    console.log("body: ", body);
    // Sends a HTTP bad request error code
    return res
      .status(400)
      .json({ data: "Cred authenticatorAttachment not found" });
  }

  console.log("pubKeyCred");
  console.log(pubKeyCred);
  console.log("pubKeyCred.id");
  console.log(pubKeyCred.id);

  if (!pubKeyCred.id) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log("id not found");
    console.log("body: ", body);
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Cred id not found" });
  }

  if (!pubKeyCred.rawId) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log("rawId not found");
    console.log("body: ", body);
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Cred rawId not found" });
  }

  if (!pubKeyCred.response) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log("response not found");
    console.log("body: ", body);
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Cred response not found" });
  }

  if (!pubKeyCred.type) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log("type not found");
    console.log("body: ", body);
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Cred type not found" });
  }

  const pubKeyCredValues = {
    authenticatorAttachment: pubKeyCred.authenticatorAttachment,
    id: pubKeyCred.id,
    rawId: pubKeyCred.rawId,
    response: pubKeyCred.response,
    type: pubKeyCred.type,
  };

  // Found the name.
  // Sends a HTTP success code
  res.status(200).json({
    data: {
      email: body.email,
      pubKeyCred: pubKeyCred,
      success: true,
      session: session,
    },
  });
};

export default handler;
