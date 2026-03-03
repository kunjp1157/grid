
"use server";

import { getDb, saveDb } from "@/lib/local-db";
import { getUser } from "./auth";
import { ReportStatus, ReportPriority, type Report } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function submitReport(data: {
  type: any;
  description: string;
  latitude: number;
  longitude: number;
  priority?: ReportPriority;
}) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const db = await getDb();
  
  const newReport: Report = {
    id: `report-${Date.now()}`,
    userId: user.id,
    type: data.type,
    description: data.description,
    location: {
      lat: data.latitude,
      lng: data.longitude,
    },
    status: ReportStatus.New,
    priority: data.priority || ReportPriority.Medium,
    timestamp: new Date().toISOString(),
  };

  db.reports.unshift(newReport);
  await saveDb(db);
  
  revalidatePath('/dashboard/my-reports');
  revalidatePath('/admin/reports');
  
  return { success: true, report: newReport };
}

export async function getAllReports() {
  const db = await getDb();
  return db.reports;
}

export async function getUserReports(userId: string) {
  const db = await getDb();
  return db.reports.filter(r => r.userId === userId);
}
