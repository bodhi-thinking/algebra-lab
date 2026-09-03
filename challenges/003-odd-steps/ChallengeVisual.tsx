import type { ChallengeVisualProps } from "@/lib/challenge-types";

const CELL_SIZE_MOBILE = 30;
const CELL_SIZE_DESKTOP = 32;

const STEP_COLORS = [
  { main: "#F5B82E", center: "#D99600" },
  { main: "#42B883", center: "#23845A" },
  { main: "#4D91E8", center: "#2869B8" },
  { main: "#9A78E8", center: "#6E4FC2" },
  { main: "#E76AA8", center: "#C04480" },
  { main: "#F2B233", center: "#D18B00" },
];


function renderLShape(step: number, cellSize: number) {
  const color = STEP_COLORS[(step - 1) % STEP_COLORS.length];
  const cells = [];

  for (let row = 0; row < step; row += 1) {
    for (let column = 0; column < step; column += 1) {
      if (row !== 0 && column !== 0) continue;

      const isCenter = row === 0 && column === 0;

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
            backgroundColor: isCenter ? color.center : color.main,
          }}
        />
      );
    }
  }

  return (
    <div
      className="grid w-max gap-1"
      style={{
        gridTemplateColumns: `repeat(${step}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${step}, ${cellSize}px)`,
      }}
    >
      {cells}
    </div>
  );
}

export default function ChallengeVisual({ challenge }: ChallengeVisualProps) {
  const stepCount = 4;

  return (
    <figure
      className="overflow-hidden rounded-2xl border border-line bg-white"
      aria-label={`${challenge.title} pattern`}
    >
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-5 sm:hidden">
          {Array.from({ length: stepCount }, (_, index) => {
            const step = index + 1;

            return (
              <div
                key={step}
                className="grid grid-cols-[40px_1fr] items-center gap-3"
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-line bg-white font-mono text-sm font-semibold text-ink"
                  aria-hidden="true"
                >
                  {step}
                </span>

                <div
                  className="min-w-0 overflow-x-auto"
                  aria-label={`Step ${step}: ${2 * step - 1} squares`}
                >
                  {renderLShape(step, CELL_SIZE_MOBILE)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden items-end justify-center gap-10 sm:flex">
          {Array.from({ length: stepCount }, (_, index) => {
            const step = index + 1;

            return (
              <div
                key={step}
                className="flex min-w-0 flex-col items-center gap-4"
              >
                {renderLShape(step, CELL_SIZE_DESKTOP)}

                <span className="flex h-8 w-8 items-center justify-center rounded-full font-mono text-1xl font-semibold text-black" style={{ backgroundColor: STEP_COLORS[(step - 1) % STEP_COLORS.length].main }}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
