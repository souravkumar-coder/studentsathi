import { pgTable, serial, varchar, text, timestamp, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// Role Enum
export const roleEnum = pgEnum('role', ['user', 'admin']);

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  openId: varchar('open_id', { length: 64 }).notNull().unique(),
  name: text('name'),
  email: varchar('email', { length: 320 }),
  loginMethod: varchar('login_method', { length: 64 }),
  role: roleEnum('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastSignedIn: timestamp('last_signed_in').defaultNow(),
});