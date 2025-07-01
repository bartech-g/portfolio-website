
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { getContactSubmissions } from '../handlers/get_contact_submissions';

describe('getContactSubmissions', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no submissions exist', async () => {
    const result = await getContactSubmissions();

    expect(result).toEqual([]);
  });

  it('should return all contact submissions', async () => {
    // Insert test submissions separately to ensure different timestamps
    await db.insert(contactSubmissionsTable)
      .values({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject 1',
        message: 'Test message 1'
      })
      .execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(contactSubmissionsTable)
      .values({
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Test Subject 2',
        message: 'Test message 2'
      })
      .execute();

    const result = await getContactSubmissions();

    expect(result).toHaveLength(2);
    
    // Since we're ordering by most recent first, Jane Smith should be first
    expect(result[0].name).toEqual('Jane Smith');
    expect(result[0].email).toEqual('jane@example.com');
    expect(result[0].subject).toEqual('Test Subject 2');
    expect(result[0].message).toEqual('Test message 2');
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);

    // John Doe should be second
    expect(result[1].name).toEqual('John Doe');
    expect(result[1].email).toEqual('john@example.com');
    expect(result[1].subject).toEqual('Test Subject 1');
    expect(result[1].message).toEqual('Test message 1');
    expect(result[1].id).toBeDefined();
    expect(result[1].created_at).toBeInstanceOf(Date);
  });

  it('should return submissions ordered by most recent first', async () => {
    // Insert submissions with slight delay to ensure different timestamps
    await db.insert(contactSubmissionsTable)
      .values({
        name: 'First User',
        email: 'first@example.com',
        subject: 'First Subject',
        message: 'First message'
      })
      .execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(contactSubmissionsTable)
      .values({
        name: 'Second User',
        email: 'second@example.com',
        subject: 'Second Subject',
        message: 'Second message'
      })
      .execute();

    const result = await getContactSubmissions();

    expect(result).toHaveLength(2);
    // Most recent should be first
    expect(result[0].name).toEqual('Second User');
    expect(result[1].name).toEqual('First User');
    
    // Verify ordering by timestamp
    expect(result[0].created_at.getTime()).toBeGreaterThan(result[1].created_at.getTime());
  });

  it('should handle single submission correctly', async () => {
    await db.insert(contactSubmissionsTable)
      .values({
        name: 'Solo User',
        email: 'solo@example.com',
        subject: 'Solo Subject',
        message: 'Solo message'
      })
      .execute();

    const result = await getContactSubmissions();

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Solo User');
    expect(result[0].email).toEqual('solo@example.com');
    expect(result[0].subject).toEqual('Solo Subject');
    expect(result[0].message).toEqual('Solo message');
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
  });
});
