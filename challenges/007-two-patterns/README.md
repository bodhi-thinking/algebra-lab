# Challenge 7 — Same Start, Different Growth

Two square-border patterns are compared.

## Visual counts

### Pattern A
- Figure 1: 8 blocks
- Figure 2: 12 blocks
- Figure 3: 16 blocks
- Growth: +4 each figure

### Pattern B
- Figure 1: 8 blocks
- Figure 2: 16 blocks
- Figure 3: 24 blocks
- Growth: +8 each figure

## Current PatternChallenge question

At Figure 10, how many more blocks will Pattern B have than Pattern A?

- Pattern A at Figure 10: 44
- Pattern B at Figure 10: 80
- Answer: 36

## Important schema note

The current `PatternChallenge` architecture has one scored `question` and one `answer` field. Therefore this implementation keeps the final Figure-10 comparison as the scored question and uses the hints/reflection to support the earlier observations.

If the product requirement is to have three independently scored questions in one challenge, the challenge type / ChallengeCard question model needs to be extended rather than putting multiple answers into the existing `question` field.
