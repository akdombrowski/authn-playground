import { NextApiRequest, NextApiResponse } from "next";

import { getXataClient } from "../../db/xata";
import {
  NextauthUser,
  NextauthUserRecord,
} from "@next-auth/xata-adapter/dist/xata";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const xata = getXataClient();
  const users = await xata.db.nextauth_users
    .select(["id", "createdAt"])
    .getMany();
  const now = Date.now();
  let numUsersDeleted = 0;
  await users.forEach(async (user) => {
    const createdAt = user.createdAt;
    const hour = 60 * 60 * 1000;
    if (now - createdAt >= hour) {
      const deleted = await user.delete();
      if (deleted) {
        numUsersDeleted++;
      }
    }
  });

  res.status(200).end(numUsersDeleted + " users cleaned up");
};

export default handler;
