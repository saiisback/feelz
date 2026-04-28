"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Variant } from "./data";

export function dottedBg(color = "rgba(255,255,255,0.18)") {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='6' height='6'><circle cx='1' cy='1' r='0.7' fill='${color}'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

export function FeelzMark({
  size = 32,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <span
      className="feelz-mark display"
      style={{
        fontSize: size,
        color,
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}
    >
      <span>feelz</span>
    </span>
  );
}

export function Sticker({
  children,
  color = "#FFC107",
  ink = "#1a0f0a",
  rot = -8,
  size = 96,
  style = {},
  float: f = false,
}: {
  children: ReactNode;
  color?: string;
  ink?: string;
  rot?: number;
  size?: number;
  style?: CSSProperties;
  float?: boolean;
}) {
  return (
    <div
      className="wob"
      style={
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "999px",
          background: color,
          color: ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 8,
          fontFamily: "var(--font-mono), monospace",
          fontSize: Math.max(9, size * 0.11),
          fontWeight: 500,
          lineHeight: 1.05,
          letterSpacing: "0.02em",
          textTransform: "lowercase",
          boxShadow:
            "0 6px 14px rgba(0,0,0,0.12), inset 0 -3px 0 rgba(0,0,0,0.08)",
          border: "1.5px solid rgba(0,0,0,0.12)",
          transform: `rotate(${rot}deg)`,
          "--r": `${rot}deg`,
          animation: f ? "float 4.5s ease-in-out infinite" : undefined,
          userSelect: "none",
          ...style,
        } as CSSProperties
      }
    >
      <span style={{ display: "inline-block" }}>{children}</span>
    </div>
  );
}

export function Sachet({
  v,
  w = 130,
  h = 180,
  rotate = 0,
  sheen = true,
  label = true,
  labelSize = 22,
}: {
  v: Variant;
  w?: number;
  h?: number;
  rotate?: number;
  sheen?: boolean;
  label?: boolean;
  labelSize?: number;
}) {
  const crimpH = h * 0.13;
  const innerH = h - crimpH * 2;
  const crimpStripes = `repeating-linear-gradient(90deg,
      rgba(255,255,255,0.45) 0 1.5px,
      rgba(0,0,0,0.18) 1.5px 3.5px)`;

  return (
    <div
      className="display"
      style={{
        position: "relative",
        width: w,
        height: h,
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 18px 26px rgba(0,0,0,0.45))",
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: crimpH,
          background:
            "linear-gradient(180deg, #d8d8da 0%, #f4f4f6 35%, #b9b9bd 100%)",
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          overflow: "hidden",
          boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: crimpStripes,
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.55)",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: crimpH,
          left: 0,
          right: 0,
          height: innerH,
          background: `linear-gradient(170deg, ${v.gradA} 0%, ${v.gradB} 100%)`,
          color: v.inkOn,
          overflow: "hidden",
        }}
      >
        {sheen && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "18%",
              width: "16%",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0) 100%)",
              mixBlendMode: "overlay",
              pointerEvents: "none",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: dottedBg("rgba(255,255,255,0.16)"),
            mixBlendMode: "overlay",
            opacity: 0.6,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            fontFamily: "var(--font-display), sans-serif",
            fontSize: Math.max(11, w * 0.11),
            letterSpacing: "-0.01em",
            textTransform: "lowercase",
            color: v.inkOn,
          }}
        >
          feelz
        </div>

        {label && (
          <div
            style={{
              position: "absolute",
              left: 10,
              right: 10,
              bottom: 10,
              fontFamily: "var(--font-display), sans-serif",
              fontSize: labelSize,
              lineHeight: 0.95,
              textTransform: "lowercase",
              letterSpacing: "-0.02em",
              color: v.inkOn,
            }}
          >
            {v.name.toLowerCase()}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
            borderRight: "6px solid rgba(0,0,0,0.35)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 5,
            top: "50%",
            transform: "translateY(-50%)",
            width: 1,
            height: innerH * 0.55,
            background: "rgba(0,0,0,0.18)",
            borderLeft: "1px dashed rgba(0,0,0,0.35)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: crimpH,
          background:
            "linear-gradient(180deg, #b9b9bd 0%, #f4f4f6 65%, #d8d8da 100%)",
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          overflow: "hidden",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: crimpStripes,
            opacity: 0.55,
          }}
        />
      </div>
    </div>
  );
}

export function VariantPill({ v, small = false }: { v: Variant; small?: boolean }) {
  const len = v.name.length;
  const W = small ? Math.max(110, len * 14) : Math.max(170, len * 22 + 40);
  const H = small ? 50 : 72;
  return (
    <div
      style={{
        width: W,
        height: H,
        padding: small ? "0 18px" : "0 26px",
        borderRadius: 14,
        background: `linear-gradient(180deg, ${v.gradA}, ${v.gradB})`,
        color: v.inkOn,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display), sans-serif",
        fontSize: small ? 17 : 24,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        boxShadow:
          "0 14px 28px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.18)",
        border: "1.5px solid rgba(0,0,0,0.18)",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {v.name}
    </div>
  );
}

export function Pack({
  variant,
  size = 1,
  perspective = false,
}: {
  variant: Variant;
  size?: number;
  perspective?: boolean;
}) {
  const { name, purpose, gradA, gradB, inkOn } = variant;
  const W = 260 * size;
  const H = 340 * size;
  const stripes = Array.from({ length: 5 }, (_, i) => i);
  const widths = [88, 72, 92, 60, 80];

  const nameLen = name.length;
  let nameSize: number;
  if (nameLen <= 4) nameSize = 64;
  else if (nameLen <= 5) nameSize = 56;
  else if (nameLen <= 9) nameSize = 36;
  else nameSize = 28;
  nameSize = nameSize * size;

  return (
    <div
      style={{
        width: W,
        height: H,
        position: "relative",
        transformStyle: "preserve-3d",
        transform: perspective ? "rotateX(4deg) rotateY(-8deg)" : "none",
        filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.22))",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          background: `linear-gradient(180deg, ${gradA} 0%, ${gradB} 100%)`,
          color: inkOn,
          padding: `${22 * size}px ${20 * size}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.18)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: dottedBg("rgba(255,255,255,0.10)"),
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />
        <div className="pack-glare" style={{ position: "absolute", inset: 0 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              opacity: 0.92,
            }}
          >
            <FeelzMark size={18 * size} color={inkOn} />
            <div
              className="mono"
              style={{
                fontSize: 9 * size,
                letterSpacing: "0.12em",
                opacity: 0.8,
              }}
            >
              by mindcafe
            </div>
          </div>
          <div
            className="mono"
            style={{
              fontSize: 9 * size,
              marginTop: 6 * size,
              opacity: 0.7,
              letterSpacing: "0.14em",
            }}
          >
            sublingual thin film · 10 strips
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, textAlign: "left" }}>
          <div
            className="display"
            style={{
              fontSize: nameSize,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              textTransform: "lowercase",
              whiteSpace: "nowrap",
            }}
          >
            {name.toLowerCase()}
          </div>
          <div
            className="serif"
            style={{
              fontSize: 15 * size,
              marginTop: 8 * size,
              opacity: 0.92,
              maxWidth: "92%",
              lineHeight: 1.22,
            }}
          >
            {purpose}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4 * size,
          }}
        >
          {stripes.map((i) => (
            <div
              key={i}
              style={{
                height: 4 * size,
                borderRadius: 999,
                background: "rgba(255,255,255,0.35)",
                width: `${widths[i]}%`,
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 9 * size,
              letterSpacing: "0.1em",
              opacity: 0.8,
              lineHeight: 1.4,
            }}
          >
            net wt 1.5g
            <br />
            (10 × 0.15g)
          </div>
          <div
            className="mono"
            style={{
              fontSize: 9 * size,
              letterSpacing: "0.1em",
              opacity: 0.85,
              border: `1px solid ${inkOn}`,
              padding: `${4 * size}px ${8 * size}px`,
              borderRadius: 4,
            }}
          >
            fssai ✓
          </div>
        </div>
      </div>

      {perspective && (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: -10,
            bottom: -6,
            width: 12,
            background: `linear-gradient(180deg, ${gradA} 0%, ${gradB} 100%)`,
            transform: "skewY(-6deg)",
            borderRadius: 2,
            opacity: 0.85,
          }}
        />
      )}
    </div>
  );
}
