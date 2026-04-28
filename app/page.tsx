"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  PACK_FACTS,
  PROPERTIES,
  VARIANTS,
  type Property,
  type Variant,
  type VariantId,
} from "./_feelz/data";
import { FeelzMark, VariantPill, dottedBg } from "./_feelz/visuals";
import { ProductCard, type WaitlistPayload } from "./_feelz/product-card";
import { PropertiesDrawer } from "./_feelz/properties-drawer";
import { BundleStrip, FootDisclaim } from "./_feelz/bundle";
import { fetchProperties } from "@/lib/properties";

const TWEAKS = {
  packStyle: "flat" as const,
  layout: "grid" as const,
  motion: 70,
  tintBg: true,
};

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function mixWith(a: string, b: string, t: number) {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const r = Math.round(pa.r * (1 - t) + pb.r * t);
  const g = Math.round(pa.g * (1 - t) + pb.g * t);
  const bl = Math.round(pa.b * (1 - t) + pb.b * t);
  return `rgb(${r},${g},${bl})`;
}

const PILL_FLOAT_DELAYS = [
  "5.5s ease-in-out infinite",
  "6s ease-in-out infinite",
  "5s ease-in-out infinite",
  "6.5s ease-in-out infinite",
];

type PillPos = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  rotate: number;
};
const PILL_POSITIONS: PillPos[] = [
  { top: "16%", left: "5%", rotate: -14 },
  { top: "12%", right: "5%", rotate: 12 },
  { bottom: "20%", left: "8%", rotate: -10 },
  { bottom: "22%", right: "6%", rotate: 10 },
];

const MOBILE_PILL_TILTS = [-6, 4, -3, 5];

export default function Home() {
  const [expanded, setExpanded] = useState<VariantId | null>(null);
  const [propsOpen, setPropsOpen] = useState(false);
  const [propsFocus, setPropsFocus] = useState<VariantId | null>(null);
  const [hoverVariant, setHoverVariant] = useState<VariantId | null>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [heroIdx, setHeroIdx] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [properties, setProperties] = useState<Property[]>(PROPERTIES);
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProperties()
      .then((rows) => {
        if (!cancelled && rows.length > 0) setProperties(rows);
      })
      .catch((err) => {
        console.warn("[feelz] property fetch failed, using seed:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIdx((i) => (i + 1) % VARIANTS.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const m = window.matchMedia("(max-width: 820px)");
    const cb = (e: MediaQueryListEvent) => setMobile(e.matches);
    setMobile(m.matches);
    m.addEventListener("change", cb);
    return () => m.removeEventListener("change", cb);
  }, []);

  useEffect(() => {
    if (!TWEAKS.tintBg) {
      document.body.style.backgroundColor = "#fef9f3";
      return;
    }
    const active = hoverVariant || expanded;
    if (!active) {
      document.body.style.backgroundColor = "#fef9f3";
      return;
    }
    const v = VARIANTS.find((x) => x.id === active);
    if (v) {
      document.body.style.backgroundColor = mixWith("#fef9f3", v.gradA, 0.08);
    }
  }, [hoverVariant, expanded]);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      const idx = Math.round(el.scrollLeft / w);
      setCarouselIdx(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [mobile]);

  function scrollToCarouselIdx(i: number) {
    const el = railRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  function openProperties(v: Variant | null) {
    setPropsFocus(v ? v.id : null);
    setPropsOpen(true);
  }

  function joinWaitlist(payload: WaitlistPayload) {
    if (typeof console !== "undefined") {
      console.log("[feelz] waitlist join:", payload);
    }
  }

  const useCarousel = mobile;
  const heroVariant = VARIANTS[heroIdx];

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(254,249,243,0.78)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <FeelzMark size={32} />
            <span
              className="serif"
              style={{
                fontSize: 14,
                fontStyle: "italic",
                opacity: 0.55,
                color: "#1a0f0a",
              }}
            >
              by{" "}
              <span
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontStyle: "normal",
                  fontSize: 13,
                }}
              >
                mindcafé
              </span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <a
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "#1a0f0a",
                opacity: 0.7,
              }}
            >
              moods
            </a>
            <a
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "#1a0f0a",
                opacity: 0.5,
              }}
            >
              about
            </a>
            <a
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "#1a0f0a",
                opacity: 0.5,
              }}
            >
              science
            </a>
            <button
              onClick={() => openProperties(null)}
              className="display push"
              style={{
                background: "#1a0f0a",
                color: "#fff7ec",
                border: "none",
                padding: "10px 18px",
                borderRadius: 999,
                fontSize: 14,
                cursor: "pointer",
                textTransform: "lowercase",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </span>
              find a zostel
              <span
                className="mono"
                style={{
                  background: "#fff7ec",
                  color: "#1a0f0a",
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                }}
              >
                {properties.length}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <section
        style={{
          position: "relative",
          marginTop: 32,
          background: "#FFC107",
          borderRadius: 28,
          padding: mobile ? "60px 24px 70px" : "80px 48px 100px",
          overflow: "hidden",
          minHeight: mobile ? 560 : 640,
          color: "#1a0f0a",
        }}
      >
          {VARIANTS.map((v, i) => (
            <div
              key={v.id}
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(180deg, ${v.gradA} 0%, ${v.gradB} 100%)`,
                opacity: heroIdx === i ? 1 : 0,
                transition: "opacity 1400ms ease-in-out",
                zIndex: 0,
              }}
            />
          ))}

          <style>{`
            .hero-ink { color: ${heroVariant.inkOn}; transition: color 1400ms ease-in-out; }
            .hero-border { border-color: ${heroVariant.inkOn} !important; transition: border-color 1400ms ease-in-out; }
            .hero-bg-ink { background: ${heroVariant.inkOn} !important; transition: background 1400ms ease-in-out; }
          `}</style>

          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: dottedBg("rgba(0,0,0,0.06)"),
              pointerEvents: "none",
            }}
          />

          {!mobile &&
            VARIANTS.map((v, i) => {
              const pos = PILL_POSITIONS[i];
              return (
                <div
                  key={v.id}
                  style={
                    {
                      position: "absolute",
                      top: pos.top,
                      bottom: pos.bottom,
                      left: pos.left,
                      right: pos.right,
                      transform: `rotate(${pos.rotate}deg)`,
                      animation: `float ${PILL_FLOAT_DELAYS[i]}`,
                      "--r": `${pos.rotate}deg`,
                    } as React.CSSProperties
                  }
                >
                  <VariantPill v={v} />
                </div>
              );
            })}

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: 760,
              margin: "0 auto",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
            }}
          >
            <div
              className="mono hero-ink"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 18px",
                borderRadius: 999,
                border: "1.5px solid currentColor",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                position: "relative",
                zIndex: 2,
              }}
            >
              <span
                className="hero-bg-ink"
                style={{ width: 6, height: 6, borderRadius: 999 }}
              />
              incubated at zo world · distributed by zostel
            </div>

            <h1
              className="display feelz-mark"
              style={{
                fontSize: "clamp(110px, 18vw, 240px)",
                lineHeight: 1.0,
                letterSpacing: "-0.05em",
                margin: 0,
                padding: 0,
                color: "#fff7ec",
                textShadow: "0 6px 0 rgba(0,0,0,0.10)",
                position: "relative",
                zIndex: 2,
              }}
            >
              feelz
            </h1>

            <div
              className="serif hero-ink"
              style={{
                fontStyle: "italic",
                fontSize: "clamp(20px, 2vw, 26px)",
                lineHeight: 1,
                marginTop: -8,
                marginBottom: 8,
                opacity: 0.95,
                position: "relative",
                zIndex: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: "0.7em",
                  letterSpacing: "0.08em",
                  textTransform: "lowercase",
                  opacity: 0.7,
                }}
              >
                by
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontStyle: "normal",
                  textTransform: "lowercase",
                  letterSpacing: "-0.01em",
                  fontSize: "1em",
                }}
              >
                mindcafé
              </span>
            </div>

            <p
              className="serif hero-ink"
              style={{
                fontSize: "clamp(20px, 2.2vw, 28px)",
                lineHeight: 1.3,
                margin: 0,
                maxWidth: 540,
                opacity: 0.92,
                position: "relative",
                zIndex: 2,
              }}
            >
              a paper-thin strip. sixty seconds on the tongue. four moods, on
              demand.
            </p>

            <button
              onClick={() => {
                const grid = document.getElementById("shop-grid");
                if (grid)
                  window.scrollTo({
                    top: grid.offsetTop - 80,
                    behavior: "smooth",
                  });
              }}
              className="display push"
              style={{
                marginTop: 12,
                background: "#fff7ec",
                color: "#1a0f0a",
                border: "1.5px solid #1a0f0a",
                padding: "18px 32px",
                borderRadius: 999,
                fontSize: 16,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                boxShadow: "0 6px 0 rgba(0,0,0,0.18)",
                position: "relative",
                zIndex: 2,
              }}
            >
              find a zostel ↗
            </button>
          </div>

          {mobile && (
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "center",
                marginTop: 36,
              }}
            >
              {VARIANTS.map((v, i) => (
                <div
                  key={v.id}
                  style={{ transform: `rotate(${MOBILE_PILL_TILTS[i]}deg)` }}
                >
                  <VariantPill v={v} small />
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 18,
              display: "flex",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
              padding: "0 24px",
              zIndex: 2,
            }}
          >
            {["fssaI ✓", "no sugar", "no water needed", "made in india"].map(
              (f) => (
                <span
                  key={f}
                  className="mono"
                  style={{
                    background: "rgba(255,247,236,0.7)",
                    border: "1px solid rgba(0,0,0,0.18)",
                    padding: "7px 14px",
                    borderRadius: 999,
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  {f}
                </span>
              ),
            )}
          </div>
      </section>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
        <div id="shop-grid" style={{ height: 1 }} />

        {useCarousel ? (
          <section style={{ position: "relative", marginTop: 16 }}>
            <div
              ref={railRef}
              className="scroll-snap-x no-scrollbar"
              style={{
                display: "flex",
                gap: 16,
                overflowX: "auto",
                padding: "20px 0",
                margin: "0 -28px",
                paddingLeft: 28,
                paddingRight: 28,
              }}
            >
              {VARIANTS.map((v) => (
                <div
                  key={v.id}
                  className="snap-center"
                  onMouseEnter={() => setHoverVariant(v.id)}
                  onMouseLeave={() => setHoverVariant(null)}
                  style={{
                    flex: "0 0 calc(100% - 0px)",
                    maxWidth: 520,
                    minWidth: 280,
                  }}
                >
                  <ProductCard
                    variant={v}
                    properties={properties}
                    expanded={expanded === v.id}
                    onToggle={() =>
                      setExpanded((e) => (e === v.id ? null : v.id))
                    }
                    onFindIt={openProperties}
                    onWaitlist={joinWaitlist}
                    packStyle={TWEAKS.packStyle}
                    motion={TWEAKS.motion}
                  />
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 14,
                marginTop: 12,
              }}
            >
              <button
                onClick={() =>
                  scrollToCarouselIdx(Math.max(0, carouselIdx - 1))
                }
                className="mono push"
                style={{
                  background: "#1a0f0a",
                  color: "#fff7ec",
                  border: "none",
                  borderRadius: 999,
                  width: 40,
                  height: 40,
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ←
              </button>
              {VARIANTS.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => scrollToCarouselIdx(i)}
                  style={{
                    width: carouselIdx === i ? 28 : 10,
                    height: 10,
                    borderRadius: 999,
                    background:
                      carouselIdx === i
                        ? `linear-gradient(90deg, ${v.gradA}, ${v.gradB})`
                        : "rgba(0,0,0,0.18)",
                    border: "none",
                    cursor: "pointer",
                    transition: "width 220ms ease",
                  }}
                />
              ))}
              <button
                onClick={() =>
                  scrollToCarouselIdx(
                    Math.min(VARIANTS.length - 1, carouselIdx + 1),
                  )
                }
                className="mono push"
                style={{
                  background: "#1a0f0a",
                  color: "#fff7ec",
                  border: "none",
                  borderRadius: 999,
                  width: 40,
                  height: 40,
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                →
              </button>
            </div>
          </section>
        ) : (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 28,
              marginTop: 24,
            }}
          >
            {VARIANTS.map((v) => (
              <div
                key={v.id}
                onMouseEnter={() => setHoverVariant(v.id)}
                onMouseLeave={() => setHoverVariant(null)}
                style={{
                  gridColumn: expanded === v.id ? "1 / -1" : "auto",
                  transition: "grid-column 0ms",
                }}
              >
                <ProductCard
                  variant={v}
                  properties={properties}
                  expanded={expanded === v.id}
                  onToggle={() =>
                    setExpanded((e) => (e === v.id ? null : v.id))
                  }
                  onFindIt={openProperties}
                  onWaitlist={joinWaitlist}
                  packStyle={TWEAKS.packStyle}
                  motion={TWEAKS.motion}
                />
              </div>
            ))}
          </section>
        )}

        <section
          style={{
            marginTop: 80,
            overflow: "hidden",
            borderTop: "1px solid rgba(0,0,0,0.12)",
            borderBottom: "1px solid rgba(0,0,0,0.12)",
            padding: "20px 0",
          }}
        >
          <div
            className="marquee-track"
            style={{ display: "flex", whiteSpace: "nowrap", gap: 28 }}
          >
            {[0, 1].map((dup) => (
              <Fragment key={dup}>
                {[
                  ...PACK_FACTS,
                  "dissolves in 60s",
                  "made in india",
                  "no sugar · no swallowing",
                  "made by mindcafe",
                ].map((t, i) => (
                  <span
                    key={`${dup}-${i}`}
                    className="display"
                    style={{
                      fontSize: 56,
                      textTransform: "lowercase",
                      opacity: 0.85,
                    }}
                  >
                    {t}{" "}
                    <span
                      className="serif"
                      style={{ opacity: 0.5, margin: "0 16px" }}
                    >
                      ✦
                    </span>
                  </span>
                ))}
              </Fragment>
            ))}
          </div>
        </section>

        <BundleStrip
          onFindAll={() => openProperties(null)}
          properties={properties}
        />

        <section style={{ marginTop: 60, position: "relative" }}>
          <div
            style={{
              background: "#fff7ec",
              border: "1.5px solid #b1121f",
              borderRadius: 24,
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "200px 1fr",
              boxShadow: "0 12px 30px rgba(177,18,31,0.18)",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(160deg, #ff4d4d 0%, #d6263b 45%, #8a0e1e 100%)",
                color: "#fff7ec",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 180,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  backgroundImage:
                    "repeating-linear-gradient(135deg, #1a0f0a 0 10px, #ffd400 10px 20px)",
                  opacity: 0.85,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: dottedBg("rgba(255,255,255,0.10)"),
                  pointerEvents: "none",
                }}
              />
              <div
                className="display"
                style={{
                  fontSize: 36,
                  lineHeight: 0.95,
                  textTransform: "lowercase",
                  position: "relative",
                  textShadow: "0 2px 0 rgba(0,0,0,0.18)",
                }}
              >
                heads
                <br />
                up.
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  opacity: 0.85,
                  marginTop: 24,
                  position: "relative",
                }}
              >
                fine print · ⚠
              </div>
            </div>

            <div style={{ padding: "28px 32px", color: "#1a0f0a" }}>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
                  gap: "18px 32px",
                }}
              >
                <li>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      opacity: 0.5,
                      marginBottom: 6,
                    }}
                  >
                    01
                  </div>
                  <div
                    className="serif"
                    style={{ fontSize: 19, lineHeight: 1.3 }}
                  >
                    not for medicinal use.
                  </div>
                </li>
                <li>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      opacity: 0.5,
                      marginBottom: 6,
                    }}
                  >
                    02
                  </div>
                  <div
                    className="serif"
                    style={{ fontSize: 19, lineHeight: 1.3 }}
                  >
                    not for children, pregnant women, or those under 18.
                  </div>
                </li>
                <li>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      opacity: 0.5,
                      marginBottom: 6,
                    }}
                  >
                    03
                  </div>
                  <div
                    className="serif"
                    style={{ fontSize: 19, lineHeight: 1.3 }}
                  >
                    consult a physician if you take other medication or have a
                    medical condition.
                  </div>
                </li>
                <li>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      opacity: 0.5,
                      marginBottom: 6,
                    }}
                  >
                    04 · sleep only
                  </div>
                  <div
                    className="serif"
                    style={{ fontSize: 19, lineHeight: 1.3 }}
                  >
                    contains melatonin. max 1 strip / 24 hr. don&apos;t operate
                    heavy machinery.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <FootDisclaim />
      </main>

      <PropertiesDrawer
        open={propsOpen}
        onClose={() => setPropsOpen(false)}
        focus={propsFocus}
        onChangeFocus={setPropsFocus}
        properties={properties}
      />
    </div>
  );
}
