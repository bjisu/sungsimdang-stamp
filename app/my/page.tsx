"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import logo from "@/public/logo.png";
import { NICKNAME_MAX, useStore, validateNickname } from "@/lib/store";
import { dateKey } from "@/lib/format";

// S4 마이페이지 (PRD 3.4, USER_FLOW 4장)
export default function MyPage() {
  const { nickname, stamps, setNickname } = useStore();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);

  // 총 방문일 = 기록이 있는 날짜 수(같은 날 중복 적립은 1일), 누적 스탬프 = 전체 기록 수 (PRD Y-3)
  const visitDays = useMemo(
    () => new Set(stamps.map((s) => dateKey(new Date(s.at)))).size,
    [stamps],
  );

  const error = validateNickname(value);
  const showError = editing && value.length > 0 && error !== null;

  const startEdit = () => {
    setValue(nickname ?? "");
    setEditing(true);
    setSaved(false);
  };

  const save = () => {
    if (error) return;
    setNickname(value);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="px-5 pt-8 animate-fade">
      <header className="px-1 [text-shadow:0_0_5px_#faf4e6,0_0_10px_#faf4e6,0_1px_18px_#faf4e6]">
        <h1 className="font-maruburi text-[22px] font-bold tracking-tight text-brown">
          마이페이지
        </h1>
      </header>

      {/* 닉네임 표시 + 변경 (PRD Y-1, Y-2) */}
      <section className="mt-5 rounded-2xl bg-paper p-5 shadow-card">
        <div className="flex items-center gap-4">
          <Image
            src={logo}
            alt="성심당"
            className="h-auto w-[76px] shrink-0"
          />
          <div className="min-w-0 flex-1">
            {!editing ? (
              <>
                <p className="truncate font-maruburi text-[20px] font-bold text-brown">
                  {nickname}
                  <span className="ml-1 text-[14px] font-normal text-brown-soft">님</span>
                </p>
                <p className="mt-0.5 text-[12px] text-latte">
                  성심당과 함께한 발걸음이 쌓이고 있어요
                </p>
              </>
            ) : (
              <input
                type="text"
                value={value}
                maxLength={NICKNAME_MAX + 2}
                autoFocus
                placeholder="1~10자, 공백만은 안 돼요"
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && save()}
                className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-[15px] text-brown placeholder:text-latte focus:border-ssred focus:outline-none focus:ring-2 focus:ring-ssred/15"
              />
            )}
          </div>
          {!editing ? (
            <button
              type="button"
              onClick={startEdit}
              className="shrink-0 rounded-lg border border-line px-3 py-2 text-[12.5px] font-medium text-brown-soft transition-colors active:bg-cream"
            >
              변경
            </button>
          ) : (
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg border border-line px-2.5 py-2 text-[12.5px] text-brown-soft active:bg-cream"
              >
                취소
              </button>
              <button
                type="button"
                disabled={error !== null}
                onClick={save}
                className="rounded-lg bg-ssred px-3 py-2 text-[12.5px] font-bold text-paper active:bg-ssred-deep disabled:bg-latte/60"
              >
                저장
              </button>
            </div>
          )}
        </div>
        {/* 오류/저장 메시지 — 있을 때만 렌더링해 박스 하단 여백이 남지 않게 */}
        {(showError || saved) && (
          <p className="mt-2.5 text-[12px] text-ssred">
            {showError ? error : "변경되었어요 ✓"}
          </p>
        )}
      </section>

      {/* 누적 요약 (PRD Y-3) */}
      <section className="mt-4 grid grid-cols-2 gap-3">
        <StatCard label="누적 스탬프" value={stamps.length} unit="개" />
        <StatCard label="총 방문일" value={visitDays} unit="일" />
      </section>

      {/* 로그인/계정 — 준비 중 자리 확보 (PRD Y-4) */}
      <section className="mt-4 rounded-2xl bg-paper shadow-card">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[14.5px] font-bold text-brown">로그인 · 계정 연동</p>
            <p className="mt-0.5 text-[12px] text-brown-soft">
              연동하면 기기가 바뀌어도 기록이 유지돼요
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-line bg-parchment px-2.5 py-1 text-[11px] font-medium text-brown-soft">
            준비 중
          </span>
        </div>
      </section>

      <div className="pb-8" />
    </div>
  );
}

function StatCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="rounded-2xl bg-paper px-5 py-4 shadow-card">
      <p className="text-[12px] text-brown-soft">{label}</p>
      <p className="mt-1.5 font-serif-kr leading-none text-brown">
        <span className="text-[28px] font-bold">{value}</span>
        <span className="ml-0.5 text-[14px] text-brown-soft">{unit}</span>
      </p>
    </div>
  );
}
