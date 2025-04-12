// lib/api/response.ts
import { NextResponse } from "next/server";

type ApiResponse<T> = {
  data?: T;
  message?: string;
  success: boolean;
};

export function successResponse<T>(data: T, message?: string, status = 200): NextResponse {
  const response: ApiResponse<T> = {
    data,
    success: true
  };
  
  if (message) {
    response.message = message;
  }
  
  return NextResponse.json(response, { status });
}

export function errorResponse(message: string, status = 400): NextResponse {
  return NextResponse.json(
    { 
      message, 
      success: false 
    },
    { status }
  );
}

export function unauthorizedResponse(message = "Unauthorized"): NextResponse {
  return errorResponse(message, 401);
}

export function notFoundResponse(message = "Resource not found"): NextResponse {
  return errorResponse(message, 404);
}

export function serverErrorResponse(message = "Internal server error"): NextResponse {
  return errorResponse(message, 500);
}