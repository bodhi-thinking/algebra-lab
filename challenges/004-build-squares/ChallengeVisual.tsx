import { useEffect, useState } from "react";
import type { ChallengeVisualProps } from "@/lib/challenge-types";

// Same palette/order as Challenge 3.
const STEP_COLORS = [
  { main: "#F5B82E", center: "#D99600" },
  { main: "#42B883", center: "#23845A" },
  { main: "#4D91E8", center: "#2869B8" },
  { main: "#9A78E8", center: "#6E4FC2" },
];

const ODD_NUMBERS = [1, 3, 5, 7];

function Arrow({ direction }: { direction: "down" | "right" }) {
  // Deliberately the same visual size and stroke treatment for both arrows.
  if (direction === "down") {
    return (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 3V17"
          stroke="#B8B8B8"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M7 14L12 20L17 14"
          stroke="#B8B8B8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 12H17"
        stroke="#B8B8B8"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M14 7L20 12L14 17"
        stroke="#B8B8B8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LShape({ size, compact = false }: { size: number; compact?: boolean }) {
  const color = STEP_COLORS[size - 1];
  const cellSize = compact ? 14 : 24;
  const gap = compact ? 2 : 3;
  const cells = [];

  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      if (row !== 0 && column !== 0) continue;

      const isCorner = row === 0 && column === 0;

      cells.push(
        <span
          key={`${row}-${column}`}
          aria-hidden="true"
          className="rounded-[2px] shadow-sm"
          style={{
            width: cellSize,
            height: cellSize,
            gridRow: row + 1,
            gridColumn: column + 1,
            backgroundColor: isCorner ? color.center : color.main,
          }}
        />
      );
    }
  }

  return (
    <div
      className="grid w-max"
      style={{
        gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
        gap,
      }}
    >
      {cells}
    </div>
  );
}

function Square({ size, compact = false }: { size: number; compact?: boolean }) {
  const cellSize = compact ? 14 : 24;
  const gap = compact ? 2 : 3;
  const cells = [];

  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      const layer = Math.max(
        0,
        Math.min(size - Math.min(row, column) - 1, STEP_COLORS.length - 1)
      );

      const color = STEP_COLORS[layer];
      const isOuterCorner = row === 0 && column === 0;

      cells.push(
        <span
          key={`${row}-${column}`}
          aria-hidden="true"
          className="rounded-[2px] shadow-sm"
          style={{
            width: cellSize,
            height: cellSize,
            gridRow: row + 1,
            gridColumn: column + 1,
            backgroundColor: isOuterCorner ? color.center : color.main,
          }}
        />
      );
    }
  }

  return (
    <div
      className="grid w-max"
      style={{
        gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
        gap,
      }}
      aria-label={`${size} by ${size} square`}
    >
      {cells}
    </div>
  );
}

function TopLShapes({ stage }: { stage: number }) {
  return (
    <div className="grid grid-cols-4 items-start gap-1 sm:flex sm:items-start sm:justify-center sm:gap-3 md:gap-5">
      {ODD_NUMBERS.map((number, index) => {
        const visibleArrow = index < 3 && index < stage;

        return (
          <div key={number} className="flex min-w-0 items-start justify-center sm:flex-1">
            <div className="flex min-w-0 flex-col items-center gap-1.5 sm:gap-2">
              <div className="flex h-[62px] items-end justify-center sm:h-[82px]">
                <div className="sm:hidden">
                  <LShape size={index + 1} compact />
                </div>
                <div className="hidden sm:block">
                  <LShape size={index + 1} />
                </div>
              </div>
              <span
                className="font-mono text-[11px] font-semibold sm:text-sm"
                style={{ color: STEP_COLORS[index].main }}
              >
                {number}
              </span>
            </div>

           {/*  {visibleArrow && (
              <div className="hidden shrink-0 self-center sm:block sm:ml-1">
                <Arrow direction="right" />
              </div>
            )} */}
          </div>
        );
      })}
    </div>
  );
}

function DownArrows({ stage }: { stage: number }) {
  // Only 3, 5 and 7 have a downward connection to a newly built square.
  return (
    <div className="grid grid-cols-4 gap-1 sm:flex sm:justify-center sm:gap-3 md:gap-5">
      {ODD_NUMBERS.map((number, index) => (
        <div key={number} className="flex h-8 items-center justify-center sm:flex-1">
          {index > 0 && index <= stage && <Arrow direction="down" />}
        </div>
      ))}
    </div>
  );
}

function BuildRow({ stage }: { stage: number }) {
  return (
    <div className="relative grid grid-cols-4 gap-1 sm:flex sm:justify-center sm:gap-3 md:gap-5">
      {ODD_NUMBERS.map((number, index) => {
        const visible = index <= stage;
        const showRightArrow = index < 3 && index < stage;

        return (
          <div key={number} className="relative flex min-w-0 items-start justify-center sm:flex-1">
            <div
              className={`flex min-w-0 flex-col items-center gap-1.5 transition-opacity duration-500 sm:gap-2 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex h-[76px] items-end justify-center sm:h-[105px]">
                {visible && (
                  <>
                    <div className="sm:hidden">
                      <Square size={index + 1} compact />
                    </div>
                    <div className="hidden sm:block">
                      <Square size={index + 1} />
                    </div>
                  </>
                )}
              </div>

              <span
                className="font-mono text-[11px] font-semibold sm:text-sm"
                style={{
                  color: visible ? STEP_COLORS[index].main : "transparent",
                }}
              >
                {(index + 1) * (index + 1)}
              </span>
            </div>

            {/* {showRightArrow && (
              <div className="absolute left-[calc(100%_-_2px)] top-7 z-10 sm:left-[calc(100%_-_3px)] sm:top-9">
                <Arrow direction="right" />
              </div>
            )} */}
          </div>
        );
      })}
    </div>
  );
}

export default function ChallengeVisual({ challenge }: ChallengeVisualProps) {
  const [stage, setStage] = useState(0);
  const stageCount = 4;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStage((current) => (current + 1) % stageCount);
    }, 2400);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <figure
      className="overflow-hidden rounded-2xl border border-line bg-white"
      aria-label={`${challenge.title} animation`}
    >
      <div className="px-2.5 py-5 sm:px-6 sm:py-6">
        <p className="mb-5 text-center text-sm font-medium text-ink sm:text-base">
          Watch the odd numbers build squares.
        </p>

        <div className="mx-auto w-full max-w-[760px]">
          <TopLShapes stage={stage} />
          <div className="mt-2 sm:mt-3">
            <DownArrows stage={stage} />
          </div>
          <div className="mt-1 sm:mt-2">
            <BuildRow stage={stage} />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-1 sm:mt-4 sm:gap-3 md:gap-5">
  {ODD_NUMBERS.map((_, index) => (
    <div
      key={index}
      className="flex justify-center sm:flex-1"
    >
      <span
        className="flex h-4 w-4 items-center justify-center rounded-full font-mono text-xs font-semibold text-black sm:h-9 sm:w-9"
        style={{
          backgroundColor: STEP_COLORS[index].main,
        }}
      >
        {index + 1}
      </span>
    </div>
  ))}
</div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2.5">
          {Array.from({ length: stageCount }, (_, index) => {
            const active = stage === index;
            const color = STEP_COLORS[index].main;

            return (
              <button
                key={index}
                type="button"
                onClick={() => setStage(index)}
                aria-label={`Show step ${index + 1}`}
                aria-current={active}
                className="flex h-8 w-8 items-center justify-center rounded-full"
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: active ? 10 : 7,
                    height: active ? 10 : 7,
                    backgroundColor: active ? color : "#C8C8C8",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
