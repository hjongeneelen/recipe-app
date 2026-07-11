import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change this to match your GitHub repository name, e.g. '/recipe-app/'.
// If deploying to a user/org page (username.github.io), set this to '/'.
const REPO_NAME = '/recipe-app/'

export default defineConfig({
  plugins: [react()],
  base: REPO_NAME,
})
