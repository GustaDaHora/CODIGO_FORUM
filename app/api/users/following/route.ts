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

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    
    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const followedUsers = await prisma.user.findMany({
      where: {
        followers: {
          some: {
            followerId: decoded.userId
          }
        }
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(followedUsers);
  } catch (error) {
    console.error("Error fetching followed users:", error);
    return NextResponse.json({ message: "Failed to fetch followed users" }, { status: 500 });
  }
}