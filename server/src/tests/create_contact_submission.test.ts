
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { type CreateContactSubmissionInput } from '../schema';
import { createContactSubmission } from '../handlers/create_contact_submission';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateContactSubmissionInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  subject: 'Portfolio Inquiry',
  message: 'Hello, I would like to discuss a potential project opportunity with you.'
};

describe('createContactSubmission', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a contact submission', async () => {
    const result = await createContactSubmission(testInput);

    // Basic field validation
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.subject).toEqual('Portfolio Inquiry');
    expect(result.message).toEqual(testInput.message);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save contact submission to database', async () => {
    const result = await createContactSubmission(testInput);

    // Query using proper drizzle syntax
    const submissions = await db.select()
      .from(contactSubmissionsTable)
      .where(eq(contactSubmissionsTable.id, result.id))
      .execute();

    expect(submissions).toHaveLength(1);
    expect(submissions[0].name).toEqual('John Doe');
    expect(submissions[0].email).toEqual('john.doe@example.com');
    expect(submissions[0].subject).toEqual('Portfolio Inquiry');
    expect(submissions[0].message).toEqual(testInput.message);
    expect(submissions[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle long messages within limits', async () => {
    const longMessageInput: CreateContactSubmissionInput = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      subject: 'Long Project Description',
      message: 'A'.repeat(1500) // Well within the 2000 character limit
    };

    const result = await createContactSubmission(longMessageInput);

    expect(result.name).toEqual('Jane Smith');
    expect(result.message).toEqual('A'.repeat(1500));
    expect(result.message.length).toEqual(1500);
  });

  it('should handle various email formats', async () => {
    const emailTestInput: CreateContactSubmissionInput = {
      name: 'Test User',
      email: 'test.user+portfolio@company.co.uk',
      subject: 'Email Format Test',
      message: 'Testing various email formats'
    };

    const result = await createContactSubmission(emailTestInput);

    expect(result.email).toEqual('test.user+portfolio@company.co.uk');
    expect(result.name).toEqual('Test User');
  });
});
