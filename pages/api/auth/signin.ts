import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(422).json({ message: "Invalid input" });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        res.status(422).json({ message: "User not found" });
        return;
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        res.status(401).json({ message: "Invalid password" });
        return;
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: "1m",
      });

      res.status(200).json({ token });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Internal server error", error: error.message });
      } else {
        res
          .status(500)
          .json({ message: "Internal server error", error: String(error) });
      }
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
