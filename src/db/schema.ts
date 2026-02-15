import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { pgTable, serial, varchar, integer, timestamp, text, real} from 'drizzle-orm/pg-core';

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
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  radius: integer("radius").default(50),
  teacherId: integer("teacher_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()   
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .references(() => users.id)
    .notNull(),
  classId: integer("class_id")
    .references(() => classes.id)
    .notNull(),
  status: text("status").notNull(), 
  createdAt: timestamp("created_at").defaultNow()
});

export const classStudents = pgTable("class_students", {
  id: serial("id").primaryKey(),
  classId: integer("class_id")
    .references(() => classes.id)
    .notNull(),
  studentId: integer("student_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});



