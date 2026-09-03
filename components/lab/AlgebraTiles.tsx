"use client";

import { useState } from "react";
import type { Equation } from "@/lib/challenge-types";
import { equationDegree, valueAt } from "@/lib/challenge-types";
import { colorFor } from "@/lib/colors";
import { useLabStore } from "@/lib/lab-store";

const POSITIVE = "#2E63C9";
const NEGATIVE = "#E0632E";
const MAX_VISIBLE_INPUTS = 8;

function UnitTile({ sign, size = 40 }: { sign: 1 | -1; size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-lg font-mono text-xs font-semibold text-white shadow-sm"
      style={{
        width: size,
        height: size,
        background: sign > 0 ? POSITIVE : NEGATIVE,
        backgroundImage:
          sign < 0
            ? "repeating-linear-gradient(135deg, rgba(255,255,255,0.18) 0 4px, transparent 4px 8px)"
            : undefined,
      }}
    >
      {sign > 0 ? "1" : "−1"}
    </span>
  );
}

function XTile({ sign, square = false }: { sign: 1 | -1; square?: boolean }) {
  return (
    <span
      className="flex items-center justify-center rounded-lg font-mono text-sm font-semibold text-white shadow-sm"
      style={{
        width: square ? 44 : 64,
        height: 44,
        background: sign > 0 ? POSITIVE : NEGATIVE,
        backgroundImage:
          sign < 0
            ? "repeating-linear-gradient(135deg, rgba(255,255,255,0.18) 0 4px, transparent 4px 8px)"
            : undefined,
      }}
    >
      {square ? (sign > 0 ? "x²" : "−x²") : sign > 0 ? "x" : "−x"}
    </span>
  );
}

export default function AlgebraTiles() {
  const equations = useLabStore((state) => state.equations);
  const activeEquationId = useLabStore((state) => state.activeEquationId);
  const selectedInput = useLabStore((state) => state.selectedInput);

  const active = equations.find((eq) => eq.id === activeEquationId);
  if (!active) return null;

  const degree = equationDegree(active);

  if (degree === 3) {
    return (
      <div className="rounded-2xl border border-line bg-panel p-5 text-center">
        <p className="font-display text-base font-semibold text-ink">Cubes not supported</p>
        <p className="mt-1 text-xs text-ink-faint">
          Algebra Tiles currently show terms through x².
        </p>
      </div>
    );
  }

  if (degree === 2) {
    return <QuadraticTiles active={active} selectedInput={selectedInput} />;
  }

  return <LinearTiles active={active} selectedInput={selectedInput} />;
}

function LinearTiles({
  active,
  selectedInput,
}: {
  active: Equation;
  selectedInput: number | null;
}) {
  const setCoefficient = useLabStore((state) => state.setCoefficient);
  const setConstant = useLabStore((state) => state.setConstant);
  const inputStart = useLabStore((state) => state.inputStart);
  const inputCount = useLabStore((state) => state.inputCount);
  const [mode, setMode] = useState<"concrete" | "compressed">("concrete");
  const colors = colorFor(active.label);
  const xCount = Math.abs(active.coefficient);
  const xSign: 1 | -1 = active.coefficient < 0 ? -1 : 1;
  const unitCount = Math.abs(active.constant);
  const unitSign: 1 | -1 = active.constant < 0 ? -1 : 1;

  const inputs = Array.from(
    { length: Math.min(inputCount + 1, MAX_VISIBLE_INPUTS) },
    (_, index) => inputStart + index
  );
  const capped = inputCount + 1 > MAX_VISIBLE_INPUTS;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-bold ${colors.text}`}
            style={{ border: `1.5px solid ${colors.stroke}` }}
            aria-hidden="true"
          >
            {active.label}
          </span>
          <span className="text-[11px] text-ink-faint">see the repeated structure</span>
        </div>

        <div className="flex shrink-0 rounded-full border border-line p-0.5 text-[11px]">
          <button
            type="button"
            onClick={() => setMode("concrete")}
            className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
              mode === "concrete" ? "bg-ink text-white" : "text-ink-soft"
            }`}
          >
            Step by step
          </button>
          <button
            type="button"
            onClick={() => setMode("compressed")}
            className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
              mode === "compressed" ? "bg-ink text-white" : "text-ink-soft"
            }`}
          >
            All together
          </button>
        </div>
      </div>

      {mode === "concrete" ? (
        <div className="rounded-2xl border border-line bg-panel p-4">
          <p className="mb-2 font-mono text-[11px] tracking-wide text-ink-faint">constant</p>
          <div className="flex flex-wrap gap-1.5">
            {unitCount === 0 ? (
              <span className="text-xs text-ink-faint">0</span>
            ) : (
              Array.from({ length: unitCount }, (_, index) => (
                <UnitTile key={`unit-${index}`} sign={unitSign} />
              ))
            )}
          </div>

          <p className="mb-2 mt-4 font-mono text-[11px] tracking-wide text-ink-faint">
            then, each value adds
          </p>

          <div className="flex flex-col gap-2">
            {inputs.map((input) => (
              <div
                key={input}
                className={`flex flex-wrap items-center gap-1.5 rounded-lg p-1 ${
                  selectedInput === input ? "bg-primary-soft" : ""
                }`}
              >
                <span className="w-14 shrink-0 font-mono text-[11px] text-ink-faint">{input}</span>
                {Array.from({ length: xCount }, (_, index) => (
                  <button
                    key={`x-${input}-${index}`}
                    type="button"
                    onClick={() => setCoefficient(active.id, active.coefficient - xSign)}
                    aria-label="Remove one x tile"
                  >
                    <XTile sign={xSign} />
                  </button>
                ))}
              </div>
            ))}
          </div>

          {capped && (
            <p className="mt-2 text-[11px] text-ink-faint">
              Showing the first {MAX_VISIBLE_INPUTS} values — the same structure continues.
            </p>
          )}

          {selectedInput !== null && (
            <p className="mt-4 font-mono text-xs text-ink">
              {active.coefficient} × {selectedInput} + {active.constant} = {" "}
              {valueAt(active, selectedInput)}
            </p>
          )}
        </div>
      ) : (
        <div className="flex min-h-[104px] flex-wrap items-center gap-2.5 rounded-2xl border border-line bg-panel p-4">
          {Array.from({ length: xCount }, (_, index) => (
            <button
              key={`x-${index}`}
              type="button"
              title="Remove one x tile"
              aria-label="Remove one x tile"
              onClick={() => setCoefficient(active.id, active.coefficient - xSign)}
              className="flex h-11 w-16 items-center justify-center rounded-xl font-mono text-base font-semibold text-white shadow-sm"
              style={{ background: xSign > 0 ? POSITIVE : NEGATIVE }}
            >
              {xSign > 0 ? "x" : "−x"}
            </button>
          ))}

          {xCount > 0 && unitCount > 0 && (
            <span className="mx-1 font-mono text-lg text-ink-faint">+</span>
          )}

          {Array.from({ length: unitCount }, (_, index) => (
            <button
              key={`unit-${index}`}
              type="button"
              title="Remove one unit tile"
              aria-label="Remove one unit tile"
              onClick={() => setConstant(active.id, active.constant - unitSign)}
              className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-base font-semibold text-white shadow-sm"
              style={{ background: unitSign > 0 ? POSITIVE : NEGATIVE }}
            >
              {unitSign > 0 ? "1" : "−1"}
            </button>
          ))}

          {xCount === 0 && unitCount === 0 && (
            <span className="text-sm text-ink-faint">Empty — add tiles below.</span>
          )}
        </div>
      )}

      {mode === "compressed" && (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <TileButton label="+ x tile" onClick={() => setCoefficient(active.id, active.coefficient + 1)} />
            <TileButton label="− x tile" onClick={() => setCoefficient(active.id, active.coefficient - 1)} />
            <TileButton label="+ 1 tile" onClick={() => setConstant(active.id, active.constant + 1)} />
            <TileButton label="− 1 tile" onClick={() => setConstant(active.id, active.constant - 1)} />
          </div>
          <p className="mt-3 font-mono text-xs text-ink-faint">
            {active.coefficient} × {active.variable} + {active.constant}
          </p>
        </>
      )}
    </div>
  );
}

function QuadraticTiles({
  active,
  selectedInput,
}: {
  active: Equation;
  selectedInput: number | null;
}) {
  const setQuadratic = useLabStore((state) => state.setQuadratic);
  const setCoefficient = useLabStore((state) => state.setCoefficient);
  const setConstant = useLabStore((state) => state.setConstant);
  const [mode, setMode] = useState<"concrete" | "compressed">("concrete");
  const colors = colorFor(active.label);
  const squareCount = Math.abs(active.quadratic);
  const squareSign: 1 | -1 = active.quadratic < 0 ? -1 : 1;
  const xCount = Math.abs(active.coefficient);
  const xSign: 1 | -1 = active.coefficient < 0 ? -1 : 1;
  const unitCount = Math.abs(active.constant);
  const unitSign: 1 | -1 = active.constant < 0 ? -1 : 1;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-bold ${colors.text}`}
            style={{ border: `1.5px solid ${colors.stroke}` }}
            aria-hidden="true"
          >
            {active.label}
          </span>
          <span className="text-[11px] text-ink-faint">see the repeated structure</span>
        </div>
        <div className="flex shrink-0 rounded-full border border-line p-0.5 text-[11px]">
          <button type="button" onClick={() => setMode("concrete")} className={`rounded-full px-2.5 py-1 font-medium ${mode === "concrete" ? "bg-ink text-white" : "text-ink-soft"}`}>Step by step</button>
          <button type="button" onClick={() => setMode("compressed")} className={`rounded-full px-2.5 py-1 font-medium ${mode === "compressed" ? "bg-ink text-white" : "text-ink-soft"}`}>All together</button>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-panel p-4">
        <p className="mb-2 font-mono text-[11px] tracking-wide text-ink-faint">equation tiles</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {Array.from({ length: squareCount }, (_, index) => (
            <button key={`square-${index}`} type="button" title="Remove one x² tile" aria-label="Remove one x² tile" onClick={() => setQuadratic(active.id, active.quadratic - squareSign)}>
              <XTile sign={squareSign} square />
            </button>
          ))}
          {squareCount > 0 && xCount > 0 && <span className="mx-1 font-mono text-lg text-ink-faint">+</span>}
          {Array.from({ length: xCount }, (_, index) => (
            <button key={`x-${index}`} type="button" title="Remove one x tile" aria-label="Remove one x tile" onClick={() => setCoefficient(active.id, active.coefficient - xSign)}>
              <XTile sign={xSign} />
            </button>
          ))}
          {(squareCount > 0 || xCount > 0) && unitCount > 0 && <span className="mx-1 font-mono text-lg text-ink-faint">+</span>}
          {Array.from({ length: unitCount }, (_, index) => (
            <button key={`unit-${index}`} type="button" title="Remove one unit tile" aria-label="Remove one unit tile" onClick={() => setConstant(active.id, active.constant - unitSign)}>
              <UnitTile sign={unitSign} />
            </button>
          ))}
          {squareCount === 0 && xCount === 0 && unitCount === 0 && <span className="text-sm text-ink-faint">Empty — add tiles below.</span>}
        </div>

        {selectedInput !== null && (
          <p className="mt-4 font-mono text-xs text-ink">
            {formatEvaluation(active, selectedInput)}
          </p>
        )}
      </div>

      {mode === "compressed" && (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <TileButton label="+ x² tile" onClick={() => setQuadratic(active.id, active.quadratic + 1)} />
            <TileButton label="− x² tile" onClick={() => setQuadratic(active.id, active.quadratic - 1)} />
            <TileButton label="+ x tile" onClick={() => setCoefficient(active.id, active.coefficient + 1)} />
            <TileButton label="− x tile" onClick={() => setCoefficient(active.id, active.coefficient - 1)} />
            <TileButton label="+ 1 tile" onClick={() => setConstant(active.id, active.constant + 1)} />
            <TileButton label="− 1 tile" onClick={() => setConstant(active.id, active.constant - 1)} />
          </div>
          <p className="mt-3 font-mono text-xs text-ink-faint">{formatPolynomial(active)}</p>
        </>
      )}
    </div>
  );
}

function formatEvaluation(eq: Equation, input: number) {
  const parts: string[] = [];
  if (eq.cubic) parts.push(`${eq.cubic} × ${input}³`);
  if (eq.quadratic) parts.push(`${eq.quadratic} × ${input}²`);
  if (eq.coefficient) parts.push(`${eq.coefficient} × ${input}`);
  if (eq.constant) parts.push(String(eq.constant));
  return `${parts.join(" + ").replace(/\+ -/g, "− ")} = ${valueAt(eq, input)}`;
}

function formatPolynomial(eq: { cubic: number; quadratic: number; coefficient: number; constant: number; variable: string }) {
  const terms: string[] = [];
  if (eq.cubic) terms.push(`${eq.cubic} × ${eq.variable}³`);
  if (eq.quadratic) terms.push(`${eq.quadratic} × ${eq.variable}²`);
  if (eq.coefficient) terms.push(`${eq.coefficient} × ${eq.variable}`);
  if (eq.constant || !terms.length) terms.push(String(eq.constant));
  return terms.join(" + ").replace(/\+ -/g, "− ");
}

function TileButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-ink-soft hover:bg-line-soft hover:text-ink">
      {label}
    </button>
  );
}
