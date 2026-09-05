"use client";

import type { ChallengeVisualProps } from "@/lib/challenge-types";

const COLORS = ["#F6B51B", "#42B883", "#4A90E2", "#9A78E8"];

const SHAPES = [
  { sides: 3, name: "Triangle", triangles: 1, sum: 180 },
  { sides: 4, name: "Quadrilateral", triangles: 2, sum: 360 },
  { sides: 5, name: "Pentagon", triangles: 3, sum: 540 },
  { sides: 6, name: "Hexagon", triangles: 4, sum: 720 },
] as const;

function polygonPoints(sides: number, size: number) {
  const center = size / 2;
  const radius = size * 0.39;
  return Array.from({ length: sides }, (_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  });
}

function Polygon({ sides }: { sides: number }) {
  const size = 150;
  const points = polygonPoints(sides, size);
  const center = points[0];

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-28 w-28 sm:h-32 sm:w-32"
      role="img"
      aria-label={`${sides}-sided polygon divided into ${sides - 2} triangles`}
    >
      {/* Light colour blocks show the triangular regions. */}
      {Array.from({ length: sides - 2 }, (_, i) => {
        const triangle = [center, points[i + 1], points[i + 2]];
        return (
          <polygon
            key={`triangle-${i}`}
            points={triangle.map(p => `${p.x},${p.y}`).join(" ")}
            fill={COLORS[i]}
            fillOpacity="0.18"
          />
        );
      })}

      {/* Thin dotted diagonals: visible enough to reveal the triangles,
          but deliberately lighter than the polygon outline. */}
      {points.slice(2, -1).map((point, i) => (
        <line
          key={`diagonal-${i}`}
          x1={center.x}
          y1={center.y}
          x2={point.x}
          y2={point.y}
          stroke="#64748B"
          strokeWidth="1"
          strokeDasharray="2 4"
          strokeLinecap="round"
        />
      ))}

      <polygon
        points={points.map(p => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke="#334155"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ChallengeVisual({ challenge }: ChallengeVisualProps) {
  return (
    <figure
      className="overflow-hidden rounded-2xl border border-line bg-white"
      aria-label={`${challenge.title}: polygons divided into triangles`}
    >
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <div className="mb-5 flex justify-center sm:mb-6">
          <span className="rounded-full bg-[#F1ECFF] px-3 py-1 text-xs font-semibold text-[#6846C7] sm:text-sm">
            Look for the pattern
          </span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="mx-auto grid min-w-[600px] grid-cols-4 gap-4 sm:gap-7">
            {SHAPES.map(shape => (
              <div
                key={shape.sides}
                className="flex min-h-[210px] flex-col items-center justify-between rounded-xl border border-slate-100 bg-white px-2 py-3"
              >
                <Polygon sides={shape.sides} />

                <div className="text-center">
                  <div className="text-xs font-semibold text-slate-700 sm:text-sm">
                    {shape.name}
                  </div>
                  <div className="mt-1 font-mono text-xs text-slate-500">
                    {shape.triangles} triangle{shape.triangles === 1 ? "" : "s"}
                  </div>
                  <div className="mt-2 min-h-[24px] font-mono text-sm font-semibold text-slate-800 sm:text-base">
                    {shape.sum}°
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
