"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import stampImg from "@/public/stamp.png";
import { useStore } from "@/lib/store";
import type { StampRecord } from "@/lib/types";
import { dateKey, formatTime } from "@/lib/format";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// S3 스탬프 내역 — 월 단위 달력 (PRD 3.3, USER_FLOW 3장)
export default function HistoryPage() {
  const { stamps } = useStore();
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState<string | null>(dateKey(now));

  // 날짜별 기록 그룹핑
  const byDay = useMemo(() => {
    const map = new Map<string, StampRecord[]>();
    for (const s of stamps) {
      const k = dateKey(new Date(s.at));
      const list = map.get(k) ?? [];
      list.push(s);
      map.set(k, list);
    }
    return map;
  }, [stamps]);

  const firstDow = new Date(cursor.y, cursor.m, 1).getDay();
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const todayKey = dateKey(now);

  // 해당 월 요약: 방문 N회(기록 있는 날짜 수) · 스탬프 N개 (PRD H-4)
  const monthStats = useMemo(() => {
    let visits = 0;
    let count = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const list = byDay.get(dateKey(new Date(cursor.y, cursor.m, d)));
      if (list?.length) {
        visits += 1;
        count += list.length;
      }
    }
    return { visits, count };
  }, [byDay, cursor, daysInMonth]);

  const move = (delta: number) => {
    setCursor(({ y, m }) => {
      const d = new Date(y, m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
    setSelected(null);
  };

  const selectedRecords = selected ? (byDay.get(selected) ?? []) : [];
  const selectedDay = selected ? Number(selected.split("-")[2]) : null;
  const selectedInMonth =
    selected?.startsWith(`${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}`) ?? false;

  return (
    <div className="px-5 pt-8 animate-fade">
      <header className="px-1 [text-shadow:0_0_5px_#faf4e6,0_0_10px_#faf4e6,0_1px_18px_#faf4e6]">
        <h1 className="font-maruburi text-[22px] font-bold tracking-tight text-brown">
          스탬프 내역
        </h1>
      </header>

      <section className="mt-5 rounded-2xl bg-paper p-4 shadow-card">
        {/* 월 이동 (PRD H-1) */}
        <div className="flex items-center justify-between px-1 pb-3">
          <ArrowButton dir="prev" onClick={() => move(-1)} />
          <p className="font-maruburi text-[19px] font-bold text-brown">
            {cursor.y}
            <span className="mx-0.5 text-latte">.</span>
            {cursor.m + 1}
          </p>
          <ArrowButton dir="next" onClick={() => move(1)} />
        </div>

        <div className="grid grid-cols-7 border-b border-line pb-2">
          {WEEKDAYS.map((w, i) => (
            <span
              key={w}
              className={`text-center text-[11.5px] font-medium ${
                i === 0 ? "text-ssred/70" : "text-latte"
              }`}
            >
              {w}
            </span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-y-1">
          {Array.from({ length: firstDow }).map((_, i) => (
            <span key={`pad-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const k = dateKey(new Date(cursor.y, cursor.m, day));
            const records = byDay.get(k);
            const isSelected = selected === k;
            const isToday = k === todayKey;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setSelected(k)}
                className={`flex h-[52px] flex-col items-center rounded-lg pt-1 transition-colors ${
                  isSelected ? "bg-cream ring-1 ring-ssred/35" : "active:bg-cream"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[12.5px] ${
                    isToday
                      ? "bg-brown font-bold text-cream"
                      : records
                        ? "font-bold text-brown"
                        : "text-brown-soft"
                  }`}
                >
                  {day}
                </span>
                {/* 적립이 있는 날짜 표시 (PRD H-2) — 날짜 아래 중앙의 인주색 점.
                    같은 날 여러 건이면 점을 최대 3개까지 나란히 표시 */}
                {records && (
                  <span className="mt-[5px] flex items-center justify-center gap-[3px]">
                    {Array.from({ length: Math.min(records.length, 3) }).map((_, d) => (
                      <span key={d} className="h-[5px] w-[5px] rounded-full bg-ssred/90" />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-3 border-t border-dashed border-line pt-3 text-center text-[12.5px] text-brown-soft">
          {monthStats.count > 0 ? (
            <>
              이번 달 방문{" "}
              <b className="font-serif-kr text-ssred">{monthStats.visits}</b>회 · 스탬프{" "}
              <b className="font-serif-kr text-ssred">{monthStats.count}</b>개
            </>
          ) : (
            "이 달에는 방문 기록이 없어요"
          )}
        </p>
      </section>

      {/* 날짜 상세 (PRD H-3) */}
      <section className="mt-4 pb-8">
        {selected && selectedInMonth ? (
          selectedRecords.length > 0 ? (
            <div className="overflow-hidden rounded-2xl bg-paper shadow-card">
              <p className="border-b border-line bg-parchment/60 px-5 py-3 text-[13px] font-bold text-brown">
                {cursor.m + 1}월 {selectedDay}일 ·{" "}
                <span className="text-ssred">{selectedRecords.length}개 적립</span>
              </p>
              <ul>
                {selectedRecords.map((r, i) => (
                  <li
                    key={r.id}
                    className={`flex items-center justify-between px-5 py-3.5 ${
                      i > 0 ? "border-t border-dashed border-line" : ""
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <MiniSeal large />
                      <span>
                        <span className="block text-[14.5px] font-bold text-brown">
                          {r.branch}
                        </span>
                        <span className="block text-[12px] text-brown-soft">
                          {formatTime(r.at)} 적립
                        </span>
                      </span>
                    </span>
                    <span className="font-serif-kr text-[12.5px] text-latte">
                      {r.seq}번째
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-line py-6 text-center text-[13px] text-latte">
              이 날은 방문 기록이 없어요
            </p>
          )
        ) : (
          <p className="py-4 text-center text-[12.5px] text-latte">
            날짜를 누르면 그날의 적립 내역을 볼 수 있어요
          </p>
        )}
      </section>
    </div>
  );
}

function ArrowButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir === "prev" ? "이전 달" : "다음 달"}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-brown-soft transition-colors active:bg-cream"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        style={{ transform: dir === "prev" ? "none" : "scaleX(-1)" }}
      >
        <path
          d="M14.5 5.5 8 12l6.5 6.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/** 달력용 미니 성심당 도장 마크 (stamp.png, 레드 인주 틴팅) */
function MiniSeal({ large = false }: { large?: boolean }) {
  const s = large ? 32 : 18;
  return (
    <Image
      src={stampImg}
      alt=""
      aria-hidden="true"
      sizes={`${s}px`}
      className="stamp-red h-auto"
      style={{ width: s }}
    />
  );
}
