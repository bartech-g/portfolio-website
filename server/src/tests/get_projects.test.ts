
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { getProjects } from '../handlers/get_projects';

// Test project data
const testProject1: Omit<CreateProjectInput, 'featured'> & { featured: boolean } = {
  title: 'First Project',
  description: 'A test project for the portfolio',
  github_url: 'https://github.com/user/first-project',
  demo_url: 'https://first-project.demo.com',
  technologies: ['React', 'TypeScript', 'Node.js'],
  featured: true
};

const testProject2: Omit<CreateProjectInput, 'featured'> & { featured: boolean } = {
  title: 'Second Project',
  description: 'Another test project',
  github_url: null,
  demo_url: 'https://second-project.demo.com',
  technologies: ['Vue.js', 'JavaScript'],
  featured: false
};

describe('getProjects', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no projects exist', async () => {
    const result = await getProjects();
    
    expect(result).toEqual([]);
  });

  it('should return all projects ordered by creation date (newest first)', async () => {
    // Insert test projects with a small delay to ensure different timestamps
    await db.insert(projectsTable)
      .values({
        title: testProject1.title,
        description: testProject1.description,
        github_url: testProject1.github_url,
        demo_url: testProject1.demo_url,
        technologies: testProject1.technologies,
        featured: testProject1.featured
      })
      .execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(projectsTable)
      .values({
        title: testProject2.title,
        description: testProject2.description,
        github_url: testProject2.github_url,
        demo_url: testProject2.demo_url,
        technologies: testProject2.technologies,
        featured: testProject2.featured
      })
      .execute();

    const result = await getProjects();

    expect(result).toHaveLength(2);
    
    // Verify projects are ordered by created_at desc (newest first)
    expect(result[0].title).toEqual('Second Project');
    expect(result[1].title).toEqual('First Project');
    
    // Verify first project data
    expect(result[0].description).toEqual(testProject2.description);
    expect(result[0].github_url).toBeNull();
    expect(result[0].demo_url).toEqual(testProject2.demo_url);
    expect(result[0].technologies).toEqual(['Vue.js', 'JavaScript']);
    expect(result[0].featured).toBe(false);
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].updated_at).toBeInstanceOf(Date);

    // Verify second project data
    expect(result[1].description).toEqual(testProject1.description);
    expect(result[1].github_url).toEqual(testProject1.github_url);
    expect(result[1].demo_url).toEqual(testProject1.demo_url);
    expect(result[1].technologies).toEqual(['React', 'TypeScript', 'Node.js']);
    expect(result[1].featured).toBe(true);
    expect(result[1].id).toBeDefined();
    expect(result[1].created_at).toBeInstanceOf(Date);
    expect(result[1].updated_at).toBeInstanceOf(Date);
  });

  it('should handle projects with null URLs correctly', async () => {
    await db.insert(projectsTable)
      .values({
        title: 'Project with nulls',
        description: 'Testing null handling',
        github_url: null,
        demo_url: null,
        technologies: ['HTML', 'CSS'],
        featured: false
      })
      .execute();

    const result = await getProjects();

    expect(result).toHaveLength(1);
    expect(result[0].github_url).toBeNull();
    expect(result[0].demo_url).toBeNull();
    expect(result[0].technologies).toEqual(['HTML', 'CSS']);
  });

  it('should handle empty technologies array correctly', async () => {
    await db.insert(projectsTable)
      .values({
        title: 'Project with no technologies',
        description: 'Testing empty technologies',
        github_url: 'https://github.com/user/project',
        demo_url: null,
        technologies: [],
        featured: false
      })
      .execute();

    const result = await getProjects();

    expect(result).toHaveLength(1);
    expect(result[0].technologies).toEqual([]);
  });
});
