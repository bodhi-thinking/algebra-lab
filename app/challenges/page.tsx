"use client";

import { useEffect, useState } from "react";
import { challenges, CHALLENGE_SERIES_TOTAL } from "@/challenges";
import { useLabStore } from "@/lib/lab-store";
import ChallengeCard from "@/components/ChallengeCard";
import RepresentationGrid from "@/components/lab/RepresentationGrid";
import Link from "next/link";

export default function ChallengesPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const challenge = challenges[activeIndex] ?? challenges[0];

  const loadChallenge = useLabStore((s) => s.loadChallenge);

  useEffect(() => {
    if (challenge) {
      loadChallenge(challenge.initialState);
    }
  }, [challenge?.id, loadChallenge]);

  if (!challenge) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="mx-auto max-w-4xl p-6">
          No challenges available.
        </div>
      </main>
    );
  }

  const goPrevious = () => {
    setActiveIndex((index) => Math.max(0, index - 1));
  };

  const goNext = () => {
    setActiveIndex((index) =>
      Math.min(challenges.length - 1, index + 1)
    );
  };

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 md:py-7 lg:px-8">

        <header className="mb-5">
  <Link
    href="/"
    className="mb-4 inline-flex items-center text-sm text-ink-soft hover:text-ink"
  >
    ← Back to Lab
  </Link>

  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
    Rekindle Algebra Foundations
  </p>

  <h1 className="mt-1 font-display text-3xl text-ink md:text-4xl">
    Challenges
  </h1>

  <p className="mt-1 max-w-2xl text-sm text-ink-soft">
    Notice. Predict. Explore. Generalise.
  </p>
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