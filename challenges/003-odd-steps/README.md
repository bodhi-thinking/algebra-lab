# Challenge 3 — Odd Steps

## Learner-facing prompt

> The pattern keeps growing by 2. Can you work out how many squares there will be at Step 100?

## Hints

1. Look at how many squares are added from one step to the next.
2. Two squares are added at every step.
3. The pattern is 1, 3, 5, 7, 9, … What comes at Step 100?

## Answer

199 squares.

## Thought question

> Both patterns grow by 2. So what makes them different?

### Thought answer

They grow at the same rate, but they start differently. One pattern gives the even numbers; the other gives the odd numbers.

## Pattern

1, 3, 5, 7, 9, 11, …

Each step adds 2 squares. The visual grows as an L: one square is shared at the corner, with one new square added to each arm at every step.

## Lab initialization

The Lab starts with `y = 2x - 1`, using Steps 1–7 (6 jumps), so the visible outputs are 1, 3, 5, 7, 9, 11, 13.

The challenge visual is independent of Lab state.
