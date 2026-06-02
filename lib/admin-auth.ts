import { createClient } from "@/lib/supabase/client";

export async function getCurrentAdmin() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (adminError || !admin) {
    return null;
  }

  return admin;
}