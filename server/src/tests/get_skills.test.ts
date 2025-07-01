
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput } from '../schema';
import { getSkills } from '../handlers/get_skills';

// Test skill inputs
const testSkill1: CreateSkillInput = {
  name: 'TypeScript',
  category: 'frontend',
  proficiency_level: 'advanced',
  years_experience: 3,
  is_featured: true
};

const testSkill2: CreateSkillInput = {
  name: 'PostgreSQL',
  category: 'database',
  proficiency_level: 'intermediate',
  years_experience: 2,
  is_featured: false
};

const testSkill3: CreateSkillInput = {
  name: 'React',
  category: 'frontend',
  proficiency_level: 'expert',
  years_experience: null,
  is_featured: true
};

describe('getSkills', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no skills exist', async () => {
    const result = await getSkills();
    expect(result).toEqual([]);
  });

  it('should return all skills', async () => {
    // Create test skills
    await db.insert(skillsTable).values([
      testSkill1,
      testSkill2,
      testSkill3
    ]).execute();

    const result = await getSkills();

    expect(result).toHaveLength(3);
    
    // Verify all skills are returned with correct structure
    const skillNames = result.map(skill => skill.name);
    expect(skillNames).toContain('TypeScript');
    expect(skillNames).toContain('PostgreSQL');
    expect(skillNames).toContain('React');

    // Check that each skill has required properties
    result.forEach(skill => {
      expect(skill.id).toBeDefined();
      expect(skill.name).toBeDefined();
      expect(skill.category).toBeDefined();
      expect(skill.proficiency_level).toBeDefined();
      expect(skill.is_featured).toBeDefined();
      expect(skill.created_at).toBeInstanceOf(Date);
    });
  });

  it('should order skills by featured first, then by name', async () => {
    // Create skills in different order
    await db.insert(skillsTable).values([
      testSkill2, // PostgreSQL - not featured
      testSkill1, // TypeScript - featured
      testSkill3  // React - featured
    ]).execute();

    const result = await getSkills();

    expect(result).toHaveLength(3);
    
    // Featured skills should come first (TypeScript and React)
    // Then non-featured skills (PostgreSQL)
    // Within each group, ordered by name
    expect(result[0].is_featured).toBe(true);
    expect(result[1].is_featured).toBe(true);
    expect(result[2].is_featured).toBe(false);

    // Among featured skills, should be ordered by name (React, TypeScript)
    const featuredSkills = result.filter(skill => skill.is_featured);
    expect(featuredSkills[0].name).toBe('React');
    expect(featuredSkills[1].name).toBe('TypeScript');
  });

  it('should include all skill properties correctly', async () => {
    await db.insert(skillsTable).values(testSkill1).execute();

    const result = await getSkills();
    const skill = result[0];

    expect(skill.name).toBe('TypeScript');
    expect(skill.category).toBe('frontend');
    expect(skill.proficiency_level).toBe('advanced');
    expect(skill.years_experience).toBe(3);
    expect(skill.is_featured).toBe(true);
    expect(skill.created_at).toBeInstanceOf(Date);
  });

  it('should handle nullable years_experience correctly', async () => {
    await db.insert(skillsTable).values(testSkill3).execute();

    const result = await getSkills();
    const skill = result[0];

    expect(skill.name).toBe('React');
    expect(skill.years_experience).toBeNull();
  });
});
