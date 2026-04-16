#!/usr/bin/env tsx
/**
 * sync-skills.ts
 *
 * Pulls skill files from the Gangsta GitHub repository and:
 *   1. Copies raw files to  skills/  → served at /.well-known/skills/* via Docus Agent Skills
 *   2. Generates Docus content pages in  content/4.skills/  → human-readable docs with navigation
 *
 * Environment variables:
 *   GITHUB_TOKEN         — Required. GitHub personal access token (contents:read scope).
 *   GITHUB_SKILLS_OWNER  — GitHub owner (default: kucherenko)
 *   GITHUB_SKILLS_REPO   — GitHub repo (default: gangsta)
 *   GITHUB_SKILLS_PATH   — Skills directory path (default: skills)
 *   GITHUB_SKILLS_BRANCH — Branch (default: main)
 *
 * Usage: npm run sync
 */

import { Octokit } from '@octokit/rest'
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

// --- Configuration ---
const OWNER  = process.env.GITHUB_SKILLS_OWNER  ?? 'kucherenko'
const REPO   = process.env.GITHUB_SKILLS_REPO   ?? 'gangsta'
const PATH   = process.env.GITHUB_SKILLS_PATH   ?? 'skills'
const BRANCH = process.env.GITHUB_SKILLS_BRANCH ?? 'main'
const TOKEN  = process.env.GITHUB_TOKEN

if (!TOKEN) {
  console.error('[sync-skills] ERROR: GITHUB_TOKEN environment variable is required.')
  console.error('[sync-skills] Set it to a GitHub personal access token with contents:read scope.')
  console.error('[sync-skills] Example: export GITHUB_TOKEN=ghp_xxxxx')
  process.exit(1)
}

const octokit = new Octokit({ auth: TOKEN })

// --- Helpers ---

interface SkillEntry {
  name: string
  slug: string
  description: string
  order: number
}

function extractFrontmatterValue(raw: string, key: string): string | null {
  const match = raw.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  return match?.[1]?.trim().replace(/^["']|["']$/g, '') ?? null
}

function extractH1(raw: string): string | null {
  const match = raw.match(/^#\s+(.+)$/m)
  return match?.[1]?.trim() ?? null
}

function injectFrontmatter(raw: string, additions: Record<string, string | number>): string {
  const hasFrontmatter = raw.startsWith('---')
  const addedLines = Object.entries(additions)
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? `"${v}"` : v}`)
    .join('\n')

  if (hasFrontmatter) {
    return raw.replace(/^---\n/, `---\n${addedLines}\n`)
  }
  return `---\n${addedLines}\n---\n\n${raw}`
}

// Category classification based on skill name
function classifySkill(slug: string): { category: string; categoryOrder: number } {
  const hierarchyRoles = ['the-consigliere', 'the-underboss', 'the-capo', 'the-ledger', 'omerta', 'using-gangsta']
  const heistPhases = ['reconnaissance', 'the-grilling', 'the-sit-down', 'resource-development', 'the-hit', 'laundering']

  if (heistPhases.includes(slug)) return { category: 'heist-phases', categoryOrder: 2 }
  if (hierarchyRoles.includes(slug)) return { category: 'hierarchy-roles', categoryOrder: 1 }
  return { category: 'dev-skills', categoryOrder: 3 }
}

// --- Main ---

async function syncDirectory(
  owner: string,
  repo: string,
  path: string,
  branch: string,
  targetRawDir: string,
  targetContentDir: string,
  skillEntries: SkillEntry[]
): Promise<void> {
  const { data: entries } = await octokit.repos.getContent({ owner, repo, path, ref: branch })

  if (!Array.isArray(entries)) {
    throw new Error(`Expected directory listing at ${path}, got a file`)
  }

  for (const entry of entries) {
    if (entry.type === 'dir') {
      // Recurse into subdirectories (e.g., the-grilling/proposer-prompt.md)
      const subRawDir = join(targetRawDir, entry.name)
      const subContentDir = join(targetContentDir, entry.name)
      mkdirSync(subRawDir, { recursive: true })
      mkdirSync(subContentDir, { recursive: true })

      await syncDirectory(owner, repo, entry.path, branch, subRawDir, subContentDir, skillEntries)
    } else if (entry.type === 'file' && entry.name.endsWith('.md')) {
      const { data: file } = await octokit.repos.getContent({ owner, repo, path: entry.path, ref: branch })
      if (!('content' in file)) continue

      const raw = Buffer.from(file.content, 'base64').toString('utf-8')

      // 1. Raw copy → skills/ (for Agent Skills serving)
      writeFileSync(join(targetRawDir, entry.name), raw, 'utf-8')

      // 2. Only SKILL.md gets a content page (not sub-prompt files)
      if (entry.name === 'SKILL.md') {
        const slug = path.split('/').pop()!
        const title = extractFrontmatterValue(raw, 'title') ?? extractFrontmatterValue(raw, 'name') ?? extractH1(raw) ?? slug
        const description = extractFrontmatterValue(raw, 'description') ?? `Gangsta skill: ${title}`
        const { category, categoryOrder } = classifySkill(slug)
        const order = categoryOrder * 10 + skillEntries.filter(s => s.slug.startsWith(slug.slice(0, 3))).length + 1

        const docPage = injectFrontmatter(raw, {
          title,
          description,
          'navigation.order': order,
          'navigation.icon': 'i-heroicons-bolt',
        })

        // Write to category subdirectory
        const categoryDir = join('content', '4.skills', category)
        mkdirSync(categoryDir, { recursive: true })
        writeFileSync(join(categoryDir, `${slug}.md`), docPage, 'utf-8')

        skillEntries.push({ name: title, slug, description, order })
        console.log(`[sync-skills] ✓ ${slug} → skills/${path}/ + content/4.skills/${category}/${slug}.md`)
      } else {
        console.log(`[sync-skills] ✓ ${entry.path} → skills/ (reference file)`)
      }
    }
  }
}

async function main(): Promise<void> {
  console.log(`[sync-skills] Fetching from ${OWNER}/${REPO}/${PATH} (branch: ${BRANCH})`)

  // Clean previous output
  const skillsDir = 'skills'
  const contentSkillsDir = join('content', '4.skills')
  if (existsSync(skillsDir)) rmSync(skillsDir, { recursive: true, force: true })
  if (existsSync(contentSkillsDir)) rmSync(contentSkillsDir, { recursive: true, force: true })

  // Ensure directories exist
  mkdirSync(skillsDir, { recursive: true })

  const skillEntries: SkillEntry[] = []

  await syncDirectory(OWNER, REPO, PATH, BRANCH, skillsDir, contentSkillsDir, skillEntries)

  // Generate .navigation.yml files
  const categories = [
    { dir: 'hierarchy-roles', title: 'Hierarchy Roles', icon: 'i-heroicons-user-group' },
    { dir: 'heist-phases', title: 'Heist Phases', icon: 'i-heroicons-academic-cap' },
    { dir: 'dev-skills', title: 'Dev Skills', icon: 'i-heroicons-wrench-screwdriver' },
  ]

  // Root skills navigation
  const rootNavYml = `title: Skills Reference\nicon: i-heroicons-bolt\n`
  writeFileSync(join(contentSkillsDir, '.navigation.yml'), rootNavYml, 'utf-8')

  // Category navigations
  for (const cat of categories) {
    const catDir = join(contentSkillsDir, cat.dir)
    if (existsSync(catDir)) {
      const catNavYml = `title: ${cat.title}\nicon: ${cat.icon}\n`
      writeFileSync(join(catDir, '.navigation.yml'), catNavYml, 'utf-8')
    }
  }

  // Skills index page
  const indexContent = `---
title: Skills Reference
description: Complete reference for all Gangsta skills — hierarchy roles, heist phases, and development tools.
navigation.order: 1
navigation.icon: i-heroicons-bolt
---

# Skills Reference

Gangsta provides **20 skills** organized into three categories:

::callout{type="info"}
Skills are automatically served at \`/.well-known/skills/\` for AI agent discovery.
See the [installation guide](/getting-started/installation) for how to install Gangsta on your platform.
::

## Hierarchy Roles

Skills for the Borgata chain of command — each role has a dedicated skill that defines its behavior and responsibilities.

## Heist Phases

The 6-phase Heist Pipeline — each phase has a skill that governs the process, checklists, and gate conditions.

## Dev Skills

Specialized development skills for TDD, debugging, code review, and workflow management.

Browse the sidebar for detailed documentation of each skill.
`
  writeFileSync(join(contentSkillsDir, 'index.md'), indexContent, 'utf-8')

  console.log(`[sync-skills] Done. ${skillEntries.length} skills synced.`)
}

main().catch((err) => {
  console.error('[sync-skills] FAILED:', err.message)
  process.exit(1)
})