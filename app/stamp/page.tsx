"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resolveStore } from "@/lib/config";
import { useStore } from "@/lib/store";
import type { StampRecord } from "@/lib/types";
import { StampModal } from "@/components/StampModal";

/**
 * NFC 태그 URL 적립 경로 — /stamp?store=mainstore (아이폰 등 Web NFC 미지원 기기용)
 * 태그에 이 URL을 기록하면: 태깅 → 알림 탭 → 접속 → 자동 적립.
 * - 닉네임 미설정 사용자는 AppShell이 먼저 닉네임 설정을 띄우고, 완료 후 이어서 적립된다.
 * - 유효하지 않은 store 값이면 적립 없이 홈으로 이동.
 */
export default function StampPage() {
  // useSearchParams는 Suspense 경계가 필요 (Next.js App Router)
  return (
    <Suspense fallback={null}>
      <StampAccrue />
    </Suspense>
  );
}

function StampAccrue() {
  const router = useRouter();
  const params = useSearchParams();
  const { addStampSafe } = useStore();
  const [record, setRecord] = useState<StampRecord | null>(null);
  const [duplicate, setDuplicate] = useState(false);
  const processed = useRef(false);

  const branch = resolveStore(params.get("store"));

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    if (!branch) {
      // 미등록 지점 코드 → 적립 없이 홈으로
      router.replace("/");
      return;
    }
    const res = addStampSafe(branch);
    if (res.ok) {
      setRecord(res.record);
    } else {
      setDuplicate(true);
    }
  }, [branch, addStampSafe, router]);

  useEffect(() => {
    if (!duplicate) return;
    const t = setTimeout(() => router.replace("/"), 2400);
    return () => clearTimeout(t);
  }, [duplicate, router]);

  return (
    <div className="flex min-h-[70dvh] items-center justify-center px-8 animate-fade">
      {duplicate && (
        <div className="w-full rounded-2xl bg-paper/95 px-6 py-8 text-center shadow-card">
          <p className="text-[36px] leading-none">✅</p>
          <h1 className="mt-4 font-maruburi text-[19px] font-bold text-brown">
            방금 적립되었어요
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-brown-soft">
            같은 지점은 1분에 한 번만 적립할 수 있어요.
            <br />
            홈으로 이동합니다…
          </p>
        </div>
      )}
      {record && (
        <StampModal record={record} onClose={() => router.replace("/")} />
      )}
    </div>
  );
}
