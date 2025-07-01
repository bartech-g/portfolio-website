
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { createProject } from '../handlers/create_project';
import { eq } from 'drizzle-orm';

// Test input with all fields
const testInput: CreateProjectInput = {
  title: 'Test Project',
  description: 'A comprehensive test project for the portfolio',
  github_url: 'https://github.com/test/project',
  demo_url: 'https://demo.example.com',
  technologies: ['TypeScript', 'React', 'Node.js'],
  featured: true
};

// Test input with minimal required fields
const minimalInput: CreateProjectInput = {
  title: 'Minimal Project',
  description: 'A minimal test project',
  github_url: null,
  demo_url: null,
  technologies: ['JavaScript'],
  featured: false
};

describe('createProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a project with all fields', async () => {
    const result = await createProject(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test Project');
    expect(result.description).toEqual(testInput.description);
    expect(result.github_url).toEqual('https://github.com/test/project');
    expect(result.demo_url).toEqual('https://demo.example.com');
    expect(result.technologies).toEqual(['TypeScript', 'React', 'Node.js']);
    expect(result.featured).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a project with minimal fields', async () => {
    const result = await createProject(minimalInput);

    expect(result.title).toEqual('Minimal Project');
    expect(result.description).toEqual(minimalInput.description);
    expect(result.github_url).toBeNull();
    expect(result.demo_url).toBeNull();
    expect(result.technologies).toEqual(['JavaScript']);
    expect(result.featured).toEqual(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save project to database', async () => {
    const result = await createProject(testInput);

    // Query using proper drizzle syntax
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, result.id))
      .execute();

    expect(projects).toHaveLength(1);
    const savedProject = projects[0];
    expect(savedProject.title).toEqual('Test Project');
    expect(savedProject.description).toEqual(testInput.description);
    expect(savedProject.github_url).toEqual('https://github.com/test/project');
    expect(savedProject.demo_url).toEqual('https://demo.example.com');
    expect(savedProject.technologies).toEqual(['TypeScript', 'React', 'Node.js']);
    expect(savedProject.featured).toEqual(true);
    expect(savedProject.created_at).toBeInstanceOf(Date);
    expect(savedProject.updated_at).toBeInstanceOf(Date);
  });

  it('should handle array of technologies correctly', async () => {
    const inputWithManyTechnologies: CreateProjectInput = {
      title: 'Multi-Tech Project',
      description: 'Project using many technologies',
      github_url: null,
      demo_url: null,
      technologies: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker'],
      featured: false
    };

    const result = await createProject(inputWithManyTechnologies);

    expect(result.technologies).toHaveLength(7);
    expect(result.technologies).toContain('JavaScript');
    expect(result.technologies).toContain('PostgreSQL');
    expect(result.technologies).toContain('Docker');

    // Verify in database
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, result.id))
      .execute();

    expect(projects[0].technologies).toHaveLength(7);
    expect(projects[0].technologies).toEqual(inputWithManyTechnologies.technologies);
  });

  it('should set timestamps correctly', async () => {
    const beforeCreate = new Date();
    const result = await createProject(testInput);
    const afterCreate = new Date();

    // Verify timestamps are within reasonable range
    expect(result.created_at.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
    expect(result.created_at.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    expect(result.updated_at.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
    expect(result.updated_at.getTime()).toBeLessThanOrEqual(afterCreate.getTime());

    // Verify created_at and updated_at are close in time (should be same for new records)
    const timeDiff = Math.abs(result.updated_at.getTime() - result.created_at.getTime());
    expect(timeDiff).toBeLessThan(1000); // Less than 1 second difference
  });
});
