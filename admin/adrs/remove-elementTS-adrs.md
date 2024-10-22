# Adding highlight feature to footnote

## Context and Problem Statement

The use of single-line functions in elements.ts creates unnecessary redundancy and hampers readability. Instead of streamlining the code, these functions increase the cognitive load for developers, forcing them to reference multiple files to understand simple operations. This approach adds complexity to the codebase without offering clear advantages, leading to slower development and maintenance efforts. Reducing or refactoring these functions could improve overall code clarity and efficiency.

## Considered Options

- Keep the original design: create function for each single line code
- Remove `elememt.ts`. Eliminate the file and directly use the single-line code within each relevant file.

## Decision Outcome

Chosen option: "Remove `element.ts`", because this maintain the readability of the code.
