
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createContactSubmissionInputSchema, 
  createProjectInputSchema, 
  createSkillInputSchema 
} from './schema';

// Import handlers
import { createContactSubmission } from './handlers/create_contact_submission';
import { getContactSubmissions } from './handlers/get_contact_submissions';
import { createProject } from './handlers/create_project';
import { getProjects } from './handlers/get_projects';
import { getFeaturedProjects } from './handlers/get_featured_projects';
import { createSkill } from './handlers/create_skill';
import { getSkills } from './handlers/get_skills';
import { getSkillsByCategory } from './handlers/get_skills_by_category';
import { getAboutMe } from './handlers/get_about_me';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Contact form submissions
  createContactSubmission: publicProcedure
    .input(createContactSubmissionInputSchema)
    .mutation(({ input }) => createContactSubmission(input)),
  
  getContactSubmissions: publicProcedure
    .query(() => getContactSubmissions()),

  // Projects management
  createProject: publicProcedure
    .input(createProjectInputSchema)
    .mutation(({ input }) => createProject(input)),
  
  getProjects: publicProcedure
    .query(() => getProjects()),
  
  getFeaturedProjects: publicProcedure
    .query(() => getFeaturedProjects()),

  // Skills management
  createSkill: publicProcedure
    .input(createSkillInputSchema)
    .mutation(({ input }) => createSkill(input)),
  
  getSkills: publicProcedure
    .query(() => getSkills()),
  
  getSkillsByCategory: publicProcedure
    .input(z.enum(['frontend', 'backend', 'database', 'devops', 'tools', 'other']))
    .query(({ input }) => getSkillsByCategory(input)),

  // About me content
  getAboutMe: publicProcedure
    .query(() => getAboutMe()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Portfolio TRPC server listening at port: ${port}`);
}

start();
