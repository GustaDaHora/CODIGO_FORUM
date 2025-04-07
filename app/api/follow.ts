import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { followerId, followingId } = req.body;

  if (!followerId || !followingId) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const existingFollow = await prisma.follow.findFirst({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      await prisma.follow.delete({ where: { id: existingFollow.id } });
      return res.status(200).json({ message: "Unfollowed user" });
    } else {
      await prisma.follow.create({
        data: { followerId, followingId },
      });
      return res.status(201).json({ message: "Followed user" });
    }
  } catch (error) {
    console.error("Error in follow API", error);
    return res.status(500).json({ message: "Server error" });
  }
}

