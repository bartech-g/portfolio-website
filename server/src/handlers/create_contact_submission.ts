
import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { type CreateContactSubmissionInput, type ContactSubmission } from '../schema';

export const createContactSubmission = async (input: CreateContactSubmissionInput): Promise<ContactSubmission> => {
  try {
    // Insert contact submission record
    const result = await db.insert(contactSubmissionsTable)
      .values({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message
      })
      .returning()
      .execute();

    const submission = result[0];
    return submission;
  } catch (error) {
    console.error('Contact submission creation failed:', error);
    throw error;
  }
};
