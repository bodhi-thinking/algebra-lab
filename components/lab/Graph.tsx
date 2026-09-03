"use client";

import type { ChangeEvent, KeyboardEvent } from "react";
import { useMemo, useState } from "react";
import { equationDegree, sequenceValues, valueAt } from "@/lib/challenge-types";
import { colorFor } from "@/lib/colors";
import { useLabStore } from "@/lib/lab-store";

const WIDTH = 560;
const HEIGHT = 330;
const PAD = 44;
const MAX_TICKS = 24;
const CURVE_SAMPLES = 120;

export default function Graph() {
  const equations = useLabStore((state) => state.equations);
  const activeEquationId = useLabStore((state) => state.activeEquationId);
  const setActiveEquation = useLabStore((state) => state.setActiveEquation);
  const inputStart = useLabStore((state) => state.inputStart);
  const inputCount = useLabStore((state) => state.inputCount);
  const selectedInput = useLabStore((state) => state.selectedInput);
  const setSelectedInput = useLabStore((state) => state.setSelectedInput);
  const graphXRange = useLabStore((state) => state.graphXRange);
  const setGraphXRange = useLabStore((state) => state.setGraphXRange);
  const graphXDivision = useLabStore((state) => state.graphXDivision);
  const setGraphXDivision = useLabStore((state) => state.setGraphXDivision);
  const [hover, setHover] = useState<{
    eqId: string;
    input: number;
  } | null>(null);

  const visible = equations.filter((equation) => equation.visible);
  const xMin = graphXRange.min;
  const xMax = Math.max(xMin + 1, graphXRange.max);

  const pointsFor = (equation: (typeof equations)[number]) =>
    sequenceValues(equation, inputStart, inputCount + 1);

  const curvePointsFor = (equation: (typeof equations)[number]) =>
    Array.from({ length: CURVE_SAMPLES + 1 }, (_, index) => {
      const x = xMin + ((xMax - xMin) * index) / CURVE_SAMPLES;
      return { x, y: valueAt(equation, x) };
    });

  const { yMin, yMax } = useMemo(() => {
    let min = 0;
    let max = 0;

    visible.forEach((equation) => {
      curvePointsFor(equation).forEach(({ y }) => {
        min = Math.min(min, y);
        max = Math.max(max, y);
      });
    });

    if (min === max) {
      min -= 5;
      max += 5;
    }

    const padding = (max - min) * 0.12;
    return {
      yMin: min - padding,
      yMax: max + padding,
    };
  }, [visible, xMin, xMax]);

  const scaleX = (x: number) =>
    PAD + ((x - xMin) / (xMax - xMin)) * (WIDTH - PAD * 2);

  const scaleY = (y: number) =>
    HEIGHT -
    PAD -
    ((y - yMin) / (yMax - yMin)) * (HEIGHT - PAD * 2);

  const xTickStep = graphXDivision;

  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    const start = Math.ceil(xMin / xTickStep) * xTickStep;
    for (let value = start; value <= xMax; value += xTickStep) {
      ticks.push(Number(value.toFixed(6)));
    }
    return ticks.slice(0, MAX_TICKS);
  }, [xMin, xMax, xTickStep]);

  const yTickStep = useMemo(() => {
    const raw = (yMax - yMin) / 6;
    const power = Math.pow(10, Math.floor(Math.log10(raw || 1)));
    const normalized = raw / power;
    const multiplier = normalized >= 5 ? 5 : normalized >= 2 ? 2 : 1;
    return multiplier * power;
  }, [yMin, yMax]);

  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const start = Math.ceil(yMin / yTickStep) * yTickStep;
    for (let value = start; value <= yMax; value += yTickStep) {
      ticks.push(Number(value.toFixed(6)));
    }
    return ticks.slice(0, MAX_TICKS);
  }, [yMin, yMax, yTickStep]);

  return (
    <div>
      <div className="rounded-2xl border border-line bg-panel p-2">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="mx-auto block h-auto w-full"
          style={{ maxWidth: WIDTH }}
          role="img"
          aria-label="Graph of x values against y values for each equation"
        >
          {xTicks.map((x) => (
            <line
              key={`gx-${x}`}
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
              key={`gy-${y}`}
              x1={PAD}
              x2={WIDTH - PAD}
              y1={scaleY(y)}
              y2={scaleY(y)}
              stroke="#E7EAE2"
              strokeWidth={1}
            />
          ))}

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
            x1={scaleX(xMin)}
            x2={scaleX(xMin)}
            y1={PAD}
            y2={HEIGHT - PAD}
            stroke="#8B948A"
            strokeWidth={1.5}
          />

          {xTicks.map((x) => (
            <text
              key={`xl-${x}`}
              x={scaleX(x)}
              y={HEIGHT - PAD + 16}
              textAnchor="middle"
              fontSize={11}
              className="fill-ink-soft font-mono"
            >
              {x}
            </text>
          ))}

          {yTicks.map((y) => (
            <text
              key={`yl-${y}`}
              x={PAD - 8}
              y={scaleY(y) + 3}
              textAnchor="end"
              fontSize={11}
              className="fill-ink-soft font-mono"
            >
              {y}
            </text>
          ))}

          <text
            x={WIDTH / 2}
            y={HEIGHT - 6}
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
            className="fill-ink-faint font-mono"
          >
            x →
          </text>

          <text
            x={-(HEIGHT / 2)}
            y={12}
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
            className="fill-ink-faint font-mono"
            transform="rotate(-90)"
          >
            y ↑
          </text>

          {visible.map((equation) => {
            const colors = colorFor(equation.label);
            const points = pointsFor(equation)
              .map((value, index) => ({
                value,
                input: inputStart + index,
              }))
              .filter(({ input }) => input >= xMin && input <= xMax);
            const curve = curvePointsFor(equation);
            const isActive = equation.id === activeEquationId;
            const pathD = curve
              .map(
                ({ x, y }, index) =>
                  `${index === 0 ? "M" : "L"} ${scaleX(x)} ${scaleY(y)}`
              )
              .join(" ");

            return (
              <g key={equation.id} opacity={isActive ? 1 : 0.62}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={colors.stroke}
                  strokeWidth={isActive ? 2.75 : 1.9}
                  strokeDasharray={colors.dash}
                />

                {points.map(({ value, input }) => {
                  const isSelected = isActive && input === selectedInput;
                  const isHovered =
                    hover?.eqId === equation.id && hover.input === input;

                  const selectPoint = () => {
                    setActiveEquation(equation.id);
                    setSelectedInput(input);
                  };

                  return (
                    <g key={`${equation.id}-${input}`}>
                      <circle
                        cx={scaleX(input)}
                        cy={scaleY(value)}
                        r={isSelected ? 7 : 4.5}
                        fill={colors.stroke}
                        stroke={isSelected ? "#C6852B" : "none"}
                        strokeWidth={2}
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        aria-label={`${equation.label}: x ${input}, y ${value}`}
                        onMouseEnter={() => setHover({ eqId: equation.id, input })}
                        onMouseLeave={() => setHover(null)}
                        onFocus={() => setHover({ eqId: equation.id, input })}
                        onBlur={() => setHover(null)}
                        onClick={selectPoint}
                        onKeyDown={(event: KeyboardEvent<SVGCircleElement>) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            selectPoint();
                          }
                        }}
                      />

                      {isHovered && (
                        <g pointerEvents="none">
                          <rect
                            x={Math.min(scaleX(input) + 6, WIDTH - PAD - 102)}
                            y={Math.max(scaleY(value) - 34, PAD)}
                            width={96}
                            height={28}
                            rx={5}
                            fill="#232A26"
                          />
                          <text
                            x={Math.min(scaleX(input) + 54, WIDTH - PAD - 54)}
                            y={Math.max(scaleY(value) - 21, PAD + 13)}
                            textAnchor="middle"
                            fontSize={10}
                            fill="#F6F6F1"
                            className="font-mono"
                          >
                            x = {input}
                          </text>
                          <text
                            x={Math.min(scaleX(input) + 54, WIDTH - PAD - 54)}
                            y={Math.max(scaleY(value) - 9, PAD + 25)}
                            textAnchor="middle"
                            fontSize={10}
                            fill="#F6F6F1"
                            className="font-mono"
                          >
                            y = {value}
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

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-ink-faint">
        <span>Visible x range</span>
        <input
          type="number"
          value={graphXRange.min}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setGraphXRange(Number(e.target.value), graphXRange.max)
          }
          className="w-16 rounded-lg border border-line bg-paper px-1.5 py-0.5 font-mono text-xs text-ink"
          aria-label="Graph x minimum"
        />
        <span>to</span>
        <input
          type="number"
          value={graphXRange.max}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setGraphXRange(graphXRange.min, Number(e.target.value))
          }
          className="w-16 rounded-lg border border-line bg-paper px-1.5 py-0.5 font-mono text-xs text-ink"
          aria-label="Graph x maximum"
        />
        <span>Divisions</span>
        <input
          type="number"
          min={1}
          max={50}
          value={graphXDivision}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setGraphXDivision(Number(e.target.value))
          }
          className="w-14 rounded-lg border border-line bg-paper px-1.5 py-0.5 font-mono text-xs text-ink"
          aria-label="Graph x divisions"
        />
      </div>
    </div>
  );
}
