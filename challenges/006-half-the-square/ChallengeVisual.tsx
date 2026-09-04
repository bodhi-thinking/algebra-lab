"use client";

import { useEffect, useRef, useState } from "react";
import type { ChallengeVisualProps } from "@/lib/challenge-types";

const STEP_COLORS = [
  { main: "#F5B82E", center: "#D99600" },
  { main: "#42B883", center: "#23845A" },
  { main: "#4D91E8", center: "#2869B8" },
  { main: "#9A78E8", center: "#6E4FC2" },
];

const STEPS = [1, 2, 3, 4];
const FRAMES = ["squares", "rearranged", "halved"] as const;
const CELL_DESKTOP = 28;
const CELL_MOBILE = 22;

type Frame = (typeof FRAMES)[number];
type TileColor = { main: string; center: string };

function Tile({ color, size, dark = false }: { color: TileColor; size: number; dark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="shrink-0 rounded-[2px] shadow-sm"
      style={{
        width: size,
        height: size,
        backgroundColor: dark ? color.center : color.main,
      }}
    />
  );
}

function squareTileColor(step: number, row: number, column: number) {
  return STEP_COLORS[Math.max(0, step - 1 - Math.min(row, column))];
}

function Square({ step, size }: { step: number; size: number }) {
  return (
    <div
      className="grid w-max gap-1"
      style={{
        gridTemplateColumns: `repeat(${step}, ${size}px)`,
        gridTemplateRows: `repeat(${step}, ${size}px)`,
      }}
    >
      {Array.from({ length: step * step }, (_, index) => {
        const row = Math.floor(index / step);
        const column = index % step;
        return (
          <Tile
            key={index}
            color={squareTileColor(step, row, column)}
            size={size}
          />
        );
      })}
    </div>
  );
}

/**
 * Rearrange the complete square into odd-length rows:
 * 1² = 1
 * 2² = 3 + 1
 * 3² = 5 + 3 + 1
 * 4² = 7 + 5 + 3 + 1
 *
 * The rows are built from the original square's diagonal colour layers,
 * preserving the visual colour progression from the first frame.
 */
function Rearranged({ step, size }: { step: number; size: number }) {
  const cells: { color: TileColor; dark: boolean }[] = [];

  // Build the odd rows from longest to shortest. The colour sequence is
  // intentionally kept in the same layer order as the square representation.
  for (let row = 0; row < step; row += 1) {
    const count = 2 * (step - row) - 1;
    for (let column = 0; column < count; column += 1) {
      const layer = Math.min(step - 1, row + Math.floor(column / 2));
      const color = STEP_COLORS[layer];
      const dark = column === Math.floor(count / 2);
      cells.push({ color, dark });
    }
  }

  let cursor = 0;
  return (
    <div className="flex w-max flex-col gap-1">
      {Array.from({ length: step }, (_, row) => {
        const count = 2 * (step - row) - 1;
        const rowItems = cells.slice(cursor, cursor + count);
        cursor += count;
        return (
          <div key={row} className="flex gap-1">
            {rowItems.map((item, index) => (
              <Tile
                key={`${row}-${index}`}
                color={item.color}
                size={size}
                dark={item.dark}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Keep one triangular half of the rearranged square.
 * The darker tiles form the diagonal, while the lighter tiles continue
 * the same colour sequence down each column.
 */
function HalfTriangle({ step, size }: { step: number; size: number }) {
  return (
    <div className="flex w-max flex-col gap-1">
      {Array.from({ length: step }, (_, row) => (
        <div key={row} className="flex gap-1">
          {Array.from({ length: step - row }, (_, column) => {
            const layer = row + column;
            const color = STEP_COLORS[Math.min(layer, STEP_COLORS.length - 1)];
            const dark = row === 0;
            return (
              <Tile
                key={column}
                color={color}
                size={size}
                dark={dark}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function StepNumber({ step }: { step: number }) {
  return (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-sm font-semibold text-black"
      style={{ backgroundColor: STEP_COLORS[step - 1].main }}
    >
      {step}
    </span>
  );
}

function Stage({ frame, step, size }: { frame: Frame; step: number; size: number }) {
  if (frame === "squares") return <Square step={step} size={size} />;
  if (frame === "rearranged") return <Rearranged step={step} size={size} />;
  return <HalfTriangle step={step} size={size} />;
}

export default function ChallengeVisual({ challenge }: ChallengeVisualProps) {
  const [frame, setFrame] = useState<Frame>("squares");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    timers.current = [
      window.setTimeout(() => setFrame("rearranged"), 1800),
      window.setTimeout(() => setFrame("halved"), 3600),
    ];
    return () => timers.current.forEach(window.clearTimeout);
  }, []);

  const selectFrame = (next: Frame) => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setFrame(next);
  };

  const label =
    frame === "squares"
      ? "Square numbers"
      : frame === "rearranged"
        ? "Rearranged"
        : "Halved";

  return (
    <figure
      className="overflow-hidden rounded-2xl border border-line bg-white"
      aria-label={`${challenge.title}: ${label}`}
    >
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <div className="mb-4 flex justify-center sm:mb-5">
          <span className="rounded-full bg-[#F1ECFF] px-3 py-1 text-xs font-semibold text-[#6846C7] sm:text-sm">
            {label}
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="mx-auto flex min-w-[500px] items-end justify-center gap-8 sm:gap-12 md:gap-16">
            {STEPS.map((step) => (
              <div
                key={step}
                className="flex w-[76px] flex-col items-center gap-3 sm:w-[92px] sm:gap-4"
              >
                <div className="flex h-[145px] items-center justify-center sm:h-[165px]">
                  <div className="sm:hidden">
                    <Stage frame={frame} step={step} size={CELL_MOBILE} />
                  </div>
                  <div className="hidden sm:block">
                    <Stage frame={frame} step={step} size={CELL_DESKTOP} />
                  </div>
                </div>
                <StepNumber step={step} />
              </div>
            ))}
          </div>
        </div>

        {frame === "halved" && (
          <div className="mt-4 border-t border-line pt-3 sm:mt-5 sm:pt-4">
            <div className="mx-auto flex min-w-[500px] justify-center gap-8 sm:gap-12 md:gap-16">
              {STEPS.map((step) => (
                <div key={step} className="w-[76px] text-center sm:w-[92px]">
                  <span className="font-mono text-base font-semibold text-ink sm:text-lg">
                    {(step * (step + 1)) / 2}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className="mt-4 flex items-center justify-center gap-3"
          role="tablist"
          aria-label="Animation stages"
        >
          {FRAMES.map((stage, index) => {
            const active = frame === stage;
            const name =
              stage === "squares"
                ? "square numbers"
                : stage === "rearranged"
                  ? "rearranged"
                  : "halved";
            return (
              <button
                key={stage}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Show ${name}`}
                onClick={() => selectFrame(stage)}
                className="flex h-5 w-5 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6846C7] focus-visible:ring-offset-2"
              >
                <span
                  className={`block rounded-full transition-all ${
                    active ? "h-2.5 w-2.5" : "h-2 w-2 bg-slate-300"
                  }`}
                  style={active ? { backgroundColor: STEP_COLORS[index].main } : undefined}
                />
              </button>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
