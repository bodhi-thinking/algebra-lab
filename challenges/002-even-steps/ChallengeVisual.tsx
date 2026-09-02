import type { ChallengeVisualProps } from "@/lib/challenge-types";

const CELL_SIZE_MOBILE = 30;
const CELL_SIZE_DESKTOP = 32;


function renderCells(step: number, cellSize: number) {
  const columns = step;
  const count = step * 2;

  return (
    <div
      className="grid w-max gap-1"
      style={{
        gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="rounded-[6px] bg-primary shadow-sm"
          style={{ width: cellSize, height: cellSize }}
        />
      ))}
    </div>
  );
}

export default function ChallengeVisual({ challenge }: ChallengeVisualProps) {
  const stepCount = 5;

  return (
    <figure
      className="overflow-hidden rounded-2xl border border-line bg-pattern-surface"
      aria-label={`${challenge.title} pattern`}
    >
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-4 sm:hidden">
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
                  aria-label={`Step ${step}: ${step * 2} dots`}
                >
                  {renderCells(step, CELL_SIZE_MOBILE)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden items-start justify-center gap-6 sm:flex">
          {Array.from({ length: stepCount }, (_, index) => {
            const step = index + 1;

            return (
              <div
                key={step}
                className="flex min-w-0 flex-col items-center gap-3"
              >
                {renderCells(step, CELL_SIZE_DESKTOP)}

                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-line bg-white font-mono text-sm font-semibold text-ink">
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
