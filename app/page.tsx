"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const ShaderBackground = dynamic(() => import("./shader-background"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 30% 30%, #ff7a33 0%, transparent 55%), radial-gradient(circle at 70% 70%, #33a0ff 0%, transparent 55%), #000",
      }}
    />
  ),
});

const wordmarkStyle = {
  fontFamily: "var(--font-display-heavy)",
  fontSize: "clamp(4rem, 18vw, 22rem)",
  letterSpacing: "-0.02em",
  lineHeight: 0.85,
};

export default function Home() {
  return (
    <section className="relative h-dvh w-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <ShaderBackground />
      </div>
      <div className="absolute inset-0 z-[1] bg-black/15 pointer-events-none" />

      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-10 py-5">
        <div className="flex items-center gap-3 text-white">
          <span className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase font-semibold text-white/70">
            Powered by
          </span>
          <Image
            src="/zostel-symbol-white.svg"
            alt="Zostel"
            width={150}
            height={157}
            className="h-6 w-auto"
          />
          <Image
            src="/zostel-wordmark.svg"
            alt="Zostel"
            width={390}
            height={50}
            className="h-3.5 w-auto"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>

        <button
          type="button"
          className="group inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/10 px-5 py-2.5 text-white text-[11px] tracking-[0.2em] uppercase font-semibold backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
        >
          Hit the flow
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </button>
      </header>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
        <h1
          className="text-white whitespace-nowrap drop-shadow-[0_4px_30px_rgba(0,0,0,0.35)]"
          style={wordmarkStyle}
        >
          Feelz
        </h1>
        <div className="mt-4 sm:mt-6 flex items-center gap-3 sm:gap-4">
          <span className="text-white/85 text-[11px] sm:text-[13px] tracking-[0.32em] uppercase font-semibold">
            by
          </span>
          <Image
            src="/Mindcafe.png"
            alt="Mindcafe"
            width={1366}
            height={566}
            priority
            className="h-7 sm:h-9 md:h-11 w-auto"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>

        <a
          href="#shop"
          className="pointer-events-auto group mt-8 sm:mt-10 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-black text-[11px] sm:text-[12px] tracking-[0.28em] uppercase font-bold shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition-all hover:shadow-[0_12px_50px_rgba(0,0,0,0.4)] hover:-translate-y-0.5"
        >
          Hit the flow
          <span
            aria-hidden
            className="grid h-6 w-6 place-items-center rounded-full bg-black text-white text-[10px] transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </a>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-30 px-6 sm:px-10 flex items-end justify-between gap-6 text-white">
        <p className="text-[12px] leading-relaxed max-w-[18rem] opacity-80">
          Fast-dissolving oral thin films for focus, calm, and social vitality.
          One strip on the tongue. No water needed.
        </p>

        <a
          href="#"
          className="rounded-full border border-white/40 px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold transition hover:bg-white/10"
        >
          @feelsmindcafe
        </a>
      </div>
    </section>
  );
}
