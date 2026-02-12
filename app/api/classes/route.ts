import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/db/schema";
import { classes } from "@/db/schema"; 

async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  console.log("AUTH HEADER:", authHeader);
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }
  const token = authHeader.split(" ")[1];
  if (!token || token === "null") {
    throw new Error("Unauthorized");
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
}


export async function POST(request: NextRequest) {
  try {
    const payload: any = await verifyToken(request);
    //Role check
    if (payload.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Teachers only" },
        { status: 403 }
      );
    }
    //Get request body
    const body = await request.json();
    const { name, subject, schedule } = body;
    //Validate input
    if (!name || name.length < 3) {
      return NextResponse.json(
        { success: false, message: "Class name must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Subject is required" },
        { status: 400 }
      );
    }

    if (!schedule) {
      return NextResponse.json(
        { success: false, message: "Schedule is required" },
        { status: 400 }
      );
    }
    //Insert class (Ownership enforced here)
    const newClass = await db
      .insert(classes)
      .values({
        name,
        subject,
        schedule,
        teacherId: payload.id, //don't trust client for this
      })
      .returning();
    return NextResponse.json(
      {
        success: true,
        message: "Class created successfully",
        class: newClass[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Class Error:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.message === "Unauthorized"
          ? "Unauthorized"
          : "Internal Server Error",
      },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
