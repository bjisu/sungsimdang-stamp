import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { Gowun_Batang, Noto_Sans_KR } from "next/font/google";
import localFont from "next/font/local";
import bg from "@/public/bg.png";
import { StoreProvider } from "@/lib/store";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

// 세리프 계열 숫자·타이틀 강조 ("1956" 헤리티지 느낌) + 본문 고딕 (PRD 4장)
const gowun = Gowun_Batang({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gowun",
});

const noto = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto",
});

// 커스텀 세리프 — 타이틀·중요 텍스트 전용 (font-maruburi)
const maruburi = localFont({
  src: [
    { path: "../public/font/MaruBuriOTF/MaruBuri-ExtraLight.otf", weight: "200", style: "normal" },
    { path: "../public/font/MaruBuriOTF/MaruBuri-Light.otf", weight: "300", style: "normal" },
    { path: "../public/font/MaruBuriOTF/MaruBuri-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/font/MaruBuriOTF/MaruBuri-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../public/font/MaruBuriOTF/MaruBuri-Bold.otf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-maruburi-local",
});

export const metadata: Metadata = {
  title: "성심당 스탬프",
  description: "성심당 방문 스탬프 적립 — 1956년부터, 대전의 빵집",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#faf4e6",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${gowun.variable} ${noto.variable} ${maruburi.variable}`}>
      <body className="paper-bg">
        {/* 모바일 웹 우선(375~430px) — 데스크톱에서는 모바일 폭 중앙 정렬 (PRD 5장) */}
        <div className="relative z-0 mx-auto min-h-dvh w-full max-w-[430px] bg-cream shadow-frame">
          {/* 공통 배경 일러스트 — 뷰포트에 고정되어 스크롤해도 유지.
              bg-cream은 이미지 로딩 전 fallback으로 남겨둔다. */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-y-0 left-1/2 -z-10 w-full max-w-[430px] -translate-x-1/2"
          >
            <Image
              src={bg}
              alt=""
              fill
              priority
              placeholder="blur"
              sizes="430px"
              className="object-cover"
            />
          </div>
          <StoreProvider>
            <AppShell>{children}</AppShell>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
