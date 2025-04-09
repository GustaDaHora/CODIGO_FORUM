// app/api/feed/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const headersInstance = headers();
    const authHeader = headersInstance.get("authorization");
    
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;

    // Find users that the current user follows
    const followedUsers = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followedUserIds = followedUsers.map((f) => f.followingId);
    
    // Include the user's own posts in the feed as well
    followedUserIds.push(userId);

    // Get posts from followed users and the user's own posts
    const feedPosts = await prisma.post.findMany({
      where: { authorId: { in: followedUserIds } },
      include: { author: true },
      orderBy: { createdAt: "desc" },
      take: 20, // Limit to 20 most recent posts
    });

    return NextResponse.json(feedPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return NextResponse.json(
      { message: "Failed to fetch feed posts" },
      { status: 500 }
    );
  }
}