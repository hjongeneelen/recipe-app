import { useMemo, useState } from 'react'
import { recipes, getAllTags } from '../lib/recipes'
import RecipeCard from '../components/RecipeCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import TagFilter from '../components/TagFilter.jsx'
import DarkModeToggle from '../components/DarkModeToggle.jsx'

export default function Home() {
  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState([])
  const allTags = useMemo(getAllTags, [])

  const toggleTag = (tag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return recipes.filter((recipe) => {
      const matchesTags = activeTags.every((tag) => recipe.tags.includes(tag))
      if (!matchesTags) return false
      if (!q) return true

      const haystack = [
        recipe.title,
        recipe.description,
        ...recipe.ingredients,
        ...recipe.steps,
        ...recipe.tags,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(q)
    })
  }, [query, activeTags])

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 pb-16 pt-6">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-terracotta-600 dark:text-terracotta-300">
            Kitchen Notebook
          </h1>
          <p className="text-sm text-charcoal-400 dark:text-charcoal-200">
            {recipes.length} recipe{recipes.length === 1 ? '' : 's'} ready to cook
          </p>
        </div>
        <DarkModeToggle />
      </header>

      <div className="mb-4">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <div className="mb-6">
        <TagFilter tags={allTags} activeTags={activeTags} onToggle={toggleTag} />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-charcoal-300 dark:text-charcoal-400">
            No recipes match your search. Try a different term or tag.
          </p>
        )}
      </div>
    </div>
  )
}
