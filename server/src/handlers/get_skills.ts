
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type Skill } from '../schema';
import { desc } from 'drizzle-orm';

export const getSkills = async (): Promise<Skill[]> => {
  try {
    // Fetch all skills, ordered by featured first, then by name
    const results = await db.select()
      .from(skillsTable)
      .orderBy(desc(skillsTable.is_featured), skillsTable.name)
      .execute();

    // Return skills as-is since there are no numeric columns to convert
    return results;
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    throw error;
  }
};
