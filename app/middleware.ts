import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/Authentication/Login", req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/Dashboard") && decoded.role !== "teacher") {
      return NextResponse.redirect(new URL("/Authentication/Login", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/Authentication/Login", req.url));
  }
}

