# Kitchen Notebook

A 100% static, free-to-host recipe app. Built with Vite + React + Tailwind CSS.
Recipes are plain Markdown files with frontmatter — no backend, no database, no build-time API calls.

## Adding a recipe

Drop a new `.md` file into [`_recipes/`](_recipes/) using this shape:

```md
---
title: My Recipe
prepTime: 30 min
portions: 4
tags: [tag-one, tag-two]
description: One sentence shown on the recipe card.
---

## Ingredients

- 500 g ingredient
- 1/2 cup another ingredient

## Preparation

1. First step.
2. Second step.
```

- `tags` power the home page filter chips.
- Numbers in the `## Ingredients` list (whole numbers, fractions like `1/2`, and
  mixed numbers like `1 1/2`) are auto-detected and scaled by the portion counter
  on the recipe page.
- `aubergine`, `mushroom(s)`/`champignon(s)`, `ricotta`, `feta`, and `olive(s)`
  are automatically flagged with a highlight — edit the list in
  [`src/lib/safetyFlags.js`](src/lib/safetyFlags.js) to match what you personally avoid.
- Recipes are discovered automatically at build time via `import.meta.glob` — no
  registry file to keep in sync.

## Local development

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

1. In [`vite.config.js`](vite.config.js), set `REPO_NAME` to match your repository
   name, e.g. `'/kitchen-notebook/'` (or `'/'` if this is a `<user>.github.io` repo).
2. Push this project to a GitHub repository on the `main` branch.
3. In the repo's **Settings → Pages**, set the source to **GitHub Actions**.
4. Push to `main` — [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
   builds the site and publishes it automatically. No paid services, no server.

The app uses a hash-based router (`/#/recipe/...`), so it works correctly on
GitHub Pages without any extra 404-redirect configuration.
