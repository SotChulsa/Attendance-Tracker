import { db } from '@/lib/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hash, compare } from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return Response.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return Response.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Insert user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: role || 'student',
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    return Response.json({
      success: true,
      message: 'Registration successful',
      user: newUser,
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}