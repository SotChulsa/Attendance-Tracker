import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { classes, attendance } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { calculateDistance } from "@/lib/distance";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload: any = verifyToken(token);

    if (!payload || payload.role !== "student") {
      return NextResponse.json({ message: "Students only" }, { status: 403 });
    }

    const { classId, latitude, longitude } = await request.json();

    //get class location
    const [cls] = await db
      .select()
      .from(classes)
      .where(eq(classes.id, classId));

    if (!cls) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    const distance = calculateDistance(
      latitude,
      longitude,
      cls.latitude,
      cls.longitude
    );

    if (distance > (cls.radius ?? 50)) {
      return NextResponse.json(
        { success: false, message: "Outside allowed area" },
        { status: 403 }
      );
    }

    await db.insert(attendance).values({
      studentId: Number(payload.id),
      classId,
      status: "Present",
    });

    return NextResponse.json({
      success: true,
      message: "Check-in successful",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
