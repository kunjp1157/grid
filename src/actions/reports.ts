
"use server";

import { pool } from "@/lib/db";
import { getUser } from "./auth";
import { ReportStatus, ReportPriority, type Report } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function submitReport(data: {
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  priority?: ReportPriority;
}) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const id = `report-${Date.now()}`;
  const status = ReportStatus.New;
  const priority = data.priority || ReportPriority.Medium;
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    await pool.execute(
      "INSERT INTO reports (id, userId, type, description, lat, lng, status, priority, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, user.id, data.type, data.description, data.latitude, data.longitude, status, priority, timestamp]
    );
    
    revalidatePath('/dashboard/my-reports');
    revalidatePath('/admin/reports');
    
    return { success: true };
  } catch (error) {
    console.error("Database error during report submission:", error);
    throw new Error("Failed to save report");
  }
}

export async function getAllReports() {
  try {
    const [rows]: any = await pool.execute("SELECT * FROM reports ORDER BY timestamp DESC");
    return rows.map((r: any) => ({
        ...r,
        location: { lat: r.lat, lng: r.lng }
    }));
  } catch (error) {
    console.error("Database error fetching reports:", error);
    return [];
  }
}

export async function getUserReports(userId: string) {
  try {
    const [rows]: any = await pool.execute("SELECT * FROM reports WHERE userId = ? ORDER BY timestamp DESC", [userId]);
    return rows.map((r: any) => ({
        ...r,
        location: { lat: r.lat, lng: r.lng }
    }));
  } catch (error) {
    console.error("Database error fetching user reports:", error);
    return [];
  }
}
