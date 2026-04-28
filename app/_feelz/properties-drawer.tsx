"use client";

import { useEffect, useState } from "react";
import {
  PROPERTIES,
  VARIANTS,
  type PropertyStatus,
  type VariantId,
} from "./data";

export function PropertiesDrawer({
  open,
  onClose,
  focus,
  onChangeFocus,
}: {
  open: boolean;
  onClose: () => void;
  focus: VariantId | null;
  onChangeFocus: (id: VariantId | null) => void;
}) {
  useEffect(() => {
    document.body.classList.toggle("locked", open);
    return () => {
      document.body.classList.remove("locked");
    };
  }, [open]);

  const [query, setQuery] = useState("");

  const variantById = (id: VariantId) => VARIANTS.find((v) => v.id === id);
  const filterChips: { id: VariantId | null; label: string }[] = [
    { id: null, label: "all moods" },
    ...VARIANTS.map((v) => ({ id: v.id, label: v.name.toLowerCase() })),
  ];

  const list = PROPERTIES.filter((p) => {
    if (focus && p.status !== "soon" && !p.stocks.includes(focus)) return false;
    if (
      query &&
      !(p.city + " " + p.region).toLowerCase().includes(query.toLowerCase())
    )
      return false;
    return true;
  });

  const stockedCount = list.filter((p) => p.status !== "soon").length;
  const soonCount = list.filter((p) => p.status === "soon").length;

  const statusStyle = (s: PropertyStatus) => {
    if (s === "stocked") return { dot: "#1f8a4c", label: "stocked" };
    if (s === "few-left") return { dot: "#d96b1a", label: "few left" };
    return { dot: "rgba(0,0,0,0.35)", label: "coming soon" };
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(26,15,10,0.45)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 280ms ease",
          zIndex: 80,
          backdropFilter: "blur(4px)",
        }}
      />
      <aside
        aria-label="zostel properties"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(520px, 96vw)",
          background: "#fff7ec",
          color: "#1a0f0a",
          zIndex: 90,
          transform: open ? "translateX(0)" : "translateX(110%)",
          transition: "transform 380ms cubic-bezier(.2,.8,.2,1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-30px 0 60px rgba(0,0,0,0.18)",
        }}
      >
        <header
          style={{
            padding: "22px 24px 18px",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  opacity: 0.6,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                find feelz at
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "#1a0f0a",
                    color: "#fff7ec",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    fontWeight: 600,
                  }}
                >
                  phase 1 launch
                </span>
              </div>
              <div
                className="display"
                style={{
                  fontSize: 32,
                  textTransform: "lowercase",
                  lineHeight: 1,
                  marginTop: 4,
                }}
              >
                zostel properties
              </div>
            </div>
            <button
              onClick={onClose}
              className="mono"
              style={{
                background: "transparent",
                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: 999,
                padding: "6px 12px",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              close ✕
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginTop: 16,
            }}
          >
            {filterChips.map((c) => {
              const active = focus === c.id;
              const v = c.id ? variantById(c.id) : null;
              return (
                <button
                  key={c.label}
                  onClick={() => onChangeFocus(c.id)}
                  className="mono"
                  style={{
                    padding: "7px 12px",
                    borderRadius: 999,
                    border:
                      "1.5px solid " +
                      (active ? "#1a0f0a" : "rgba(0,0,0,0.18)"),
                    background: active
                      ? v
                        ? `linear-gradient(180deg, ${v.gradA}, ${v.gradB})`
                        : "#1a0f0a"
                      : "transparent",
                    color: active ? (v ? v.inkOn : "#fff7ec") : "#1a0f0a",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 14, position: "relative" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search a city or state…"
              className="mono"
              style={{
                width: "100%",
                padding: "12px 14px 12px 38px",
                borderRadius: 12,
                border: "1.5px solid rgba(0,0,0,0.18)",
                background: "#fef9f3",
                fontSize: 13,
                color: "#1a0f0a",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <span
              className="mono"
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 14,
                opacity: 0.5,
              }}
            >
              ⌕
            </span>
          </div>

          <div
            className="mono"
            style={{
              marginTop: 12,
              fontSize: 11,
              letterSpacing: "0.1em",
              opacity: 0.65,
              display: "flex",
              gap: 14,
            }}
          >
            <span>
              <b style={{ color: "#1f8a4c" }}>●</b> {stockedCount} stocked
            </span>
            {soonCount > 0 && (
              <span>
                <b style={{ color: "rgba(0,0,0,0.4)" }}>●</b> {soonCount} soon
              </span>
            )}
          </div>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {list.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <div
                className="serif"
                style={{ fontSize: 24, lineHeight: 1.3, marginBottom: 8 }}
              >
                no matches.
                <br />
                try another mood or city.
              </div>
            </div>
          ) : (
            list.map((p, idx) => {
              const ss = statusStyle(p.status);
              return (
                <div
                  key={p.city}
                  style={{
                    padding: "14px 24px",
                    borderBottom: "1px dashed rgba(0,0,0,0.12)",
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      opacity: 0.4,
                      width: 24,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      className="display"
                      style={{
                        fontSize: 19,
                        lineHeight: 1.1,
                        textTransform: "lowercase",
                      }}
                    >
                      {p.city.toLowerCase()}
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: 10,
                        opacity: 0.55,
                        marginTop: 4,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      {p.region}
                      {p.archetype ? (
                        <span style={{ opacity: 0.55 }}>
                          {" "}
                          · {p.archetype.toLowerCase()}
                        </span>
                      ) : null}
                    </div>

                    {p.stocks.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          gap: 4,
                          marginTop: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        {p.stocks.map((mid) => {
                          const v = variantById(mid);
                          if (!v) return null;
                          return (
                            <span
                              key={mid}
                              className="mono"
                              style={{
                                fontSize: 9,
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                padding: "3px 7px",
                                borderRadius: 999,
                                background: `linear-gradient(180deg, ${v.gradA}, ${v.gradB})`,
                                color: v.inkOn,
                                border: "1px solid rgba(0,0,0,0.15)",
                                fontWeight: 600,
                              }}
                            >
                              {v.name.toLowerCase()}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div
                    className="mono"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "5px 10px",
                      borderRadius: 999,
                      border: "1px solid rgba(0,0,0,0.15)",
                      background: "#fef9f3",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 999,
                        background: ss.dot,
                      }}
                    />
                    {ss.label}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <footer
          style={{
            padding: "16px 24px",
            borderTop: "1px solid rgba(0,0,0,0.1)",
            background: "#fef9f3",
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.65,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            distributed by zostel · ₹290 per pack of 10 strips
            <br />
            ask the front desk at any property
          </div>
        </footer>
      </aside>
    </>
  );
}
