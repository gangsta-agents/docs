---
title: Installation
description: Install Gangsta skills on OpenCode, Codex, or Gemini CLI.
navigation.order: 2
---

# Installation

Gangsta is a skills framework — it doesn't run as a standalone application. Instead, you install it into your AI coding tool so the agent can invoke skills automatically. Choose your platform below.

::callout{type="info" icon="i-lucide-package"}
**What you're installing:** A collection of Markdown-based skill files that tell your AI agent when and how to use structured development processes. No runtime dependencies, no build step, no package manager required.
::

## Prerequisites

- Git
- An AI coding tool: OpenCode, Codex, or Gemini CLI
- A project directory where you want to use Gangsta

::callout{type="warning" icon="i-lucide-clock"}
**Claude Code and Cursor support is in progress.** Follow [GitHub](https://github.com/kucherenko/gangsta) for updates.
::

## Install for Your Platform

### OpenCode

Tell OpenCode in a new session:

> "Fetch and follow instructions from `https://raw.githubusercontent.com/kucherenko/gangsta/refs/heads/master/.opencode/INSTALL.md`"

That's it — OpenCode will clone the repo, configure the plugin, and set up the skills path automatically.

**Prefer a manual install?**

::code-group

```bash [1. Clone]
git clone https://github.com/kucherenko/gangsta.git ~/.gangsta
```

```json [2. opencode.json]
{
  "plugin": ["gangsta@file:///Users/you/.gangsta"],
  "skills": {
    "paths": ["~/.gangsta/skills"]
  }
}
```

::

Replace `/Users/you/.gangsta` with your actual clone path. The `~` shorthand works in `skills.paths`. Restart OpenCode after saving.

---

### Codex

Tell Codex in a new session:

> "Fetch and follow instructions from `https://raw.githubusercontent.com/kucherenko/gangsta/refs/heads/master/.codex/INSTALL.md`"

**Prefer a manual install?**

```bash
git clone https://github.com/kucherenko/gangsta.git ~/.gangsta
mkdir -p ~/.agents/skills
ln -sf ~/.gangsta/skills ~/.agents/skills/gangsta
```

Restart Codex — skills are discovered automatically from `SKILL.md` frontmatter.

---

### Gemini CLI

```bash
gemini extensions install https://github.com/kucherenko/gangsta
```

This handles cloning, path configuration, and registration automatically.

---

## Verify Installation

After installing, start a **new session** with your AI tool and test with this prompt:

::callout{type="success" icon="i-lucide-check-circle"}
**Verification prompt:** Start a new session and say:

> "I want to build a new feature"

The agent should **automatically invoke** `gangsta:reconnaissance` and begin gathering intel about your codebase and requirements. If it does, installation is successful.
::

If the agent doesn't invoke the skill:

1. Check that the skills path is correctly configured
2. Ensure you're starting a **fresh session** (skills are loaded at session start)
3. Verify the `skills/` directory contains `.md` files (not nested too deep)

## Updating

To update Gangsta skills to the latest version:

::code-group

```bash [All Platforms]
cd ~/.gangsta
git pull origin main
```

```bash [Gemini CLI]
gemini extensions update gangsta
```

::

::callout{type="warning" icon="i-lucide-refresh-cw"}
Always update before starting a new Heist. Skill definitions evolve, and using the latest version ensures you have the most current process definitions.
::

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Agent doesn't invoke skills | Check skills path configuration; restart session |
| Skills appear but produce errors | Verify skill files are `.md` format, not corrupted |
| Partial skill invocation | Ensure the entire `skills/` directory is linked, not individual files |
| Gemini CLI extension not found | Ensure `gemini extensions install` completed without errors |
