"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { StampRecord } from "./types";

// 백엔드 미사용 — 모든 데이터는 브라우저 localStorage에 보관 (PRD 5장)
const NICKNAME_KEY = "ssd.nickname";
const STAMPS_KEY = "ssd.stamps";

export const NICKNAME_MAX = 10;

/** 닉네임 유효성: 1~10자, 공백만 입력 불가 (PRD Y-2) */
export function validateNickname(raw: string): string | null {
  const name = raw.trim();
  if (name.length === 0) return "닉네임을 입력해 주세요.";
  if (name.length > NICKNAME_MAX) return `닉네임은 ${NICKNAME_MAX}자 이내로 입력해 주세요.`;
  return null;
}

interface StoreValue {
  /** localStorage 로드 완료 여부 (SSR 하이드레이션 안전장치) */
  ready: boolean;
  nickname: string | null;
  stamps: StampRecord[];
  setNickname: (name: string) => void;
  addStamp: (branch: string) => StampRecord;
}

const StoreContext = createContext<StoreValue | null>(null);

function loadStamps(): StampRecord[] {
  try {
    const raw = localStorage.getItem(STAMPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [nickname, setNicknameState] = useState<string | null>(null);
  const [stamps, setStamps] = useState<StampRecord[]>([]);
  const stampsRef = useRef<StampRecord[]>([]);

  useEffect(() => {
    setNicknameState(localStorage.getItem(NICKNAME_KEY));
    const loaded = loadStamps();
    stampsRef.current = loaded;
    setStamps(loaded);
    setReady(true);
  }, []);

  const setNickname = useCallback((name: string) => {
    const trimmed = name.trim();
    localStorage.setItem(NICKNAME_KEY, trimmed);
    setNicknameState(trimmed);
  }, []);

  const addStamp = useCallback((branch: string) => {
    const created: StampRecord = {
      id: crypto.randomUUID(),
      branch,
      at: new Date().toISOString(),
      seq: stampsRef.current.length + 1,
    };
    const next = [...stampsRef.current, created];
    stampsRef.current = next;
    localStorage.setItem(STAMPS_KEY, JSON.stringify(next));
    setStamps(next);
    return created;
  }, []);

  return (
    <StoreContext.Provider value={{ ready, nickname, stamps, setNickname, addStamp }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
