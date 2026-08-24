"use client";

import { useMemo, useState } from "react";
import { useLabStore } from "@/lib/store";
import { jumpSequence, valueAt } from "@/lib/types";
import { colorFor } from "@/lib/colors";

const WIDTH = 440;
const HEIGHT = 440;
const PAD = 40;

export default function Graph() {
  const equations = useLabStore((s) => s.equations);
  const activeEquationId = useLabStore((s) => s.activeEquationId);
  const setActiveEquation = useLabStore((s) => s.setActiveEquation);
  const jumpCount = useLabStore((s) => s.jumpCount);
  const selectedJump = useLabStore((s) => s.selectedJump);
  const setSelectedJump = useLabStore((s) => s.setSelectedJump);

  const [hover, setHover] = useState<{ eqId: string; jump: number } | null>(
    null
  );

  const visible = equations.filter((eq) => eq.visible);

  const { yMin, yMax } = useMemo(() => {
    let lo = 0;
    let hi = 0;
    visible.forEach((eq) => {
      jumpSequence(eq, jumpCount).forEach((v) => {
        lo = Math.min(lo, v);
        hi = Math.max(hi, v);
      });
    });
    if (lo === hi) {
      lo -= 5;
      hi += 5;
    }
    const pad = (hi - lo) * 0.12;
    return { yMin: lo - pad, yMax: hi + pad };
  }, [visible, jumpCount]);

  const xMin = 0;
  const xMax = Math.max(1, jumpCount);

  const scaleX = (x: number) =>
    PAD + ((x - xMin) / (xMax - xMin)) * (WIDTH - PAD * 2);
  const scaleY = (y: number) =>
    HEIGHT - PAD - ((y - yMin) / (yMax - yMin)) * (HEIGHT - PAD * 2);

  const xTicks = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i <= xMax; i++) arr.push(i);
    return arr;
  }, [xMax]);

  const yTickStep = useMemo(() => {
    const span = yMax - yMin;
    const raw = span / 6;
    const pow = Math.pow(10, Math.floor(Math.log10(raw || 1)));
    const norm = raw / pow;
    const step = norm >= 5 ? 5 : norm >= 2 ? 2 : 1;
    return step * pow;
  }, [yMin, yMax]);

  const yTicks = useMemo(() => {
    const arr: number[] = [];
    const start = Math.ceil(yMin / yTickStep) * yTickStep;
    for (let v = start; v <= yMax; v += yTickStep) arr.push(Math.round(v));
    return arr;
  }, [yMin, yMax, yTickStep]);

  return (
    <div className="rounded-sm border border-line bg-panel p-2">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Graph of jump number against resulting value for each equation"
      >
        {/* grid */}
        {xTicks.map((x) => (
          <line
            key={`gx${x}`}
            x1={scaleX(x)}
            x2={scaleX(x)}
            y1={PAD}
            y2={HEIGHT - PAD}
            stroke="#E7EAE2"
            strokeWidth={1}
          />
        ))}
        {yTicks.map((y) => (
          <line
            key={`gy${y}`}
            x1={PAD}
            x2={WIDTH - PAD}
            y1={scaleY(y)}
            y2={scaleY(y)}
            stroke="#E7EAE2"
            strokeWidth={1}
          />
        ))}

        {/* axes */}
        {yMin <= 0 && yMax >= 0 && (
          <line
            x1={PAD}
            x2={WIDTH - PAD}
            y1={scaleY(0)}
            y2={scaleY(0)}
            stroke="#8B948A"
            strokeWidth={1.5}
          />
        )}
        <line
          x1={scaleX(0)}
          x2={scaleX(0)}
          y1={PAD}
          y2={HEIGHT - PAD}
          stroke="#8B948A"
          strokeWidth={1.5}
        />

        {/* axis labels */}
        {xTicks.map((x) => (
          <text
            key={`xl${x}`}
            x={scaleX(x)}
            y={HEIGHT - PAD + 16}
            textAnchor="middle"
            fontSize={10}
            className="fill-ink-soft font-mono"
          >
            {x}
          </text>
        ))}
        {yTicks.map((y) => (
          <text
            key={`yl${y}`}
            x={PAD - 8}
            y={scaleY(y) + 3}
            textAnchor="end"
            fontSize={10}
            className="fill-ink-soft font-mono"
          >
            {y}
          </text>
        ))}
        <text
          x={WIDTH - PAD}
          y={PAD - 14}
          textAnchor="end"
          fontSize={10}
          className="fill-ink-faint font-mono"
        >
          jump number →
        </text>

        {/* lines + points per equation */}
        {visible.map((eq) => {
          const c = colorFor(eq.label);
          const points = jumpSequence(eq, jumpCount);
          const isActive = eq.id === activeEquationId;
          const pathD = points
            .map((v, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(v)}`)
            .join(" ");

          return (
            <g key={eq.id} opacity={isActive ? 1 : 0.5}>
              <path
                d={pathD}
                fill="none"
                stroke={c.stroke}
                strokeWidth={isActive ? 2.25 : 1.5}
                strokeDasharray={c.dash}
                style={{ transition: "d 300ms ease-out" }}
              />
              {points.map((v, i) => {
                const isSelected = isActive && i === selectedJump;
                const isHovered = hover?.eqId === eq.id && hover.jump === i;
                return (
                  <g key={i}>
                    <circle
                      cx={scaleX(i)}
                      cy={scaleY(v)}
                      r={isSelected ? 6 : 4}
                      fill={c.stroke}
                      stroke={isSelected ? "#C6852B" : "none"}
                      strokeWidth={2}
                      className="cursor-pointer"
                      style={{ transition: "cx 300ms ease-out, cy 300ms ease-out" }}
                      onMouseEnter={() => setHover({ eqId: eq.id, jump: i })}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => {
                        setActiveEquation(eq.id);
                        setSelectedJump(i);
                      }}
                    />
                    {isHovered && (
                      <g>
                        <rect
                          x={scaleX(i) + 8}
                          y={scaleY(v) - 26}
                          width={64}
                          height={20}
                          rx={3}
                          fill="#1D2321"
                        />
                        <text
                          x={scaleX(i) + 40}
                          y={scaleY(v) - 12}
                          textAnchor="middle"
                          fontSize={10}
                          fill="#F4F5F0"
                          className="font-mono"
                        >
                          ({i}, {v})
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
