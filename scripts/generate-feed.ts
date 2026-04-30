import { Feed } from 'feed'
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import matter from 'gray-matter'

const siteUrl = 'https://gangsta.page'
const contentDir = resolve(import.meta.dirname, '..', 'content', 'blog')
const outDir = resolve(import.meta.dirname, '..', 'dist')

const feed = new Feed({
  title: 'Gangsta Agents',
  description:
    'AI agent development structured like a mafia family. Hierarchy, pipelines, and discipline — enforced.',
  id: siteUrl,
  link: siteUrl,
  language: 'en',
  image: `${siteUrl}/logo-light.svg`,
  favicon: `${siteUrl}/favicon.svg`,
  copyright: `All rights reserved ${new Date().getFullYear()}, Gangsta Agents`,
  updated: new Date(),
  feedLinks: {
    rss: `${siteUrl}/feed.xml`,
  },
  author: {
    name: 'Gangsta Agents',
    link: siteUrl,
  },
})

const files = readdirSync(contentDir)
  .filter((f) => f.endsWith('.md') && f !== '.navigation.yml')
  .sort()
  .reverse()

let latestDate = new Date(0)

for (const file of files) {
  const raw = readFileSync(join(contentDir, file), 'utf-8')
  const { data } = matter(raw)
  const date = data.date ? new Date(data.date) : new Date()
  if (date > latestDate) latestDate = date
  const slug = file.replace(/\.md$/, '')
  feed.addItem({
    title: data.title || slug,
    id: `${siteUrl}/blog/${slug}`,
    link: `${siteUrl}/blog/${slug}`,
    description: data.description || '',
    date,
  })
}

feed.options.updated = latestDate

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'feed.xml'), feed.rss2(), 'utf-8')
console.log(`Generated feed.xml with ${files.length} posts`)