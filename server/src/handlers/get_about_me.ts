
import { db } from '../db';
import { aboutMeTable } from '../db/schema';
import { type AboutMe } from '../schema';
import { desc } from 'drizzle-orm';

export const getAboutMe = async (): Promise<AboutMe | null> => {
  try {
    // Get the most recent about me entry
    const result = await db.select()
      .from(aboutMeTable)
      .orderBy(desc(aboutMeTable.updated_at))
      .limit(1)
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error('Failed to fetch about me content:', error);
    throw error;
  }
};
