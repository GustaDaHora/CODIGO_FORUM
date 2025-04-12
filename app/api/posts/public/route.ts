// app/api/posts/public/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch the most recent public posts
    const publicPosts = await prisma.post.findMany({
      where: { 
        published: true // Assuming you have a 'published' field on posts
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
      take: 10, // Limit to 10 most recent public posts
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