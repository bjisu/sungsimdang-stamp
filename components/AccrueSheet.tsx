"use client";

import { BRANCHES } from "@/lib/config";
import { Portal } from "./Portal";

/**
 * (데모용) 적립 지점 선택 바텀시트 — 전 지점 목록에서 선택 또는 랜덤 (USER_FLOW 2장).
 * 실제 서비스에서는 NFC 태그 접촉 → 지점 URL 접속이 이 단계를 대신한다.
 */
export function AccrueSheet({
  onPick,
  onClose,
}: {
  onPick: (branch: string) => void;
  onClose: () => void;
}) {
  const pickRandom = () => {
    onPick(BRANCHES[Math.floor(Math.random() * BRANCHES.length)]);
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-50 flex justify-center" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-brown/40 backdrop-blur-[2px] animate-fade"
      />
      <div className="absolute bottom-0 w-full max-w-[430px] rounded-t-3xl bg-paper px-6 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-3 shadow-sheet animate-sheet-up">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line" />
        <h2 className="font-serif-kr text-[19px] font-bold text-brown">
          어느 지점에 방문하셨나요?
        </h2>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-brown-soft">
          데모 화면입니다 · 실제 서비스에서는 매장의 NFC 스탬프에
          <br />폰을 태깅하면 지점이 자동으로 인식돼요.
        </p>

        <ul className="mt-5 overflow-hidden rounded-xl border border-line">
          {BRANCHES.map((branch, i) => (
            <li key={branch} className={i > 0 ? "border-t border-line" : ""}>
              <button
                type="button"
                onClick={() => onPick(branch)}
                className="flex w-full items-center justify-between bg-paper px-4 py-3.5 text-left transition-colors active:bg-cream"
              >
                <span className="flex items-center gap-3">
                  <StorefrontMark />
                  <span className="text-[15px] font-medium text-brown">{branch}</span>
                </span>
                <span className="text-latte">›</span>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={pickRandom}
          className="mt-3 w-full rounded-xl border border-dashed border-ssred/40 bg-ssred/5 py-3.5 text-[14px] font-bold text-ssred transition-colors active:bg-ssred/10"
        >
          아무 지점이나 (랜덤 적립)
        </button>
      </div>
    </div>
    </Portal>
  );
}

function StorefrontMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-latte">
      <path
        d="M4.5 9.8 5.6 5h12.8l1.1 4.8M4.5 9.8v9.7a.9.9 0 0 0 .9.9h13.2a.9.9 0 0 0 .9-.9V9.8M4.5 9.8h15M9.5 20.4v-5.5h5v5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
