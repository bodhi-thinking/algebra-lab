import type { Challenge } from "@/lib/challenge-types";
import { challenge as dotTrail } from "@/challenges/001-dot-trail/challenge";
import { challenge as evenSteps } from "@/challenges/002-even-steps/challenge";
import { challenge as oddSteps } from "@/challenges/003-odd-steps/challenge";

/** Planned size of the introductory challenge series. */
export const CHALLENGE_SERIES_TOTAL = 10;

/** Registered challenges available in the current build. */
export const challenges: Challenge[] = [dotTrail, evenSteps, oddSteps];
