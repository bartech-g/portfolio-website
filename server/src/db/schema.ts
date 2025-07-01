
import { serial, text, pgTable, timestamp, varchar, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';

// Enums for skills
export const skillCategoryEnum = pgEnum('skill_category', ['frontend', 'backend', 'database', 'devops', 'tools', 'other']);
export const proficiencyLevelEnum = pgEnum('proficiency_level', ['beginner', 'intermediate', 'advanced', 'expert']);

// Contact form submissions table
export const contactSubmissionsTable = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 200 }).notNull(),
  message: text('message').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// About me content table (for future dynamic content management)
export const aboutMeTable = pgTable('about_me', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Projects table for portfolio projects
export const projectsTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  github_url: text('github_url'), // Nullable by default
  demo_url: text('demo_url'), // Nullable by default
  technologies: text('technologies').array().notNull(), // Array of technology names
  featured: boolean('featured').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Skills table for portfolio skills
export const skillsTable = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  category: skillCategoryEnum('category').notNull(),
  proficiency_level: proficiencyLevelEnum('proficiency_level').notNull(),
  years_experience: integer('years_experience'), // Nullable by default
  is_featured: boolean('is_featured').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types for the table schemas
export type ContactSubmission = typeof contactSubmissionsTable.$inferSelect;
export type NewContactSubmission = typeof contactSubmissionsTable.$inferInsert;

export type AboutMe = typeof aboutMeTable.$inferSelect;
export type NewAboutMe = typeof aboutMeTable.$inferInsert;

export type Project = typeof projectsTable.$inferSelect;
export type NewProject = typeof projectsTable.$inferInsert;

export type Skill = typeof skillsTable.$inferSelect;
export type NewSkill = typeof skillsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  contactSubmissions: contactSubmissionsTable,
  aboutMe: aboutMeTable,
  projects: projectsTable,
  skills: skillsTable
};
