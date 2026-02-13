import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { classes } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

function getPayload(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  return verifyToken(token);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload: any = getPayload(request);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const classId = Number(id);
    const teacherId = Number(payload.id);

    const result = await db
      .select()
      .from(classes)
      .where(
        and(
          eq(classes.id, classId),
          eq(classes.teacherId, teacherId)
        )
      );

    if (!result.length) {
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      class: result[0],
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload: any = getPayload(request);

    if (!payload || payload.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const classId = Number(id);
    const teacherId = Number(payload.id);

    const body = await request.json();
    const { name, subject, schedule } = body;

    const updated = await db
      .update(classes)
      .set({ name, subject, schedule })
      .where(
        and(
          eq(classes.id, classId),
          eq(classes.teacherId, teacherId)
        )
      )
      .returning();

    if (!updated.length) {
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      class: updated[0],
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload: any = getPayload(request);

    if (!payload || payload.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const classId = Number(id);
    const teacherId = Number(payload.id);

    const deleted = await db
      .delete(classes)
      .where(
        and(
          eq(classes.id, classId),
          eq(classes.teacherId, teacherId)
        )
      )
      .returning();

    if (!deleted.length) {
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Class deleted",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
