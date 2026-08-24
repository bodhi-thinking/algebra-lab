"use client";

import { useLabStore } from "@/lib/store";
import { colorFor } from "@/lib/colors";

export default function EquationPanel({
  allowAdd,
}: {
  allowAdd: boolean;
}) {
  const equations = useLabStore((s) => s.equations);
  const activeEquationId = useLabStore((s) => s.activeEquationId);
  const setActiveEquation = useLabStore((s) => s.setActiveEquation);
  const setCoefficient = useLabStore((s) => s.setCoefficient);
  const setConstant = useLabStore((s) => s.setConstant);
  const toggleVisibility = useLabStore((s) => s.toggleVisibility);
  const addEquation = useLabStore((s) => s.addEquation);
  const removeEquation = useLabStore((s) => s.removeEquation);

  return (
    <div className="flex flex-col gap-3">
      {equations.map((eq) => {
        const c = colorFor(eq.label);
        const isActive = eq.id === activeEquationId;
        return (
          <div
            key={eq.id}
            onClick={() => setActiveEquation(eq.id)}
            className={`flex cursor-pointer flex-wrap items-center gap-3 rounded-sm border px-3 py-2.5 transition-colors ${
              isActive ? `${c.ring} ${c.bg}` : "border-line bg-panel"
            } ${eq.visible ? "" : "opacity-40"}`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-sm font-mono text-xs font-bold ${c.text}`}
              style={{ border: `1.5px solid ${c.stroke}` }}
            >
              {eq.label}
            </span>

            <div className="flex items-center gap-1.5 font-mono text-base text-ink">
              <span>{eq.outputVariable} =</span>
              <input
                type="number"
                value={eq.coefficient}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setCoefficient(eq.id, Number(e.target.value))}
                className="w-14 rounded-sm border border-line bg-paper px-1.5 py-1 text-center focus:outline-none focus:ring-2 focus:ring-chalk"
                aria-label={`${eq.label} coefficient`}
              />
              <span>{eq.variable} +</span>
              <input
                type="number"
                value={eq.constant}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setConstant(eq.id, Number(e.target.value))}
                className="w-14 rounded-sm border border-line bg-paper px-1.5 py-1 text-center focus:outline-none focus:ring-2 focus:ring-chalk"
                aria-label={`${eq.label} constant`}
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisibility(eq.id);
                }}
                className="rounded-sm border border-line px-2 py-1 text-[11px] text-ink-soft hover:border-ink-soft"
              >
                {eq.visible ? "Hide" : "Show"}
              </button>
              {equations.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeEquation(eq.id);
                  }}
                  className="rounded-sm border border-line px-2 py-1 text-[11px] text-ink-soft hover:border-ink-soft"
                  aria-label={`Remove equation ${eq.label}`}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        );
      })}

      {allowAdd && equations.length < 3 && (
        <button
          type="button"
          onClick={addEquation}
          className="self-start rounded-sm border border-dashed border-line px-3 py-1.5 text-xs text-ink-soft hover:border-ink-soft hover:text-ink"
        >
          + Compare another relationship
        </button>
      )}
    </div>
  );
}
