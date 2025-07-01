
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput, type Project } from '../schema';

export const createProject = async (input: CreateProjectInput): Promise<Project> => {
  try {
    // Insert project record
    const result = await db.insert(projectsTable)
      .values({
        title: input.title,
        description: input.description,
        github_url: input.github_url,
        demo_url: input.demo_url,
        technologies: input.technologies,
        featured: input.featured
      })
      .returning()
      .execute();

    const project = result[0];
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      github_url: project.github_url,
      demo_url: project.demo_url,
      technologies: project.technologies,
      featured: project.featured,
      created_at: project.created_at,
      updated_at: project.updated_at
    };
  } catch (error) {
    console.error('Project creation failed:', error);
    throw error;
  }
};
