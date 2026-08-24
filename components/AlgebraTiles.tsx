"use client";

import { useLabStore } from "@/lib/store";
import { colorFor } from "@/lib/colors";

const POS = "#33528F";
const NEG = "#AE4E30";

export default function AlgebraTiles() {
  const equations = useLabStore((s) => s.equations);
  const activeEquationId = useLabStore((s) => s.activeEquationId);
  const setCoefficient = useLabStore((s) => s.setCoefficient);
  const setConstant = useLabStore((s) => s.setConstant);

  const active = equations.find((eq) => eq.id === activeEquationId);
  if (!active) return null;

  const c = colorFor(active.label);
  const xCount = Math.abs(active.coefficient);
  const xSign = active.coefficient < 0 ? -1 : 1;
  const uCount = Math.abs(active.constant);
  const uSign = active.constant < 0 ? -1 : 1;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-sm font-mono text-xs font-bold ${c.text}`}
          style={{ border: `1.5px solid ${c.stroke}` }}
        >
          {active.label}
        </span>
        <span className="text-[11px] text-ink-faint">
          workspace for equation {active.label} — each relationship has its own tiles
        </span>
      </div>

      <div className="flex min-h-[104px] flex-wrap items-center gap-2 rounded-sm border border-line bg-panel p-4">
        {Array.from({ length: xCount }).map((_, i) => (
          <button
            key={`x${i}`}
            type="button"
            title={xSign > 0 ? "Remove one x tile" : "Remove one negative x tile"}
            onClick={() => setCoefficient(active.id, active.coefficient - xSign)}
            className="flex h-10 w-16 items-center justify-center rounded-sm font-mono text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            style={{
              background: xSign > 0 ? POS : NEG,
              backgroundImage:
                xSign < 0
                  ? "repeating-linear-gradient(135deg, rgba(255,255,255,0.18) 0 4px, transparent 4px 8px)"
                  : undefined,
            }}
          >
            {xSign > 0 ? "x" : "−x"}
          </button>
        ))}

        {xCount > 0 && uCount > 0 && (
          <span className="mx-1 font-mono text-lg text-ink-faint">+</span>
        )}

        {Array.from({ length: uCount }).map((_, i) => (
          <button
            key={`u${i}`}
            type="button"
            title={uSign > 0 ? "Remove one unit tile" : "Remove one negative unit tile"}
            onClick={() => setConstant(active.id, active.constant - uSign)}
            className="flex h-10 w-10 items-center justify-center rounded-sm font-mono text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            style={{
              background: uSign > 0 ? POS : NEG,
              backgroundImage:
                uSign < 0
                  ? "repeating-linear-gradient(135deg, rgba(255,255,255,0.18) 0 4px, transparent 4px 8px)"
                  : undefined,
            }}
          >
            {uSign > 0 ? "1" : "−1"}
          </button>
        ))}

        {xCount === 0 && uCount === 0 && (
          <span className="text-sm text-ink-faint">Empty — add tiles below.</span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TileButton
          label="+ x tile"
          onClick={() => setCoefficient(active.id, active.coefficient + 1)}
        />
        <TileButton
          label="− x tile"
          onClick={() => setCoefficient(active.id, active.coefficient - 1)}
        />
        <TileButton
          label="+ 1 tile"
          onClick={() => setConstant(active.id, active.constant + 1)}
        />
        <TileButton
          label="− 1 tile"
          onClick={() => setConstant(active.id, active.constant - 1)}
        />
      </div>

      <p className="mt-3 font-mono text-xs text-ink-faint">
        {active.coefficient} × {active.variable} + {active.constant}
      </p>
    </div>
  );
}

function TileButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-sm border border-line px-2.5 py-1 text-xs text-ink-soft hover:border-ink-soft hover:text-ink"
    >
      {label}
    </button>
  );
}
