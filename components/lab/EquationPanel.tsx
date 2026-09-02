"use client";

import type { ChangeEvent, MouseEvent } from "react";
import { useLabStore } from "@/lib/lab-store";
import { colorFor } from "@/lib/colors";

export default function EquationPanel({ allowAdd }: { allowAdd: boolean }) {
  const equations = useLabStore((s) => s.equations);
  const activeEquationId = useLabStore((s) => s.activeEquationId);
  const setActiveEquation = useLabStore((s) => s.setActiveEquation);
  const setCoefficient = useLabStore((s) => s.setCoefficient);
  const setConstant = useLabStore((s) => s.setConstant);
  const toggleVisibility = useLabStore((s) => s.toggleVisibility);
  const addEquation = useLabStore((s) => s.addEquation);
  const duplicateEquation = useLabStore((s) => s.duplicateEquation);
  const removeEquation = useLabStore((s) => s.removeEquation);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-ink-faint">Add or duplicate equations to compare relationships.</p>
        <span className="shrink-0 font-mono text-[11px] text-ink-faint">{equations.length}/3</span>
      </div>

      {equations.map((eq) => {
        const c = colorFor(eq.label);
        const isActive = eq.id === activeEquationId;
        return (
          <div
            key={eq.id}
            onClick={() => setActiveEquation(eq.id)}
            className={`flex cursor-pointer flex-wrap items-center gap-3 rounded-2xl border px-3 py-2.5 transition-colors ${
              isActive ? `${c.ring} ${c.bg}` : "border-line bg-panel"
            } ${eq.visible ? "" : "opacity-45"}`}
            aria-label={`Equation ${eq.label}`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${c.text}`}
              style={{ border: `1.5px solid ${c.stroke}` }}
              aria-hidden="true"
            >
              {eq.label}
            </span>

            <div
              className="flex items-center gap-1.5 font-mono text-base font-semibold"
              style={{ color: c.stroke }}
            >
              <span>{eq.outputVariable} =</span>
              <input
                type="number"
                inputMode="decimal"
                value={eq.coefficient}
                onClick={(e: MouseEvent) => e.stopPropagation()}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCoefficient(eq.id, Number(e.target.value))}
                className="w-14 rounded-lg border border-line bg-paper px-1.5 py-1.5 text-center text-ink focus:outline-none focus:ring-2 focus:ring-chalk"
                aria-label={`${eq.label} coefficient`}
              />
              <span>{eq.variable} +</span>
              <input
                type="number"
                inputMode="decimal"
                value={eq.constant}
                onClick={(e: MouseEvent) => e.stopPropagation()}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConstant(eq.id, Number(e.target.value))}
                className="w-14 rounded-lg border border-line bg-paper px-1.5 py-1.5 text-center text-ink focus:outline-none focus:ring-2 focus:ring-chalk"
                aria-label={`${eq.label} constant`}
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  toggleVisibility(eq.id);
                }}
                className="rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-soft hover:border-ink-soft hover:bg-line-soft"
                aria-label={`${eq.visible ? "Hide" : "Show"} equation ${eq.label}`}
              >
                {eq.visible ? "Hide" : "Show"}
              </button>

              {allowAdd && equations.length < 3 && (
                <button
                  type="button"
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    duplicateEquation(eq.id);
                  }}
                  className="rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-line-soft"
                  style={{ borderColor: `${c.stroke}55`, color: c.stroke }}
                  aria-label={`Duplicate equation ${eq.label}`}
                >
                  Duplicate
                </button>
              )}

              {equations.length > 1 && (
                <button
                  type="button"
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    removeEquation(eq.id);
                  }}
                  className="rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-soft hover:border-ink-soft hover:bg-line-soft"
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
          className="self-start rounded-full border border-dashed border-line px-3.5 py-1.5 text-xs font-medium text-ink-soft hover:border-ink-soft hover:bg-line-soft hover:text-ink"
        >
          + Add equation
        </button>
      )}
    </div>
  );
}
