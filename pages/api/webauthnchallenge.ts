import type { NextApiRequest, NextApiResponse } from "next";
import { randomFillSync } from "node:crypto";
import { getXataClient } from "../../db/xata";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const xata = getXataClient();

  const userIDUint8Arr = new Uint8Array(16);
  randomFillSync(userIDUint8Arr);
  const userID = userIDUint8Arr.join("");

  const challUint8 = new Uint8Array(32);
  randomFillSync(challUint8);
  const challenge = challUint8.toString();

  const challIDUint8Arr = new Uint8Array(32);
  randomFillSync(challIDUint8Arr);
  // same as cred.id in db
  const challID = challIDUint8Arr.join("");

  const createdAt = Date.now();

  const readUser = await xata.db.nextauth_users.read(userID);

  console.log("");
  console.log("readUser");
  console.log(readUser);

  if (!readUser) {
    const user = await xata.db.nextauth_users.create(userID, { createdAt });
    const challengeRecord = await xata.db.nextauth_credentials.create(challID, {
      user: userID,
      challenge: challenge,
    });
    user.update({ cred: challID });
    
    console.log("");
    console.log("user");
    console.log(user);
    console.log("");
    console.log("challengeRecord");
    console.log(challengeRecord);
  } else {
    const readCred = await xata.db.nextauth_credentials.read(challID);
    if (readCred) {
      readUser.update({ createdAt });
      readCred.update({ challenge: challenge });
    }
  }

  res.status(200).json({ data: { challenge } });
};

export default handler;
