// app/api/posts/public/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get the most recent posts for public viewing
    const publicPosts = await prisma.post.findMany({
      include: { author: true },
      orderBy: { createdAt: "desc" },
      take: 10, // Limit to 10 most recent posts
    });

    return NextResponse.json(publicPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching public posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch public posts" },
      { status: 500 }
    );
  }
}