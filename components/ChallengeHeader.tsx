"use client";

import { useState } from "react";
import type { Challenge } from "@/lib/types";

export default function ChallengeHeader({ challenge }: { challenge: Challenge }) {
  const [hintsShown, setHintsShown] = useState(0);
  const [feedbackShown, setFeedbackShown] = useState(false);

  return (
    <header className="border-b border-line bg-panel">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-faint">
            Algebra Lab
          </p>
          <p className="font-mono text-xs uppercase tracking-wider text-ink-faint">
            {challenge.seriesPosition}
          </p>
        </div>

        <h1 className="mt-1 font-display text-3xl text-ink">{challenge.title}</h1>
        <p className="mt-2 max-w-2xl font-body text-[15px] leading-relaxed text-ink-soft">
          {challenge.prompt}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {hintsShown < challenge.hints.length && (
            <button
              type="button"
              onClick={() => setHintsShown((n) => n + 1)}
              className="rounded-sm border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-ink-soft hover:text-ink"
            >
              {hintsShown === 0 ? "Need a hint?" : "Another hint"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setFeedbackShown((v) => !v)}
            className="rounded-sm border border-chalk bg-chalk-soft px-3 py-1.5 text-xs text-ink hover:brightness-95"
          >
            {feedbackShown ? "Hide explanation" : "I found the pattern"}
          </button>
        </div>

        {hintsShown > 0 && (
          <ol className="mt-3 flex flex-col gap-1.5">
            {challenge.hints.slice(0, hintsShown).map((h, i) => (
              <li key={h.id} className="font-body text-sm text-ink-soft">
                <span className="font-mono text-xs text-ink-faint">Hint {i + 1} — </span>
                {h.text}
              </li>
            ))}
          </ol>
        )}

        {feedbackShown && (
          <p className="mt-3 max-w-2xl rounded-sm border border-chalk-soft bg-chalk-soft/40 px-3 py-2 font-body text-sm text-ink">
            {challenge.feedback}
          </p>
        )}
      </div>
    </header>
  );
}
