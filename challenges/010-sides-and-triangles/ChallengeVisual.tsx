"use client";

import type { ChallengeVisualProps } from "@/lib/challenge-types";

const TRIANGLE_COLORS = [
  "#F5B82E",
  "#42B883",
  "#4D91E8",
  "#9A78E8",
];

const SHAPES = [
  { sides: 3, name: "Triangle", triangles: 1 },
  { sides: 4, name: "Quadrilateral", triangles: 2 },
  { sides: 5, name: "Pentagon", triangles: 3 },
  { sides: 6, name: "Hexagon", triangles: 4 },
] as const;

function polygonPoints(
  sides: number,
  radius: number,
  cx: number,
  cy: number,
) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / sides;

    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });
}

function Polygon({
  sides,
  size = 150,
}: {
  sides: number;
  size?: number;
}) {
  const center = size / 2;
  const radius = size * 0.39;
  const points = polygonPoints(sides, radius, center, center);

  const triangles = Array.from({ length: sides - 2 }, (_, index) => [
    points[0],
    points[index + 1],
    points[index + 2],
  ]);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-24 w-24 sm:h-28 sm:w-28"
      role="img"
      aria-label={`${sides}-sided polygon divided into ${sides - 2} triangles`}
    >
      {triangles.map((triangle, index) => (
        <polygon
          key={`fill-${index}`}
          points={triangle.map((point) => `${point.x},${point.y}`).join(" ")}
          fill={TRIANGLE_COLORS[index % TRIANGLE_COLORS.length]}
          fillOpacity="0.18"
        />
      ))}

      {/* Thin dotted diagonals: visible enough to reveal the
          decomposition, but lighter than the polygon outline. */}
      {points.slice(2, -1).map((point, index) => (
        <line
          key={`diagonal-${index}`}
          x1={points[0].x}
          y1={points[0].y}
          x2={point.x}
          y2={point.y}
          stroke="#64748B"
          strokeWidth="1.2"
          strokeDasharray="2.5 4"
          strokeLinecap="round"
        />
      ))}

      <polygon
        points={points.map((point) => `${point.x},${point.y}`).join(" ")}
        fill="none"
        stroke="#334155"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ChallengeVisual({
  challenge,
}: ChallengeVisualProps) {
  return (
    <figure
      className="overflow-hidden rounded-2xl border border-line bg-white"
      aria-label={`${challenge.title}: relationship between polygon sides and triangles`}
    >
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <div className="mb-5 flex justify-center sm:mb-6">
          <span className="rounded-full bg-[#F1ECFF] px-3 py-1 text-xs font-semibold text-[#6846C7] sm:text-sm">
            Look inside the shapes
          </span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="mx-auto grid min-w-[760px] grid-cols-4 gap-3 sm:gap-5">
            {SHAPES.map((shape) => (
              <div
                key={shape.sides}
                className="flex min-h-[190px] flex-col items-center justify-between px-1"
              >
                <Polygon sides={shape.sides} />

                <div className="text-center">
                  <div className="text-xs font-semibold text-slate-700 sm:text-sm">
                    {shape.name}
                  </div>

                  <div className="mt-1 font-mono text-xs text-slate-500">
                    {shape.sides} sides
                  </div>

                  <div className="mt-2 font-mono text-sm font-semibold text-slate-800 sm:text-base">
                    {shape.triangles} triangle
                    {shape.triangles === 1 ? "" : "s"}
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
