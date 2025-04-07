import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const followedUsers = await prisma.follow.findMany({
      where: { followerId: Number(userId) },
      select: { followingId: true },
    });

    const followedUserIds = followedUsers.map((f) => f.followingId);

    const feedPosts = await prisma.post.findMany({
      where: { authorId: { in: followedUserIds } },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(feedPosts);
  } catch (error) {
    console.error("Error fetching feed:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

