
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type Project } from '../schema';
import { eq, desc } from 'drizzle-orm';

export const getFeaturedProjects = async (): Promise<Project[]> => {
  try {
    // Query for featured projects, ordered by most recent first
    const results = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.featured, true))
      .orderBy(desc(projectsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Featured projects fetch failed:', error);
    throw error;
  }
};
