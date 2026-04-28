"use client";

import { useState } from "react";
import { VARIANTS, type Property } from "./data";
import { FeelzMark, Sachet } from "./visuals";

export function BundleStrip({
  onFindAll,
  properties,
}: {
  onFindAll: () => void;
  properties: Property[];
}) {
  const stockedNow = properties.filter((p) => p.status !== "soon").length;
  const comingSoon = properties.filter((p) => p.status === "soon").length;
  const regions = [...new Set(properties.map((p) => p.region))];
  const [hover, setHover] = useState(false);
  const offsets = [-8, 6, -4, 8];
  const sachetLifts = [-10, -16, -8, -12];
  const sachetRotations = [-6, -2, 3, 7];

  return (
    <section
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        marginTop: 80,
        borderRadius: 36,
        overflow: "hidden",
        background: "#1a0f0a",
        color: "#fff7ec",
        padding: "56px 48px",
      }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: 0.85 }}>
        {VARIANTS.map((v, i) => (
          <div
            key={v.id}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${i * 25}%`,
              width: "30%",
              background: `linear-gradient(180deg, ${v.gradA}, ${v.gradB})`,
              filter: "blur(40px)",
              opacity: 0.65,
              transform: hover ? `translateY(${offsets[i]}px)` : "none",
              transition: "transform 600ms ease",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(26,15,10,0.55)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div>
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            the network
          </div>
          <h2
            className="display"
            style={{
              fontSize: "clamp(48px, 6.5vw, 86px)",
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              margin: "8px 0 18px",
              textTransform: "lowercase",
            }}
          >
            find feelz
            <br />
            at any zostel.
          </h2>
          <p
            className="serif"
            style={{
              fontSize: 26,
              lineHeight: 1.25,
              maxWidth: 540,
              opacity: 0.95,
            }}
          >
            kasol, manali, gokarna, lonavala, kodaikanal — pick up a pack at
            the front desk of any phase 1 zostel.
          </p>

          <div
            style={{
              display: "flex",
              gap: 24,
              marginTop: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                className="display"
                style={{
                  fontSize: 44,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {stockedNow}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  opacity: 0.6,
                  marginTop: 4,
                }}
              >
                stocked now
              </div>
            </div>
            <div>
              <div
                className="display"
                style={{
                  fontSize: 44,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {regions.length}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  opacity: 0.6,
                  marginTop: 4,
                }}
              >
                states / regions
              </div>
            </div>
            {comingSoon > 0 && (
              <div>
                <div
                  className="display"
                  style={{
                    fontSize: 44,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  +{comingSoon}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    opacity: 0.6,
                    marginTop: 4,
                  }}
                >
                  coming soon
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              marginTop: 28,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={onFindAll}
              className="display push"
              style={{
                background: "#fff7ec",
                color: "#1a0f0a",
                border: "none",
                padding: "20px 28px",
                borderRadius: 999,
                fontSize: 22,
                cursor: "pointer",
                textTransform: "lowercase",
                boxShadow: "0 6px 0 rgba(255,247,236,0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              browse all properties →
            </button>
            <span
              className="mono"
              style={{
                fontSize: 12,
                opacity: 0.7,
                letterSpacing: "0.1em",
              }}
            >
              ₹290 per pack · 10 strips
            </span>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            height: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {VARIANTS.map((v, i) => (
            <div
              key={v.id}
              style={{
                position: "absolute",
                transform: `translateX(${(i - 1.5) * 80}px) translateY(${
                  hover ? sachetLifts[i] : 0
                }px)`,
                transition: "transform 600ms cubic-bezier(.2,.8,.2,1)",
                zIndex: i,
              }}
            >
              <Sachet v={v} w={130} h={180} rotate={sachetRotations[i]} labelSize={22} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FootDisclaim() {
  return (
    <footer
      style={{
        marginTop: 80,
        paddingTop: 40,
        paddingBottom: 80,
        borderTop: "1px solid rgba(0,0,0,0.12)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr",
          gap: 32,
          alignItems: "start",
        }}
      >
        <div>
          <FeelzMark size={56} />
          <div
            className="serif"
            style={{
              fontSize: 22,
              marginTop: 8,
              opacity: 0.75,
              maxWidth: 380,
              lineHeight: 1.25,
            }}
          >
            sublingual mood strips, made by mindcafe. incubated at zo world.
            distributed by zostel.
          </div>
        </div>
        <div
          className="mono"
          style={{
            fontSize: 11,
            lineHeight: 1.7,
            opacity: 0.7,
            letterSpacing: "0.04em",
          }}
        >
          <div
            style={{
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: 8,
            }}
          >
            moods
          </div>
          <div>focus</div>
          <div>extrovert</div>
          <div>joy</div>
          <div>sleep</div>
        </div>
        <div
          className="mono"
          style={{
            fontSize: 11,
            lineHeight: 1.7,
            opacity: 0.7,
            letterSpacing: "0.04em",
          }}
        >
          <div
            style={{
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: 8,
            }}
          >
            fine print
          </div>
          <div>not for medicinal use.</div>
          <div>not for children, pregnant women,</div>
          <div>or those under 18.</div>
          <div style={{ marginTop: 10 }}>fssaI compliant · made in india</div>
        </div>
      </div>
      <div
        className="mono"
        style={{
          marginTop: 40,
          fontSize: 10,
          opacity: 0.5,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        © 2026 feelz by mindcafe · incubated at zo world · distributed by zostel
      </div>
    </footer>
  );
}
