// app/api/posts/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/middleware/auth";
import { 
  successResponse, 
  errorResponse, 
  serverErrorResponse 
} from "@/lib/api/response";

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const userId = req.user!.userId;
      const body = await req.json();
      const { title, content, published = true } = body;

      if (!title || !content) {
        return errorResponse("Title and content are required", 400);
      }

      // Create the post
      const post = await prisma.post.create({
        data: {
          title,
          content,
          published,
          author: {
            connect: { id: userId },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return successResponse(post, "Post created successfully", 201);
    } catch (error) {
      console.error("Error creating post:", error);
      return serverErrorResponse("Failed to create post");
    }
  });
}

export async function GET(request: NextRequest) {
  try {
    // Public route to get published posts
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return serverErrorResponse("Failed to fetch posts");
  }
}