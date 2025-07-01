
import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { type ContactSubmission } from '../schema';
import { desc } from 'drizzle-orm';

export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  try {
    // Query all contact submissions, ordered by most recent first
    const results = await db.select()
      .from(contactSubmissionsTable)
      .orderBy(desc(contactSubmissionsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to get contact submissions:', error);
    throw error;
  }
};
