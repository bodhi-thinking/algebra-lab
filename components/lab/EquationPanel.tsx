"use client";

import type { ChangeEvent, MouseEvent } from "react";
import { equationDegree } from "@/lib/challenge-types";
import { useLabStore } from "@/lib/lab-store";
import { colorFor } from "@/lib/colors";

export default function EquationPanel({ allowAdd }: { allowAdd: boolean }) {
  const equations = useLabStore((s) => s.equations);
  const activeEquationId = useLabStore((s) => s.activeEquationId);
  const setActiveEquation = useLabStore((s) => s.setActiveEquation);
  const setCubic = useLabStore((s) => s.setCubic);
  const setQuadratic = useLabStore((s) => s.setQuadratic);
  const setCoefficient = useLabStore((s) => s.setCoefficient);
  const setConstant = useLabStore((s) => s.setConstant);
  const toggleVisibility = useLabStore((s) => s.toggleVisibility);
  const addEquation = useLabStore((s) => s.addEquation);
  const duplicateEquation = useLabStore((s) => s.duplicateEquation);
  const removeEquation = useLabStore((s) => s.removeEquation);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-ink-faint">
          Add or duplicate equations to compare relationships.
        </p>
        <span className="shrink-0 font-mono text-[11px] text-ink-faint">
          {equations.length}/3
        </span>
      </div>

      {equations.map((eq) => {
        const c = colorFor(eq.label);
        const isActive = eq.id === activeEquationId;
        const degree = Math.max(
          equationDegree(eq),
          eq.editableDegree
        ) as 1 | 2 | 3;

        return (
          <div
            key={eq.id}
            onClick={() => setActiveEquation(eq.id)}
            className={`flex cursor-pointer flex-wrap items-center gap-2 rounded-2xl border px-2.5 py-2 transition-colors sm:gap-3 sm:px-3 sm:py-2.5 ${
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
              className="flex min-w-0 flex-wrap items-center gap-1 font-mono text-sm font-semibold sm:text-base"
              style={{ color: c.stroke }}
            >
              <span className="shrink-0">{eq.outputVariable} =</span>

              {degree === 3 && (
                <>
                  <CoefficientInput
                    value={eq.cubic}
                    onChange={(value) => setCubic(eq.id, value)}
                    ariaLabel={`${eq.label} cubic coefficient`}
                  />
                  <span className="shrink-0">{eq.variable}³ +</span>
                </>
              )}

              {degree >= 2 && (
                <>
                  <CoefficientInput
                    value={eq.quadratic}
                    onChange={(value) => setQuadratic(eq.id, value)}
                    ariaLabel={`${eq.label} square coefficient`}
                  />
                  <span className="shrink-0">{eq.variable}² +</span>
                </>
              )}

              {degree >= 1 && (
                <>
                  <CoefficientInput
                    value={eq.coefficient}
                    onChange={(value) => setCoefficient(eq.id, value)}
                    ariaLabel={`${eq.label} coefficient`}
                  />
                  <span className="shrink-0">{eq.variable} +</span>
                </>
              )}

              <CoefficientInput
                value={eq.constant}
                onChange={(value) => setConstant(eq.id, value)}
                ariaLabel={`${eq.label} constant`}
              />
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-2">
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
                  style={{
                    borderColor: `${c.stroke}55`,
                    color: c.stroke,
                  }}
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

function CoefficientInput({
  value,
  onChange,
  ariaLabel,
}: {
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Allow temporary editing states such as "", "-", "0."
    if (raw === "" || raw === "-" || /^-?\d*\.?\d{0,3}$/.test(raw)) {
      // Do not commit incomplete values to the store.
      if (raw === "" || raw === "-") return;

      // A trailing decimal is still an editing state.
      if (raw.endsWith(".")) return;

      const parsed = Number(raw);

      if (Number.isFinite(parsed)) {
        onChange(parsed);
      }
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      onClick={(e: MouseEvent) => e.stopPropagation()}
      onChange={handleChange}
      className="w-11 min-w-0 rounded-lg border border-line bg-paper px-1 py-1 text-center text-sm text-ink focus:outline-none focus:ring-2 focus:ring-chalk sm:w-12 sm:text-sm"
      aria-label={ariaLabel}
    />
  );
}