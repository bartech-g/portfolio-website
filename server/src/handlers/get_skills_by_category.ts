
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type Skill } from '../schema';
import { eq } from 'drizzle-orm';

export const getSkillsByCategory = async (category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'other'): Promise<Skill[]> => {
  try {
    const results = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.category, category))
      .execute();

    return results.map(skill => ({
      ...skill,
      years_experience: skill.years_experience // Integer column - no conversion needed
    }));
  } catch (error) {
    console.error('Failed to fetch skills by category:', error);
    throw error;
  }
};
