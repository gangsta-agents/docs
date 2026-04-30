# Gangsta Agents — Docs

Official documentation for [Gangsta Agents](https://github.com/gangsta-agents/gangsta) — the spec-driven development framework for AI agents.

Covers the Heist Pipeline (6-phase development cycle), the Borgata hierarchy, Omerta governance laws, the Ledger, skills, and autonomous mode with slash commands (`/gangsta:heist`, `/gangsta:go`, `/gangsta:abort`).

Built with [Docus](https://docus.dev/) and deployed to [gangsta.page](https://gangsta.page).

## Quick Start

```bash
npm install

# Sync skills from GitHub (requires GITHUB_TOKEN)
export GITHUB_TOKEN=ghp_your_token_here
npm run sync

npm run dev      # dev server
npm run build    # production build
```

## Architecture

Dual-purpose site:

- **Human documentation** — Docus content pages in `content/`
- **Agent Skill endpoint** — Served at `/.well-known/skills/` via Docus's Agent Skills module

Skills are auto-synced from [kucherenko/gangsta](https://github.com/kucherenko/gangsta) at build time.

## Deployment

Deployed to Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `.output/public`
- Node version: 20

A GitHub webhook triggers rebuilds when skill files change upstream.

## Project Structure

```
├── app/
│   └── components/content/  # Vue components (PipelineFlow, HierarchyTree, PhaseGate)
├── assets/css/              # Theme styles (gold/amber on dark)
├── content/                 # Docus content pages
│   ├── index.md             # Landing page
│   ├── 1.getting-started/   # Installation, quickstart, 1% rule
│   ├── 2.core-concepts/      # Borgata, Heist, Omerta, Ledger, etc.
│   ├── 3.heist-pipeline/    # 6-phase deep-dives
│   ├── 4.skills/            # Auto-generated skill docs (from sync)
│   └── 5.advanced/          # Autonomous mode, custom skills, multi-agent, contributing
├── scripts/
│   └── sync-skills.ts       # GitHub → skills/ + content/4.skills/
├── app.config.ts            # Docus configuration
├── nuxt.config.ts           # Nuxt configuration (Cloudflare preset)
└── package.json             # Dependencies and scripts
```

## License

MIT