
import fs from 'fs/promises';
import path from 'path';
import { users as initialUsers, reports as initialReports, zones as initialZones, barterPosts as initialBarter, resources as initialResources, tasks as initialTasks } from './data';
import type { User, Report, Zone, BarterPost, CommunityResource, VolunteerTask } from './types';

const DB_PATH = path.join(process.cwd(), 'database.json');

interface LocalDB {
  users: User[];
  reports: Report[];
  zones: Zone[];
  barterPosts: BarterPost[];
  resources: CommunityResource[];
  tasks: VolunteerTask[];
}

export async function getDb(): Promise<LocalDB> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, initialize with mock data from data.ts
    const initialDb: LocalDB = {
      users: initialUsers,
      reports: initialReports,
      zones: initialZones,
      barterPosts: initialBarter,
      resources: initialResources,
      tasks: initialTasks,
    };
    await saveDb(initialDb);
    return initialDb;
  }
}

export async function saveDb(db: LocalDB): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}
