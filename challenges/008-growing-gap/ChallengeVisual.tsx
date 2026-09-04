"use client";

import type { ChallengeVisualProps } from "@/lib/challenge-types";

const COLORS = {
  a: { main: "#42B883", center: "#23845A" },
  b: { main: "#9A78E8", center: "#6E4FC2" },
};

const FIGURES = [1, 2, 3] as const;
const CELL_DESKTOP = 22;
const CELL_MOBILE = 12;

function Tile({
  color,
  size,
  dark = false,
}: {
  color: { main: string; center: string };
  size: number;
  dark?: boolean;
}) {
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

function BorderFigure({
  outerSize,
  color,
  cellSize,
}: {
  outerSize: number;
  color: { main: string; center: string };
  cellSize: number;
}) {
  return (
    <div
      className="grid w-max gap-px bg-white"
      style={{
        gridTemplateColumns: `repeat(${outerSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${outerSize}, ${cellSize}px)`,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: outerSize * outerSize }, (_, index) => {
        const row = Math.floor(index / outerSize);
        const column = index % outerSize;
        const isBorder =
          row === 0 ||
          row === outerSize - 1 ||
          column === 0 ||
          column === outerSize - 1;

        if (!isBorder) {
          return (
            <span
              key={index}
              style={{ width: cellSize, height: cellSize }}
            />
          );
        }

        const isCorner =
          (row === 0 || row === outerSize - 1) &&
          (column === 0 || column === outerSize - 1);

        return (
          <Tile
            key={index}
            color={color}
            size={cellSize}
            dark={isCorner}
          />
        );
      })}
    </div>
  );
}

function PatternRow({
  label,
  color,
  outerSizes,
  cellSize,
}: {
  label: string;
  color: { main: string; center: string };
  outerSizes: readonly number[];
  cellSize: number;
}) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center gap-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full font-mono text-sm font-semibold text-black"
          style={{ backgroundColor: color.main }}
        >
          {label}
        </span>
        <span className="text-sm font-semibold text-slate-700 sm:text-base">
          Pattern {label}
        </span>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max items-end justify-center gap-4 sm:gap-12 md:gap-16">
          {FIGURES.map((figure, index) => (
            <div key={figure} className="flex flex-col items-center gap-2">
              <div className="flex min-h-[100px] items-center justify-center sm:min-h-[145px]">
                <div className="sm:hidden">
                  <BorderFigure
                    outerSize={outerSizes[index]}
                    color={color}
                    cellSize={CELL_MOBILE}
                  />
                </div>
                <div className="hidden sm:block">
                  <BorderFigure
                    outerSize={outerSizes[index]}
                    color={color}
                    cellSize={cellSize}
                  />
                </div>
              </div>
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-semibold text-black"
                style={{ backgroundColor: color.main }}
              >
                {figure}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChallengeVisual({
  challenge,
}: ChallengeVisualProps) {
  return (
    <figure
      className="overflow-hidden rounded-2xl border border-line bg-white"
      aria-label={`${challenge.title}: two growing patterns`}
    >
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <div className="mb-5 flex justify-center sm:mb-6">
          <span className="rounded-full bg-[#F1ECFF] px-3 py-1 text-xs font-semibold text-[#6846C7] sm:text-sm">
            Look closely
          </span>
        </div>

        <div className="mx-auto flex max-w-4xl flex-col gap-7 sm:gap-9">
          <PatternRow
            label="A"
            color={COLORS.a}
            outerSizes={[3, 4, 5]}
            cellSize={CELL_DESKTOP}
          />

          <PatternRow
            label="B"
            color={COLORS.b}
            outerSizes={[3, 5, 7]}
            cellSize={CELL_DESKTOP}
          />
        </div>

        <p className="mt-5 text-center text-xs text-slate-500 sm:text-sm">
          Same beginning. Different growth. A growing gap.
        </p>
      </div>
    </figure>
  );
}
