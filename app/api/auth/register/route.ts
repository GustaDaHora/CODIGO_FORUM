// app/api/auth/register/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { 
  successResponse, 
  errorResponse, 
  serverErrorResponse 
} from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !email.includes("@") || !password || password.length < 5) {
      return errorResponse(
        "Invalid input. Name, valid email, and password (min 5 characters) are required", 
        422
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return errorResponse("User with this email already exists", 422);
    }

    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return successResponse(
      { id: user.id, name: user.name, email: user.email },
      "User successfully registered", 
      201
    );
  } catch (error) {
    console.error("Registration error:", error);
    return serverErrorResponse("Failed to register user");
  }
}