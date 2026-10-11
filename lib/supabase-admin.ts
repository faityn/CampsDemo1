import type { User } from "@supabase/supabase-js";

export function isSupabaseAdmin(user: User | null | undefined) {
  if (!user?.email || user.app_metadata.role !== "admin") {
    return false;
  }

  const allowedEmails = (process.env.SUPABASE_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(user.email.toLowerCase());
}
