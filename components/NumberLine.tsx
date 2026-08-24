"use client";

import { useMemo, useState } from "react";
import { useLabStore } from "@/lib/store";
import { jumpSequence, valueAt } from "@/lib/types";
import { colorFor } from "@/lib/colors";

const WIDTH = 880;
const LANE_HEIGHT = 64;
const BASE_PAD_TOP = 36;
const BASE_PAD_BOTTOM = 46;
const SIDE_PAD = 32;

export default function NumberLine() {
  const equations = useLabStore((s) => s.equations);
  const activeEquationId = useLabStore((s) => s.activeEquationId);
  const setActiveEquation = useLabStore((s) => s.setActiveEquation);
  const selectedJump = useLabStore((s) => s.selectedJump);
  const setSelectedJump = useLabStore((s) => s.setSelectedJump);
  const jumpCount = useLabStore((s) => s.jumpCount);
  const setJumpCount = useLabStore((s) => s.setJumpCount);
  const range = useLabStore((s) => s.numberLineRange);
  const setRange = useLabStore((s) => s.setNumberLineRange);
  const setConstant = useLabStore((s) => s.setConstant);
  const setCoefficient = useLabStore((s) => s.setCoefficient);

  const visibleEquations = equations.filter((eq) => eq.visible);
  const active = equations.find((eq) => eq.id === activeEquationId);

  const height =
    BASE_PAD_TOP + BASE_PAD_BOTTOM + LANE_HEIGHT * Math.max(1, visibleEquations.length);
  const lineY = height - BASE_PAD_BOTTOM;
  const innerWidth = WIDTH - SIDE_PAD * 2;

  const scaleX = (value: number) =>
    SIDE_PAD + ((value - range.min) / (range.max - range.min)) * innerWidth;

  const tickStep = useMemo(() => {
    const span = range.max - range.min;
    if (span <= 12) return 1;
    if (span <= 30) return 2;
    if (span <= 60) return 5;
    return 10;
  }, [range]);

  const ticks = useMemo(() => {
    const arr: number[] = [];
    const start = Math.ceil(range.min / tickStep) * tickStep;
    for (let v = start; v <= range.max; v += tickStep) arr.push(v);
    return arr;
  }, [range, tickStep]);

  return (
    <div>
      <div className="overflow-x-auto rounded-sm border border-line bg-panel">
        <svg
          viewBox={`0 0 ${WIDTH} ${height}`}
          className="min-w-[560px] w-full"
          role="img"
          aria-label="Number line showing jump sequences for each equation"
        >
          {/* baseline */}
          <line
            x1={SIDE_PAD}
            y1={lineY}
            x2={WIDTH - SIDE_PAD}
            y2={lineY}
            stroke="#8B948A"
            strokeWidth={1.5}
          />

          {/* ticks */}
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
              {t === 0 && (
                <text
                  x={scaleX(t)}
                  y={lineY - 16}
                  textAnchor="middle"
                  className="fill-chalk font-mono"
                  fontSize={11}
                  fontWeight={600}
                >
                  0
                </text>
              )}
            </g>
          ))}

          {/* jump arcs per equation, stacked in lanes */}
          {visibleEquations.map((eq, laneIndex) => {
            const points = jumpSequence(eq, jumpCount);
            const c = colorFor(eq.label);
            const laneTop = lineY - BASE_PAD_TOP - LANE_HEIGHT * laneIndex;
            const isActive = eq.id === activeEquationId;

            return (
              <g key={eq.id} opacity={isActive ? 1 : 0.55}>
                {points.slice(0, -1).map((v, i) => {
                  const from = v;
                  const to = points[i + 1];
                  const x1 = scaleX(from);
                  const x2 = scaleX(to);
                  const midX = (x1 + x2) / 2;
                  const arcHeight = 34;
                  const apexY = laneTop - arcHeight;
                  const path = `M ${x1} ${lineY} Q ${midX} ${apexY} ${x2} ${lineY}`;
                  return (
                    <g key={i} style={{ transition: "opacity 300ms ease-out" }}>
                      <path
                        d={path}
                        fill="none"
                        stroke={c.stroke}
                        strokeWidth={isActive ? 2 : 1.5}
                        strokeDasharray={c.dash}
                        style={{ transition: "d 300ms ease-out" }}
                      />
                      <text
                        x={midX}
                        y={laneTop - arcHeight - 6}
                        textAnchor="middle"
                        fontSize={11}
                        className="font-mono"
                        fill={c.stroke}
                      >
                        {eq.coefficient >= 0 ? `+${eq.coefficient}` : eq.coefficient}
                      </text>
                    </g>
                  );
                })}

                {/* landing points */}
                {points.map((v, i) => {
                  const isSelected = isActive && i === selectedJump;
                  return (
                    <g key={i}>
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
                      <circle
                        cx={scaleX(v)}
                        cy={lineY}
                        r={4.5}
                        fill={c.stroke}
                        style={{ transition: "cx 300ms ease-out" }}
                      />
                    </g>
                  );
                })}

                {/* equation identity tag at start of lane */}
                <text
                  x={SIDE_PAD}
                  y={laneTop - 4}
                  fontSize={11}
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

      {/* controls */}
      {active && (
        <div className="mt-4 flex flex-wrap items-end gap-5">
          <NumberField
            label="Starting value"
            value={active.constant}
            onChange={(v) => setConstant(active.id, v)}
            colorLabel={active.label}
          />
          <NumberField
            label="Jump size"
            value={active.coefficient}
            onChange={(v) => setCoefficient(active.id, v)}
            colorLabel={active.label}
          />
          <NumberField
            label="Number of jumps"
            value={jumpCount}
            min={1}
            max={20}
            onChange={(v) => {
              setJumpCount(Math.max(1, Math.round(v)));
              if (selectedJump > v) setSelectedJump(Math.max(1, Math.round(v)));
            }}
          />

          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide text-ink-faint">
              Step through jumps
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous jump"
                onClick={() => setSelectedJump(Math.max(0, selectedJump - 1))}
                className="h-8 w-8 rounded-sm border border-line text-ink hover:border-ink-soft"
              >
                &minus;
              </button>
              <span className="w-14 text-center font-mono text-sm text-ink">
                jump {selectedJump}
              </span>
              <button
                type="button"
                aria-label="Next jump"
                onClick={() => setSelectedJump(Math.min(jumpCount, selectedJump + 1))}
                className="h-8 w-8 rounded-sm border border-line text-ink hover:border-ink-soft"
              >
                +
              </button>
            </div>
          </div>

          <div className="ml-auto flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide text-ink-faint">
              Landing point
            </span>
            <span className="font-mono text-sm text-chalk">
              y = {valueAt(active, selectedJump)}
            </span>
          </div>
        </div>
      )}

      {equations.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {equations.map((eq) => {
            const c = colorFor(eq.label);
            const isActive = eq.id === activeEquationId;
            return (
              <button
                key={eq.id}
                type="button"
                onClick={() => setActiveEquation(eq.id)}
                className={`rounded-sm border px-2.5 py-1 font-mono text-xs transition-colors ${
                  isActive ? c.ring + " " + c.bg : "border-line text-ink-soft"
                }`}
              >
                {eq.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-3 flex items-center gap-3 text-[11px] text-ink-faint">
        <span>Visible range</span>
        <input
          type="number"
          value={range.min}
          onChange={(e) => setRange(Number(e.target.value), range.max)}
          className="w-16 rounded-sm border border-line bg-paper px-1.5 py-0.5 font-mono text-xs text-ink"
          aria-label="Number line minimum"
        />
        <span>to</span>
        <input
          type="number"
          value={range.max}
          onChange={(e) => setRange(range.min, Number(e.target.value))}
          className="w-16 rounded-sm border border-line bg-paper px-1.5 py-0.5 font-mono text-xs text-ink"
          aria-label="Number line maximum"
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
  const c = colorLabel ? colorFor(colorLabel) : undefined;
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-24 rounded-sm border bg-paper px-2 py-1 font-mono text-sm text-ink focus:outline-none focus:ring-2 focus:ring-chalk ${
          c ? c.ring : "border-line"
        }`}
      />
    </label>
  );
}
