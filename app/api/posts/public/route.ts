// app/api/posts/public/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch the most recent public posts with more posts (e.g., 20 instead of 10)
    const publicPosts = await prisma.post.findMany({
      where: { 
        published: true
      },
      include: { 
        author: {
          select: {
            id: true,
            name: true,
          }
        } 
      },
      orderBy: { createdAt: "desc" },
      take: 20, // Increase the number of posts returned
    });

    return NextResponse.json(publicPosts);
  } catch (error) {
    console.error("Error fetching public posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch public posts" },
      { status: 500 }
    );
  }
}