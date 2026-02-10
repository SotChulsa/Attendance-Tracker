import type { NextApiRequest, NextApiResponse } from 'next';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!databaseUrl || !supabaseUrl || !supabaseKey) {
    return res.status(500).json({ 
      success: false,
      error: 'Server configuration error' 
    });
  }

  const sql = postgres(databaseUrl);
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    const existingUser = await sql`
      SELECT id FROM public.users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
    
    const inserted = await sql`
      INSERT INTO public.users (name, email, role)
      VALUES (${name}, ${email}, ${role || 'student'})
      RETURNING id, name, email, role, created_at;
    `;

    if (!inserted[0]) {
      throw new Error('Failed to create user');
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: role || 'student'
          }
        }
      });

      if (authError) {
        console.warn('Supabase auth creation failed:', authError.message);
      }
    } catch (authErr) {
      console.warn('Supabase auth skipped:', authErr);
    }

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: inserted[0].id,
        name: inserted[0].name,
        email: inserted[0].email,
        role: inserted[0].role,
        createdAt: inserted[0].created_at
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.code === '23505') { // 
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    await sql.end();
  }
}