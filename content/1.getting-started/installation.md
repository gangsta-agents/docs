---
title: Installation
description: Install Gangsta Agents skills on Claude Code, GitHub Copilot, OpenCode, Codex, Gemini CLI, or Cursor.
navigation.order: 2
---
Gangsta Agents is a skills framework — it doesn't run as a standalone application. Instead, you install it into your AI coding tool so the agent can invoke skills automatically. Choose your platform below.

::callout{type="info" icon="i-lucide-package"}
**What you're installing:** A collection of Markdown-based skill files that tell your AI agent when and how to use structured development processes. No runtime dependencies, no build step, no package manager required.
::

## Prerequisites

- Git
- An AI coding tool: Claude Code, GitHub Copilot, OpenCode, Codex, Gemini CLI, or Cursor
- A project directory where you want to use Gangsta Agents

## Universal Install

The fastest way to install on any platform — including those without a native plugin — is the [skills CLI](https://github.com/vercel-labs/skills):

```bash
# Install into the current project
npx skills add kucherenko/gangsta

# Install globally (available across all projects)
npx skills add kucherenko/gangsta --global

# Install to a specific agent only
npx skills add kucherenko/gangsta -a claude-code
npx skills add kucherenko/gangsta -a opencode
npx skills add kucherenko/gangsta -a cursor
```

This installs the full Gangsta Agents skill set into your agent's skills directory. Prefer this if your platform has no dedicated plugin below.

## Install for Your Platform

### Claude Code

Run these two slash commands inside Claude Code:

::code-group

```bash [1. Add marketplace]
/plugin marketplace add kucherenko/gangsta
```

```bash [2. Install plugin]
/plugin install gangsta@gangsta
```

::

That's it — Claude Code will fetch and register all Gangsta Agents skills automatically. Start a new session to activate them.

---

### GitHub Copilot

Run these two slash commands inside GitHub Copilot:

::code-group

```bash [1. Add marketplace]
copilot plugin marketplace add kucherenko/gangsta
```

```bash [2. Install plugin]
copilot plugin install gangsta@gangsta-marketplace
```

::

That's it — GitHub Copilot will fetch and register all Gangsta Agents skills automatically. Start a new session to activate them.

---

### OpenCode

Tell OpenCode in a new session:

```text [Prompt OpenCode]
Fetch and follow instructions from https://raw.githubusercontent.com/kucherenko/gangsta/refs/heads/master/.opencode/INSTALL.md
```

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

```text [Prompt Codex]
Fetch and follow instructions from https://raw.githubusercontent.com/kucherenko/gangsta/refs/heads/master/.codex/INSTALL.md
```

**Prefer a manual install?**

::code-group

```bash [Manual install]
git clone https://github.com/kucherenko/gangsta.git ~/.gangsta
mkdir -p ~/.agents/skills
ln -sf ~/.gangsta/skills ~/.agents/skills/gangsta
```

::

Restart Codex — skills are discovered automatically from `SKILL.md` frontmatter.

---

### Gemini CLI

```bash
gemini extensions install https://github.com/kucherenko/gangsta
```

This handles cloning, path configuration, and registration automatically.

---

### Cursor

Cursor doesn't have a native Gangsta Agents plugin yet. Install via the [universal `npx skills add`](#universal-install) command:

```bash
npx skills add https://github.com/kucherenko/gangsta
```

This installs the full Gangsta Agents skill set into your agent's skills directory. Once done, start a new Cursor session and prompt your agent:

```
Use gangsta and build new feature
```

Cursor will pick up the skills and invoke the right ones for the task.

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

To update Gangsta Agents skills to the latest version:

::code-group

```bash [All Platforms]
cd ~/.gangsta
git pull origin master
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
| Claude Code plugin not found | Ensure marketplace was added before running `/plugin install` |
| GitHub Copilot plugin not found | Ensure marketplace was added before running `copilot plugin install` |
