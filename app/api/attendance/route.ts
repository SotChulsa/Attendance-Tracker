import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { attendance, users, classes } from "@/db/schema";
import { eq, like, and, gte, lte } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload: any = await verifyToken(token);

    const { searchParams } = new URL(request.url);

    const date = searchParams.get("date");
    const studentName = searchParams.get("name");
    const status = searchParams.get("status");

    let conditions: any[] = [];

    //student view
    if (payload.role === "student") {
      conditions.push(eq(attendance.studentId, Number(payload.id)));
    }

    //teacher filters
    if (date) {
      const start = new Date(date);
      const end = new Date(date);

      end.setHours(23, 59, 59, 999);

      conditions.push(
        and(
          gte(attendance.createdAt, start),
          lte(attendance.createdAt, end)
        )
      );
    }

    if (studentName) {
      conditions.push(
        like(users.name, `%${studentName}%`)
      );
    }

    if (status) {
      conditions.push(eq(attendance.status, status));
    }

    const rows = await db
      .select({
        id: attendance.id,
        name: users.name,
        status: attendance.status,
        date: attendance.createdAt,
        className: classes.name,
      })
      .from(attendance)
      .innerJoin(users, eq(users.id, attendance.studentId))
      .innerJoin(classes, eq(classes.id, attendance.classId))
      .where(conditions.length ? and(...conditions) : undefined);

    return NextResponse.json({
      success: true,
      attendance: rows,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
