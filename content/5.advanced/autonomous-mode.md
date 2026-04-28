---
title: Autonomous Mode
description: Run the Heist Pipeline end-to-end with the Don Proxy approving gates on your behalf.
navigation.order: 6
---
Autonomous Mode runs the same 6-phase Heist Pipeline, but with `gangsta:don-proxy` substituting for the human Don at every gate. Instead of pausing at each phase for your approval, the pipeline flows through phases automatically — and you sign off at key checkpoints.

::callout{type="info" icon="i-lucide-robot"}
**Autonomous Mode is optional.** The default gated pipeline — where you approve every phase — remains unchanged. Autonomous Mode is for when you trust the pipeline and want to move faster.
::

## How It Works

Autonomous Mode uses **two commands** that split the Heist into two runs:

1. **`/gangsta:heist <feature>`** — Runs phases 1–4 (Reconnaissance → Grilling → Sit-Down → Resource Development). The Don Proxy approves each gate, producing a Contract and Execution Plan.
2. **`/gangsta:go [feature]`** — You review and sign the Contract, then phases 5–6 (The Hit → Laundering) execute.
3. **`/gangsta:abort <feature>`** — Halts the Heist at any point and archives it.

```
/gangsta:heist <feature>
  Phase 1: Reconnaissance ──── don-proxy approves ──→ auto-advance
  Phase 2: The Grilling ────── don-proxy approves ──→ auto-advance
  Phase 3: The Sit-Down ─────── dual-veto gate ────→ auto-advance
  Phase 4: Resource Development ─ don-proxy approves ──→ PAUSE

/gangsta:go <feature>
  You sign the Contract and Plan
  Phase 5: The Hit ──────────── Workers execute ────→ auto-advance
  Phase 6: Laundering ────────── don-proxy declares ──→ COMPLETE
```

## The Don Proxy

During Autonomous Mode, `gangsta:don-proxy` acts as your surrogate at every gate. It reviews outputs using the same criteria a human Don would:

- Does the Dossier cover all requested areas?
- Are Grilling conclusions well-reasoned?
- Does the Contract meet completeness standards?
- Is the Execution Plan realistic?

The Don Proxy is **not** a rubber stamp. It can reject outputs that are incomplete or violate the Constitutional Floor.

## The Dual-Veto

Phase 3 (The Sit-Down) has a special **Dual-Veto** gate: both the Consigliere and the Don Proxy must approve. If either rejects, the Heist halts.

| Consigliere | Don Proxy | Result |
|---|---|---|
| Approve | Approve | Proceed to Resource Development |
| Reject | Approve | Halt — Consigliere veto |
| Approve | Reject | Halt — Don Proxy veto |
| Reject | Reject | Halt — both vetoed |

There is no tie-breaker, no precedence, no override. A veto from either party is terminal for that Heist run.

## Command Reference

### `/gangsta:heist <feature>`

Starts an autonomous Heist for the named feature. Runs phases 1–4 end-to-end without pausing.

- Creates the Heist directory: `docs/gangsta/<feature>/`
- Produces: Dossier, Grilling Conclusions, Contract, Execution Plan
- Artifacts are marked `signed-by: don-proxy`, `status: pending-don-confirmation`
- Exits after Resource Development with the Contract and Plan ready for your review

### `/gangsta:go [feature]`

Signs the Contract and Execution Plan, then executes phases 5–6.

- If no feature is specified, reads `docs/gangsta/.last-heist` for the most recent autonomous Heist
- Flips artifact status from `pending-don-confirmation` to `confirmed`
- The signature is atomic: Contract and all matched Ledger entries are confirmed together
- The Hit and Laundering execute automatically after signing

### `/gangsta:abort <feature>`

Halts the Heist and relocates all artifacts to `docs/gangsta/.aborted/<feature>-<timestamp>/`.

- Aborted Heists are excluded from active Ledger reads
- Clears `.last-heist` if it pointed to the aborted feature
- No partial artifacts are left in the active Heist directory

## Constitutional Floor

Autonomous Mode is bounded by a **Constitutional Floor** — a set of hard rules that cannot be overridden:

- **Omerta Laws** from `skills/omerta/SKILL.md`
- **Negative Constraints** from `docs/gangsta/constitution.md`
- **Binding contributor constraints** from `AGENTS.md`

If any phase produces output that violates the Constitutional Floor, the Heist **halts immediately**. The violation is written to the autonomous log, and the Heist directory is left in place for your inspection.

::callout{type="danger" icon="i-lucide-shield-alert"}
**No mid-flight retry.** A Constitutional Floor rejection is terminal. Resumption requires a fresh `/gangsta:heist` invocation. The `--best-effort` flag does not override Floor violations.
::

## Per-Phase Differences

The following table summarizes how Autonomous Mode differs from the default gated pipeline at each phase:

| Phase | Gate Actor | Auto-Advance | Termination |
|---|---|---|---|
| 1. Reconnaissance | Don Proxy (once, post-Dossier) | To Grilling on non-REJECT | Halts on Floor REJECT or material incompleteness |
| 2. The Grilling | Don Proxy (per round + consensus) | To Sit-Down on non-REJECT | Halts on Floor violation baked into consensus |
| 3. The Sit-Down | Don Proxy + Consigliere (dual-veto) | To Resource Development on dual non-REJECT | Either veto is terminal |
| 4. Resource Development | Don Proxy (once, post-Plan) | `/gangsta:heist` exits; Hit does NOT auto-start | Halts on Plan that forces a Floor violation |
| 5. The Hit | Don Proxy (at Worker-failure mini-Grilling only) | To Laundering as in default | Mini-Grilling produces deviation report only; Contract amendment requires fresh Sit-Down |
| 6. Laundering | Don Proxy (once, at final declaration) | `/gangsta:go` exits | Ledger entries written `signed-by: don-proxy`, `status: pending-don-confirmation` |

## Artifact Lifecycle States

Autonomous Mode artifacts carry one of three states in their frontmatter:

### `pending-don-confirmation`
Written by `/gangsta:heist` and during Laundering under `/gangsta:go`. Visible to active reads but flagged as unconfirmed.

### `confirmed`
Flipped by `/gangsta:go` at signing: `signed-by: don`, `confirmed: <ISO-8601 UTC>`. The flip is atomic across the Contract and every matched Ledger entry.

### `rejected`
Relocated by `/gangsta:abort` together with the Heist directory to `docs/gangsta/.aborted/<feature>-<timestamp>/`. Subsequent Ledger reads exclude entries whose `heist:` resolves under `.aborted/`.

## State Files

Autonomous Mode maintains two state files:

### `.last-heist`
A single-line pointer at `docs/gangsta/.last-heist` that references the most recent autonomous Heist directory. Read by `/gangsta:go` when invoked without a feature argument. Cleared by `/gangsta:abort` if it points at the aborted feature.

### `autonomous-log.md`
A progressive per-phase decision log at `docs/gangsta/<feature>/autonomous-log.md`. Written incrementally during `/gangsta:heist` and `/gangsta:go`. Records:

- Timestamp
- Phase
- Actor (don-proxy, consigliere, worker)
- Verdict
- Citation (which rule or artifact informed the decision)
- Artifact pointers

## Resolution Rules

Both `/gangsta:go` and `/gangsta:abort` resolve the target Heist by **exact directory match only** under `docs/gangsta/<feature>/`. No fuzzy match, no Levenshtein distance, no auto-correct, no closest-suggestion. Resolution failure is a hard error.

## When to Use Autonomous Mode

::callout{type="tip" icon="i-lucide-lightbulb"}
**Use Autonomous Mode when:**
- You have a clear feature description and want fast end-to-end pipeline execution
- You trust the pipeline's Constitutional Floor to catch serious issues
- You want to review the Contract and Plan in one go rather than approving each phase individually

**Use the default gated pipeline when:**
- You want full control over every phase gate
- The feature is complex or ambiguous enough that intermediate review is important
- You don't want any auto-approval at all
::

## Quick Reference: Gated vs. Autonomous

| Aspect | Gated Pipeline | Autonomous Mode |
|---|---|---|
| Gate approval | Human Don at every phase | Don Proxy (phases 1–4), Human Don (signing), Don Proxy (phases 5–6) |
| Phase transition | Manual after each gate | Automatic between phases |
| Starting command | Express building intent or `gangsta:reconnaissance` | `/gangsta:heist <feature>` |
| Signing | Human Don at each gate | Human Don signs via `/gangsta:go` |
| Halting | Reject at any gate | `/gangsta:abort` or Constitutional Floor REJECT |
| Abort handling | Manual cleanup | Automatic archival to `.aborted/` |