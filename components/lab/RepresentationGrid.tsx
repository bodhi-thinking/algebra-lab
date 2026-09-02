"use client";

import { useEffect, useState } from "react";
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
  { key: "numberLine", title: "Number Line", caption: "watch it grow", accent: "#E0972B" },
  { key: "graph", title: "Graph", caption: "map the relationship", accent: "#2E63C9" },
  { key: "tiles", title: "Algebra Tiles", caption: "see the repeated structure", accent: "#3E9662" },
  { key: "equation", title: "Equation", caption: "describe it compactly", accent: "#E0632E" },
];

function renderPanel(key: PanelKey, challenge: Challenge) {
  if (key === "numberLine") return <NumberLine />;
  if (key === "graph") return <Graph />;
  if (key === "equation") return <EquationPanel allowAdd={challenge.allowAddEquation} />;
  return <AlgebraTiles />;
}

function PanelCard({ panel, challenge }: { panel: PanelMeta; challenge: Challenge }) {
  return (
    <article
      className="min-w-0 overflow-hidden rounded-2xl border border-line-soft bg-panel shadow-sm"
      style={{ borderTop: `4px solid ${panel.accent}` }}
    >
      <div className="flex items-start justify-between gap-3 px-4 pb-1 pt-3 sm:px-5 sm:pt-4">
        <div>
          <h2 className="font-display text-lg text-ink sm:text-xl">{panel.title}</h2>
          <p className="text-xs text-ink-faint sm:text-sm">{panel.caption}</p>
        </div>
      </div>
      <div className="min-w-0 p-3 sm:p-4 md:p-5">
        {renderPanel(panel.key, challenge)}
      </div>
    </article>
  );
}

export default function RepresentationGrid({ challenge }: { challenge: Challenge }) {
  const panels = PANEL_META.filter((panel) => challenge.enabledRepresentations[panel.key]);
  const [active, setActive] = useState<PanelKey>("numberLine");

  useEffect(() => {
    setActive("numberLine");
  }, [challenge.id]);

  const activePanel = panels.find((panel) => panel.key === active) ?? panels[0];
  if (!activePanel) return null;

  return (
  <section aria-label="Algebra Lab representations">

    {/* Lab heading */}
    <div className="mb-5">
      <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
        Play with the Rule
      </h2>

      <p className="mt-1 text-sm text-ink-soft sm:text-base">
        Want to tweak the numbers and see what changes? Try it out.
      </p>
    </div>

    {/* Desktop: all four representations remain visible in the original 2 × 2 layout. */}
    <div className="hidden gap-4 md:grid md:grid-cols-2">
        {(["numberLine", "graph", "equation", "tiles"] as PanelKey[])
          .map((key) => panels.find((panel) => panel.key === key))
          .filter((panel): panel is PanelMeta => Boolean(panel))
          .map((panel) => (
            <PanelCard key={panel.key} panel={panel} challenge={challenge} />
          ))}
      </div>

      {/* Mobile: conserve vertical space with one representation visible at a time. */}
      <div className="overflow-hidden rounded-2xl border border-line-soft bg-panel shadow-sm md:hidden">
        <div
          className="border-b border-line-soft px-2 pt-1.5 sm:px-4 sm:pt-2"
          role="tablist"
          aria-label="Algebra Lab representations"
        >
          <div className="flex min-w-0 gap-1 overflow-x-auto scrollbar-none">
            {panels.map((panel) => {
              const isActive = panel.key === activePanel.key;
              return (
                <button
                  key={panel.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="mobile-lab-panel"
                  id={`mobile-lab-tab-${panel.key}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(panel.key)}
                  onKeyDown={(event) => {
                    const currentIndex = panels.findIndex((item) => item.key === panel.key);
                    if (event.key === "ArrowRight") {
                      event.preventDefault();
                      setActive(panels[(currentIndex + 1) % panels.length].key);
                    } else if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      setActive(panels[(currentIndex - 1 + panels.length) % panels.length].key);
                    }
                  }}
                  className={`relative shrink-0 whitespace-nowrap rounded-t-xl px-3 py-2.5 text-sm font-semibold transition-colors sm:px-4 sm:text-base ${
                    isActive ? "text-ink" : "text-ink-faint hover:text-ink-soft"
                  }`}
                >
                  {panel.title}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-2 bottom-0 h-0.5 rounded-full sm:inset-x-4"
                      style={{ backgroundColor: panel.accent }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="mobile-lab-panel"
          role="tabpanel"
          aria-labelledby={`mobile-lab-tab-${activePanel.key}`}
          className="min-w-0 p-3 sm:p-4"
        >
          <div className="mb-3">
            <h2 className="font-display text-lg text-ink sm:text-xl">{activePanel.title}</h2>
            <p className="text-xs text-ink-faint sm:text-sm">{activePanel.caption}</p>
          </div>
          {renderPanel(activePanel.key, challenge)}
        </div>
      </div>
    </section>
  );
}
