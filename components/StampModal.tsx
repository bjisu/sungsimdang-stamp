"use client";

import { useEffect, useState } from "react";
import type { StampRecord } from "@/lib/types";
import { formatMonthDay } from "@/lib/format";
import Image from "next/image";
import stampImg from "@/public/stamp.png";
import { Portal } from "./Portal";

/**
 * 스탬프 적립 팝업 (PRD 3.2, USER_FLOW 2장)
 * 도장 찍기 모션 → 잉크 번짐 → 문구 등장 순서로 재생.
 * 닫기 버튼 또는 배경 탭으로 닫힘.
 */
export function StampModal({
  record,
  onClose,
}: {
  record: StampRecord;
  onClose: () => void;
}) {
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLanded(true), 480);
    return () => clearTimeout(t);
  }, []);

  return (
    <Portal>
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-8"
      role="dialog"
      aria-modal="true"
      aria-label="스탬프 적립 완료"
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-brown/50 backdrop-blur-[3px] animate-fade"
      />

      <div className="relative w-full max-w-[330px] rounded-3xl bg-paper px-7 pb-8 pt-10 text-center shadow-frame animate-paper-thud">
        {/* 종이 카드 안쪽 라인 */}
        <div className="pointer-events-none absolute inset-3 rounded-2xl border border-line" />

        <div className="relative mx-auto flex h-[132px] w-[132px] items-center justify-center">
          {/* 잉크 번짐 링 */}
          <span className="absolute inset-0 rounded-full border-[3px] border-ssred/50 animate-ink-burst" />
          <span className="absolute inset-4 rounded-full bg-ssred/15 animate-ink-burst" />
          {/* 도장 본체 — 위에서 쾅 찍히는 모션 */}
          <div className="animate-stamp-press">
            <Image
              src={stampImg}
              alt="성심당 도장"
              priority
              sizes="116px"
              className="stamp-red h-auto w-[112px] drop-shadow-md"
            />
          </div>
        </div>

        <div
          className={`transition-all duration-500 ${
            landed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <h2 className="mt-5 font-maruburi text-[22px] font-bold text-brown">
            스탬프가 적립되었어요!
          </h2>
          <p className="mt-2.5 text-[14px] text-brown-soft">
            {record.branch} · {formatMonthDay(record.at)}
          </p>
          <p className="mt-4 inline-block rounded-full bg-ssred/8 px-4 py-1.5 font-serif-kr text-[15px] font-bold text-ssred">
            {record.seq}번째 스탬프
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-7 w-full rounded-xl bg-ssred py-3.5 text-[15px] font-bold text-paper shadow-card transition-colors active:bg-ssred-deep"
          >
            확인
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}
