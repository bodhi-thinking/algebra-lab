"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useLabStore } from "@/lib/lab-store";
import { equationDegree, sequenceValues, valueAt } from "@/lib/challenge-types";
import { colorFor } from "@/lib/colors";

const WIDTH = 880;
const LANE_HEIGHT = 52;
const BASE_PAD_TOP = 30;
const BASE_PAD_BOTTOM = 54;
const SIDE_PAD = 28;

export default function NumberLine() {
  const equations = useLabStore((s) => s.equations);
  const activeEquationId = useLabStore((s) => s.activeEquationId);
  const setActiveEquation = useLabStore((s) => s.setActiveEquation);

  const selectedInput = useLabStore((s) => s.selectedInput);
  const setSelectedInput = useLabStore((s) => s.setSelectedInput);

  const inputStart = useLabStore((s) => s.inputStart);
  const inputCount = useLabStore((s) => s.inputCount);
  const setInputStart = useLabStore((s) => s.setInputStart);
  const setInputCount = useLabStore((s) => s.setInputCount);

  const range = useLabStore((s) => s.numberLineRange);
  const setRange = useLabStore((s) => s.setNumberLineRange);
  const division = useLabStore((s) => s.numberLineDivision);
  const setDivision = useLabStore((s) => s.setNumberLineDivision);

  const setCoefficient = useLabStore((s) => s.setCoefficient);

  const selectedOrStart = selectedInput ?? inputStart;
  const [highlightDraft, setHighlightDraft] = useState(
    selectedInput === null ? "" : String(selectedInput)
  );

  useEffect(() => {
    setHighlightDraft(selectedInput === null ? "" : String(selectedInput));
  }, [selectedInput]);

  const visibleEquations = equations.filter((eq) => eq.visible);
  const active = equations.find((eq) => eq.id === activeEquationId);

  /*
   * Jumps means the number of changes from the starting value.
   *
   * Example:
   * Start at = 1
   * Jumps = 7
   *
   * Values shown:
   * 1, 2, 3, 4, 5, 6, 7, 8
   *
   * Therefore we need inputCount + 1 values.
   */
  const pointsFor = (eq: (typeof equations)[number]) =>
    sequenceValues(eq, inputStart, inputCount + 1);

  const height =
    BASE_PAD_TOP +
    BASE_PAD_BOTTOM +
    LANE_HEIGHT * Math.max(1, visibleEquations.length);

  const lineY = height - BASE_PAD_BOTTOM;
  const innerWidth = WIDTH - SIDE_PAD * 2;

  const scaleX = (value: number) => {
    const ratio = (value - range.min) / (range.max - range.min);
    const clamped = Math.max(0, Math.min(1, ratio));
    return SIDE_PAD + clamped * innerWidth;
  };

  const tickStep = useMemo(() => {
    const span = range.max - range.min;
    return Math.max(division, Math.ceil(span / 120) * division);
  }, [range, division]);

  const ticks = useMemo(() => {
    const arr: number[] = [];
    const start = Math.ceil(range.min / tickStep) * tickStep;

    for (let v = start; v <= range.max && arr.length < 140; v += tickStep) {
      arr.push(v);
    }

    return arr;
  }, [range, tickStep]);

  /*
   * Because Jumps excludes the starting value, the final selectable
   * number is Start at + Jumps.
   */
  const firstNumber = inputStart;
  const lastNumber = inputStart + inputCount;

  return (
    <div>
      {/* Number line */}
      <div className="overflow-x-auto rounded-2xl border border-line bg-panel">
        <svg
          viewBox={`0 0 ${WIDTH} ${height}`}
          className="min-w-[560px] w-full"
          role="img"
          aria-label="Number line showing the relationship between numbers and results for each equation"
        >
          {/* Base line */}
          <line
            x1={SIDE_PAD}
            y1={lineY}
            x2={WIDTH - SIDE_PAD}
            y2={lineY}
            stroke="#8B948A"
            strokeWidth={1.5}
          />

          {/* Ticks */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={scaleX(t)}
                x2={scaleX(t)}
                y1={lineY - (t === 0 ? 10 : 6)}
                y2={lineY + (t === 0 ? 10 : 6)}
                stroke={t === 0 ? "#C6852B" : "#AAB3A5"}
                strokeWidth={t === 0 ? 2 : 1}
              />

              <text
                x={scaleX(t)}
                y={lineY + 22}
                textAnchor="middle"
                className="fill-ink-soft font-mono"
                fontSize={12}
              >
                {t}
              </text>
            </g>
          ))}

          {/* Equations / jump lanes */}
          {visibleEquations.map((eq, laneIndex) => {
            const points = pointsFor(eq);
            const c = colorFor(eq.label);

            const laneTop =
              lineY -
              BASE_PAD_TOP -
              LANE_HEIGHT * laneIndex;

            const isActive = eq.id === activeEquationId;

            return (
              <g
                key={eq.id}
                opacity={isActive ? 1 : 0.62}
              >
                {/* Jumps */}
                {points.slice(0, -1).map((from, i) => {
                  const to = points[i + 1];

                  const x1 = scaleX(from);
                  const x2 = scaleX(to);
                  const midX = (x1 + x2) / 2;

                  const arcHeight = 26;
                  const apexY = laneTop - arcHeight;

                  const path = `M ${x1} ${lineY} Q ${midX} ${apexY} ${x2} ${lineY}`;

                  return (
                    <g key={i}>
                      <path
                        d={path}
                        fill="none"
                        stroke={c.stroke}
                        strokeWidth={isActive ? 2.5 : 1.75}
                        strokeDasharray={c.dash}
                      />

                      <text
                        x={midX}
                        y={laneTop - arcHeight - 6}
                        textAnchor="middle"
                        fontSize={12}
                        className="font-mono"
                        fill={c.stroke}
                      >
                        {eq.coefficient >= 0
                          ? `+${eq.coefficient}`
                          : eq.coefficient}
                      </text>
                    </g>
                  );
                })}

                {/* Number points */}
                {points.map((v, i) => {
                  const pointNumber = inputStart + i;

                  const isSelected =
                    isActive &&
                    pointNumber === selectedInput;

                  return (
                    <g
                      key={pointNumber}
                      role="button"
                      tabIndex={0}
                      aria-label={`Number ${pointNumber}, result ${v}`}
                      onClick={() => {
                        setActiveEquation(eq.id);
                        setSelectedInput(pointNumber);
                      }}
                      onKeyDown={(e: KeyboardEvent) => {
                        if (
                          e.key === "Enter" ||
                          e.key === " "
                        ) {
                          e.preventDefault();

                          setActiveEquation(eq.id);
                          setSelectedInput(pointNumber);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {/* Highlight ring */}
                      {isSelected && (
                        <circle
                          cx={scaleX(v)}
                          cy={lineY}
                          r={9}
                          fill="none"
                          stroke="#C6852B"
                          strokeWidth={2}
                        />
                      )}

                      {/* Point */}
                      <circle
                        cx={scaleX(v)}
                        cy={lineY}
                        r={i === 0 ? 6 : 4.5}
                        fill={c.stroke}
                        stroke={
                          i === 0
                            ? "#232A26"
                            : "none"
                        }
                        strokeWidth={1.5}
                      />
                    </g>
                  );
                })}

                {/* Equation label */}
                <text
                  x={SIDE_PAD}
                  y={laneTop - 4}
                  fontSize={12}
                  className="font-mono"
                  fill={c.stroke}
                  fontWeight={700}
                >
                  {eq.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {active && (
        <div className="mt-3 flex flex-wrap items-end gap-4">
          {/* Start */}
          <NumberField
            label="Start at"
            value={inputStart}
            min={-100}
            max={100}
            onChange={setInputStart}
          />

          {/* A single change value only describes a linear rule. */}
          {equationDegree(active) <= 1 && (
            <NumberField
              label="Change by"
              value={active.coefficient}
              min={-100}
              max={100}
              onChange={(v) => setCoefficient(active.id, v)}
              colorLabel={active.label}
            />
          )}

          {/* Jumps */}
          <NumberField
            label="Jumps"
            value={inputCount}
            min={1}
            max={100}
            onChange={(v) =>
              setInputCount(Math.round(v))
            }
          />

          {/* Highlight + Result */}
          <div className="basis-full border-t border-line-soft pt-3 sm:pt-4">
            <div className="flex flex-wrap items-end gap-6">
              {/* Highlight */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] tracking-wide text-ink-faint">
                  Highlight
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Previous number"
                    onClick={() =>
                      setSelectedInput(
                        Math.max(
                          firstNumber,
                          selectedOrStart - 1
                        )
                      )
                    }
                    className="h-8 w-8 rounded-full border border-line text-ink hover:border-ink-soft hover:bg-line-soft"
                  >
                    &minus;
                  </button>

                  <input
                    type="number"
                    inputMode="numeric"
                    value={highlightDraft}
                    min={firstNumber}
                    max={lastNumber}
                    placeholder="none"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const raw = e.target.value;
                      setHighlightDraft(raw);
                      if (raw === "") {
                        setSelectedInput(null);
                        return;
                      }
                      const value = Number(raw);
                      if (Number.isFinite(value)) {
                        setSelectedInput(
                          Math.max(firstNumber, Math.min(lastNumber, Math.round(value)))
                        );
                      }
                    }}
                    onBlur={() => {
                      if (highlightDraft === "") setSelectedInput(null);
                    }}
                    className="w-20 rounded-lg border border-line bg-paper px-1.5 py-1 text-center font-mono text-sm text-ink focus:outline-none focus:ring-2 focus:ring-chalk"
                    aria-label="Highlighted input"
                  />

                  <button
                    type="button"
                    aria-label="Next number"
                    onClick={() =>
                      setSelectedInput(
                        Math.min(
                          lastNumber,
                          selectedOrStart + 1
                        )
                      )
                    }
                    className="h-8 w-8 rounded-full border border-line text-ink hover:border-ink-soft hover:bg-line-soft"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Result */}
              {selectedInput !== null && (
                <div className="flex items-center gap-2 whitespace-nowrap pb-1">
                  <span className="text-[11px] tracking-wide text-ink-faint">
                    Result at {selectedInput}:
                  </span>

                  <span
                    className="font-mono text-sm font-semibold"
                    style={{
                      color: colorFor(active.label).stroke,
                    }}
                  >
                    y ={" "}
                    {valueAt(
                      active,
                      selectedInput
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Equation selector */}
      {equations.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {equations.map((eq) => {
            const c = colorFor(eq.label);
            const isActive =
              eq.id === activeEquationId;

            return (
              <button
                key={eq.id}
                type="button"
                onClick={() =>
                  setActiveEquation(eq.id)
                }
                className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
                  isActive
                    ? `${c.ring} ${c.bg}`
                    : "border-line text-ink-soft"
                }`}
              >
                {eq.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Visible range + divisions */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-ink-faint">
        <span>Visible range</span>

        <input
          type="number"
          value={range.min}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRange(Number(e.target.value), range.max)
          }
          className="w-16 rounded-lg border border-line bg-paper px-1.5 py-0.5 font-mono text-xs text-ink"
          aria-label="Number line minimum"
        />

        <span>to</span>

        <input
          type="number"
          value={range.max}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRange(range.min, Number(e.target.value))
          }
          className="w-16 rounded-lg border border-line bg-paper px-1.5 py-0.5 font-mono text-xs text-ink"
          aria-label="Number line maximum"
        />

        <span>Divisions</span>

        <input
          type="number"
          min={1}
          max={50}
          value={division}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDivision(Number(e.target.value))
          }
          className="w-14 rounded-lg border border-line bg-paper px-1.5 py-0.5 font-mono text-xs text-ink"
          aria-label="Number line divisions"
        />
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  colorLabel,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  colorLabel?: string;
}) {
  const c = colorLabel
    ? colorFor(colorLabel)
    : undefined;

  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] tracking-wide text-ink-faint">
        {label}
      </span>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(
          e: ChangeEvent<HTMLInputElement>
        ) => onChange(Number(e.target.value))}
        className={`w-24 rounded-lg border bg-paper px-2 py-1.5 font-mono text-sm text-ink focus:outline-none focus:ring-2 focus:ring-chalk ${
          c ? c.ring : "border-line"
        }`}
      />
    </label>
  );
}