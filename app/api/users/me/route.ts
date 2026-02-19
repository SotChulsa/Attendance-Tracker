import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const payload: any = verifyToken(token!);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(payload.id)));

    if (!user) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    const { password, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const payload: any = verifyToken(token!);
    const { name, email, password, dob } = await request.json();
    const updateData: any = {
      name,
      email,
      dob,
    };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, Number(payload.id)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
