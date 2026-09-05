"use client";

import { useState } from "react";
import type { Challenge, PanelKey } from "@/lib/challenge-types";
import NumberLine from "@/components/lab/NumberLine";
import Graph from "@/components/lab/Graph";
import EquationPanel from "@/components/lab/EquationPanel";
import AlgebraTiles from "@/components/lab/AlgebraTiles";

type PanelMeta = {
  key: PanelKey;
  title: string;
  caption: string;
  accent: string;
};

const PANEL_META: PanelMeta[] = [
  { key: "equation", title: "Equation", caption: "describe it compactly", accent: "#E0632E" },
  { key: "numberLine", title: "Number Line", caption: "watch it grow", accent: "#E0972B" },
  { key: "graph", title: "Graph", caption: "map the relationship", accent: "#2E63C9" },
  { key: "tiles", title: "Algebra Tiles", caption: "see the repeated structure", accent: "#3E9662" },
];

function renderPanel(key: PanelKey, challenge: Challenge) {
  if (key === "numberLine") return <NumberLine />;
  if (key === "graph") return <Graph />;
  if (key === "equation") {
    return <EquationPanel allowAdd={challenge.allowAddEquation} />;
  }
  return <AlgebraTiles />;
}

function PanelCard({
  panel,
  challenge,
  onFocus,
}: {
  panel: PanelMeta;
  challenge: Challenge;
  onFocus: (key: PanelKey) => void;
}) {
  return (
    <article
      className="min-w-0 overflow-hidden rounded-2xl border border-line-soft bg-panel shadow-sm"
      style={{ borderTop: `4px solid ${panel.accent}` }}
    >
      <div className="flex items-start justify-between gap-3 px-4 pb-1 pt-3 sm:px-5 sm:pt-4">
        <div>
          <h2 className="font-display text-lg text-ink sm:text-xl">
            {panel.title}
          </h2>
          <p className="text-xs text-ink-faint sm:text-sm">
            {panel.caption}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onFocus(panel.key)}
          className="min-h-10 shrink-0 rounded-lg border border-line bg-paper px-3 py-2 text-xs font-semibold text-ink-soft transition hover:border-primary hover:text-primary sm:text-sm"
          aria-label={`Focus on ${panel.title}`}
        >
          Focus
        </button>
      </div>

      <div className="min-w-0 p-3 sm:p-4 md:p-5">
        {renderPanel(panel.key, challenge)}
      </div>
    </article>
  );
}

function FocusView({
  focusedPanel,
  equation,
  challenge,
  onClose,
}: {
  focusedPanel: PanelMeta;
  equation?: PanelMeta;
  challenge: Challenge;
  onClose: () => void;
}) {
  const showEquationSeparately = equation && focusedPanel.key !== "equation";

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-paper/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="focus-view-title"
    >
      <div className="mx-auto min-h-full w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4 sm:mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Focus view
            </p>
            <h2
              id="focus-view-title"
              className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl"
            >
              {focusedPanel.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-11 shrink-0 rounded-xl border border-line bg-panel px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
          >
            Back to Lab
          </button>
        </div>

        <div className="flex flex-col gap-4 pb-8 sm:gap-5">
          {showEquationSeparately && (
            <section
              className="min-w-0 overflow-hidden rounded-2xl border border-line-soft bg-panel shadow-sm"
              style={{ borderTop: `4px solid ${equation.accent}` }}
            >
              <div className="px-4 pb-1 pt-3 sm:px-5 sm:pt-4">
                <h3 className="font-display text-lg text-ink sm:text-xl">
                  {equation.title}
                </h3>
                <p className="text-xs text-ink-faint sm:text-sm">
                  Keep the rule visible while you explore.
                </p>
              </div>
              <div className="min-w-0 p-3 sm:p-4 md:p-5">
                {renderPanel(equation.key, challenge)}
              </div>
            </section>
          )}

          <section
            className="min-w-0 overflow-hidden rounded-2xl border border-line-soft bg-panel shadow-sm"
            style={{ borderTop: `4px solid ${focusedPanel.accent}` }}
          >
            <div className="px-4 pb-1 pt-3 sm:px-5 sm:pt-4">
              <p className="text-xs text-ink-faint sm:text-sm">
                Explore this representation. Changes stay connected to the other views.
              </p>
            </div>
            <div className="min-w-0 p-3 sm:p-4 md:p-6">
              {renderPanel(focusedPanel.key, challenge)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function RepresentationGrid({
  challenge,
}: {
  challenge: Challenge;
}) {
  const [focusedKey, setFocusedKey] = useState<PanelKey | null>(null);

  const panels = PANEL_META.filter(
    (panel) => challenge.enabledRepresentations[panel.key]
  );

  const equation = panels.find((panel) => panel.key === "equation");
  const numberLine = panels.find((panel) => panel.key === "numberLine");
  const graph = panels.find((panel) => panel.key === "graph");
  const tiles = panels.find((panel) => panel.key === "tiles");
  const focusedPanel = panels.find((panel) => panel.key === focusedKey);

  return (
    <section aria-label="Algebra Lab representations">
      <div className="mb-5">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Think Beyond Numbers
        </h2>

        <p className="mt-1 text-sm text-ink-soft sm:text-base">
          Want to tweak the numbers and see what changes? Try it out.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Equation — the symbolic anchor, always first. */}
        {equation && (
          <PanelCard
            panel={equation}
            challenge={challenge}
            onFocus={setFocusedKey}
          />
        )}

        {/* Number Line + Graph — side by side when there is enough width. */}
        {(numberLine || graph) && (
          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            {numberLine && (
              <PanelCard
                panel={numberLine}
                challenge={challenge}
                onFocus={setFocusedKey}
              />
            )}
            {graph && (
              <PanelCard
                panel={graph}
                challenge={challenge}
                onFocus={setFocusedKey}
              />
            )}
          </div>
        )}

        {/* Algebra Tiles — full width, after the visual pair. */}
        {tiles && (
          <PanelCard
            panel={tiles}
            challenge={challenge}
            onFocus={setFocusedKey}
          />
        )}
      </div>

      {focusedPanel && (
        <FocusView
          focusedPanel={focusedPanel}
          equation={equation}
          challenge={challenge}
          onClose={() => setFocusedKey(null)}
        />
      )}
    </section>
  );
}
