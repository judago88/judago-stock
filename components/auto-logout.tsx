"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30분
// const AUTO_LOGOUT_TIME = 10 * 1000; // 10초

export function AutoLogout() {
  const supabase = createClient();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const logout = async () => {
      await supabase.auth.signOut();
      alert("일정 시간 동안 활동이 없어 자동 로그아웃되었습니다.");
      window.location.href = "/";
    };

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, AUTO_LOGOUT_TIME);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [supabase]);

  return null;
}
