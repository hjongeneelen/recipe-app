import { parseFrontmatter } from './frontmatter'

// Vite statically analyzes this glob at build time and inlines every
// matching file as raw text — this is what makes the whole app buildable
// as a static site with zero server-side code.
const files = import.meta.glob('/_recipes/*.md', { query: '?raw', import: 'default', eager: true })

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Splits the markdown body into named sections keyed by "## Heading" text,
// and extracts list items (checkbox-friendly) from each section.
function parseSections(content) {
  const lines = content.split(/\r?\n/)
  const sections = {}
  let current = null

  for (const line of lines) {
    const heading = line.match(/^##\s+(.*)$/)
    if (heading) {
      current = heading[1].trim().toLowerCase()
      sections[current] = []
      continue
    }
    if (!current) continue

    const item = line.match(/^\s*(?:[-*]|\d+[.)])\s+(.*)$/)
    if (item && item[1].trim()) {
      sections[current].push(item[1].trim())
    }
  }

  return sections
}

function findSection(sections, candidates) {
  for (const name of candidates) {
    if (sections[name]) return sections[name]
  }
  return []
}

function loadRecipes() {
  return Object.entries(files).map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    const sections = parseSections(content)

    const ingredients = findSection(sections, ['ingredients', 'ingrediënten'])
    const steps = findSection(sections, [
      'preparation',
      'instructions',
      'method',
      'steps',
      'bereiding',
    ])

    const filename = path.split('/').pop().replace(/\.md$/, '')
    const title = data.title || filename
    const slug = data.slug ? slugify(String(data.slug)) : slugify(title)

    return {
      slug,
      title,
      prepTime: data.prepTime || data.prep_time || '',
      portions: Number(data.portions || data.servings || 4),
      tags: Array.isArray(data.tags) ? data.tags : [],
      description: data.description || '',
      ingredients,
      steps,
      content,
    }
  })
}

export const recipes = loadRecipes()

export function getRecipeBySlug(slug) {
  return recipes.find((r) => r.slug === slug)
}

export function getAllTags() {
  const tags = new Set()
  recipes.forEach((r) => r.tags.forEach((t) => tags.add(t)))
  return Array.from(tags).sort()
}
