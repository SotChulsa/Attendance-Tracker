import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { users, attendance } from "@/db/schema";
import { eq, and, gte, lte, count } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload: any = await verifyToken(token);

    if (payload.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Teachers only" },
        { status: 403 }
      );
    }

    //Get total students
    const totalStudentsResult = await db
      .select({ total: count() })
      .from(users)
      .where(eq(users.role, "student"));

    const totalStudents = totalStudentsResult[0].total;

    //Get today's attendance
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    //Get total present
    const presentResult = await db
      .select({ total: count() })
      .from(attendance)
      .where(
        and(
          eq(attendance.status, "Present"),
          gte(attendance.createdAt, start),
          lte(attendance.createdAt, end)
        )
      );

    const totalPresent = presentResult[0].total;

    //Get total attendance today
    const todayTotalResult = await db
      .select({ total: count() })
      .from(attendance)
      .where(
        and(
          gte(attendance.createdAt, start),
          lte(attendance.createdAt, end)
        )
      );

    const todayTotal = todayTotalResult[0].total;

    const totalAbsent = totalStudents - totalPresent;

    const attendancePercentage =
      totalStudents > 0
        ? ((totalPresent / totalStudents) * 100).toFixed(1)
        : 0;
        
    return NextResponse.json({
      success: true,
      totalStudents,
      totalPresent,
      totalAbsent,
      attendancePercentage,
      todayTotal,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
