import { db } from '@/lib/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { compare } from 'bcrypt';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      );
    }

const [user] = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  .limit(1);

if (!user) {
  return Response.json(
    { success: false, error: 'Invalid credentials' },
    { status: 401 }
  );
}

const isValidPassword = await compare(password, user.password);
    
    if (!isValidPassword) {
      return Response.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const token = await new SignJWT({
      id: users.id,
      email: users.email,
      role: users.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    const { password: _, ...userWithoutPassword } = users;

    return Response.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}