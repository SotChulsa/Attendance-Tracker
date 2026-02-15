import { pgTable, uuid, text} from 'drizzle-orm/pg-core';

export const attendance = pgTable("attendance", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  date: text("date").notNull(),
});





