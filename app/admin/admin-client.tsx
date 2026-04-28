"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  VARIANTS,
  type PropertyStatus,
  type VariantId,
} from "@/app/_feelz/data";
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
  type PropertyRow,
} from "@/lib/properties";

const STATUSES: PropertyStatus[] = ["stocked", "few-left", "soon"];

const ADMIN_USER = "admin";
const ADMIN_PASS = "adminzozo";
const SESSION_KEY = "feelz_admin_authed";

type DraftRow = {
  city: string;
  region: string;
  archetype: string;
  status: PropertyStatus;
  stocks: VariantId[];
  sort_order: number;
};

const EMPTY_DRAFT: DraftRow = {
  city: "",
  region: "",
  archetype: "",
  status: "stocked",
  stocks: [],
  sort_order: 0,
};

export default function AdminClient() {
  const [authed, setAuthed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(SESSION_KEY) === "1") {
      setAuthed(true);
    }
    setAuthChecked(true);
  }, []);

  if (!authChecked) return null;

  if (!authed) {
    return (
      <LoginGate
        onSuccess={() => {
          window.sessionStorage.setItem(SESSION_KEY, "1");
          setAuthed(true);
        }}
      />
    );
  }

  return (
    <AdminPanel
      onLogout={() => {
        window.sessionStorage.removeItem(SESSION_KEY);
        setAuthed(false);
      }}
    />
  );
}

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setErr(null);
      onSuccess();
    } else {
      setErr("wrong username or password");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#fff7ec",
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 24,
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.55,
          }}
        >
          feelz · admin
        </div>
        <div
          className="display"
          style={{
            fontSize: 38,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            textTransform: "lowercase",
            margin: "2px 0 6px",
          }}
        >
          sign in
        </div>
        <input
          className="feelz-input"
          placeholder="username"
          autoComplete="username"
          value={user}
          onChange={(e) => {
            setUser(e.target.value);
            setErr(null);
          }}
        />
        <input
          className="feelz-input"
          placeholder="password"
          type="password"
          autoComplete="current-password"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
            setErr(null);
          }}
        />
        {err && (
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "#8a0e1e",
            }}
          >
            ⚠ {err}
          </div>
        )}
        <button
          type="submit"
          className="display push"
          style={{
            background: "#1a0f0a",
            color: "#fff7ec",
            border: "none",
            padding: "14px 18px",
            borderRadius: 999,
            fontSize: 15,
            cursor: "pointer",
            textTransform: "lowercase",
            marginTop: 4,
          }}
        >
          unlock
        </button>
        <a
          href="/"
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textAlign: "center",
            opacity: 0.55,
            color: "#1a0f0a",
            textDecoration: "none",
            marginTop: 4,
          }}
        >
          ← back to site
        </a>
      </form>
    </div>
  );
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [rows, setRows] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<DraftRow>(EMPTY_DRAFT);

  // per-row pending state map keyed by id
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const setRowPending = (id: string, v: boolean) =>
    setPending((p) => ({ ...p, [id]: v }));

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await fetchProperties();
      setRows(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const summary = useMemo(() => {
    const total = rows.length;
    const stocked = rows.filter((r) => r.status === "stocked").length;
    const few = rows.filter((r) => r.status === "few-left").length;
    const soon = rows.filter((r) => r.status === "soon").length;
    const stockCounts: Record<VariantId, number> = {
      focus: 0,
      extrovert: 0,
      joy: 0,
      sleep: 0,
    };
    for (const r of rows) {
      if (r.status === "soon") continue;
      for (const s of r.stocks) {
        if (s in stockCounts) stockCounts[s] += 1;
      }
    }
    return { total, stocked, few, soon, stockCounts };
  }, [rows]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!draft.city.trim() || !draft.region.trim()) {
      setErr("city and region are required");
      return;
    }
    setCreating(true);
    setErr(null);
    try {
      const created = await createProperty({
        city: draft.city.trim(),
        region: draft.region.trim(),
        archetype: draft.archetype.trim(),
        status: draft.status,
        stocks: draft.stocks,
        sort_order: Number.isFinite(draft.sort_order) ? draft.sort_order : 0,
      });
      setRows((rs) => [...rs, created].sort(byOrder));
      setDraft(EMPTY_DRAFT);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setCreating(false);
    }
  }

  async function onPatch(id: string, patch: Partial<DraftRow>) {
    setRowPending(id, true);
    try {
      const updated = await updateProperty(id, patch);
      setRows((rs) => rs.map((r) => (r.id === id ? updated : r)).sort(byOrder));
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setRowPending(id, false);
    }
  }

  async function onDelete(id: string) {
    const target = rows.find((r) => r.id === id);
    if (!target) return;
    if (!confirm(`delete ${target.city}?`)) return;
    setRowPending(id, true);
    try {
      await deleteProperty(id);
      setRows((rs) => rs.filter((r) => r.id !== id));
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setRowPending(id, false);
    }
  }

  function toggleStock(list: VariantId[], v: VariantId) {
    return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
  }

  return (
    <div style={{ minHeight: "100vh", padding: "32px 28px 80px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: 0.6,
              }}
            >
              feelz · admin
            </div>
            <h1
              className="display"
              style={{
                fontSize: 56,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                textTransform: "lowercase",
                margin: "6px 0 0",
              }}
            >
              zostel properties
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a
              href="/"
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "10px 16px",
                borderRadius: 999,
                border: "1.5px solid rgba(0,0,0,0.2)",
                textDecoration: "none",
                color: "#1a0f0a",
              }}
            >
              ← back to site
            </a>
            <button
              onClick={onLogout}
              className="mono push"
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "10px 16px",
                borderRadius: 999,
                border: "1.5px solid #1a0f0a",
                background: "#1a0f0a",
                color: "#fff7ec",
                cursor: "pointer",
              }}
            >
              log out
            </button>
          </div>
        </header>

        <SummaryStrip summary={summary} />

        {err && (
          <div
            className="mono"
            style={{
              marginTop: 20,
              padding: "12px 16px",
              borderRadius: 12,
              background: "#fff7ec",
              border: "1.5px solid #b1121f",
              color: "#8a0e1e",
              fontSize: 13,
              letterSpacing: "0.04em",
            }}
          >
            {err}
          </div>
        )}

        <section
          style={{
            marginTop: 28,
            background: "#fff7ec",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 20,
            padding: 24,
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: 12,
            }}
          >
            add a new zostel
          </div>
          <form
            onSubmit={onCreate}
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr 0.8fr 0.6fr auto",
              gap: 10,
              alignItems: "stretch",
            }}
          >
            <input
              className="feelz-input"
              placeholder="city (e.g. Zostel Spiti)"
              value={draft.city}
              onChange={(e) =>
                setDraft((d) => ({ ...d, city: e.target.value }))
              }
            />
            <input
              className="feelz-input"
              placeholder="region (e.g. Himachal Pradesh)"
              value={draft.region}
              onChange={(e) =>
                setDraft((d) => ({ ...d, region: e.target.value }))
              }
            />
            <input
              className="feelz-input"
              placeholder="archetype (e.g. Mountain · Trekking)"
              value={draft.archetype}
              onChange={(e) =>
                setDraft((d) => ({ ...d, archetype: e.target.value }))
              }
            />
            <StatusSelect
              value={draft.status}
              onChange={(v) => setDraft((d) => ({ ...d, status: v }))}
            />
            <input
              className="feelz-input"
              type="number"
              placeholder="sort"
              value={draft.sort_order}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  sort_order: Number(e.target.value) || 0,
                }))
              }
              style={{ textAlign: "center" }}
            />
            <button
              type="submit"
              className="display push"
              disabled={creating}
              style={{
                background: "#1a0f0a",
                color: "#fff7ec",
                border: "none",
                padding: "0 22px",
                borderRadius: 999,
                fontSize: 14,
                cursor: creating ? "wait" : "pointer",
                textTransform: "lowercase",
                whiteSpace: "nowrap",
                opacity: creating ? 0.6 : 1,
              }}
            >
              {creating ? "saving…" : "+ add"}
            </button>
          </form>
          <div style={{ marginTop: 14 }}>
            <StocksRow
              stocks={draft.stocks}
              onChange={(stocks) => setDraft((d) => ({ ...d, stocks }))}
            />
          </div>
        </section>

        <section style={{ marginTop: 32 }}>
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: 12,
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            <span>existing properties · {rows.length}</span>
            <button
              onClick={() => void load()}
              className="mono"
              style={{
                background: "transparent",
                border: "1px solid rgba(0,0,0,0.18)",
                borderRadius: 999,
                padding: "4px 10px",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              refresh
            </button>
          </div>

          {loading ? (
            <div
              className="mono"
              style={{ padding: 24, textAlign: "center", opacity: 0.6 }}
            >
              loading…
            </div>
          ) : rows.length === 0 ? (
            <div
              className="serif"
              style={{
                padding: 32,
                textAlign: "center",
                fontSize: 22,
                opacity: 0.7,
              }}
            >
              no properties yet. add the first one above.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {rows.map((r) => (
                <RowEditor
                  key={r.id}
                  row={r}
                  pending={!!pending[r.id]}
                  toggleStock={toggleStock}
                  onPatch={onPatch}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </section>

        <p
          className="mono"
          style={{
            marginTop: 40,
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            opacity: 0.45,
            textAlign: "center",
          }}
        >
          changes write directly to supabase · public is the homepage
        </p>
      </div>
    </div>
  );
}

function byOrder(a: PropertyRow, b: PropertyRow) {
  if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
  return a.city.localeCompare(b.city);
}

function StatusSelect({
  value,
  onChange,
}: {
  value: PropertyStatus;
  onChange: (v: PropertyStatus) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as PropertyStatus)}
      className="mono"
      style={{
        background: "rgba(255,255,255,0.85)",
        border: "1.5px solid rgba(0,0,0,0.18)",
        borderRadius: 999,
        padding: "12px 16px",
        fontSize: 12,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        outline: "none",
        cursor: "pointer",
        color: "#1a0f0a",
      }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

function StocksRow({
  stocks,
  onChange,
}: {
  stocks: VariantId[];
  onChange: (next: VariantId[]) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
      }}
    >
      <span
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: 0.55,
          marginRight: 4,
        }}
      >
        stocks
      </span>
      {VARIANTS.map((v) => {
        const active = stocks.includes(v.id);
        return (
          <button
            type="button"
            key={v.id}
            onClick={() =>
              onChange(
                active ? stocks.filter((x) => x !== v.id) : [...stocks, v.id],
              )
            }
            className="mono push"
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: active
                ? "1.5px solid #1a0f0a"
                : "1.5px solid rgba(0,0,0,0.18)",
              background: active
                ? `linear-gradient(180deg, ${v.gradA}, ${v.gradB})`
                : "transparent",
              color: active ? v.inkOn : "#1a0f0a",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontWeight: active ? 600 : 400,
            }}
          >
            {v.name.toLowerCase()}
          </button>
        );
      })}
    </div>
  );
}

function SummaryStrip({
  summary,
}: {
  summary: {
    total: number;
    stocked: number;
    few: number;
    soon: number;
    stockCounts: Record<VariantId, number>;
  };
}) {
  const cells: { label: string; value: number; tint?: string }[] = [
    { label: "total", value: summary.total },
    { label: "stocked", value: summary.stocked, tint: "#1f8a4c" },
    { label: "few left", value: summary.few, tint: "#d96b1a" },
    { label: "soon", value: summary.soon, tint: "rgba(0,0,0,0.4)" },
    ...VARIANTS.map((v) => ({
      label: v.name.toLowerCase(),
      value: summary.stockCounts[v.id] ?? 0,
      tint: v.gradA,
    })),
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))`,
        gap: 10,
      }}
    >
      {cells.map((c) => (
        <div
          key={c.label}
          style={{
            padding: "14px 14px",
            borderRadius: 16,
            background: "#fff7ec",
            border: "1px solid rgba(0,0,0,0.08)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {c.tint && (
            <span
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 8,
                height: 8,
                borderRadius: 999,
                background: c.tint,
              }}
            />
          )}
          <div
            className="display"
            style={{ fontSize: 30, lineHeight: 1, letterSpacing: "-0.02em" }}
          >
            {c.value}
          </div>
          <div
            className="mono"
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.55,
              marginTop: 6,
            }}
          >
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function RowEditor({
  row,
  pending,
  toggleStock,
  onPatch,
  onDelete,
}: {
  row: PropertyRow;
  pending: boolean;
  toggleStock: (list: VariantId[], v: VariantId) => VariantId[];
  onPatch: (id: string, patch: Partial<DraftRow>) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}) {
  const [draft, setDraft] = useState<DraftRow>({
    city: row.city,
    region: row.region,
    archetype: row.archetype,
    status: row.status,
    stocks: row.stocks,
    sort_order: row.sort_order,
  });
  const [dirty, setDirty] = useState(false);

  // when row prop changes (after server save), sync.
  useEffect(() => {
    setDraft({
      city: row.city,
      region: row.region,
      archetype: row.archetype,
      status: row.status,
      stocks: row.stocks,
      sort_order: row.sort_order,
    });
    setDirty(false);
  }, [row]);

  function patch<K extends keyof DraftRow>(k: K, v: DraftRow[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
    setDirty(true);
  }

  return (
    <div
      style={{
        background: "#fff7ec",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: 16,
        padding: 16,
        opacity: pending ? 0.7 : 1,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 0.8fr 0.6fr auto",
          gap: 10,
          alignItems: "stretch",
        }}
      >
        <input
          className="feelz-input"
          value={draft.city}
          onChange={(e) => patch("city", e.target.value)}
        />
        <input
          className="feelz-input"
          value={draft.region}
          onChange={(e) => patch("region", e.target.value)}
        />
        <input
          className="feelz-input"
          value={draft.archetype}
          onChange={(e) => patch("archetype", e.target.value)}
        />
        <StatusSelect
          value={draft.status}
          onChange={(v) => patch("status", v)}
        />
        <input
          className="feelz-input"
          type="number"
          value={draft.sort_order}
          onChange={(e) => patch("sort_order", Number(e.target.value) || 0)}
          style={{ textAlign: "center" }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="display push"
            disabled={!dirty || pending}
            onClick={() => void onPatch(row.id, draft)}
            style={{
              background: dirty ? "#1a0f0a" : "rgba(0,0,0,0.12)",
              color: dirty ? "#fff7ec" : "#1a0f0a",
              border: "none",
              padding: "0 16px",
              borderRadius: 999,
              fontSize: 13,
              cursor: dirty && !pending ? "pointer" : "not-allowed",
              textTransform: "lowercase",
              whiteSpace: "nowrap",
            }}
          >
            save
          </button>
          <button
            className="mono push"
            disabled={pending}
            onClick={() => void onDelete(row.id)}
            style={{
              background: "transparent",
              color: "#8a0e1e",
              border: "1.5px solid #8a0e1e",
              padding: "0 14px",
              borderRadius: 999,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: pending ? "wait" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            delete
          </button>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <StocksRow
          stocks={draft.stocks}
          onChange={(stocks) => patch("stocks", stocks)}
        />
      </div>
      <div
        className="mono"
        style={{
          marginTop: 8,
          fontSize: 9,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          opacity: 0.4,
        }}
      >
        id {row.id}
      </div>
    </div>
  );
}
