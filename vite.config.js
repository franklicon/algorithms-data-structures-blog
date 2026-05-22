import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
// IMPORTANT: 'base' must match your GitHub Pages repo name.
// If the repo is "algorithms-data-structures-blog", the deployed URL will be
// https://<username>.github.io/algorithms-data-structures-blog/
export default defineConfig({
    plugins: [react()],
    base: '/algorithms-data-structures-blog/',
});
