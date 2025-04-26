// app/api/posts/public/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
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
      take: 20,
    });

    // Add headers to prevent caching
    const headers = {
      'Cache-Control': 'no-store, must-revalidate',
      'Pragma': 'no-cache',
    };

    return NextResponse.json(publicPosts, { headers });
  } catch (error) {
    console.error("Error fetching public posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch public posts" },
      { status: 500 }
    );
  }
}