"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "@/public/logo.png";
import stampImg from "@/public/stamp.png";
import { NICKNAME_MAX, useStore, validateNickname } from "@/lib/store";

// 최초 방문 닉네임 설정 (USER_FLOW 1장) — 로그인 없이 닉네임만으로 시작
export function Onboarding() {
  const { setNickname } = useStore();
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const error = validateNickname(value);
  const showError = touched && value.length > 0 && error !== null;

  const submit = () => {
    if (error) return;
    setNickname(value);
  };

  return (
    <div className="flex min-h-dvh flex-col px-7 pb-12 pt-20 animate-fade">
      <header className="flex flex-col items-center text-center">
        {/* 닉네임 설정 화면에서만 검정(차콜) 톤 — 다른 화면의 레드 도장에는 영향 없음 */}
        <Image
          src={stampImg}
          alt="성심당 도장"
          priority
          sizes="88px"
          className="h-auto w-[88px] -rotate-6 opacity-85 drop-shadow-sm [filter:brightness(0)]"
        />
        <Image
          src={logo}
          alt="성심당 — 1956 이래, 대한민국 대전"
          priority
          className="mt-8 h-auto w-[168px]"
        />
        <h1 className="mt-5 font-maruburi text-[26px] font-bold leading-snug text-brown">
          성심당에서 부를
          <br />
          이름을 알려주세요
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-brown-soft">
          로그인 없이 닉네임만으로 시작해요.
          <br />
          매장에 방문할 때마다 스탬프가 쌓입니다.
        </p>
      </header>

      <div className="mt-12">
        <label
          htmlFor="nickname"
          className="mb-2 block text-[13px] font-medium text-brown-soft"
        >
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          value={value}
          maxLength={NICKNAME_MAX + 2}
          placeholder="1~10자로 입력해 주세요"
          autoComplete="off"
          onChange={(e) => {
            setValue(e.target.value);
            setTouched(true);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full rounded-xl border border-line bg-paper px-4 py-3.5 text-[16px] text-brown placeholder:text-latte focus:border-ssred focus:outline-none focus:ring-2 focus:ring-ssred/15"
        />
        {/* 유효하지 않으면 오류 문구 노출 + 저장 비활성화 (USER_FLOW 1장 예외) */}
        <p
          className={`mt-2 min-h-[18px] text-[12.5px] ${
            showError ? "text-ssred" : "text-transparent"
          }`}
        >
          {showError ? error : "."}
        </p>
      </div>

      <div className="mt-auto pt-10">
        <button
          type="button"
          disabled={error !== null}
          onClick={submit}
          className="w-full rounded-xl bg-ssred py-4 text-[16px] font-bold text-paper shadow-card transition-colors duration-150 active:bg-ssred-deep disabled:bg-latte disabled:text-paper"
        >
          시작하기
        </button>
        <p className="mx-auto mt-4 w-fit rounded-full bg-cream/90 px-4 py-1.5 text-center text-[11.5px] font-medium leading-relaxed text-brown-soft backdrop-blur-[2px]">
          닉네임과 스탬프 기록은 이 브라우저에만 저장됩니다.
        </p>
      </div>
    </div>
  );
}
