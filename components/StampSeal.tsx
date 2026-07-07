"use client";

import { useId } from "react";

/**
 * 붉은 인주 도장 느낌의 빵 스탬프 (PRD 4장 — 스탬프 비주얼).
 * feTurbulence 변위로 도장 특유의 거친 잉크 가장자리를 표현한다.
 */
export function StampSeal({
  size = 56,
  seed = 3,
  className = "",
}: {
  size?: number;
  seed?: number;
  className?: string;
}) {
  const uid = useId();
  const fid = `ink-${uid}`;
  const gid = `pad-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <filter id={fid} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.55"
            numOctaves="2"
            seed={seed}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" />
        </filter>
        <radialGradient id={gid} cx="42%" cy="36%" r="72%">
          <stop offset="0%" stopColor="#cc4530" />
          <stop offset="62%" stopColor="#bd3826" />
          <stop offset="100%" stopColor="#992a1c" />
        </radialGradient>
      </defs>

      <g filter={`url(#${fid})`}>
        {/* 인주 원판 */}
        <circle cx="32" cy="32" r="29" fill={`url(#${gid})`} />
        {/* 안쪽 음각 링 */}
        <circle
          cx="32"
          cy="32"
          r="24.5"
          fill="none"
          stroke="#faf4e6"
          strokeWidth="1.6"
          opacity="0.9"
        />
        {/* 빵(캄파뉴) 글리프 — 음각 */}
        <g stroke="#faf4e6" strokeWidth="2.6" strokeLinecap="round" fill="none">
          <path d="M17.5 36.5c0-7.6 6.5-13 14.5-13s14.5 5.4 14.5 13c0 3.4-2.5 5.5-6.2 5.5H23.7c-3.7 0-6.2-2.1-6.2-5.5Z" />
          {/* 칼집 세 줄 */}
          <path d="M24.5 29.5l3.4 3.6" />
          <path d="M30.4 27.6l3.4 3.6" />
          <path d="M36.3 29.5l3.4 3.6" />
        </g>
        {/* 좌우 점 장식 */}
        <circle cx="12.5" cy="32" r="1.6" fill="#faf4e6" opacity="0.85" />
        <circle cx="51.5" cy="32" r="1.6" fill="#faf4e6" opacity="0.85" />
      </g>
    </svg>
  );
}

/** 스탬프 판의 빈 칸 — 은은한 빵 실루엣 자리표시 */
export function EmptySlot({
  size = 56,
  index,
  className = "",
}: {
  size?: number;
  index: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="32"
        cy="32"
        r="28.5"
        fill="none"
        stroke="#d9c9a6"
        strokeWidth="1.4"
        strokeDasharray="3.5 4.5"
        strokeLinecap="round"
      />
      <g stroke="#ddcfae" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d="M18.5 33.5c0-7 6-12 13.5-12s13.5 5 13.5 12c0 3.1-2.3 5-5.7 5H24.2c-3.4 0-5.7-1.9-5.7-5Z" />
      </g>
      <text
        x="32"
        y="50"
        textAnchor="middle"
        fontSize="9.5"
        fontFamily="var(--font-serif-kr)"
        fill="#c9b98f"
      >
        {index}
      </text>
    </svg>
  );
}
