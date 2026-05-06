"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  const supabase = createClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? null);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (email) {
    return (
      <div className="h-12 border-b border-border/50 bg-background">
        <div className="container mx-auto flex h-full items-center justify-end gap-2 px-4">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {email}
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={signOut}
            className="h-9 rounded-md border border-white/10 bg-[#0b0b0b] px-4 text-sm text-white hover:bg-[#151515]"
          >
            로그아웃
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-12 border-b border-border/50 bg-background">
      <div className="container mx-auto flex h-full items-center justify-end gap-2 px-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={signInWithGoogle}
          className="h-9 rounded-md border border-white/10 bg-[#0b0b0b] px-4 text-sm text-white hover:bg-[#151515]"
        >
          로그인
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={signInWithGoogle}
          className="h-9 rounded-md bg-white px-4 text-sm font-medium text-black hover:bg-neutral-200"
        >
          회원가입
        </Button>
      </div>
    </div>
  );
}
