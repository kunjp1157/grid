
"use server";

import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import type { User } from "@/lib/types";

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
