import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type UserWithoutPassword = Omit<User, "password">;

export default async function createUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Omit the password property from the user object
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
