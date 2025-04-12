// app/api/feed/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/middleware/auth";
import { successResponse, serverErrorResponse } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const userId = req.user!.userId;

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
        where: { 
          authorId: { in: followedUserIds },
          published: true
        },
        include: { 
          author: {
            select: {
              id: true,
              name: true,
            },
          } 
        },
        orderBy: { createdAt: "desc" },
        take: 20, // Limit to 20 most recent posts
      });

      return successResponse(feedPosts);
    } catch (error) {
      console.error("Error fetching feed:", error);
      return serverErrorResponse("Failed to fetch feed posts");
    }
  });
}