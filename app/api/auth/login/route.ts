// app/api/auth/login/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse, 
  serverErrorResponse 
} from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return errorResponse("Email and password are required", 422);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error("User not found:", email);
      return unauthorizedResponse("Invalid credentials");
    }

    const passwordValid = await compare(password, user.password);
    if (!passwordValid) {
      console.error("Invalid password for user:", email);
      return unauthorizedResponse("Invalid credentials");
    }

    if (!process.env.JWT_SECRET) {
      console.error("Missing JWT_SECRET in environment variables");
      return serverErrorResponse();
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "20d" }
    );

    return successResponse({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    return serverErrorResponse("Failed to login");
  }
}