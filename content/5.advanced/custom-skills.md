---
title: Writing Custom Skills
description: Create your own Gangsta skills using the SKILL.md format and register them with your AI tool.
navigation.order: 2
---
Gangsta skills are Markdown files that tell AI agents how to perform structured tasks. You can create custom skills for your project's specific needs — domain-specific processes, team conventions, or specialized workflows.

## The SKILL.md Format

Every skill is a Markdown file with YAML frontmatter:

```yaml
---
name: my-custom-skill
description: |
  A brief description of what this skill does and when to invoke it.
  This description is what the AI agent reads to decide whether to invoke the skill.
type: flexible  # or: rigid
---

# Skill Name

## When to Invoke

Describe the conditions under which this skill should be activated.
Be specific about triggers and intents.

## Process

1. Step one
2. Step two
3. Step three

## Checklist Before Proceeding

- [ ] Item one is verified
- [ ] Item two is confirmed
- [ ] Item three is complete

## Outputs

Describe what this skill produces when complete.
```

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique skill identifier (kebab-case) |
| `description` | Yes | What the skill does and when to invoke it |
| `type` | No | `rigid` or `flexible` (default: `flexible`) |

## Skill Types

### Flexible Skills
Adapt principles to context. The spirit matters more than the letter.

```yaml
type: flexible
```

Use for: reconnaissance, brainstorming, planning — tasks where context determines the best approach.

### Rigid Skills
Must be followed exactly. Don't adapt away from the discipline.

```yaml
type: rigid
```

Use for: TDD cycles, debugging protocols, governance rules — tasks where skipping steps produces unreliable results.

## Directory Structure

Custom skills live in your project's skills directory:

```
your-project/
├── .gangsta/
│   └── skills/
│       ├── my-custom-skill/
│       │   └── SKILL.md
│       └── another-skill/
│           ├── SKILL.md
│           └── subagent-prompt.md
├── docs/
├── src/
└── ...
```

Or in a shared location:

```
~/gangsta/skills/
├── my-custom-skill/
│   └── SKILL.md
└── ...
```

## Writing Effective Skill Descriptions

The `description` field is critical — it's what the AI agent reads to decide whether to invoke the skill. Write descriptions that:

1. **Are specific about triggers** — "When the user wants to add a new API endpoint" is better than "When building things"
2. **Include relevant keywords** — AI agents match on intent; use words the user is likely to say
3. **Clarify scope** — "For database migration tasks only" prevents false positives

**Good example:**
```yaml
description: |
  Invoke when creating or modifying database schema migrations.
  Covers adding tables, columns, indexes, and constraints.
  Do not invoke for data migrations or seed scripts.
```

**Poor example:**
```yaml
description: |
  Use this skill for database stuff.
```

## Subagent Prompts

Skills that delegate work to subagents can include separate prompt files:

```
my-skill/
├── SKILL.md
├── planner-prompt.md
└── executor-prompt.md
```

The main `SKILL.md` references these subagents in its process steps.

## Registering with Your AI Tool

### Claude Code
```json
// .claude/settings.json
{
  "skills": {
    "paths": ["~/gangsta/skills", "./.gangsta/skills"]
  }
}
```

### OpenCode
```json
// opencode.json (OpenCode 2.x)
{
  "skills": ["~/gangsta/skills", "./.gangsta/skills"]
}
```

```json
// opencode.json (OpenCode 1.x)
{
  "skills": {
    "paths": ["~/gangsta/skills", "./.gangsta/skills"]
  }
}
```

### Antigravity CLI
```bash
# Workspace skills are discovered from .agents/skills/
mkdir -p .agents/skills
cp -r ./skills/my-custom-skill .agents/skills/
```

### Codex
```bash
# Symlink to the Codex skills directory
ln -s ./skills/my-custom-skill ~/.agents/skills/my-custom-skill
```

### Gemini CLI
```bash
# Install local skills
gemini extensions install ./path/to/my-custom-skill
```

## Testing Custom Skills

After creating a custom skill:

1. Start a **new session** with your AI tool
2. Express an intent that should trigger the skill
3. Verify the agent invokes your skill
4. Walk through the skill's process steps
5. Confirm the expected outputs are produced

::callout{type="info" icon="i-lucide-test-tubes"}
**Debugging tip:** If a skill doesn't invoke, check the `description` field. It may not match the user intent closely enough. The 1% Rule means agents look for any match — make sure your description is specific enough to avoid false positives.
::