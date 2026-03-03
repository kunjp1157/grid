
"use server";

import { pool } from "@/lib/db";
import { getUser } from "./auth";
import { revalidatePath } from "next/cache";

export async function createBarterPost(data: { have: string; need: string }) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const id = `barter-${Date.now()}`;
  try {
    await pool.execute(
      "INSERT INTO barter_posts (id, userId, have, need) VALUES (?, ?, ?, ?)",
      [id, user.id, data.have, data.need]
    );
    revalidatePath('/dashboard/barter');
    return { success: true };
  } catch (error) {
    console.error("DB Error:", error);
    throw new Error("Failed to create post");
  }
}

export async function getBarterPosts() {
  try {
    const [rows]: any = await pool.execute(`
      SELECT b.*, u.name as userName, u.email as userEmail 
      FROM barter_posts b 
      JOIN users u ON b.userId = u.id 
      ORDER BY b.timestamp DESC
    `);
    return rows;
  } catch (error) {
    console.error("DB Error:", error);
    return [];
  }
}
