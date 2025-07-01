
import { z } from 'zod';

// Contact form submission schema
export const contactSubmissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
  created_at: z.coerce.date()
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

// Input schema for creating contact form submissions
export const createContactSubmissionInputSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format').max(255, 'Email must be less than 255 characters'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message must be less than 2000 characters')
});

export type CreateContactSubmissionInput = z.infer<typeof createContactSubmissionInputSchema>;

// About me content schema (for future dynamic content management)
export const aboutMeSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  updated_at: z.coerce.date()
});

export type AboutMe = z.infer<typeof aboutMeSchema>;

// Project schema for portfolio projects
export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  github_url: z.string().url().nullable(),
  demo_url: z.string().url().nullable(),
  technologies: z.array(z.string()),
  featured: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Project = z.infer<typeof projectSchema>;

// Input schema for creating projects
export const createProjectInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  github_url: z.string().url('Invalid GitHub URL').nullable(),
  demo_url: z.string().url('Invalid demo URL').nullable(),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  featured: z.boolean().default(false)
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

// Skills schema for portfolio skills
export const skillSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.enum(['frontend', 'backend', 'database', 'devops', 'tools', 'other']),
  proficiency_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  years_experience: z.number().int().nonnegative().nullable(),
  is_featured: z.boolean(),
  created_at: z.coerce.date()
});

export type Skill = z.infer<typeof skillSchema>;

// Input schema for creating skills
export const createSkillInputSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(100, 'Skill name must be less than 100 characters'),
  category: z.enum(['frontend', 'backend', 'database', 'devops', 'tools', 'other']),
  proficiency_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  years_experience: z.number().int().nonnegative().nullable(),
  is_featured: z.boolean().default(false)
});

export type CreateSkillInput = z.infer<typeof createSkillInputSchema>;
