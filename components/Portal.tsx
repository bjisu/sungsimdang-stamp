"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * 오버레이(모달·바텀시트)를 body로 포털.
 * 페이지 진입 애니메이션(opacity)이 만드는 스태킹 컨텍스트에 갇혀
 * 하단 내비게이션 아래로 깔리는 문제를 방지한다.
 */
export function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
