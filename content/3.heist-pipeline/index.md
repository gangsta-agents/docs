---
title: The Heist Pipeline
description: The 6-phase development cycle — from reconnaissance to the delivery.
navigation.order: 1
---
Every feature development cycle in Gangsta Agents follows the same structured process — a 6-phase Heist that ensures specs are written before code, designs are debated before committing, and results are verified before delivery.

::pipeline-flow{}
::

## Phase Overview

| # | Phase | Skill | Gate | Output |
|---|---|---|---|---|
| 1 | [Reconnaissance](/heist-pipeline/reconnaissance) | `gangsta:reconnaissance` | Dossier approved | Intel report |
| 2 | [The Grilling](/heist-pipeline/the-grilling) | `gangsta:the-grilling` | Consensus approved | Design decisions |
| 3 | [The Sit-Down](/heist-pipeline/the-sit-down) | `gangsta:the-sit-down` | Contract signed | Specification |
| 4 | [Resource Development](/heist-pipeline/resource-development) | `gangsta:resource-development` | Execution Plan approved | Task breakdown |
| 5 | [Execution](/heist-pipeline/the-hit) | `gangsta:the-hit` | Completion approved | Working code |
| 6 | [The Delivery](/heist-pipeline/laundering) | `gangsta:laundering` | Heist complete | Clean delivery |

## The Six Phases

### 1. Reconnaissance
Gather intel on the codebase, requirements, dependencies, and existing patterns before writing a single line of code. [Explore Reconnaissance →](/heist-pipeline/reconnaissance)

### 2. The Grilling
Run an adversarial debate between a proposer and a devil's advocate to stress-test designs before committing to implementation. [Explore The Grilling →](/heist-pipeline/the-grilling)

### 3. The Sit-Down
Draft the formal specification — no code allowed. The Contract becomes the binding spec that governs all subsequent implementation. [Explore The Sit-Down →](/heist-pipeline/the-sit-down)

### 4. Resource Development
Decompose the spec into work packages, assign territories, and prepare the infrastructure for parallel execution. [Explore Resource Development →](/heist-pipeline/resource-development)

### 5. Execution
Workers implement the approved work packages in parallel, with strict TDD enforcement and real-time progress reporting to Crew Leads. [Explore Execution →](/heist-pipeline/the-hit)

### 6. The Delivery
Verify, integrate, lint, test, and update the Ledger. Clean output only — no dirty code gets merged. [Explore The Delivery →](/heist-pipeline/laundering)

## Phase Gates

Every phase ends with a **gate** — a checkpoint requiring the Don's explicit approval. The framework never auto-advances to the next phase.

::callout{type="warning" icon="i-lucide-shield"}
**You are the Don.** Your approval is required at every gate. If the output is incomplete or incorrect, reject it. The Heist only progresses when you say so.
::

## Starting a Heist

There are two ways to start a Heist:

### Manual (Gated)

Express a building intention to your AI tool:

> "I want to add user notifications to my app"

The 1% Rule triggers `gangsta:reconnaissance` automatically. From there, each phase flows into the next with your approval at every gate.

### Autonomous Mode

Use the `/gangsta:heist` slash command to run phases 1–4 end-to-end without pausing at each gate:

> `/gangsta:heist user-notifications`

The Don Proxy approves each gate on your behalf. When the Contract and Execution Plan are ready, you sign with `/gangsta:go` to execute phases 5–6. [Full Autonomous Mode docs →](/advanced/autonomous-mode)

## Slash Commands

| Command | Phases | Purpose |
|---|---|---|
| `/gangsta:heist <feature>` | 1–4 | Run Reconnaissance through Resource Development autonomously |
| `/gangsta:go [feature]` | 5–6 | Sign the Contract and execute The Hit + The Delivery |
| `/gangsta:abort <feature>` | — | Halt the Heist and archive it |

## Resuming a Heist

If a session is interrupted:

1. Check `docs/gangsta/` for checkpoint files
2. Read the latest checkpoint
3. Present the resume context to the Don
4. Continue from the last completed phase

[Checkpoint Recovery guide →](/advanced/checkpoint-recovery)

## The Full Cycle

```
Reconnaissance → The Grilling → The Sit-Down → Resource Dev → Execution → The Delivery
     │                │                │               │            │             │
  Dossier         Consensus        Contract       Execution     Code +         Clean
  approved         approved          signed          Plan        Budgets      Delivery
                                                    approved
```

Each phase produces a concrete artifact that the next phase depends on. You cannot skip phases, and you cannot proceed without explicit approval.
