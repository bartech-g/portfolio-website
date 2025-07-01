
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type Project } from '../schema';
import { desc } from 'drizzle-orm';

export const getProjects = async (): Promise<Project[]> => {
  try {
    const results = await db.select()
      .from(projectsTable)
      .orderBy(desc(projectsTable.created_at))
      .execute();

    return results.map(project => ({
      ...project,
      // Ensure technologies array is properly typed
      technologies: project.technologies || []
    }));
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw error;
  }
};
