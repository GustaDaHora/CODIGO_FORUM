import { withIronSession } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../pages/api/user";
export default withIronSession(
  async (req: NextApiRequest, res: NextApiResponse) => ({}),
  {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "session-cookie",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
