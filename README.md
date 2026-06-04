# pres-solo

A single-scroll explainer site for the **Solo · Claude Code · Mulch** multi-agent
coding workflow. Bold-and-playful, character-driven, dev-peer audience.

> **The theme, in one line:** Solo coordinates · Claude Code executes · Mulch remembers.
> This site was built _with_ the workflow it describes (researched → planned →
> implemented → QA'd by fresh Solo-orchestrated Claude Code agents).

Built with **Vite + Tailwind CSS v4**, vanilla JS, and **hand-authored inline
animated SVG** — no external image assets, no framework runtime.

---

## Quick start

```bash
npm install        # install dependencies (Vite + Tailwind)
npm run dev        # local dev server with HMR  →  http://localhost:5173
npm run build      # production build           →  outputs to ./public
npm run preview    # serve the built ./public    →  http://localhost:4173
```

## Viewing at `pres-solo.test` (Laravel Herd)

This project lives under `~/Herd/pres-solo`, so Herd serves it at
**http://pres-solo.test**.

The Vite build is configured (see `vite.config.js`) to:

- **`base: './'`** — all asset URLs are relative, so the site works from any host
  or sub-path.
- **`build.outDir: 'public'`** — the production build is written into `public/`,
  which is the directory Laravel Herd serves as a site's web root.

So the workflow is simply:

```bash
npm run build
# then open http://pres-solo.test
```

After every content/code change, re-run `npm run build` to refresh what Herd
serves. (Herd serves the **static built files** in `public/` — it does not run
the Vite dev server. For live-reloading while editing, use `npm run dev` and the
`localhost:5173` URL instead.)

> **If `pres-solo.test` shows a directory listing or 404:** confirm in Herd that
> this site's web root points at the `public/` subdirectory (Herd's default for a
> site that has a `public/` folder). The canonical, always-correct local preview
> is `npm run build && npm run preview`.

---

## Project structure

```
index.html          The 10-section single-scroll page (semantic landmarks + copy)
src/
  main.js           Mounts SVG scenes, wires IntersectionObserver reveals + scroll progress
  cast.js           The reusable SVG cast (Conductor / Worker / Mulch Bin / Ticket)
                    and the per-section scene builders. Define once, reuse everywhere.
  style.css         Tailwind import, @theme design tokens, and all motion keyframes
vite.config.js      base './', builds to public/ (Herd web root)
public/             Build output (git-ignored)
```

## The cast (defined once in `cast.js`, reused for coherence)

| Character     | Represents          | Look                                              |
| ------------- | ------------------- | ------------------------------------------------- |
| **Conductor** | Solo / orchestrator | Purple, on a `solo` podium, baton, clipboard      |
| **Worker**    | a Claude Code agent | Coral robot carrying ONE task ticket, powers down |
| **Mulch Bin** | Mulch               | Green compost crate that sprouts as it learns     |
| **Ticket**    | a to-do / learning  | Color-coded card — the shared visual currency     |

## Motion & accessibility

- **Scroll-driven reveals** via `IntersectionObserver` (fade-up + stagger).
- **Idle "alive" loops** (bob/breathe/baton-tap) so the troupe feels populated.
- **Signature micro-interactions** fire once per scene on scroll-in: worker
  spawn-pop, ticket hand-off, Mulch lid-bounce + sprout-grow, QA stamp, relay baton.
- All motion is **transform/opacity only** (GPU-cheap); no animation library.
- **`prefers-reduced-motion: reduce`** is honored — all loops/scrub/spring are
  dropped and only a simple fade remains; every scene still settles to a
  fully-visible end state.
- Semantic landmarks (`header`/`main`/`footer`/`section`), real heading hierarchy,
  a skip link, visible focus rings, and `aria-hidden` on all decorative SVG.

## Accuracy notes (verified against the real project)

- Mulch tiers are **foundational / tactical / observational**.
- Mulch is **CLI-only — there is no Mulch MCP server** (Solo is the MCP; Mulch is a
  bash CLI; Claude Code is the agent runtime).
- Commands referenced are real (`ml prime`, `ml search`, `ml record`, `ml rank`,
  …); `ml search` uses BM25, `ml rank` uses a confirmation-frequency score, storage
  is append-only JSONL per domain. Source: <https://github.com/jayminwest/mulch>.

## Tool links used on the page

- Solo → <https://soloterm.com/>
- Claude Code → <https://claude.com/claude-code>
- Mulch → <https://github.com/jayminwest/mulch>

---

_Not committed to git intentionally; `.gitignore` excludes `node_modules/` and the
built `public/` output._
