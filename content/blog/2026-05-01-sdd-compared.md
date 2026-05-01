---
title: Spec-Driven Development in 2026
description: GitHub Spec Kit, OpenSpec, BMad Method, and Gangsta Agents all implement spec-first development but with different philosophies. Here's how they actually differ — and how to choose.
date: 2026-05-01
navigation: false
---

Ask Claude or Copilot to "add user authentication" and you'll get something. Whether that something matches what you actually need depends on twenty silent inferences the agent made: which auth pattern, which session strategy, which security level, which error handling. None of them written down. None of them reviewable. All of them yours to debug later.

This is the structural failure SDD addresses. But "spec-first" is one principle implemented four very different ways. GitHub Spec Kit, OpenSpec, BMad Method, and Gangsta Agents agree that the spec comes before the code — they disagree on almost everything else: how strict the gates are, where the spec lives, whether agents debate, whether memory persists across sessions.

I'll compare them across five axes that actually matter in practice:

- **Spec scope** — feature-level (one change) or project-level (the whole project)
- **Adversarial review** — is there a mechanism that attacks a proposal before code is written
- **Gate strictness** — can the agent proceed without explicit human approval
- **Institutional memory** — is experience preserved between sessions
- **Cost of entry** — dependencies, setup time, learning curve

Ecosystem metrics (stars, community, extensions) live in a separate table — they're useful, but they're not architecture.

*Disclosure: I built Gangsta Agents. It's included for completeness, not promotion. Judge for yourself.*

---

## GitHub Spec Kit

**88k stars** | [github.com/github/spec-kit](https://github.com/github/spec-kit)

Official open-source project from GitHub, launched in 2025, with an active ecosystem of extensions and presets.

**How it works:**

Four phases with clear artifacts: Constitution → Specify → Plan → Tasks → Implement. Each phase is triggered via slash commands (`/speckit.constitution`, `/speckit.specify`, etc.) or agent skills. `Constitution.md` is an immutable document with project principles.

Each phase is a handoff between the human (driving intent) and the AI (doing the writing). You don't move to the next phase until the current artifact is reviewed and accepted:

- **Specify** — the developer writes what needs to be built and why. The AI generates a detailed spec covering user stories, acceptance criteria, workflows, and success metrics. No code, no implementation details.
- **Plan** — the developer adds technical constraints (tech stack, architecture, compliance, performance). The AI produces a technical plan that respects those constraints. Alternative plans can be generated for comparison.
- **Tasks** — the AI breaks work into small reviewable units. Each task is concrete and independently verifiable ("Create a user registration endpoint that validates email format" — not "build authentication").
- **Implement** — the AI executes each task. Code changes are traceable to specific requirements, not to a giant diff with unclear intent.

The structure is the value. Each phase has a checkpoint where humans catch misalignment before it becomes rework.

**Real workflow:**

```
/speckit.constitution  Create principles focused on code quality and testing standards
/speckit.specify       Build a Kanban board with drag-and-drop, multiple users, no login
/speckit.plan          Use .NET Aspire, Postgres, Blazor server
/speckit.tasks
/speckit.implement
```

**Strengths:**

- 50+ community extensions: Jira, Azure DevOps, GitHub Issues, worktrees, security review, V-Model, and more
- Presets for customization without touching the core
- Works with 28 AI agents: Claude Code, Gemini CLI, Copilot, Cursor, OpenCode, Codex, Kiro, Windsurf, and others
- Ralph Loop — autonomous execution cycle for fully agentic implementation
- Brownfield bootstrap extension for existing projects
- Enterprise-ready: Azure DevOps, Jira integrations, compliance requirements

**Weaknesses:**

- Heavyweight: requires Python, uv, git
- Phase gates exist but aren't strict — agent can continue without explicit approval
- No adversarial review out of the box (extension only)
- Spec lives at feature level, not project level

**Best for:** If you already have Jira or Azure DevOps and need compatibility with your existing process — Spec Kit brings SDD without changing infrastructure.

*Spec Kit is the most polished, most extensible, and most enterprise-ready of the four — but it pays for that with weight and bypassable gates.*

---

## OpenSpec

**37.7k stars** | [github.com/Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) | [openspec.dev](https://openspec.dev) | YC W26

Built by Tabish (@0xTab), YC W26. Philosophy: fluid, not rigid. Iterative, not waterfall.

**How it works:**

Two key actions:

```
/opsx:propose "add dark mode"
→ creates openspec/changes/add-dark-mode/
  ✓ proposal.md  — why and what changes
  ✓ specs/       — requirements and scenarios
  ✓ design.md    — technical approach
  ✓ tasks.md     — implementation checklist

/opsx:apply
→ executes all tasks
```

Each change lives in its own folder. Artifacts can be updated at any time — no strict phase transitions.

**Spec deltas** — unique to OpenSpec. Every change produces a diff against the existing spec, not a new document. Reviewers see exactly what's changing in the requirements (added scenarios, modified behaviors, deleted constraints) before any code is written.

Example: adding "Remember me" to authentication produces a delta showing the new scenario added to `auth-session/spec.md`, not a fresh spec file.

Specs live in the codebase as permanent documentation. Other frameworks treat the spec as planning material that gets discarded after implementation. OpenSpec keeps specs in `openspec/specs/` organized by capability (`auth-login/`, `checkout-cart/`). When a new developer joins, they read the specs to understand what the code is supposed to do — not what it currently does.

**Strengths:**

- Minimal overhead: `npm install -g @fission-ai/openspec`
- Brownfield-first — built for working with existing code
- Iterative approach: spec evolves with the code
- Active community: Discord, 37.7k stars
- Works with 20+ tools

**Weaknesses:**

- Fluid means less structure — no strict gates
- No adversarial review
- No institutional memory between sessions
- Spec quality is entirely on the developer

**Best for:** If you want to try SDD today in 5 minutes on an existing project — this is the fastest start of the four.

*OpenSpec treats specs as living code documentation through deltas — the lightest framework here, but you carry the discipline yourself.*

---

## BMad Method

**44.2k stars** | [github.com/bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)

Full AI-driven framework for the entire development lifecycle — from idea to shipped code. Version 6, actively maintained.

**How it works:**

Specialized named agents guide the project through each phase. Modular architecture — extendable via BMad Builder. Four phases, each producing artifacts that feed the next:

- **Analysis** (optional) — brainstorming, domain/market/technical research, product brief. Validates the idea before committing to planning.
- **Planning** — PRD with functional and non-functional requirements + UX spec when relevant.
- **Solutioning** — architecture document with ADRs, epics broken into stories, and an Implementation Readiness Check that produces a formal gate: PASS / CONCERNS / FAIL.
- **Implementation** — sprint planning, story-by-story development, code review, retrospective.

For small well-understood work, Quick Flow (`bmad-quick-dev`) skips phases 1–3 entirely — clarify intent, plan, implement, review in one unified pass.

`project-context.md` — BMad's equivalent of Constitution. A document that captures technology stack, implementation rules, and project conventions. Generated from architecture or codebase, it guides every workflow.

**Adversarial Review** is the recurring quality mechanism, used across the whole pipeline — code review, implementation readiness checks, spec validation. The reviewer agent must find issues — zero findings triggers a halt and re-analysis. The reviewer assumes problems exist and must surface them. Output is structured by severity:

```
- HIGH   - login.ts:47 - No rate limiting on failed attempts
- HIGH   - Session token stored in localStorage (XSS vulnerable)
- MEDIUM - Password validation happens client-side only
- LOW    - Magic number 3600 should be SESSION_TIMEOUT_SECONDS
```

Unlike Gangsta, there is no Nash Equilibrium as a stopping condition — the debate ends at the orchestrator's discretion. Human filtering is required: because the AI is instructed to find problems, false positives are expected. You decide what is real.

**Strengths:**

- Covers the full lifecycle: analysis → planning → implementation → verification
- 12+ specialized named agents (PM, Architect, Developer, UX, Scrum Master, and more)
- Adversarial Review as a built-in feature
- Supports Agile-compatible workflows — iterative sprints, user stories, backlog
- Large community: Discord, YouTube, active GitHub
- Domain-specific modules: Game Dev Studio, Creative Intelligence Suite, Test Architect
- Works with Claude Code, Cursor, Codex CLI

**Weaknesses:**

- High entry barrier — many concepts to learn upfront
- Quality depends on installed modules (same applies to Spec Kit with its extensions)

**Best for:** If you're building a new product from scratch and want AI at every stage from idea to deployment — BMad covers the full cycle.

*BMad is the only framework that pairs full-lifecycle coverage with a built-in adversarial reviewer — pay the entry cost only if you'll use the whole pipeline.*

---

## Gangsta Agents

**[github.com/kucherenko/gangsta](https://github.com/kucherenko/gangsta)** | [gangsta.page](https://gangsta.page)

Agentic framework for spec-driven development built on the organizational model of the mafia. Zero dependencies, installs in one step. The newest entry of the four — first stable release v1.1.1 in April 2026 — so the comparison reflects an early-stage project rather than an established ecosystem.

Gangsta is built on the principle of strict hierarchy and explicit gates — every decision is traceable to the contract, every agent answers only to its own level.

Gangsta supports two modes: **manual mode** where the Don approves every phase gate, and **autonomous mode** where the entire pipeline runs end-to-end without human intervention. Choose based on the cost of failure for the task at hand.

<img src="/pipeline-flow.svg" alt="The Gangsta Agents Heist Pipeline — 6 phases with Don-approved gates" style="width:100%;border-radius:4px;margin:1.5rem 0 2rem;" />

**How it works — 6-phase Heist Pipeline:**

| Phase | What happens | Gate |
|-------|-------------|------|
| Reconnaissance | Agents scan the codebase, read the Ledger | Don approves Dossier |
| The Grilling | Adversarial debate: Proposer vs Devils-Advocate, min 2 rounds | Don approves consensus |
| The Sit-Down | Formal contract — no code allowed | Don signs |
| Resource Development | Decomposition into Work Packages | Don approves War Plan |
| The Hit | Parallel execution, TDD mandatory | Don approves completion |
| Laundering | Verification, integration, Ledger update | Don declares Heist complete |

**Strict hierarchy:** Don (you) → Consigliere → Underboss → Capo → Soldier. No horizontal communication — only through the chain of command.

### The Grilling — unique feature

Before any spec is written, three agents debate the solution: Proposer proposes the architecture, Devils-Advocate attacks (vulnerabilities, constitution violations, regression risks), Synthesizer integrates valid attacks and the Don's feedback. Minimum 2 rounds, maximum 7, exit only at **Nash Equilibrium** — when the Devils-Advocate can't raise a single new valid objection.

### The Sit-Down — real example

Here's a fragment from a real contract in gangsta-money-tracker-example:

```
## Functional Requirements
- FR-001: Every transaction stores amount in original currency
- FR-002: Every transaction stores amount_default in home currency
- FR-003: Every transaction stores exchange_rate at create time
- FR-008: Changing default currency recalculates ALL existing transactions

## Architectural Decisions
- AD-001: Integer storage — no float rounding errors
- AD-002: Currencies table in DB, not hardcoded enum
- AD-005: Rate stored per-transaction, not computed at query time
  (exchange rates change; the rate at transaction time is correct)
```

No code. Just WHAT and WHY.

### Governance through Omerta — 5 laws:

1. **Introduction Rule** — no agent-to-agent communication without hierarchy mediation
2. **Rule of Availability** — all state saved to files before every phase transition
3. **Rule of Truth** — every claim cites its source. No citation — stronzate
4. **Rule of Tribute** — token and resource budgets are enforced
5. **Spec is Law** — if code contradicts the spec, the spec is revised. Never the reverse.

### Institutional Memory

Gangsta stores history in the filesystem. After each Heist the Ledger is updated: successful patterns become Commandments, failures become Negative Constraints in the Constitution. During Reconnaissance, Associates scan the Ledger and include relevant entries in the next Heist's Dossier.

### Dev Skills — separate toolkit

Beyond the Heist Pipeline, Gangsta ships 7 software development skills that can be invoked anywhere:

- **Interrogation** — systematic debugging, finds the root cause before applying fixes
- **The Drill** — TDD enforcement, no production code without a failing test first
- **Safehouse** — git worktrees, isolated operational bases for parallel work
- **The Audit** — code review with adversarial framing
- **Receiving Orders** — processes user feedback with rigor, not blind agreement
- **The Sweep** — verification through evidence, not assumption
- **Exit Strategy** — clean branch integration and cleanup

The **1% Rule** governs invocation: if there's even a 1% chance a skill applies, you invoke it. No rationalizing, no shortcuts. This prevents the "quick fix" mentality that compounds into technical debt.

**Lightweight Heist** for minor fixes: the full 6-phase pipeline isn't always required. For minor fixes or known patterns, a lightweight version skips early phases. For new features, architectural changes, or non-trivial bugs — the full pipeline runs.

**Strengths:**

- The Grilling — the only adversarial debate with Nash Equilibrium and fixed rounds
- Strict gates in manual mode — every phase requires explicit Don approval
- Institutional Memory via Ledger
- Zero dependencies — pure Markdown and shell scripts
- TDD enforced at the architecture level
- Native integration: Claude Code, GitHub Copilot, Gemini CLI, OpenCode, Codex. Cursor support via `npx skills add`

**Weaknesses:**

- Steep learning curve due to metaphors and hierarchy
- 6-phase pipeline with gates is overkill for isolated single-agent tasks
- Young project, community still forming

**Best for:** If the cost of failure is high, the feature touches multiple domains, and you need full traceability of every decision back to the contract — Gangsta gives the strictest process of the four.

*Gangsta Agents trades ceremony for traceability — the only framework with Nash Equilibrium debate and institutional memory, but the youngest of the four.*

---

## Comparison

### Autonomous execution: where the control boundary sits

All four frameworks support autonomous execution — but the human control boundary differs:

- **GitHub Spec Kit — Ralph Loop:** agent takes `tasks.md` and executes all tasks without stopping. Gates can be bypassed.
- **OpenSpec — /opsx:apply:** executes all tasks sequentially. Minimal gates, maximum autonomy.
- **BMad Method — Orchestrator:** orchestrator agent guides execution through phases. Adversarial review built in, but no named loop.
- **Gangsta Agents — Two modes:** in manual mode, Soldiers execute Work Packages with strict gates before and after the phase; in autonomous mode, the entire 6-phase pipeline runs end-to-end without human approval.

### Technical characteristics

<img src="/tech.jpeg" alt="Technical characteristics comparison across four SDD frameworks" style="width:100%;border-radius:4px;margin:1.5rem 0 2rem;" />

### Ecosystem

| | GitHub Spec Kit | OpenSpec | BMad Method | Gangsta |
|---|---|---|---|---|
| GitHub stars | 88k | 37.7k | 44.2k | — |
| Extensions | 50+ | — | Modules | — |
| Community | Large | Growing | Large | Forming |
| AI agents | 28 | 20+ | 12+ | 5+ |

Gangsta's Agile compatibility is low **by design**: each phase requires explicit human approval before proceeding, which conflicts with sprint-based iteration. This is optimized for traceability, not throughput.

---

## What all four share

Despite different approaches, all four frameworks agree on one thing:

**The human stays in the loop** — but not for everything. The agent acts on the rules and only stops where a human is actually needed: conflicting requirements, an architectural choice with real consequences, ambiguity affecting the system boundary.

Uncertainty doesn't disappear into confident-sounding text — it gets logged explicitly.

**Agent context matters more than agent capability.** When Andrej Karpathy named vibe coding in February 2025, the conversation focused on whether models were good enough. Two years later it's clear: the bottleneck isn't model capability. It's that the model has no contract.

SDD does not guarantee correct decisions and does not replace architectural thinking. It reduces the probability of two specific failure modes: agents drifting off-spec due to missing constraints, and contradictions accumulating silently across sessions.

The four frameworks sit on a spectrum from low ceremony to high traceability:

- **OpenSpec:** minimal structure, maximum iteration speed, no gates
- **Spec Kit:** structured phases, enterprise integrations, bypassable gates
- **BMad:** full lifecycle, adversarial review, orchestrator-controlled flow
- **Gangsta Agents:** strict gates at every phase, Nash Equilibrium debate, institutional memory

Pick based on your failure cost and change velocity. Higher failure cost requires stricter gates. Higher change velocity requires lower ceremony.

---

**GitHub Spec Kit:** [github.com/github/spec-kit](https://github.com/github/spec-kit)

**OpenSpec:** [github.com/Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) | [openspec.dev](https://openspec.dev)

**BMad Method:** [github.com/bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | [docs.bmad-method.org](https://docs.bmad-method.org)

**Gangsta Agents:** [github.com/kucherenko/gangsta](https://github.com/kucherenko/gangsta) | [gangsta.page](https://gangsta.page)
