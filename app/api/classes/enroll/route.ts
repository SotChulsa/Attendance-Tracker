import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { classStudents } from "@/db/schema";
import { db } from "@/lib/drizzle";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];
    const payload: any = await verifyToken(token);

    if (!payload || payload.role !== "teacher") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { classId, studentId } = await request.json();

    await db.insert(classStudents).values({
      classId: Number(classId),
      studentId: Number(studentId),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
