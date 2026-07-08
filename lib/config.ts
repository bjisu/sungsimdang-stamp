// 스탬프 판 총 칸 수 — 보상 구조 미정이므로 10칸 기본 (PRD M-7)
// 보상 정책 확정 시 이 값만 바꾸면 판 크기가 전체 화면에 반영된다.
export const BOARD_SIZE = 10;

// 지점 목록 — 데모용 코드 내 고정 (PRD 6장)
export const BRANCHES = [
  "본점",
  "DCC점",
  "롯데백화점 대전점",
  "대전역점",
  "케익부띠끄",
] as const;

export type Branch = (typeof BRANCHES)[number];

/**
 * NFC 지점 코드 매핑 테이블 — 현재 본점만 활성화.
 * 지점 추가 시 아래에 한 줄만 추가하면 된다.
 * 예) dcc: "DCC점", lotte: "롯데백화점 대전점", station: "대전역점", cake: "케익부띠끄"
 */
export const STORE_CODES: Record<string, string> = {
  mainstore: "본점",
};

/** 지점 코드 → 지점명. 미등록 코드는 null */
export function resolveStore(code: string | null | undefined): string | null {
  if (!code) return null;
  return STORE_CODES[code] ?? null;
}

/** 같은 지점 중복 적립 방지 시간 (1분) */
export const DUP_WINDOW_MS = 60_000;
