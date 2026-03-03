"use server";

import { cookies } from "next/headers";
import { users } from "@/lib/data";
import type { User } from "@/lib/types";

export async function login(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string || "").toLowerCase();
  // Note: For prototype, we check against local mock data. 
  // In full integration, client-side Firebase Auth is preferred.
  const user = users.find(u => u.email.toLowerCase() === email);

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
}

export async function signup(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string || "").toLowerCase();
  const role = "citizen";

  if (users.find(u => u.email.toLowerCase() === email)) {
    return { error: "signup.error.userExists" };
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    role,
  };

  // Mock addition
  users.push(newUser);

  const userCookie = JSON.stringify({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  });

  const cookieStore = await cookies();
  cookieStore.set("user", userCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  return { redirectTo: "/dashboard" };
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
