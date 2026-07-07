"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 하단 내비게이션: 홈 / 스탬프 내역 / 마이페이지 — 모든 화면 상시 노출 (PRD M-5)
const TABS = [
  { href: "/", label: "홈", icon: HomeIcon },
  { href: "/history", label: "스탬프 내역", icon: CalendarIcon },
  { href: "/my", label: "마이페이지", icon: UserIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center">
      <div className="pointer-events-auto w-full max-w-[430px] border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="grid grid-cols-3">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 pb-2.5 pt-3"
              >
                <Icon
                  className={active ? "text-ssred" : "text-latte"}
                  filled={active}
                />
                <span
                  className={`text-[11px] leading-none tracking-tight ${
                    active ? "font-bold text-ssred" : "text-brown-soft"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function HomeIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 10.2 12 3.8l8 6.4V20a1 1 0 0 1-1 1h-4.6v-5.6h-4.8V21H5a1 1 0 0 1-1-1v-9.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.12 : 0}
      />
    </svg>
  );
}

function CalendarIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15.5"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.12 : 0}
      />
      <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M8 3v3.4M16 3v3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="14.8" r="1.7" fill="currentColor" />
    </svg>
  );
}

function UserIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
      <circle
        cx="12"
        cy="8.2"
        r="3.7"
        stroke="currentColor"
        strokeWidth="1.7"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.12 : 0}
      />
      <path
        d="M4.8 20.2c1.1-3.4 3.9-5.2 7.2-5.2s6.1 1.8 7.2 5.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
