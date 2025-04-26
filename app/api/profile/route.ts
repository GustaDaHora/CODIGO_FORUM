// app/api/profile/route.ts
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { hash, compare } from "bcryptjs";

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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        id: true, 
        email: true, 
        name: true,
        _count: {
          select: {
            followers: true,
            following: true
          }
        }
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
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

    const body = await request.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { name: name.trim() },
      select: {
        id: true,
        email: true,
        name: true,
        _count: {
          select: {
            followers: true,
            following: true
          }
        }
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 5) {
      return NextResponse.json(
        { message: "New password must be at least 5 characters long" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { password: true }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const hashedPassword = await hash(newPassword, 12);
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { message: "Failed to update password" },
      { status: 500 }
    );
  }
}