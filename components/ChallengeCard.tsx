"use client";

import { useEffect, useState } from "react";
import type { Challenge } from "@/lib/challenge-types";
import { checkAnswer } from "@/lib/challenge-types";

type Status = "unanswered" | "correct" | "incorrect";

type Props = {
  challenge: Challenge;
  challengeCount: number;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
};

export default function ChallengeCard({
  challenge,
  challengeCount,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: Props) {
  const [hintsShown, setHintsShown] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<Status>("unanswered");

  useEffect(() => {
    setHintsShown(0);
    setInputValue("");
    setStatus("unanswered");
  }, [challenge.id]);

  const showNextHint = () => {
    setHintsShown((current) =>
      Math.min(current + 1, challenge.hints.length)
    );

    setStatus((current) =>
      current === "correct" ? current : "unanswered"
    );
  };

  const handleCheck = () => {
    if (!inputValue.trim()) return;

    setStatus(
      checkAnswer(challenge.answer, inputValue)
        ? "correct"
        : "incorrect"
    );
  };

  const ChallengeVisual = challenge.challengeType === "pattern" ? challenge.visual : null;

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-panel shadow-panel">
      {/* Row 1: title tab + navigation */}
      <header className="flex min-h-14 flex-wrap items-center gap-2.5 border-b border-line-soft px-4 py-3 sm:px-5 md:px-6">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft"
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="6"
              cy="18"
              r="2.6"
              fill="#7C5CFC"
            />
            <circle
              cx="12"
              cy="14"
              r="2.6"
              fill="#7C5CFC"
            />
            <circle
              cx="18"
              cy="8"
              r="2.6"
              fill="#7C5CFC"
            />
          </svg>
        </span>

        <span className="font-display text-lg text-ink sm:text-xl">
          {challenge.title}
        </span>

        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
          Challenge{" "}
          {String(challenge.seriesPosition).padStart(2, "0")} /{" "}
          {String(challengeCount).padStart(2, "0")}
        </span>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!canPrevious}
            aria-label="Previous challenge"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
          >
            ←
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            aria-label="Next challenge"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
          >
            →
          </button>
        </div>
      </header>

      {/* Row 2: challenge-owned visual */}
      <div className="border-b border-line-soft bg-pattern-surface px-2.5 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4">
        {ChallengeVisual && <ChallengeVisual challenge={challenge} />}
      </div>

      {/* Row 3: question */}
      <div className="px-4 pt-4 sm:px-5 md:px-6 md:pt-5">
        <p className="max-w-none font-display text-md leading-snug text-ink sm:text-xl">
          {challenge.questionIntro && (
  <>
    <span>{challenge.questionIntro}</span>
    <br />
  </>
)}
<strong>{challenge.question}</strong>
        </p>
      </div>

      {/* Row 4: answer + hint */}
      <div className="px-4 pb-4 pt-3 sm:px-5 md:px-6 md:pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <input
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value.slice(0, 20));

              if (status !== "unanswered") {
                setStatus("unanswered");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCheck();
              }
            }}
            placeholder="Type your answer..."
            maxLength={20}
            aria-label="Your answer"
            className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-56"
          />

          <div className="flex flex-wrap gap-2.5">
            {status !== "correct" && (
              <button
                type="button"
                onClick={handleCheck}
                disabled={!inputValue.trim()}
                className="min-h-11 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-35"
              >
                Check answer
              </button>
            )}

            {status !== "correct" && hintsShown < challenge.hints.length && (
              <button
                type="button"
                onClick={showNextHint}
                aria-expanded={hintsShown > 0}
                className="min-h-11 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:border-primary hover:text-ink"
              >
                {hintsShown === 0
                  ? "Need a hint?"
                  : "Another hint"}
              </button>
            )}

            {status === "correct" && canNext && (
              <button
                type="button"
                onClick={onNext}
                className="min-h-11 w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 sm:w-auto"
              >
                Next challenge →
              </button>
            )}
          </div>
        </div>

        {/* Hints */}
        {hintsShown > 0 && status !== "correct" && (
          <div
            className="mt-3 rounded-xl bg-chalk-soft px-4 py-3"
            role="status"
            aria-live="polite"
          >
            {challenge.hints
              .slice(0, hintsShown)
              .map((hint, index) => (
                <p
                  key={hint.id}
                  className="text-sm leading-relaxed text-ink-soft"
                >
                  <span className="font-mono text-[11px] uppercase tracking-wide text-chalk">
                    Hint {index + 1}
                  </span>

                  <span className="mx-2 text-ink-faint">
                    ·
                  </span>

                  {hint.text}
                </p>
              ))}
          </div>
        )}

        {/* Correct answer + next action */}
        {status === "correct" && (
          <div
            className="mt-3 rounded-xl bg-eqC-soft px-4 py-3"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm font-semibold text-eqC">
              Correct!
            </p>

            <p className="mt-0.5 text-sm text-ink">
              {challenge.correctFeedback}
            </p>

            <p className="mt-1 text-sm text-ink-soft">
              {challenge.followUpPrompt}
            </p>
          </div>
        )}

        {/* Incorrect answer */}
        {status === "incorrect" && (
          <div
            className="mt-3 rounded-xl bg-eqB-soft px-4 py-3"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm font-semibold text-eqB">
              Try again.
            </p>

            <p className="mt-0.5 text-sm text-ink-soft">
              Look carefully at how the pattern changes.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}