
"use server";

import { cookies } from "next/headers";
import { users } from "@/lib/data";
import type { User } from "@/lib/types";

export async function login(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string || "").toLowerCase();
  // Note: Password is not checked in this mock setup.
  const user = users.find(u => u.email.toLowerCase() === email);

  if (!user) {
    return { error: "Invalid credentials. Please try again." };
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
    return { redirectTo: "/admin" };
  } else {
    return { redirectTo: "/dashboard" };
  }
}

export async function signup(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string || "").toLowerCase();
  // New users are always created as citizens
  const role = "citizen";

  if (users.find(u => u.email.toLowerCase() === email)) {
    return { error: "User with this email already exists." };
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    role,
  };

  users.push(newUser);

  const userCookie = JSON.stringify({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  });

  cookies().set("user", userCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  // New users are always citizens, so they will be redirected to the dashboard.
  return { redirectTo: "/dashboard" };
}


export async function logout() {
  cookies().delete("user");
  // This redirect is safe because it's a simple server action not tied to a form state
  const { redirect } = await import("next/navigation");
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
