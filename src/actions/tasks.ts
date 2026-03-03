
"use server";

import { pool } from "@/lib/db";
import { getUser } from "./auth";
import { revalidatePath } from "next/cache";
import { TaskStatus } from "@/lib/types";

export async function getVolunteerTasks() {
  try {
    const [tasks]: any = await pool.execute("SELECT * FROM volunteer_tasks ORDER BY createdAt DESC");
    
    // Fetch assignments for each task
    for (const task of tasks) {
      const [assignments]: any = await pool.execute(
        "SELECT u.id as userId, u.name FROM volunteer_assignments va JOIN users u ON va.userId = u.id WHERE va.taskId = ?",
        [task.id]
      );
      task.volunteers = assignments;
      task.requiredSkills = task.requiredSkills ? task.requiredSkills.split(',') : [];
    }
    
    return tasks;
  } catch (error) {
    console.error("DB Error:", error);
    return [];
  }
}

export async function broadcastTask(data: any) {
  const user = await getUser();
  if (!user || user.role !== 'admin') throw new Error("Unauthorized");

  const id = `task-${Date.now()}`;
  try {
    await pool.execute(
      "INSERT INTO volunteer_tasks (id, title, description, location, requiredSkills, volunteersNeeded, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, data.title, data.description, data.location, data.requiredSkills.join(','), data.volunteersNeeded, TaskStatus.Open]
    );
    revalidatePath('/admin/dispatch');
    revalidatePath('/dashboard/tasks');
    return { success: true };
  } catch (error) {
    console.error("DB Error:", error);
    throw new Error("Failed to broadcast task");
  }
}

export async function acceptTask(taskId: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  try {
    await pool.execute(
      "INSERT IGNORE INTO volunteer_assignments (taskId, userId) VALUES (?, ?)",
      [taskId, user.id]
    );
    revalidatePath('/dashboard/tasks');
    return { success: true };
  } catch (error) {
    console.error("DB Error:", error);
    throw new Error("Failed to accept task");
  }
}
