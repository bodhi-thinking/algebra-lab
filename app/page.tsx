"use client";

import { useEffect, useState } from "react";
import { challenges, CHALLENGE_SERIES_TOTAL } from "@/challenges";
import { useLabStore } from "@/lib/lab-store";
import ChallengeCard from "@/components/ChallengeCard";
import RepresentationGrid from "@/components/lab/RepresentationGrid";

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const challenge = challenges[activeIndex] ?? challenges[0];
  const loadChallenge = useLabStore((s) => s.loadChallenge);

  useEffect(() => {
    if (challenge) loadChallenge(challenge.initialState);
  }, [challenge?.id, loadChallenge]);

  if (!challenge) {
    return <main className="mx-auto max-w-4xl p-6">No challenges available.</main>;
  }

  const goPrevious = () => setActiveIndex((index) => Math.max(0, index - 1));
  const goNext = () => setActiveIndex((index) => Math.min(challenges.length - 1, index + 1));

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 md:py-7 lg:px-8">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">Algebra Lab</p>
            <h1 className="mt-1 font-display text-3xl text-ink md:text-4xl">Algebra Lab</h1>
            <p className="mt-1 max-w-2xl text-sm text-ink-soft">One mathematical idea. Different ways to see it.</p>
          </div>
        </header>

        <div className="flex flex-col gap-4">
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            challengeCount={CHALLENGE_SERIES_TOTAL}
            onPrevious={goPrevious}
            onNext={goNext}
            canPrevious={activeIndex > 0}
            canNext={activeIndex < challenges.length - 1}
          />
          <RepresentationGrid challenge={challenge} />
        </div>
      </div>
    </main>
  );
}
