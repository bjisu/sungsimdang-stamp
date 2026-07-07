"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useStore } from "@/lib/store";
import { BottomNav } from "./BottomNav";
import { Onboarding } from "./Onboarding";

/**
 * 앱 프레임: localStorage 로드 → 닉네임 유무 분기 (USER_FLOW 1장)
 * - 닉네임 없음(최초 방문) → 닉네임 설정 화면
 * - 닉네임 있음(재방문) → 메인/탭 화면 + 하단 내비게이션
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { ready, nickname } = useStore();

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Image
          src={logo}
          alt="성심당"
          priority
          className="h-auto w-[132px] opacity-70"
        />
      </div>
    );
  }

  if (!nickname) {
    return <Onboarding />;
  }

  return (
    <>
      <main className="min-h-dvh pb-24">{children}</main>
      <BottomNav />
    </>
  );
}
