// lib/middleware/auth.ts
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
  };
}

export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables");
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    
    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // Extend the request with user data
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    // Call the original handler with the authenticated request
    return await handler(authenticatedRequest);
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 401 }
    );
  }
}