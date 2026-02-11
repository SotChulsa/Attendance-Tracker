import { db } from "@/lib/drizzle";
import { users } from "@/db/schema";

export async function GET() {
  try {
    const allUsers = await db.select().from(users);

    // remove passwords
    const safeUsers = allUsers.map(({ password, ...rest }) => rest);

    return Response.json({ success: true, users: safeUsers });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
