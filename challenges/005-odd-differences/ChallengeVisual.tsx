import type { ChallengeVisualProps } from "@/lib/challenge-types";

const ODD_NUMBERS = Array.from({ length: 10 }, (_, i) => 2 * i + 1);
const SQUARE_NUMBERS = Array.from({ length: 10 }, (_, i) => (i + 1) ** 2);

export default function OddDifferencesVisual({}: ChallengeVisualProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[650px] rounded-xl border border-line bg-panel p-3 sm:p-4">
        <div className="grid grid-cols-[72px_repeat(10,minmax(42px,1fr))] items-center gap-x-1 gap-y-3 sm:grid-cols-[100px_repeat(10,minmax(42px,1fr))] sm:gap-x-2">
          <div className="text-xs font-semibold text-ink-faint sm:text-sm">
            Step
          </div>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="text-center font-mono text-xs font-semibold text-ink-faint sm:text-sm"
            >
              {i + 1}
            </div>
          ))}

          <div className="text-xs font-semibold text-ink-soft sm:text-sm">
            Odd numbers
          </div>
          {ODD_NUMBERS.map((value, i) => (
            <div
              key={i}
              className="text-center font-mono text-sm font-semibold text-ink sm:text-base"
            >
              {value}
            </div>
          ))}

          <div className="text-xs font-semibold text-ink-soft sm:text-sm">
            Square numbers
          </div>
          {SQUARE_NUMBERS.map((value, i) => {
            const highlighted = i === 10 || i === 11;
            return (
              <div
                key={i}
                className={`flex justify-center text-center font-mono text-sm font-semibold text-ink sm:text-base ${
                  highlighted
                    ? "rounded-lg border border-ink-soft bg-line-soft px-1 py-1"
                    : ""
                }`}
              >
                {value}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
