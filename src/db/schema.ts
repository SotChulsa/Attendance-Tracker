import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { pgTable, serial, varchar, integer, timestamp, text} from 'drizzle-orm/pg-core';

dotenv.config();

const databaseUrl = process.env['DATABASE_URL'] as string;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const sql = postgres(databaseUrl, {
  max: 10, 
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: 'require',
});

export const db = drizzle(sql);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role').default('student'), 
  created_at: timestamp('created_at').defaultNow(),
});

export async function testDbConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    if (!result || result.length === 0) {
      console.error('Database returned empty result');
      return false;
    }
    console.log('Database connection successful:',);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  schedule: text("schedule").notNull(),
  teacherId: integer("teacher_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()   
});

