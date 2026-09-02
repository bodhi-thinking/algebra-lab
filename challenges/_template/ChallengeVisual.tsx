import type { ChallengeVisualProps } from "@/lib/challenge-types";

export default function ChallengeVisual({ challenge }: ChallengeVisualProps) {
  return (
    <figure className="rounded-2xl border border-line bg-white p-6">
      <p className="text-sm text-ink-soft">
        Replace this component with the visual for <strong>{challenge.title}</strong>.
      </p>
    </figure>
  );
}
