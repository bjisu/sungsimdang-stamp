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
