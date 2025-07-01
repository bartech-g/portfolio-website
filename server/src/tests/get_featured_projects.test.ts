
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { getFeaturedProjects } from '../handlers/get_featured_projects';

describe('getFeaturedProjects', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return only featured projects', async () => {
    // Create test projects - some featured, some not
    await db.insert(projectsTable).values([
      {
        title: 'Featured Project 1',
        description: 'A featured project',
        github_url: 'https://github.com/user/project1',
        demo_url: 'https://demo1.com',
        technologies: ['React', 'TypeScript'],
        featured: true
      },
      {
        title: 'Regular Project',
        description: 'Not featured',
        github_url: 'https://github.com/user/project2',
        demo_url: null,
        technologies: ['Vue.js'],
        featured: false
      },
      {
        title: 'Featured Project 2',
        description: 'Another featured project',
        github_url: null,
        demo_url: 'https://demo2.com',
        technologies: ['Node.js', 'Express'],
        featured: true
      }
    ]).execute();

    const result = await getFeaturedProjects();

    // Should return only featured projects
    expect(result).toHaveLength(2);
    expect(result.every(project => project.featured)).toBe(true);

    // Verify specific projects are included
    const titles = result.map(p => p.title);
    expect(titles).toContain('Featured Project 1');
    expect(titles).toContain('Featured Project 2');
    expect(titles).not.toContain('Regular Project');
  });

  it('should return projects ordered by most recent first', async () => {
    // Create projects with different creation times
    const now = new Date();
    const older = new Date(now.getTime() - 86400000); // 1 day ago
    const newest = new Date(now.getTime() + 3600000); // 1 hour in future

    await db.insert(projectsTable).values([
      {
        title: 'Older Featured Project',
        description: 'Created earlier',
        github_url: 'https://github.com/user/old',
        demo_url: null,
        technologies: ['HTML', 'CSS'],
        featured: true,
        created_at: older
      },
      {
        title: 'Newest Featured Project',
        description: 'Created most recently',
        github_url: 'https://github.com/user/new',
        demo_url: 'https://newest.com',
        technologies: ['React', 'Next.js'],
        featured: true,
        created_at: newest
      },
      {
        title: 'Middle Featured Project',
        description: 'Created in between',
        github_url: null,
        demo_url: 'https://middle.com',
        technologies: ['Angular'],
        featured: true,
        created_at: now
      }
    ]).execute();

    const result = await getFeaturedProjects();

    expect(result).toHaveLength(3);
    
    // Should be ordered by created_at descending (newest first)
    expect(result[0].title).toBe('Newest Featured Project');
    expect(result[1].title).toBe('Middle Featured Project');
    expect(result[2].title).toBe('Older Featured Project');
  });

  it('should return empty array when no featured projects exist', async () => {
    // Create only non-featured projects
    await db.insert(projectsTable).values([
      {
        title: 'Regular Project 1',
        description: 'Not featured',
        github_url: 'https://github.com/user/project1',
        demo_url: null,
        technologies: ['JavaScript'],
        featured: false
      },
      {
        title: 'Regular Project 2',
        description: 'Also not featured',
        github_url: null,
        demo_url: 'https://demo.com',
        technologies: ['Python'],
        featured: false
      }
    ]).execute();

    const result = await getFeaturedProjects();

    expect(result).toHaveLength(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return empty array when no projects exist', async () => {
    const result = await getFeaturedProjects();

    expect(result).toHaveLength(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should include all project fields correctly', async () => {
    await db.insert(projectsTable).values({
      title: 'Complete Featured Project',
      description: 'Project with all fields populated',
      github_url: 'https://github.com/user/complete',
      demo_url: 'https://complete-demo.com',
      technologies: ['React', 'TypeScript', 'Node.js'],
      featured: true
    }).execute();

    const result = await getFeaturedProjects();

    expect(result).toHaveLength(1);
    const project = result[0];

    // Verify all fields are present and correct
    expect(project.id).toBeDefined();
    expect(project.title).toBe('Complete Featured Project');
    expect(project.description).toBe('Project with all fields populated');
    expect(project.github_url).toBe('https://github.com/user/complete');
    expect(project.demo_url).toBe('https://complete-demo.com');
    expect(project.technologies).toEqual(['React', 'TypeScript', 'Node.js']);
    expect(project.featured).toBe(true);
    expect(project.created_at).toBeInstanceOf(Date);
    expect(project.updated_at).toBeInstanceOf(Date);
  });
});
