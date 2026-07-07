// 스탬프 기록 — 적립 일시 + 지점명 + 순번 (PRD 6장)
export interface StampRecord {
  id: string;
  branch: string;
  /** ISO 8601 적립 일시 */
  at: string;
  /** 누적 순번 (1부터) */
  seq: number;
}
