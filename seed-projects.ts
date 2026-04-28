import { db } from './src/db';
import { projects } from './src/db/schema/projects';
import { eq } from 'drizzle-orm';
import fs from 'fs';

async function seed() {
  const rawData = fs.readFileSync('project.json', 'utf8');
  const projectList = JSON.parse(rawData);

  console.log(`Starting seed for ${projectList.length} projects...`);

  for (const projectData of projectList) {
    const { slug, ...rest } = projectData;
    
    // Trim slug to avoid accidental spaces from JSON
    const cleanSlug = slug.trim();

    const existing = await db.query.projects.findFirst({
      where: eq(projects.slug, cleanSlug)
    });

    if (existing) {
      console.log(`Updating existing project: ${projectData.title}`);
      await db.update(projects)
        .set({ ...rest, slug: cleanSlug })
        .where(eq(projects.id, existing.id));
    } else {
      console.log(`Inserting new project: ${projectData.title}`);
      await db.insert(projects).values({ ...rest, slug: cleanSlug });
    }
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
