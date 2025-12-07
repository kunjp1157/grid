"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { users } from "@/lib/data";
import type { User } from "@/lib/types";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const role = formData.get("role") as "citizen" | "admin";

  const user = users.find(u => u.email === email && u.role === role);

  if (!user) {
    return { error: "Invalid credentials" };
  }

  const userCookie = JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  cookies().set("user", userCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  if (user.role === "admin") {
    redirect("/admin");
  } else {
    redirect("/dashboard");
  }
}

export async function logout() {
  cookies().delete("user");
  redirect("/");
}

export async function getUser(): Promise<User | null> {
    const userCookie = cookies().get('user')?.value;
    if (userCookie) {
        try {
            return JSON.parse(userCookie) as User;
        } catch (error) {
            return null;
        }
    }
    return null;
}
