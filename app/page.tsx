"use client";

import { useEffect, useState } from "react";
import { useLabStore } from "@/lib/store";
import { challenge01 } from "@/lib/challenges";
import ChallengeHeader from "@/components/ChallengeHeader";
import NumberLine from "@/components/NumberLine";
import Graph from "@/components/Graph";
import EquationPanel from "@/components/EquationPanel";
import AlgebraTiles from "@/components/AlgebraTiles";

type PanelKey = "numberLine" | "graph" | "equation" | "tiles";

export default function Home() {
  const loadChallenge = useLabStore((s) => s.loadChallenge);
  const challenge = useLabStore((s) => s.challenge);
  const [focused, setFocused] = useState<PanelKey | null>(null);

  useEffect(() => {
    loadChallenge(challenge01);
  }, [loadChallenge]);

  if (!challenge) return null;

  const { enabledRepresentations: er } = challenge;

  const panels: Array<{
    key: PanelKey;
    title: string;
    caption: string;
    enabled: boolean;
    node: React.ReactNode;
  }> = [
    {
      key: "numberLine" as const,
      title: "Number Line",
      caption: "repeated jumps",
      enabled: er.numberLine,
      node: <NumberLine />,
    },
    {
      key: "graph" as const,
      title: "Graph",
      caption: "jump number vs. value",
      enabled: er.graph,
      node: <Graph />,
    },
    {
      key: "equation" as const,
      title: "Equation",
      caption: "symbolic form",
      enabled: er.equation,
      node: <EquationPanel allowAdd={challenge.allowAddEquation} />,
    },
    {
      key: "tiles" as const,
      title: "Algebra Tiles",
      caption: "structure",
      enabled: er.tiles,
      node: <AlgebraTiles />,
    },
  ].filter((p) => p.enabled);

  return (
    <main className="min-h-screen bg-paper">
      <ChallengeHeader challenge={challenge} />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div
          className={
            focused
              ? "grid grid-cols-1 gap-5 lg:grid-cols-3"
              : "grid grid-cols-1 gap-5 lg:grid-cols-2"
          }
        >
          {panels.map((p) => {
            const isFocused = focused === p.key;
            const isDimmed = focused !== null && !isFocused;
            return (
              <section
                key={p.key}
                className={`rounded-sm border border-line-soft bg-paper p-5 ${
                  isFocused ? "lg:col-span-2 lg:row-span-2" : ""
                } ${isDimmed ? "opacity-70" : ""}`}
              >
                <div className="mb-4 flex items-baseline justify-between">
                  <div>
                    <h2 className="font-display text-lg text-ink">{p.title}</h2>
                    <p className="text-[11px] uppercase tracking-wide text-ink-faint">
                      {p.caption}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFocused(isFocused ? null : p.key)}
                    className="font-mono text-[11px] text-ink-faint hover:text-ink"
                  >
                    {isFocused ? "reset view" : "focus"}
                  </button>
                </div>
                {p.node}
              </section>
            );
          })}
        </div>

        <p className="mt-10 max-w-2xl font-body text-xs leading-relaxed text-ink-faint">
          Move → Notice → Represent → Compare → Generalize → Symbolize. These
          four panels are windows into the same relationship — change a value
          in any one of them and watch the rest respond.
        </p>
      </div>
    </main>
  );
}
