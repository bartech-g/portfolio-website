
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput } from '../schema';
import { getSkillsByCategory } from '../handlers/get_skills_by_category';

// Test skills data with different categories
const frontendSkill: CreateSkillInput = {
  name: 'React',
  category: 'frontend',
  proficiency_level: 'advanced',
  years_experience: 3,
  is_featured: true
};

const backendSkill: CreateSkillInput = {
  name: 'Node.js',
  category: 'backend',
  proficiency_level: 'intermediate',
  years_experience: 2,
  is_featured: false
};

const databaseSkill: CreateSkillInput = {
  name: 'PostgreSQL',
  category: 'database',
  proficiency_level: 'advanced',
  years_experience: 4,
  is_featured: true
};

const anotherFrontendSkill: CreateSkillInput = {
  name: 'TypeScript',
  category: 'frontend',
  proficiency_level: 'expert',
  years_experience: 5,
  is_featured: true
};

describe('getSkillsByCategory', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return skills filtered by frontend category', async () => {
    // Create test skills
    await db.insert(skillsTable).values([
      frontendSkill,
      backendSkill,
      databaseSkill,
      anotherFrontendSkill
    ]).execute();

    const result = await getSkillsByCategory('frontend');

    expect(result).toHaveLength(2);
    expect(result.every(skill => skill.category === 'frontend')).toBe(true);
    
    const skillNames = result.map(skill => skill.name);
    expect(skillNames).toContain('React');
    expect(skillNames).toContain('TypeScript');
    expect(skillNames).not.toContain('Node.js');
    expect(skillNames).not.toContain('PostgreSQL');
  });

  it('should return skills filtered by backend category', async () => {
    // Create test skills
    await db.insert(skillsTable).values([
      frontendSkill,
      backendSkill,
      databaseSkill
    ]).execute();

    const result = await getSkillsByCategory('backend');

    expect(result).toHaveLength(1);
    expect(result[0].category).toEqual('backend');
    expect(result[0].name).toEqual('Node.js');
    expect(result[0].proficiency_level).toEqual('intermediate');
    expect(result[0].years_experience).toEqual(2);
    expect(result[0].is_featured).toBe(false);
  });

  it('should return empty array when no skills exist for category', async () => {
    // Create only frontend skills
    await db.insert(skillsTable).values([frontendSkill]).execute();

    const result = await getSkillsByCategory('devops');

    expect(result).toHaveLength(0);
  });

  it('should handle all skill categories correctly', async () => {
    const skillsData = [
      { ...frontendSkill, name: 'Frontend Skill' },
      { ...backendSkill, name: 'Backend Skill' },
      { ...databaseSkill, name: 'Database Skill' },
      { name: 'DevOps Skill', category: 'devops' as const, proficiency_level: 'intermediate' as const, years_experience: 1, is_featured: false },
      { name: 'Tools Skill', category: 'tools' as const, proficiency_level: 'beginner' as const, years_experience: null, is_featured: false },
      { name: 'Other Skill', category: 'other' as const, proficiency_level: 'advanced' as const, years_experience: 3, is_featured: true }
    ];

    await db.insert(skillsTable).values(skillsData).execute();

    // Test each category individually
    const frontendResult = await getSkillsByCategory('frontend');
    expect(frontendResult).toHaveLength(1);
    expect(frontendResult[0].category).toEqual('frontend');
    expect(frontendResult[0].name).toEqual('Frontend Skill');

    const backendResult = await getSkillsByCategory('backend');
    expect(backendResult).toHaveLength(1);
    expect(backendResult[0].category).toEqual('backend');
    expect(backendResult[0].name).toEqual('Backend Skill');

    const databaseResult = await getSkillsByCategory('database');
    expect(databaseResult).toHaveLength(1);
    expect(databaseResult[0].category).toEqual('database');
    expect(databaseResult[0].name).toEqual('Database Skill');

    const devopsResult = await getSkillsByCategory('devops');
    expect(devopsResult).toHaveLength(1);
    expect(devopsResult[0].category).toEqual('devops');
    expect(devopsResult[0].name).toEqual('DevOps Skill');

    const toolsResult = await getSkillsByCategory('tools');
    expect(toolsResult).toHaveLength(1);
    expect(toolsResult[0].category).toEqual('tools');
    expect(toolsResult[0].name).toEqual('Tools Skill');

    const otherResult = await getSkillsByCategory('other');
    expect(otherResult).toHaveLength(1);
    expect(otherResult[0].category).toEqual('other');
    expect(otherResult[0].name).toEqual('Other Skill');
  });

  it('should preserve all skill properties correctly', async () => {
    await db.insert(skillsTable).values([databaseSkill]).execute();

    const result = await getSkillsByCategory('database');

    expect(result).toHaveLength(1);
    const skill = result[0];
    
    expect(skill.id).toBeDefined();
    expect(skill.name).toEqual('PostgreSQL');
    expect(skill.category).toEqual('database');
    expect(skill.proficiency_level).toEqual('advanced');
    expect(skill.years_experience).toEqual(4);
    expect(skill.is_featured).toBe(true);
    expect(skill.created_at).toBeInstanceOf(Date);
  });
});
