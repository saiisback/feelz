"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ALLERGEN,
  BEST_BEFORE,
  DOSAGE,
  type Property,
  type Variant,
  type VariantId,
} from "./data";
import { Pack, Sticker, dottedBg } from "./visuals";

export type WaitlistPayload = { variant: VariantId; email: string };

export function ProductCard({
  variant,
  properties,
  expanded,
  onToggle,
  onFindIt,
  onWaitlist,
  packStyle,
  motion: motionLevel,
}: {
  variant: Variant;
  properties: Property[];
  expanded: boolean;
  onToggle: () => void;
  onFindIt: (v: Variant) => void;
  onWaitlist: (p: WaitlistPayload) => void;
  packStyle: "flat" | "3d";
  motion: number;
}) {
  const {
    id,
    name,
    tagline,
    blurbs,
    composition,
    when,
    gradA,
    gradB,
    inkOn,
    tilt,
    accentSticker,
    warning,
  } = variant;

  const [hover, setHover] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [emailErr, setEmailErr] = useState(false);

  const tiltDeg = (motionLevel / 100) * tilt;
  const lift = hover && motionLevel > 10;

  const stockedCount = useMemo(
    () =>
      properties.filter(
        (p) => p.status !== "soon" && p.stocks.includes(id),
      ).length,
    [id, properties],
  );

  function joinWaitlist(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailErr(true);
      return;
    }
    setEmailErr(false);
    onWaitlist({ variant: id, email });
    setJoined(true);
  }

  const idx = ["focus", "extrovert", "joy", "sleep"].indexOf(id);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        background: `linear-gradient(170deg, ${gradA} 0%, ${gradB} 100%)`,
        color: inkOn,
        borderRadius: 28,
        padding: "36px 32px 32px",
        overflow: "visible",
        transform: `rotate(${lift ? 0 : tiltDeg}deg) translateY(${lift ? -6 : 0}px)`,
        transition:
          "transform 380ms cubic-bezier(.2,.8,.2,1), box-shadow 380ms ease",
        boxShadow: lift
          ? "0 30px 60px -20px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.18)"
          : "0 12px 28px -10px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.18)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: dottedBg("rgba(255,255,255,0.08)"),
          mixBlendMode: "overlay",
          borderRadius: 28,
          pointerEvents: "none",
        }}
      />

      <Sticker
        color={accentSticker.color}
        ink="#1a0f0a"
        rot={-12}
        size={92}
        style={{ top: -22, right: -16, zIndex: 4, animationDelay: "200ms" }}
        float={motionLevel > 30}
      >
        {accentSticker.text}
      </Sticker>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 16,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.8,
            }}
          >
            no. {String(idx + 1).padStart(2, "0")} · feelz
          </div>
          <div
            className="display"
            style={{
              fontSize: "clamp(44px, 5.2vw, 64px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              textTransform: "lowercase",
              marginTop: 8,
              paddingBottom: 4,
            }}
          >
            {name.toLowerCase()}
          </div>
          <div
            className="serif"
            style={{
              fontSize: 22,
              marginTop: 14,
              opacity: 0.95,
              lineHeight: 1.25,
            }}
          >
            {tagline}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "minmax(180px, 200px) minmax(0, 1fr)",
          gap: 40,
          alignItems: "center",
          marginTop: 32,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px 0",
            width: "100%",
            overflow: "visible",
            minHeight: 240,
          }}
        >
          <div
            style={{
              transform: lift
                ? "rotate(0deg) scale(1.02)"
                : `rotate(${-tilt * 1.2}deg)`,
              transition: "transform 420ms cubic-bezier(.2,.8,.2,1)",
              transformOrigin: "center center",
              flex: "0 0 auto",
            }}
          >
            <Pack variant={variant} size={0.55} perspective={packStyle === "3d"} />
          </div>

          <Sticker
            color={inkOn === "#fff7ec" ? "#fff7ec" : "#1a0f0a"}
            ink={inkOn === "#fff7ec" ? "#1a0f0a" : "#fff7ec"}
            rot={9}
            size={52}
            style={{ bottom: 0, left: -4 }}
            float={motionLevel > 50}
          >
            10
            <br />
            strips
          </Sticker>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              opacity: 0.75,
            }}
          >
            for —
          </div>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {blurbs.map((b) => (
              <li
                key={b}
                className="serif"
                style={{ fontSize: 19, lineHeight: 1.25 }}
              >
                <span style={{ opacity: 0.55, marginRight: 8 }}>·</span>
                {b}
              </li>
            ))}
          </ul>
          <div
            className="mono"
            style={{
              marginTop: 10,
              fontSize: 11,
              opacity: 0.7,
              letterSpacing: "0.04em",
            }}
          >
            when → {when}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          borderTop: "1px dashed rgba(0,0,0,0.18)",
          paddingTop: 14,
        }}
      >
        <div>
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.6,
            }}
          >
            stocked at
          </div>
          <div
            className="display"
            style={{
              fontSize: 28,
              lineHeight: 1,
              marginTop: 2,
              letterSpacing: "-0.02em",
            }}
          >
            {stockedCount}{" "}
            <span style={{ fontSize: 14, opacity: 0.7 }}>properties</span>
          </div>
        </div>
        <div
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "5px 10px",
            borderRadius: 999,
            border: `1px solid ${inkOn}`,
            opacity: 0.85,
            whiteSpace: "nowrap",
          }}
        >
          ₹290 / 10 strips
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 10,
          marginTop: 14,
        }}
      >
        <button
          className="push display"
          onClick={(e) => {
            e.stopPropagation();
            onFindIt(variant);
          }}
          style={{
            background: inkOn === "#fff7ec" ? "#fff7ec" : "#1a0f0a",
            color: inkOn === "#fff7ec" ? "#1a0f0a" : "#fff7ec",
            border: "none",
            padding: "16px 18px",
            borderRadius: 999,
            fontSize: 17,
            letterSpacing: "-0.01em",
            cursor: "pointer",
            textTransform: "lowercase",
            boxShadow: "0 6px 0 rgba(0,0,0,0.18)",
          }}
        >
          find it at ↗
        </button>
        <button
          className="push mono"
          onClick={(e) => {
            e.stopPropagation();
            const el = document.getElementById(`wl-${id}`);
            el?.focus();
            if (!expanded) onToggle();
          }}
          style={{
            background: "transparent",
            color: inkOn,
            border: `1.5px solid ${inkOn}`,
            padding: "16px 14px",
            borderRadius: 999,
            fontSize: 12,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          notify me
        </button>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="mono"
        style={{
          marginTop: 16,
          background: "rgba(0,0,0,0.10)",
          color: inkOn,
          border: "none",
          padding: "10px 14px",
          borderRadius: 999,
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          cursor: "pointer",
          width: "100%",
          textAlign: "center",
          backdropFilter: "blur(2px)",
        }}
      >
        {expanded ? "close details ↑" : "what's inside ↓"}
      </button>

      <div
        className={`reveal ${expanded ? "open" : ""}`}
        style={{ position: "relative", zIndex: 2 }}
      >
        <div className="reveal-inner">
          <div
            style={{
              marginTop: 16,
              background: "rgba(255,247,236,0.96)",
              color: "#1a0f0a",
              borderRadius: 20,
              padding: 22,
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1fr",
                gap: 24,
              }}
            >
              <div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    opacity: 0.6,
                  }}
                >
                  composition / strip
                </div>
                <table
                  className="mono"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: 10,
                    fontSize: 13,
                  }}
                >
                  <tbody>
                    {composition.map((c) => (
                      <tr
                        key={c.ing}
                        style={{ borderTop: "1px dashed rgba(0,0,0,0.18)" }}
                      >
                        <td style={{ padding: "8px 0", width: "44%" }}>
                          {c.ing.toLowerCase()}
                        </td>
                        <td
                          style={{
                            padding: "8px 0",
                            width: "20%",
                            fontWeight: 500,
                          }}
                        >
                          {c.amt}
                        </td>
                        <td style={{ padding: "8px 0", opacity: 0.6 }}>
                          {c.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    opacity: 0.6,
                    marginTop: 18,
                  }}
                >
                  how to take
                </div>
                <p
                  className="serif"
                  style={{ fontSize: 19, lineHeight: 1.3, margin: "8px 0 0" }}
                >
                  {DOSAGE}
                </p>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {warning && (
                  <div
                    style={{
                      background: "#1a0f0a",
                      color: "#fff7ec",
                      padding: 14,
                      borderRadius: 12,
                      fontSize: 12,
                      lineHeight: 1.4,
                    }}
                    className="mono"
                  >
                    <div
                      style={{
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        opacity: 0.7,
                        fontSize: 10,
                        marginBottom: 6,
                      }}
                    >
                      ⚠ heads up
                    </div>
                    {warning}
                  </div>
                )}

                <div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      opacity: 0.6,
                    }}
                  >
                    notify me when stocked at my property
                  </div>
                  {joined ? (
                    <div
                      className="serif"
                      style={{
                        marginTop: 10,
                        fontSize: 22,
                        background: `linear-gradient(90deg, ${gradA}, ${gradB})`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      you&apos;re on the list ✦ front desk will know
                    </div>
                  ) : (
                    <form
                      onSubmit={joinWaitlist}
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <input
                        id={`wl-${id}`}
                        type="email"
                        className="feelz-input"
                        placeholder="your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailErr(false);
                        }}
                        style={{
                          borderColor: emailErr ? "#E73C7E" : undefined,
                          flex: "1 1 180px",
                        }}
                      />
                      <button
                        type="submit"
                        className="display push"
                        style={{
                          background: "#1a0f0a",
                          color: "#fff7ec",
                          border: "none",
                          padding: "12px 18px",
                          borderRadius: 999,
                          fontSize: 14,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          textTransform: "lowercase",
                        }}
                      >
                        notify me
                      </button>
                    </form>
                  )}
                  <div
                    className="mono"
                    style={{ fontSize: 10, marginTop: 8, opacity: 0.6 }}
                  >
                    {emailErr
                      ? "⚠ that email's not quite right"
                      : "we'll ping you when your zostel restocks this mood"}
                  </div>
                </div>

                <div
                  className="mono"
                  style={{ fontSize: 10, opacity: 0.6, lineHeight: 1.5 }}
                >
                  {BEST_BEFORE}
                  <br />
                  {ALLERGEN}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
