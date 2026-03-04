"use server";

import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import type { User } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function login(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string || "").toLowerCase();
  
  try {
    const [rows]: any = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user) {
      return { error: "login.error.invalid" };
    }

    const userCookie = JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set("user", userCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    if (user.role === "admin") {
      return { redirectTo: "/admin" };
    } else {
      return { redirectTo: "/dashboard" };
    }
  } catch (error) {
    console.error("Database error during login:", error);
    return { error: "login.error.unknown" };
  }
}

export async function signup(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string || "").toLowerCase();
  const role = "citizen";
  const id = `user-${Date.now()}`;

  try {
    const [existing]: any = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return { error: "signup.error.userExists" };
    }

    await pool.execute(
      "INSERT INTO users (id, name, email, role, isVolunteer) VALUES (?, ?, ?, ?, ?)",
      [id, name, email, role, false]
    );

    const userCookie = JSON.stringify({ id, name, email, role });

    const cookieStore = await cookies();
    cookieStore.set("user", userCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { redirectTo: "/dashboard" };
  } catch (error) {
    console.error("Database error during signup:", error);
    return { error: "signup.error.unknown" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("user");
  const { redirect } = await import("next/navigation");
  redirect("/");
}

export async function getUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user')?.value;
    if (userCookie) {
        try {
            return JSON.parse(userCookie) as User;
        } catch (error) {
            return null;
        }
    }
    return null;
}

export async function updateUserProfile(userData: User) {
  try {
    const skillsString = Array.isArray(userData.skills) ? userData.skills.join(',') : userData.skills || '';
    
    await pool.execute(
      `UPDATE users SET 
        name = ?, 
        email = ?, 
        mobile = ?, 
        address = ?, 
        pincode = ?, 
        bloodGroup = ?, 
        emergencyContactName = ?, 
        emergencyContactNumber = ?, 
        medicalConditions = ?, 
        isVolunteer = ?, 
        skills = ?, 
        certifications = ? 
      WHERE id = ?`,
      [
        userData.name,
        userData.email,
        userData.mobile || null,
        userData.address || null,
        userData.pincode || null,
        userData.bloodGroup || null,
        userData.emergencyContactName || null,
        userData.emergencyContactNumber || null,
        userData.medicalConditions || null,
        userData.isVolunteer ? 1 : 0,
        skillsString,
        userData.certifications || null,
        userData.id
      ]
    );

    // Update the cookie with new info
    const updatedUserJson = JSON.stringify({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });

    const cookieStore = await cookies();
    cookieStore.set("user", updatedUserJson, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    revalidatePath('/dashboard/profile');
    revalidatePath('/admin/profile');
    
    return { success: true };
  } catch (error) {
    console.error("Database error during profile update:", error);
    throw new Error("Failed to update profile");
  }
}
