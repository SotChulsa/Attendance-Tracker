import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { attendance, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) throw new Error("Unauthorized");

    const token = authHeader.split(" ")[1];
    const payload: any = await verifyToken(token);

    const rows = await db
      .select({
        id: attendance.id,
        name: users.name,
        status: attendance.status,
        date: attendance.createdAt,
      })
      .from(attendance)
      .innerJoin(users, eq(users.id, attendance.studentId))
      .where(eq(attendance.studentId, Number(payload.id)));

    return NextResponse.json({
      success: true,
      attendance: rows,
    });

  } catch {
    return NextResponse.json(
      { success: false },
      { status: 401 }
    );
  }
}

