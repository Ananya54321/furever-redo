// user utils

// import { cookies } from "next/headers"; // for server-side cookie management

import Cookies from "js-cookie"; // for client-side cookie management
import { redirect } from "next/navigation";

export function getUser() {
  const token = Cookies.get("token");
  const user = Cookies.get("user");

  if (!user) {
    return new Error("User not found");
  }

  return JSON.parse(user);
}

export async function logout() {
  Cookies.remove("token");
  Cookies.remove("user");
  redirect("/login");
}
