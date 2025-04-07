// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    if (
      !name ||
      !email ||
      !email.includes("@") ||
      !password ||
      password.length < 5
    ) {
      res.status(422).json({ message: "Invalid input" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.status(422).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created", user });
  } else {
    res.status(405).end();
  }
}
