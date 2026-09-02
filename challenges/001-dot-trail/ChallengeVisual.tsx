import type { ChallengeVisualProps } from "@/lib/challenge-types";

const CELL_SIZE_MOBILE = 30;
const CELL_SIZE_DESKTOP = 34;


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
                  aria-label={`Step ${step}: ${step} dot${step === 1 ? "" : "s"}`}
                >
                  <div
                    className="grid w-max gap-1"
                    style={{
                      gridTemplateColumns: `repeat(${step}, ${CELL_SIZE_MOBILE}px)`,
                    }}
                  >
                    {Array.from({ length: step }, (_, cell) => (
                      <span
                        key={cell}
                        aria-hidden="true"
                        className="rounded-[6px] bg-primary shadow-sm"
                        style={{
                          width: CELL_SIZE_MOBILE,
                          height: CELL_SIZE_MOBILE,
                        }}
                      />
                    ))}
                  </div>
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
                <div
                  className="grid w-max gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${step}, ${CELL_SIZE_DESKTOP}px)`,
                  }}
                  aria-label={`Step ${step}`}
                >
                  {Array.from({ length: step }, (_, cell) => (
                    <span
                      key={cell}
                      aria-hidden="true"
                      className="rounded-[6px] bg-primary shadow-sm"
                      style={{
                        width: CELL_SIZE_DESKTOP,
                        height: CELL_SIZE_DESKTOP,
                      }}
                    />
                  ))}
                </div>

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
