/** "7월 5일" */
export function formatMonthDay(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/** "오후 2:35" */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const period = h < 12 ? "오전" : "오후";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${period} ${hour12}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** 로컬 기준 날짜 키 "2026-07-05" */
export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}
