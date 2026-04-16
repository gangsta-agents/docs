---
heist: gangsta-site-cicd
date: 2026-04-16
status: pending-review
---

# Reconnaissance Dossier: CI/CD Pipeline for Gangsta Site

## Objective
Add CI/CD to automatically publish the Gangsta documentation site on push to the `master` branch.

## Codebase Overview

| Property | Value |
|----------|-------|
| Framework | Nuxt 4 + Docus v5.9.0 |
| Build command | `npm run sync && nuxt generate` |
| Build output | `.output/public` (confirmed by `preview` script) |
| Hosting | Cloudflare Pages (wrangler.toml present, `preset: 'cloudflare-pages'` in nuxt.config.ts) |
| Git remote | `git@github.com:kucherenko/gangsta-site.git` |
| Node version | 20 (`.node-version` + `.nvmrc`) |
| Package manager | npm (package-lock.json present; bun.lock also exists) |
| Existing CI/CD | **None** — no `.github/workflows/` directory |

### Key Files
- `nuxt.config.ts` — Cloudflare Pages preset, SSG via `prerender: { crawlLinks: true }`
- `wrangler.toml` — `name = "gangsta"`, `pages_build_output_dir = "dist"` ⚠️ see risks
- `scripts/sync-skills.ts` — Syncs skills from GitHub using `@octokit/rest` — may need `GITHUB_TOKEN`
- `package.json` — `build` script runs sync then generate

## Dependency Signals for CI

| Concern | Detail |
|---------|--------|
| `@octokit/rest` (devDep) | Used by sync-skills.ts — GitHub API calls may hit rate limits without a token in CI |
| `better-sqlite3` | Native module — requires node-gyp-compatible environment |
| Node 20 | Required by `engines.node >= 20` |

## Existing Ledger / Prior Heist
- Previous heist (`gangsta-site`) completed in Laundering phase — site is built, deployed manually
- No CI/CD entries in ledger

## Risks and Unknowns

1. **`wrangler.toml` output dir mismatch** — wrangler.toml says `pages_build_output_dir = "dist"` but the `preview` script uses `.output/public`. Need to confirm correct deploy dir or align configs.
2. **`sync-skills.ts` GitHub API rate limits** — Without a `GITHUB_TOKEN`, the sync script may fail in CI due to unauthenticated GitHub API rate limits.
3. **Package manager ambiguity** — Both `package-lock.json` and `bun.lock` exist. CI should use one consistently (npm is safer given `npm ci` support).
4. **Cloudflare secrets needed** — `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` must be added to GitHub repo secrets by the Don.
5. **Branch name** — Repo may use `main` vs `master` — need to confirm the default branch.

## Recommended Scope
Single GitHub Actions workflow file: `.github/workflows/deploy.yml`

**Trigger:** `push` to `master` (or `main` — confirm with Don)  
**Steps:** checkout → setup Node 20 → npm ci → npm run build → wrangler pages deploy  
**Secrets needed:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, optionally `GITHUB_TOKEN` for sync script

## Recommended Approach
Use the official `cloudflare/wrangler-action` GitHub Action to deploy via Wrangler, consistent with the existing `wrangler.toml`.
