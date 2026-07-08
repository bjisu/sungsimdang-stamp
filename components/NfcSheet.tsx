"use client";

import { useEffect, useState } from "react";
import { resolveStore } from "@/lib/config";
import { useStore } from "@/lib/store";
import type { StampRecord } from "@/lib/types";
import { Portal } from "./Portal";

/**
 * NFC 스탬프 적립 시트 (하이브리드)
 * - 안드로이드 크롬: Web NFC(NDEFReader)로 태그 스캔 → URL의 store 코드 검증 후 적립
 * - 아이폰 등 미지원 기기: 기기 자체 NFC 태깅 안내 (태그의 URL로 접속해 적립 — /stamp 경로)
 */
type Phase = "scanning" | "unsupported" | "unknown" | "duplicate";

export function NfcSheet({
  onSuccess,
  onClose,
}: {
  onSuccess: (record: StampRecord) => void;
  onClose: () => void;
}) {
  const { addStampSafe } = useStore();
  // Web NFC 지원 판별: 'NDEFReader' in window
  const [phase, setPhase] = useState<Phase>(() =>
    typeof window !== "undefined" && "NDEFReader" in window
      ? "scanning"
      : "unsupported",
  );

  useEffect(() => {
    if (phase !== "scanning") return;
    const ctrl = new AbortController();
    let stopped = false;

    const handleTagUrl = (raw: string) => {
      let code: string | null = null;
      try {
        code = new URL(raw).searchParams.get("store");
      } catch {
        /* URL이 아닌 태그 */
      }
      const branch = resolveStore(code);
      if (!branch) {
        setPhase("unknown");
        return;
      }
      const res = addStampSafe(branch);
      if (!res.ok) {
        setPhase("duplicate");
        return;
      }
      stopped = true;
      ctrl.abort();
      onSuccess(res.record);
    };

    (async () => {
      try {
        // eslint 없음 — Web NFC는 표준 타입 정의가 없어 any로 사용
        const reader = new (window as unknown as { NDEFReader: new () => any }).NDEFReader();
        reader.onreading = (event: any) => {
          if (stopped) return;
          const records: any[] = Array.from(event.message?.records ?? []);
          const urlRecord = records.find(
            (r) => r.recordType === "url" || r.recordType === "absolute-url",
          );
          if (!urlRecord) {
            setPhase("unknown");
            return;
          }
          handleTagUrl(new TextDecoder().decode(urlRecord.data));
        };
        reader.onreadingerror = () => {
          if (!stopped) setPhase("unknown");
        };
        await reader.scan({ signal: ctrl.signal });
      } catch {
        // 권한 거부·스캔 실패 등
        if (!stopped) setPhase("unknown");
      }
    })();

    return () => {
      stopped = true;
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex justify-center" role="dialog" aria-modal="true">
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute inset-0 bg-brown/40 backdrop-blur-[2px] animate-fade"
        />
        <div className="absolute bottom-0 w-full max-w-[430px] rounded-t-3xl bg-paper px-6 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-3 text-center shadow-sheet animate-sheet-up">
          <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-line" />

          {phase === "scanning" && (
            <>
              <NfcWaves active />
              <h2 className="mt-5 font-maruburi text-[19px] font-bold text-brown">
                NFC 스탬프에 휴대폰을 갖다 대주세요
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-brown-soft">
                휴대폰 뒷면을 매장 스탬프에 가까이 대면
                <br />
                자동으로 적립돼요.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-7 w-full rounded-xl border border-line py-3.5 text-[15px] font-medium text-brown-soft transition-colors active:bg-cream"
              >
                취소
              </button>
            </>
          )}

          {phase === "unsupported" && (
            <>
              <NfcWaves />
              <h2 className="mt-5 font-maruburi text-[19px] font-bold leading-snug text-brown">
                휴대폰을 매장의 NFC 스탬프에
                <br />
                직접 갖다 대주세요
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-brown-soft">
                알림이 뜨면 눌러서 적립을 완료할 수 있어요.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-7 w-full rounded-xl bg-ssred py-3.5 text-[15px] font-bold text-paper shadow-card transition-colors active:bg-ssred-deep"
              >
                확인
              </button>
            </>
          )}

          {phase === "unknown" && (
            <>
              <p className="text-[40px] leading-none">🥖</p>
              <h2 className="mt-4 font-maruburi text-[19px] font-bold text-brown">
                인식할 수 없는 스탬프예요
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-brown-soft">
                성심당 매장의 NFC 스탬프가 맞는지 확인하고
                <br />
                다시 시도해 주세요.
              </p>
              <div className="mt-7 flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-line py-3.5 text-[15px] font-medium text-brown-soft transition-colors active:bg-cream"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={() => setPhase("scanning")}
                  className="flex-1 rounded-xl bg-ssred py-3.5 text-[15px] font-bold text-paper shadow-card transition-colors active:bg-ssred-deep"
                >
                  다시 시도
                </button>
              </div>
            </>
          )}

          {phase === "duplicate" && (
            <>
              <p className="text-[40px] leading-none">✅</p>
              <h2 className="mt-4 font-maruburi text-[19px] font-bold text-brown">
                방금 적립되었어요
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-brown-soft">
                같은 지점은 1분에 한 번만 적립할 수 있어요.
                <br />
                잠시 후 다시 시도해 주세요.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-7 w-full rounded-xl bg-ssred py-3.5 text-[15px] font-bold text-paper shadow-card transition-colors active:bg-ssred-deep"
              >
                확인
              </button>
            </>
          )}
        </div>
      </div>
    </Portal>
  );
}

/** 휴대폰 + 전파 아이콘 (스캔 중이면 물결이 퍼지는 애니메이션) */
function NfcWaves({ active = false }: { active?: boolean }) {
  return (
    <div className="relative mx-auto mt-1 flex h-[104px] w-[104px] items-center justify-center">
      {active && (
        <>
          <span className="absolute inset-2 animate-nfc-pulse rounded-full bg-ssred/15" />
          <span className="absolute inset-5 animate-nfc-pulse rounded-full bg-ssred/20 [animation-delay:0.4s]" />
        </>
      )}
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-ssred/10">
        {/* 전파 arc가 잘리지 않도록 viewBox에 여유 폭 확보 */}
        <svg width="34" height="30" viewBox="0 0 27 24" fill="none" className="text-ssred">
          <rect
            x="6"
            y="3.5"
            width="10"
            height="17"
            rx="2.2"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path d="M9.5 17.8h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path
            d="M19 8.5a6 6 0 0 1 0 7M21.5 6.5a9.5 9.5 0 0 1 0 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      </span>
    </div>
  );
}
