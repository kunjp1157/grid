
"use server";

import { pool } from "@/lib/db";
import { getUser } from "./auth";
import { revalidatePath } from "next/cache";
import type { CommunityResource } from "@/lib/types";

export async function submitResource(data: {
  type: string;
  description: string;
  latitude: number;
  longitude: number;
}) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const id = `res-${Date.now()}`;
  try {
    await pool.execute(
      "INSERT INTO community_resources (id, userId, type, description, lat, lng) VALUES (?, ?, ?, ?, ?, ?)",
      [id, user.id, data.type, data.description, data.latitude, data.longitude]
    );
    revalidatePath('/dashboard/resources');
    return { success: true };
  } catch (error) {
    console.error("DB Error:", error);
    throw new Error("Failed to save resource");
  }
}

export async function getAllResources(): Promise<CommunityResource[]> {
  try {
    const [rows]: any = await pool.execute("SELECT * FROM community_resources ORDER BY timestamp DESC");
    return rows.map((r: any) => ({
      ...r,
      location: { lat: Number(r.lat), lng: Number(r.lng) }
    }));
  } catch (error) {
    console.error("DB Error:", error);
    return [];
  }
}
