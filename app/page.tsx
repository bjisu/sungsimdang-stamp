"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useStore } from "@/lib/store";
import type { StampRecord } from "@/lib/types";
import { formatMonthDay } from "@/lib/format";
import { StampBoard } from "@/components/StampBoard";
import { AccrueSheet } from "@/components/AccrueSheet";
import { NfcSheet } from "@/components/NfcSheet";
import { StampModal } from "@/components/StampModal";

// S1 메인 화면 (PRD 3.1)
export default function HomePage() {
  const { nickname, stamps, addStamp } = useStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [nfcOpen, setNfcOpen] = useState(false);
  const [justStamped, setJustStamped] = useState<StampRecord | null>(null);

  const total = stamps.length;
  const recent = total > 0 ? stamps[total - 1] : null;

  // (데모용) 스탬프 적립 시뮬레이션 트리거 (PRD M-6)
  // 실제 서비스에서는 매장 NFC 태그 접촉 → 지점 URL 접속으로 대체된다.
  const handlePick = (branch: string) => {
    setSheetOpen(false);
    setJustStamped(addStamp(branch));
  };

  return (
    <div className="animate-fade">
      <div className="px-5 pt-7">
      {/* 로고 — 카드 밖, 배경 위 좌측 상단 (멤버십 앱 헤더 톤).
          배경 일러스트에 묻히지 않게 크림색 글로우를 은은하게 깔아준다. */}
      <Image
        src={logo}
        alt="성심당 — 1956 이래, 대한민국 대전"
        priority
        className="ml-1 h-auto w-[112px] [filter:drop-shadow(0_0_4px_#faf4e6)_drop-shadow(0_0_9px_#faf4e6)_drop-shadow(0_0_16px_#faf4e6)]"
      />

      {/* 인사말 카드 (PRD M-4) */}
      <header className="mt-5 rounded-2xl bg-paper/90 px-5 py-4 shadow-card backdrop-blur-[2px]">
        <h1 className="font-maruburi text-[21px] font-bold leading-snug tracking-tight text-brown">
          {nickname}님, 안녕하세요
        </h1>
        <p className="mt-0.5 text-[13px] text-brown-soft">
          오늘도 성심당과 따뜻한 하루 보내세요.
        </p>
      </header>

      {/* 보유 스탬프 개수 (PRD M-1) */}
      <section className="mt-4 flex items-end justify-between rounded-2xl bg-ssred px-6 py-5 text-paper shadow-card">
        <div>
          <p className="text-[12.5px] font-medium text-paper/80">내 스탬프</p>
          <p className="mt-1 font-maruburi leading-none">
            <span className="text-[44px] font-bold">{total}</span>
            <span className="ml-1 text-[17px]">개</span>
          </p>
        </div>
        {/* 최근 방문 지점 (PRD M-3) */}
        <div className="max-w-[55%] text-right">
          <p className="text-[11.5px] text-paper/70">최근 방문</p>
          <p className="mt-1 text-[13.5px] font-bold leading-snug">
            {recent
              ? `${recent.branch} · ${formatMonthDay(recent.at)} 방문`
              : "아직 방문 기록이 없어요"}
          </p>
        </div>
      </section>

      {/* 스탬프 판 (PRD M-2) */}
      <div className="mt-4">
        <StampBoard total={total} />
      </div>

      {/* NFC 스탬프 적립 — 안드로이드는 Web NFC 스캔, 아이폰은 태깅 안내 (하이브리드) */}
      <button
        type="button"
        onClick={() => setNfcOpen(true)}
        className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl bg-brown py-4 text-[15.5px] font-bold text-cream shadow-card transition-colors active:bg-brown/85"
      >
        <TagIcon />
        스탬프 적립하기
      </button>
      <p className="mt-2.5 text-center text-[11.5px] font-medium text-brown-soft [text-shadow:0_1px_6px_rgba(250,244,230,0.9)]">
        매장의 NFC 스탬프에 휴대폰을 갖다 대면 적립돼요
      </p>

      {/* (개발 확인용) 적립 시뮬레이션 (PRD M-6) — 정식 오픈 시 제거 */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="mx-auto mb-8 mt-5 block text-center text-[11px] text-latte underline underline-offset-2"
      >
        데모 · 지점 선택 시뮬레이션
      </button>
      </div>

      {nfcOpen && (
        <NfcSheet
          onSuccess={(record) => {
            setNfcOpen(false);
            setJustStamped(record);
          }}
          onClose={() => setNfcOpen(false)}
        />
      )}
      {sheetOpen && (
        <AccrueSheet onPick={handlePick} onClose={() => setSheetOpen(false)} />
      )}
      {justStamped && (
        <StampModal record={justStamped} onClose={() => setJustStamped(null)} />
      )}
    </div>
  );
}

function TagIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4.5c3.6 0 6.5 2.9 6.5 6.5m-6.5-3a3.5 3.5 0 0 1 3.5 3.5M6 13.2l5.1 5.1a2 2 0 0 0 2.8 0l3.4-3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.8" cy="12.4" r="2.3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
