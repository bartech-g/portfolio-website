
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { aboutMeTable } from '../db/schema';
import { getAboutMe } from '../handlers/get_about_me';

describe('getAboutMe', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no about me content exists', async () => {
    const result = await getAboutMe();
    expect(result).toBeNull();
  });

  it('should return the about me content', async () => {
    // Create test about me content
    const testContent = {
      title: 'About Me',
      content: 'I am a passionate developer with expertise in modern web technologies.'
    };

    await db.insert(aboutMeTable)
      .values(testContent)
      .execute();

    const result = await getAboutMe();

    expect(result).not.toBeNull();
    expect(result!.title).toEqual(testContent.title);
    expect(result!.content).toEqual(testContent.content);
    expect(result!.id).toBeDefined();
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return the most recent about me content when multiple exist', async () => {
    // Create older content
    await db.insert(aboutMeTable)
      .values({
        title: 'Old About Me',
        content: 'This is old content.'
      })
      .execute();

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create newer content
    const newerContent = {
      title: 'Updated About Me',
      content: 'This is the most recent content about me.'
    };

    await db.insert(aboutMeTable)
      .values(newerContent)
      .execute();

    const result = await getAboutMe();

    expect(result).not.toBeNull();
    expect(result!.title).toEqual(newerContent.title);
    expect(result!.content).toEqual(newerContent.content);
  });

  it('should verify content is saved correctly in database', async () => {
    const testContent = {
      title: 'Test Title',
      content: 'Test content for verification.'
    };

    await db.insert(aboutMeTable)
      .values(testContent)
      .execute();

    // Verify content exists in database
    const dbContent = await db.select()
      .from(aboutMeTable)
      .execute();

    expect(dbContent).toHaveLength(1);
    expect(dbContent[0].title).toEqual(testContent.title);
    expect(dbContent[0].content).toEqual(testContent.content);
    expect(dbContent[0].updated_at).toBeInstanceOf(Date);
  });
});
