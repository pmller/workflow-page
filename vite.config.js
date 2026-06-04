import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

// Why these settings:
// - base: './'  -> all asset URLs are relative, so the built site works no
//   matter what path/host it's served from (Laravel Herd, file://, a sub-path).
// - build.outDir: 'public' -> Laravel Herd serves a site's `public/` directory,
//   so `npm run build` drops a ready-to-serve site straight into the web root
//   for pres-solo.test. See README.md for the Herd details.
// - publicDir: false -> Vite's own "copy static assets" dir defaults to `public`,
//   which would collide with our outDir. We hand-author no static assets (all
//   SVG is inline), so we simply turn it off.
export default defineConfig({
  base: './',
  plugins: [tailwindcss(), cloudflare()],
  publicDir: false,
  build: {
    outDir: 'public',
    emptyOutDir: true,
  },
})