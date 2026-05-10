"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30분
// const AUTO_LOGOUT_TIME = 10 * 1000; // 10초

export function AutoLogout() {
  const supabase = createClient();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const logout = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      await supabase.auth.signOut();
      alert("일정 시간 동안 활동이 없어 자동 로그아웃되었습니다.");
      window.location.href = "/";
    };

    const resetTimer = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      clearTimer();

      if (!session) return;

      timer = setTimeout(logout, AUTO_LOGOUT_TIME);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      clearTimer();

      if (session) {
        timer = setTimeout(logout, AUTO_LOGOUT_TIME);
      }
    });

    return () => {
      clearTimer();
      subscription.unsubscribe();

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [supabase]);

  return null;
}
