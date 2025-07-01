
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput, createSkillInputSchema } from '../schema';
import { createSkill } from '../handlers/create_skill';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateSkillInput = {
  name: 'TypeScript',
  category: 'frontend',
  proficiency_level: 'advanced',
  years_experience: 3,
  is_featured: true
};

// Test input with nullable field
const testInputWithNullExperience: CreateSkillInput = {
  name: 'Docker',
  category: 'devops',
  proficiency_level: 'intermediate',
  years_experience: null,
  is_featured: false
};

describe('createSkill', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a skill with all fields', async () => {
    const result = await createSkill(testInput);

    // Basic field validation
    expect(result.name).toEqual('TypeScript');
    expect(result.category).toEqual('frontend');
    expect(result.proficiency_level).toEqual('advanced');
    expect(result.years_experience).toEqual(3);
    expect(result.is_featured).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a skill with null years_experience', async () => {
    const result = await createSkill(testInputWithNullExperience);

    expect(result.name).toEqual('Docker');
    expect(result.category).toEqual('devops');
    expect(result.proficiency_level).toEqual('intermediate');
    expect(result.years_experience).toBeNull();
    expect(result.is_featured).toEqual(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save skill to database', async () => {
    const result = await createSkill(testInput);

    // Query using proper drizzle syntax
    const skills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, result.id))
      .execute();

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toEqual('TypeScript');
    expect(skills[0].category).toEqual('frontend');
    expect(skills[0].proficiency_level).toEqual('advanced');
    expect(skills[0].years_experience).toEqual(3);
    expect(skills[0].is_featured).toEqual(true);
    expect(skills[0].created_at).toBeInstanceOf(Date);
  });

  it('should apply default values from Zod schema', async () => {
    // Test input without is_featured field - should default to false
    const inputWithoutFeatured = {
      name: 'React',
      category: 'frontend' as const,
      proficiency_level: 'expert' as const,
      years_experience: 5
    };

    // Parse through Zod to apply defaults
    const parsedInput = createSkillInputSchema.parse(inputWithoutFeatured);
    const result = await createSkill(parsedInput);

    expect(result.name).toEqual('React');
    expect(result.is_featured).toEqual(false); // Should default to false
  });

  it('should handle different skill categories', async () => {
    const categories = ['frontend', 'backend', 'database', 'devops', 'tools', 'other'] as const;
    
    for (const category of categories) {
      const skillInput: CreateSkillInput = {
        name: `Test ${category} skill`,
        category,
        proficiency_level: 'beginner',
        years_experience: 1,
        is_featured: false
      };

      const result = await createSkill(skillInput);
      expect(result.category).toEqual(category);
    }
  });

  it('should handle different proficiency levels', async () => {
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
    
    for (const level of levels) {
      const skillInput: CreateSkillInput = {
        name: `Test ${level} skill`,
        category: 'tools',
        proficiency_level: level,
        years_experience: 2,
        is_featured: false
      };

      const result = await createSkill(skillInput);
      expect(result.proficiency_level).toEqual(level);
    }
  });
});
