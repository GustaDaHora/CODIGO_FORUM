import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { withIronSession } from "next-iron-session";

const prisma = new PrismaClient();

export default withIronSession(
  async function login(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
      const { email, password } = req.body;

      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Save user data to the session
        req.session.set("user", {
          id: user.id,
          email: user.email,
          // Add more user data as needed
        });
        await req.session.save();

        return res.status(200).json({ message: "Login successful" });
      } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Failed to login" });
      }
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  },
  {
    password: process.env.NEXT_IRON_SESSION_PASSWORD, // Use your own password
    cookieName: "myapp_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
