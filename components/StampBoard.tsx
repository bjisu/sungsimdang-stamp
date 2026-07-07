"use client";

import Image from "next/image";
import stampImg from "@/public/stamp.png";
import { BOARD_SIZE } from "@/lib/config";

// 도장마다 미묘하게 다른 기울기 — 손으로 찍은 느낌
const TILTS = [-7, 5, -4, 8, -6, 3, -8, 6, -3, 7];

/**
 * 스탬프 판 (PRD M-2, M-7) — 채워진 칸/빈 칸 구분.
 * 판(10칸)이 가득 차면 새 판으로 넘어가고 누적 개수는 계속 증가 (USER_FLOW 2장 예외).
 */
export function StampBoard({ total }: { total: number }) {
  const filled = total === 0 ? 0 : ((total - 1) % BOARD_SIZE) + 1;
  const boardNo = total === 0 ? 1 : Math.floor((total - 1) / BOARD_SIZE) + 1;

  return (
    <section className="rounded-2xl bg-paper p-4 shadow-card">
      {/* 이중 라인 프레임 — 정갈한 복고 티켓 느낌 */}
      <div className="rounded-xl border border-line p-4">
        <div className="mb-4 flex items-baseline justify-between border-b border-dashed border-line pb-3">
          <h2 className="font-maruburi text-[14px] font-bold tracking-tight text-brown">
            나의 스탬프 판
          </h2>
          <span className="font-serif-kr text-[12px] text-latte">
            {boardNo}번째 판 · {filled}/{BOARD_SIZE}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-x-2 gap-y-4">
          {Array.from({ length: BOARD_SIZE }, (_, i) => {
            const slot = i + 1;
            const isFilled = slot <= filled;
            return (
              <div key={slot} className="flex items-center justify-center">
                {isFilled ? (
                  <div style={{ transform: `rotate(${TILTS[i]}deg)` }}>
                    <Image
                      src={stampImg}
                      alt="적립된 스탬프"
                      sizes="56px"
                      className="stamp-red h-auto w-[54px] opacity-95 drop-shadow-sm"
                    />
                  </div>
                ) : (
                  // 빈 칸 — 도장이 찍힐 자리를 희미한 고스트 도장으로 표시
                  <div className="relative">
                    <Image
                      src={stampImg}
                      alt=""
                      sizes="56px"
                      className="h-auto w-[54px] opacity-[0.12]"
                    />
                    <span className="absolute inset-0 flex items-center justify-center font-serif-kr text-[13px] text-latte">
                      {slot}
                    </span>
                  </div>
                )}
                {isFilled && <span className="sr-only">{slot}번째 칸 적립됨</span>}
              </div>
            );
          })}
        </div>

        <p className="mt-4 border-t border-dashed border-line pt-3 text-center text-[12px] leading-relaxed text-brown-soft">
          {total === 0
            ? "첫 스탬프를 찍어보세요 — 갓 구운 이야기가 시작됩니다"
            : filled === BOARD_SIZE
              ? "판이 가득 찼어요! 다음 적립부터 새 판이 시작됩니다"
              : `${BOARD_SIZE - filled}개 더 모으면 이 판이 완성돼요`}
        </p>
      </div>
    </section>
  );
}
