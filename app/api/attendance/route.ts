import { db } from "@/lib/drizzle";
import { attendance } from "@/db/attendance"; 

export async function GET() {
  try {
    const records = await db.select().from(attendance);

    return Response.json({
      success: true,
      attendance: records,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}
