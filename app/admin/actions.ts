"use server";

import { redirect } from "next/navigation";
import {
  createSupabaseServerClient,
  isSupabaseAuthConfigured,
} from "@/lib/supabase-server";
import { isSupabaseAdmin } from "@/lib/supabase-admin";

export type LoginState = {
  error?: string;
};

export async function signIn(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isSupabaseAuthConfigured()) {
    return {
      error: "Supabase is not configured. Check the server's .env.local file.",
    };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) {
    return { error: "The email or password is incorrect. Please try again." };
  }

  if (!isSupabaseAdmin(data.user)) {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      throw new Error(
        `Could not clear unauthorized Supabase session: ${signOutError.message}`,
      );
    }
    return {
      error:
        'Admin access requires the email in SUPABASE_ADMIN_EMAILS and app_metadata.role = "admin" in Supabase Auth. Update the user, then sign in again.',
    };
  }

  redirect("/admin");
}

export async function signOut() {
  if (isSupabaseAuthConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(`Supabase sign out failed: ${error.message}`);
    }
  }
  redirect("/admin/login");
}
