"use client";

import { useEffect } from "react";
import Link from "next/link";
import { challenges } from "@/challenges";
import { useLabStore } from "@/lib/lab-store";
import RepresentationGrid from "@/components/lab/RepresentationGrid";

export default function HomePage() {
  const loadChallenge = useLabStore((s) => s.loadChallenge);

  const baseChallenge = challenges.find(
    (challenge) => challenge.id === "square-halved"
  );

  useEffect(() => {
    if (!baseChallenge) return;

    loadChallenge({
      ...baseChallenge.initialState,

      equations: [
        {
          id: "playground-a",
          label: "A",
          variable: "x",
          outputVariable: "y",
          cubic: 0,
          quadratic: 2,
          editableDegree: 3,
          coefficient: 2,
          constant: 1,
          visible: true,
        },
      ],

      activeEquationId: "playground-a",
      inputStart: 1,
      inputCount: 5,
      selectedInput: null,
      numberLineRange: {
        min: 0,
        max: 20,
      },
    });
  }, [baseChallenge?.id, loadChallenge]);

  if (!baseChallenge) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="mx-auto max-w-4xl p-6">
          No Lab configuration available.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">

        {/* INTRO */}
        <header className="max-w-4xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            Algebra Lab
          </p>

          <h1 className="mt-12 max-w-4xl font-display text-4xl leading-[1.08] text-ink sm:text-5xl md:mt-16 md:text-6xl">
            One mathematical idea.
            <br />
            Different ways to see it.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">
            Explore patterns and relationships by moving between different
            mathematical representations.
          </p>

            <Link
            href="/challenges"
            className="mt-7 inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Rekindle Algebra Foundations
          </Link>

        </header>

        {/* LAB */}
        <section className="mt-16 md:mt-20">
          <div className="mb-6 border-t border-line pt-6">
           
            <p className="mt-2 max-w-3xl text-l leading-6 ">
              Start with the equation, change a number, or select a value on
              the number line. Then look across the number line, tiles, graph and equation. What changed? What stayed the same?
            </p>

          </div>

          <RepresentationGrid
            challenge={{
              ...baseChallenge,
              initialState: {
                ...baseChallenge.initialState,
                equations: [
                  {
                    id: "playground-a",
                    label: "A",
                    variable: "x",
                    outputVariable: "y",
                    cubic: 0.1,
                    quadratic: 0.5,
                    editableDegree: 3,
                    coefficient: 2,
                    constant: 1,
                    visible: true,
                  },
                ],
                activeEquationId: "playground-a",
                inputStart: 1,
                inputCount: 5,
                selectedInput: null,
                numberLineRange: {
                  min: 0,
                  max: 20,
                },
              },
              allowAddEquation: true,
              enabledRepresentations: {
                numberLine: true,
                tiles: true,
                graph: true,
                equation: true,
              },
            }}
          />
        </section>

      </div>
    </main>
  );
}