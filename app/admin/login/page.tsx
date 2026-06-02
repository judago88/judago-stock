"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
        <h1 className="text-2xl font-bold">관리자 로그인</h1>

        <p className="text-sm text-muted-foreground">
          등록된 관리자 Google 계정으로 로그인해주세요.
        </p>

        <Button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          Google 계정으로 로그인
        </Button>
      </div>
    </main>
  );
}
