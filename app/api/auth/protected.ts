import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export default async function GET() {
  try {
    const headersInstance = headers();
    const authHeader = headersInstance.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 400 }
      );
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, jwtSecret);
    if (typeof decoded === "string") {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    const { exp } = decoded as JwtPayload;
    if (!exp || exp < Math.floor(Date.now() / 1000)) {
      return NextResponse.json({ message: "Expired" }, { status: 400 });
    } else {
      // If the token is valid, return some protected data.
      return NextResponse.json({ data: "Protected data" }, { status: 200 });
    }
  } catch (error) {
    console.error("Token verification failed", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
  }
}
