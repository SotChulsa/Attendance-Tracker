import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/drizzle";
import { classes, classStudents } from "@/db/schema"; 
import { eq } from "drizzle-orm";

export async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);

  return payload;
}


export async function POST(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    //Role check
    if (payload.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Teachers only" },
        { status: 403 }
      );
    }
    //Get request body
    const { name, subject, schedule, latitude, longitude } =
    await request.json();
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
    //Insert class
    const newClass = await db
      .insert(classes)
      .values({
        name,
        subject,
        schedule,
        latitude,
        longitude,
        teacherId: Number(payload.id), //don't trust client for this
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

export async function GET(request: NextRequest) {
  try {
    const payload: any = await verifyToken(request);

    let result;

    if (payload.role === "teacher") {
      result = await db
        .select()
        .from(classes)
        .where(eq(classes.teacherId, Number(payload.id)));
    }

    else if (payload.role === "student") {
      const rows = await db
        .select({
          id: classes.id,
          name: classes.name,
          subject: classes.subject,
          schedule: classes.schedule,
          latitude: classes.latitude,
          longitude: classes.longitude,
        })
        .from(classStudents)
        .innerJoin(
          classes,
          eq(classes.id, classStudents.classId)
        )
        .where(eq(classStudents.studentId, Number(payload.id)));

      //database returns joined structure
      result = rows.map((r) => ({
        id: r.id,
        name: r.name,
        subject: r.subject,
        schedule: r.schedule,
        latitude: r.latitude,
        longitude: r.longitude,
      }));
    }

    return NextResponse.json({
      success: true,
      classes: result,
    });

  } catch (error: any) {
    console.error("Get Classes Error:", error.message);

    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}

