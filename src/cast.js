/* ============================================================================
   THE CAST  —  hand-authored, inline animated SVG.

   The whole site shares ONE small troupe of characters so it reads as a single
   coherent world (per the research illustration brief):

     • Conductor  → Solo / the orchestrator   (purple, baton, never touches code)
     • Worker     → a Claude Code sub-agent    (coral, carries ONE ticket, powers down)
     • Mulch Bin  → Mulch                       (green compost bin that sprouts as it learns)
     • Ticket     → a to-do handed to a worker  (the shared visual currency)
     • Leaf-note  → a recorded learning         (dropped into the bin)

   Characters are pure functions returning SVG markup, composed into per-section
   scenes below. Define once, reuse everywhere = visual coherence + maintainability.
   Motion is layered on via CSS classes (see style.css): idle loops (anim-*) keep
   the troupe alive; signature beats (fx-*) fire once when a scene scrolls in.
   ========================================================================== */

// --- palette (mirrors the @theme tokens; kept local so the cast is portable) --
const C = {
  base: '#1a1726',
  surface: '#272138',
  line: '#3b3357',
  stroke: '#120f1c', // bold near-black "sticker" outline used on every character
  purple: '#7c5cfc',
  purpleLt: '#a48bff',
  coral: '#ff6b6b',
  amber: '#ffc93c',
  green: '#3dd68c',
  greenDk: '#27a96b',
  cyan: '#34d1f0',
  ink: '#f5f3ff',
  muted: '#a99fc4',
}

// --- tiny line-icons drawn (not emoji) so they match the hand-drawn cast ------
function glyph(name, color = C.stroke) {
  const s = `stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"`
  switch (name) {
    case 'research': // magnifier
      return `<circle cx="7" cy="7" r="5" ${s}/><line x1="11" y1="11" x2="15" y2="15" ${s}/>`
    case 'plan': // flag on a pole
      return `<line x1="3" y1="1" x2="3" y2="16" ${s}/><path d="M3 2 H13 L10 5 L13 8 H3" ${s}/>`
    case 'implement': // hammer
      return `<path d="M2 14 L9 7" ${s}/><path d="M7 3 L13 9 L11 11 L5 5 Z" ${s} fill="${color}" fill-opacity="0.25"/>`
    case 'qa': // checkmark
      return `<path d="M2 9 L6 13 L15 3" ${s}/>`
    default:
      return ''
  }
}

// --- a leaf shape, reused for the bin sprout and recorded "leaf-notes" --------
function leafPath(fill) {
  return `<path d="M0 0 C -11 -5 -11 -19 0 -24 C 11 -19 11 -5 0 0 Z"
            fill="${fill}" stroke="${C.stroke}" stroke-width="2.2"/>
          <path d="M0 -2 L0 -20" stroke="${C.stroke}" stroke-width="1.4" opacity="0.5"/>`
}

/* ---------------------------------------------------------------------------
   TICKET — a small to-do card. Local box ≈ 36×27, origin top-left.
   --------------------------------------------------------------------------- */
export function ticket({ color = C.amber, icon = '', cls = '', extra = '' } = {}) {
  return `
  <g class="${cls}" ${extra}>
    <rect x="0" y="0" width="36" height="27" rx="5" fill="${color}" stroke="${C.stroke}" stroke-width="2.5"/>
    <path d="M27 0 L36 9 L27 9 Z" fill="#000" opacity="0.18"/>
    ${icon
      ? `<g transform="translate(6,5)">${glyph(icon)}</g>`
      : `<rect x="6" y="7" width="15" height="3" rx="1.5" fill="${C.stroke}" opacity="0.55"/>
         <rect x="6" y="14" width="22" height="3" rx="1.5" fill="${C.stroke}" opacity="0.4"/>`}
  </g>`
}

/* ---------------------------------------------------------------------------
   WORKER — a Claude Code sub-agent. Local box ≈ 74×96, feet ≈ y95.
   Pass a ticket color/icon to have it carry its single task.
   --------------------------------------------------------------------------- */
export function worker({
  body = C.coral, accent = C.amber, eye = C.cyan,
  ticketColor = null, ticketIcon = '', working = false,
  cls = '', extra = '',
} = {}) {
  const sparks = working ? `
    <g aria-hidden="true">
      <circle class="anim-spark"   cx="4"  cy="40" r="3"   fill="${C.amber}"/>
      <circle class="anim-spark-2" cx="70" cy="48" r="2.6" fill="${C.cyan}"/>
      <circle class="anim-spark-3" cx="63" cy="28" r="2.2" fill="${C.green}"/>
    </g>` : ''
  const held = ticketColor ? `
    <g transform="translate(19,60)">${ticket({ color: ticketColor, icon: ticketIcon })}</g>` : ''
  return `
  <g class="${cls}" ${extra}>
    <ellipse cx="37" cy="95" rx="23" ry="4" fill="#000" opacity="0.30"/>
    <!-- legs -->
    <rect x="22" y="74" width="9" height="15" rx="4" fill="${body}" stroke="${C.stroke}" stroke-width="2.5"/>
    <rect x="43" y="74" width="9" height="15" rx="4" fill="${body}" stroke="${C.stroke}" stroke-width="2.5"/>
    <!-- arms -->
    <rect x="1"  y="42" width="9" height="22" rx="4.5" fill="${body}" stroke="${C.stroke}" stroke-width="2.5"/>
    <rect x="64" y="42" width="9" height="22" rx="4.5" fill="${body}" stroke="${C.stroke}" stroke-width="2.5"/>
    <!-- body -->
    <rect x="9" y="32" width="56" height="48" rx="17" fill="${body}" stroke="${C.stroke}" stroke-width="3"/>
    <rect x="16" y="39" width="42" height="12" rx="6" fill="#fff" opacity="0.16"/>
    <rect x="22" y="55" width="30" height="18" rx="6" fill="${C.base}" opacity="0.55"/>
    <rect x="26" y="61" width="${working ? 18 : 9}" height="4" rx="2" fill="${accent}"/>
    <!-- head -->
    <line x1="37" y1="5" x2="37" y2="-4" stroke="${C.stroke}" stroke-width="2.5"/>
    <circle cx="37" cy="-6" r="3.6" fill="${accent}" stroke="${C.stroke}" stroke-width="2"/>
    <rect x="13" y="4" width="48" height="30" rx="12" fill="${C.base}" stroke="${body}" stroke-width="3"/>
    <circle cx="29" cy="19" r="3.7" fill="${eye}"/>
    <circle cx="45" cy="19" r="3.7" fill="${eye}"/>
    <path d="M30 27 q7 4 14 0" stroke="${eye}" stroke-width="2" stroke-linecap="round" opacity="0.65" fill="none"/>
    ${sparks}
    ${held}
  </g>`
}

/* ---------------------------------------------------------------------------
   CONDUCTOR — Solo / the orchestrator. Local box ≈ 100×150 (incl. podium).
   Calm horizontal "eyes", a baton it keeps time with, a clipboard, and an
   optional Zzz idle-timer cloud (it sleeps on a timer — never busy-loops).
   --------------------------------------------------------------------------- */
export function conductor({ cls = '', extra = '', zzz = false, baton = true } = {}) {
  const zzzCloud = zzz ? `
    <g aria-hidden="true" fill="${C.purpleLt}" font-family="JetBrains Mono, monospace" font-weight="700">
      <text class="anim-zzz"   x="70" y="34" font-size="11">z</text>
      <text class="anim-zzz-2" x="77" y="25" font-size="13">z</text>
      <text class="anim-zzz-3" x="85" y="15" font-size="16">z</text>
    </g>` : ''
  return `
  <g class="${cls}" ${extra}>
    <ellipse cx="48" cy="140" rx="34" ry="5" fill="#000" opacity="0.32"/>
    <!-- podium -->
    <rect x="22" y="120" width="52" height="22" rx="5" fill="${C.surface ?? '#272138'}" stroke="${C.stroke}" stroke-width="2.5"/>
    <rect x="22" y="120" width="52" height="7" rx="3" fill="${C.purple}"/>
    <text x="48" y="136" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="${C.purpleLt}" font-weight="700">solo</text>
    <!-- robe / body -->
    <path d="M28 122 C28 84 34 62 48 62 C62 62 68 84 68 122 Z" fill="${C.purple}" stroke="${C.stroke}" stroke-width="3"/>
    <path d="M40 70 C44 66 52 66 56 70" stroke="${C.purpleLt}" stroke-width="2.5" fill="none" opacity="0.8"/>
    <circle cx="48" cy="86"  r="2.4" fill="${C.purpleLt}"/>
    <circle cx="48" cy="98"  r="2.4" fill="${C.purpleLt}"/>
    <circle cx="48" cy="110" r="2.4" fill="${C.purpleLt}"/>
    <!-- left arm + clipboard -->
    <line x1="34" y1="74" x2="22" y2="92" stroke="${C.purple}" stroke-width="7" stroke-linecap="round"/>
    <g transform="rotate(-10 22 96)">
      <rect x="13" y="84" width="20" height="26" rx="3" fill="#f5f3ff" stroke="${C.stroke}" stroke-width="2.2"/>
      <rect x="18" y="82" width="10" height="5" rx="2" fill="${C.amber}" stroke="${C.stroke}" stroke-width="1.6"/>
      <rect x="16" y="92" width="14" height="2.4" rx="1.2" fill="${C.stroke}" opacity="0.5"/>
      <rect x="16" y="98" width="14" height="2.4" rx="1.2" fill="${C.stroke}" opacity="0.4"/>
      <rect x="16" y="104" width="9" height="2.4" rx="1.2" fill="${C.stroke}" opacity="0.4"/>
    </g>
    <!-- head + conductor cap -->
    <rect x="33" y="32" width="30" height="28" rx="11" fill="${C.base}" stroke="${C.purpleLt}" stroke-width="3"/>
    <path d="M31 36 Q48 20 65 36 Z" fill="${C.purple}" stroke="${C.stroke}" stroke-width="2.5"/>
    <circle cx="48" cy="30" r="3" fill="${C.amber}" stroke="${C.stroke}" stroke-width="1.6"/>
    <line x1="41" y1="46" x2="46" y2="46" stroke="${C.cyan}" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="46" x2="55" y2="46" stroke="${C.cyan}" stroke-width="3" stroke-linecap="round"/>
    <!-- right arm + baton (keeps time) -->
    ${baton ? `
    <g class="anim-baton">
      <line x1="62" y1="74" x2="80" y2="62" stroke="${C.purple}" stroke-width="7" stroke-linecap="round"/>
      <line x1="80" y1="62" x2="98" y2="46" stroke="#f5f3ff" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="98" cy="46" r="3.4" fill="${C.amber}"/>
    </g>` : `
    <line x1="62" y1="74" x2="74" y2="92" stroke="${C.purple}" stroke-width="7" stroke-linecap="round"/>`}
    ${zzzCloud}
  </g>`
}

/* ---------------------------------------------------------------------------
   MULCH BIN — Mulch. Local box ≈ 96×108. A friendly compost crate that sprouts
   more leaves as expertise compounds. Lid bounces on deposit (fx-lid); the
   tallest sprout can grow a notch (fx-sprout).
   --------------------------------------------------------------------------- */
export function mulchBin({ cls = '', extra = '', sprouts = 3, lidFx = false, sproutFx = false } = {}) {
  const sproutSet = []
  // three leaves of increasing height = "expertise compounding"
  const layout = [
    { x: 38, y: 46, s: 0.8, sway: 'anim-sway' },
    { x: 58, y: 44, s: 0.85, sway: 'anim-sway-2' },
    { x: 48, y: 40, s: 1.05, sway: 'anim-sway', fx: sproutFx }, // tallest = the "grow" one
  ].slice(0, Math.max(1, sprouts))
  for (const l of layout) {
    sproutSet.push(`
      <g transform="translate(${l.x},${l.y})">
        <line x1="0" y1="6" x2="0" y2="-${22 * l.s}" stroke="${C.greenDk}" stroke-width="3" stroke-linecap="round"/>
        <g class="${l.sway} ${l.fx ? 'fx-sprout' : ''}" transform="translate(0,-${22 * l.s}) scale(${l.s})">
          ${leafPath(C.green)}
        </g>
      </g>`)
  }
  return `
  <g class="${cls}" ${extra}>
    <ellipse cx="48" cy="104" rx="30" ry="5" fill="#000" opacity="0.32"/>
    ${sproutSet.join('')}
    <!-- crate body (wider at top) -->
    <path d="M18 56 L78 56 L72 102 L24 102 Z" fill="${C.green}" stroke="${C.stroke}" stroke-width="3"/>
    <path d="M18 56 L78 56 L76 64 L20 64 Z" fill="#fff" opacity="0.14"/>
    <line x1="33" y1="58" x2="31" y2="100" stroke="${C.greenDk}" stroke-width="2" opacity="0.7"/>
    <line x1="48" y1="58" x2="48" y2="100" stroke="${C.greenDk}" stroke-width="2" opacity="0.7"/>
    <line x1="63" y1="58" x2="65" y2="100" stroke="${C.greenDk}" stroke-width="2" opacity="0.7"/>
    <!-- front tag -->
    <rect x="37" y="78" width="22" height="15" rx="3" fill="${C.base}" opacity="0.85"/>
    <text x="48" y="89" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="${C.green}" font-weight="700">ml</text>
    <!-- lid (bounces on deposit) -->
    <g class="${lidFx ? 'fx-lid' : ''}">
      <rect x="13" y="46" width="70" height="13" rx="5" fill="${C.greenDk}" stroke="${C.stroke}" stroke-width="3"/>
      <rect x="40" y="42" width="16" height="6" rx="3" fill="${C.greenDk}" stroke="${C.stroke}" stroke-width="2"/>
    </g>
  </g>`
}

/* ---------------------------------------------------------------------------
   PRIME CARD — a glowing expertise card pulled OUT of the bin before work.
   LEAF NOTE  — a learning dropped IN after work.
   --------------------------------------------------------------------------- */
export function primeCard({ cls = '', extra = '' } = {}) {
  return `
  <g class="${cls}" ${extra}>
    <ellipse class="anim-glow" cx="17" cy="20" rx="26" ry="26" fill="${C.cyan}" opacity="0.25"/>
    <rect x="0" y="0" width="34" height="40" rx="5" fill="${C.base}" stroke="${C.cyan}" stroke-width="2.6"/>
    <rect x="6" y="7"  width="22" height="3" rx="1.5" fill="${C.cyan}"/>
    <rect x="6" y="15" width="16" height="3" rx="1.5" fill="${C.ink}" opacity="0.6"/>
    <rect x="6" y="23" width="20" height="3" rx="1.5" fill="${C.ink}" opacity="0.45"/>
    <rect x="6" y="31" width="12" height="3" rx="1.5" fill="${C.ink}" opacity="0.45"/>
  </g>`
}
export function leafNote({ cls = '', extra = '' } = {}) {
  return `<g class="${cls}" ${extra}>${leafPath(C.green)}</g>`
}

/* ============================================================================
   SCENES  —  one per section. Each returns a full <svg> (decorative => aria-hidden).
   The wrapping element gets class "scene"; IntersectionObserver adds .is-in to
   fire the one-shot fx-* beats.
   ========================================================================== */
function svg(viewBox, inner, cls = '') {
  return `<svg viewBox="${viewBox}" class="${cls}" fill="none" preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" focusable="false">${inner}</svg>`
}

// 0 — HERO: the whole troupe on one stage.
export function heroScene() {
  return svg('0 0 420 240', `
    <g class="anim-float">
      <ellipse cx="210" cy="222" rx="170" ry="14" fill="#000" opacity="0.25"/>
      <g transform="translate(150,72) scale(1.05)">${conductor({ cls: 'anim-bob', baton: true })}</g>
      <g transform="translate(40,120) scale(0.82)">${worker({ cls: 'anim-bob-2', ticketColor: C.amber, ticketIcon: 'research' })}</g>
      <g transform="translate(300,116) scale(0.86)">${worker({ body: C.coral, cls: 'anim-bob-3', ticketColor: C.cyan, ticketIcon: 'qa' })}</g>
      <g transform="translate(338,128) scale(0.92)">${mulchBin({ cls: 'anim-bob' })}</g>
    </g>`, 'w-full h-auto')
}

// 1 — PROBLEM: one overloaded, glitching robot + a wilting plant.
export function problemScene() {
  // a big single worker drowning in papers, screen flickering
  const papers = []
  for (let i = 0; i < 7; i++) {
    const rot = -20 + i * 7
    papers.push(`<g class="anim-wobble${i % 2 ? '-2' : ''}" transform="translate(${60 + i * 18},${70 + (i % 3) * 6}) rotate(${rot})">
      <rect x="0" y="0" width="30" height="22" rx="3" fill="#efeaff" stroke="${C.stroke}" stroke-width="2"/>
      <rect x="4" y="5" width="20" height="2.4" rx="1" fill="${C.stroke}" opacity="0.5"/>
      <rect x="4" y="11" width="22" height="2.4" rx="1" fill="${C.stroke}" opacity="0.35"/>
    </g>`)
  }
  return svg('0 0 360 240', `
    <ellipse cx="170" cy="222" rx="120" ry="12" fill="#000" opacity="0.25"/>
    <!-- oversized overloaded worker -->
    <g transform="translate(110,40) scale(1.7)">
      <rect x="22" y="74" width="9" height="15" rx="4" fill="${C.coral}" stroke="${C.stroke}" stroke-width="2.5"/>
      <rect x="43" y="74" width="9" height="15" rx="4" fill="${C.coral}" stroke="${C.stroke}" stroke-width="2.5"/>
      <rect x="9" y="32" width="56" height="48" rx="17" fill="${C.coral}" stroke="${C.stroke}" stroke-width="3"/>
      <rect x="22" y="55" width="30" height="18" rx="6" fill="${C.base}" opacity="0.55"/>
      <rect x="13" y="4" width="48" height="30" rx="12" fill="${C.base}" stroke="${C.coral}" stroke-width="3"/>
      <!-- frazzled eyes -->
      <line x1="25" y1="15" x2="33" y2="23" stroke="${C.coral}" stroke-width="2.6" stroke-linecap="round"/>
      <line x1="33" y1="15" x2="25" y2="23" stroke="${C.coral}" stroke-width="2.6" stroke-linecap="round"/>
      <line x1="41" y1="15" x2="49" y2="23" stroke="${C.coral}" stroke-width="2.6" stroke-linecap="round"/>
      <line x1="49" y1="15" x2="41" y2="23" stroke="${C.coral}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M30 30 q7 -4 14 0" stroke="${C.coral}" stroke-width="2" stroke-linecap="round" fill="none"/>
      <!-- glitch flicker over the screen -->
      <g class="anim-glitch">
        <rect x="13" y="8" width="48" height="5" fill="${C.cyan}" opacity="0.8"/>
        <rect x="13" y="20" width="48" height="4" fill="${C.coral}" opacity="0.8"/>
      </g>
    </g>
    <!-- avalanche of papers (stale context) -->
    ${papers.join('')}
    <!-- wilting plant -->
    <g transform="translate(300,150)">
      <path d="M6 60 L26 60 L22 92 L10 92 Z" fill="${C.greenDk}" stroke="${C.stroke}" stroke-width="2.5"/>
      <g class="anim-wilt" transform="translate(16,60)">
        <line x1="0" y1="0" x2="0" y2="-26" stroke="${C.greenDk}" stroke-width="3"/>
        <g transform="translate(0,-26) rotate(40) scale(0.7)">${leafPath('#8aa58f')}</g>
        <g transform="translate(0,-14) rotate(-50) scale(0.6)">${leafPath('#8aa58f')}</g>
      </g>
    </g>`, 'w-full h-auto')
}

// 3 — WORKFLOW LOOP: four workers light up in sequence, baton relays across.
//
// Two layouts share one cast: a single ROW (≥480px) with the travelling relay
// baton, and a 2×2 GRID (<480px, see .loop-narrow in style.css) so each worker
// stays large and legible on phones. CSS shows exactly one at a time. In the 2×2
// layout the travelling track is dropped (it can't cross grid cells cleanly) but
// the phases still light up in sequence via the same fx-seq beats.
export function loopScene() {
  const phases = [
    { icon: 'research', color: C.amber,  label: 'research' },
    { icon: 'plan',     color: C.purpleLt, label: 'plan' },
    { icon: 'implement', color: C.coral,  label: 'implement' },
    { icon: 'qa',       color: C.cyan,    label: 'QA' },
  ]
  // NOTE: positioning lives on the OUTER <g> (transform attribute). The light-up
  // keyframe animates `transform`, which would clobber a positioning transform on
  // the same element — so the animated class goes on an INNER <g>.
  // The relay track + labels are vertically separated (track y=138, label baseline
  // y=120) so the travelling amber marker never sits behind the "plan" label text.
  const cols = phases.map((p, i) => `
    <g transform="translate(${20 + i * 96},20)">
      <g class="fx-seq fx-seq-${i + 1}">
        <g transform="scale(0.78)">${worker({ ticketColor: p.color, ticketIcon: p.icon, cls: i % 2 ? 'anim-bob-2' : 'anim-bob' })}</g>
        <text x="29" y="100" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="${C.muted}">${p.label}</text>
      </g>
    </g>`).join('')
  const row = svg('0 0 408 156', `
    <!-- relay track (sits below the phase labels so the marker never overlaps them) -->
    <line x1="40" y1="138" x2="368" y2="138" stroke="${C.line ?? '#3b3357'}" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>
    <g class="fx-relay" style="--relay-dist:328px">
      <circle cx="40" cy="138" r="6" fill="${C.amber}"/>
      <circle cx="40" cy="138" r="11" fill="${C.amber}" opacity="0.3"/>
    </g>
    ${cols}`, 'w-full h-auto')

  // 2×2 grid: one larger worker per cell, same sequential light-up, no relay track.
  const cells = phases.map((p, i) => `
    <div class="loop-cell">${svg('0 0 96 128', `
      <g class="fx-seq fx-seq-${i + 1}">
        <g transform="translate(11,14)">${worker({ ticketColor: p.color, ticketIcon: p.icon, cls: i % 2 ? 'anim-bob-2' : 'anim-bob' })}</g>
        <text x="48" y="122" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" fill="${C.muted}">${p.label}</text>
      </g>`, 'w-full h-auto')}</div>`).join('')

  return `<div class="loop-wide">${row}</div><div class="loop-narrow">${cells}</div>`
}

// 4 — ORCHESTRATION: conductor sleeps on an idle timer; a worker spawns, takes a
//     ticket (hand-off), works, hands back a ✅, then powers down (never recycled).
export function orchestrationScene() {
  return svg('0 0 380 220', `
    <ellipse cx="190" cy="200" rx="150" ry="12" fill="#000" opacity="0.22"/>
    <g transform="translate(30,46) scale(1.0)">${conductor({ zzz: true, baton: false })}</g>
    <!-- the ticket flying from clipboard to the worker -->
    <g class="fx-handoff" transform="translate(150,96)">${ticket({ color: C.amber, icon: 'implement' })}</g>
    <!-- spawned worker (pops in), works, then powers down -->
    <g class="fx-spawn" transform="translate(232,84)">
      <g class="fx-powerdown">
        <g transform="scale(1.0)">${worker({ working: true, cls: 'anim-bob' })}</g>
        <!-- the checkmark ticket it hands back -->
        <g class="fx-stamp" transform="translate(56,12)">${ticket({ color: C.green, icon: 'qa' })}</g>
      </g>
    </g>`, 'w-full h-auto')
}

// 5 — MULCH: worker pulls a primed card OUT (prime/search), drops a leaf IN
//     (record); the bin's sprout grows one notch.
export function mulchScene() {
  return svg('0 0 380 208', `
    <ellipse cx="190" cy="194" rx="150" ry="12" fill="#000" opacity="0.22"/>
    <g transform="translate(222,88) scale(1.05)">${mulchBin({ lidFx: true, sproutFx: true })}</g>
    <g transform="translate(62,90)">${worker({ working: true, cls: 'anim-bob' })}</g>
    <!-- prime: glowing card pulled out (between worker and bin) before work -->
    <g class="fx-prime" transform="translate(150,108)">${primeCard({})}</g>
    <text x="150" y="100" font-family="JetBrains Mono, monospace" font-size="12" fill="${C.cyan}" aria-hidden="true">ml prime</text>
    <!-- record: a leaf dropped into the bin after work -->
    <g class="fx-record" transform="translate(252,66)">${leafNote({})}</g>
    <text x="230" y="52" font-family="JetBrains Mono, monospace" font-size="12" fill="${C.green}" aria-hidden="true">ml record</text>
  `, 'w-full h-auto')
}

// 7 — QUALITY: a distinct QA worker (magnifier + checklist, never a code ticket)
//     inspects another worker's output and stamps it; the fix is recorded.
export function qualityScene() {
  return svg('0 0 380 220', `
    <ellipse cx="190" cy="200" rx="150" ry="12" fill="#000" opacity="0.22"/>
    <!-- the reviewed work: a small panel with a magnified "root cause" -->
    <g transform="translate(150,70)">
      <rect x="0" y="0" width="86" height="92" rx="10" fill="${C.surface ?? '#272138'}" stroke="${C.line ?? '#3b3357'}" stroke-width="2.5"/>
      <rect x="12" y="14" width="50" height="4" rx="2" fill="${C.muted ?? '#a99fc4'}" opacity="0.7"/>
      <rect x="12" y="26" width="62" height="4" rx="2" fill="${C.muted ?? '#a99fc4'}" opacity="0.5"/>
      <rect x="12" y="38" width="40" height="4" rx="2" fill="${C.coral}" opacity="0.9"/>
      <rect x="12" y="50" width="58" height="4" rx="2" fill="${C.muted ?? '#a99fc4'}" opacity="0.5"/>
      <!-- magnifier zooming the root cause -->
      <g class="anim-bob">
        <circle cx="48" cy="40" r="16" fill="${C.cyan}" opacity="0.12" stroke="${C.cyan}" stroke-width="2.5"/>
        <line x1="60" y1="52" x2="74" y2="66" stroke="${C.cyan}" stroke-width="4" stroke-linecap="round"/>
      </g>
      <!-- QA stamp thumps down -->
      <g class="fx-stamp" transform="translate(58,70)">
        <circle cx="0" cy="0" r="16" fill="${C.green}" opacity="0.18" stroke="${C.green}" stroke-width="2.5"/>
        <path d="M-8 0 L-2 7 L9 -7" stroke="${C.green}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </g>
    </g>
    <!-- the QA worker: cyan eyes, holds a magnifier + checklist, no code ticket -->
    <g transform="translate(252,84)">
      <g transform="scale(0.92)">${worker({ body: C.cyan, accent: C.green, eye: C.base, cls: 'anim-bob-2' })}</g>
      <g transform="translate(-6,40)">
        <rect x="0" y="0" width="18" height="24" rx="3" fill="#f5f3ff" stroke="${C.stroke}" stroke-width="2"/>
        <path d="M3 6 l3 3 l5 -6" stroke="${C.green}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M3 15 l3 3 l5 -6" stroke="${C.green}" stroke-width="2" fill="none" stroke-linecap="round"/>
      </g>
    </g>`, 'w-full h-auto')
}

// 8 — META: the troupe assembles a miniature of THIS very page on an easel.
export function metaScene() {
  return svg('0 0 380 230', `
    <ellipse cx="190" cy="212" rx="150" ry="12" fill="#000" opacity="0.22"/>
    <!-- easel legs -->
    <line x1="150" y1="60" x2="120" y2="206" stroke="${C.line ?? '#3b3357'}" stroke-width="5" stroke-linecap="round"/>
    <line x1="230" y1="60" x2="260" y2="206" stroke="${C.line ?? '#3b3357'}" stroke-width="5" stroke-linecap="round"/>
    <line x1="135" y1="150" x2="245" y2="150" stroke="${C.line ?? '#3b3357'}" stroke-width="5" stroke-linecap="round"/>
    <!-- the canvas: a tiny wireframe of this page, blocks snapping in -->
    <rect x="120" y="40" width="140" height="120" rx="8" fill="${C.base}" stroke="${C.purple}" stroke-width="3"/>
    <g class="fx-seq fx-seq-1"><rect x="132" y="52" width="116" height="16" rx="4" fill="${C.purple}" opacity="0.85"/></g>
    <g class="fx-seq fx-seq-2"><rect x="132" y="74" width="74" height="9" rx="3" fill="${C.coral}"/></g>
    <g class="fx-seq fx-seq-3"><rect x="132" y="88" width="116" height="26" rx="4" fill="${C.surface ?? '#272138'}" stroke="${C.line ?? '#3b3357'}" stroke-width="1.5"/></g>
    <g class="fx-seq fx-seq-4"><rect x="132" y="120" width="50" height="14" rx="7" fill="${C.green}"/><rect x="190" y="120" width="58" height="14" rx="4" fill="${C.amber}"/></g>
    <!-- conductor directing, worker placing a block, bin nearby -->
    <g transform="translate(8,84) scale(0.74)">${conductor({ cls: 'anim-bob', baton: true })}</g>
    <g transform="translate(268,128) scale(0.66)">${worker({ working: true, cls: 'anim-bob-2', ticketColor: C.amber })}</g>
    <g transform="translate(300,150) scale(0.66)">${mulchBin({})}</g>
  `, 'w-full h-auto')
}

// 9 — FOOTER: the troupe waves goodbye; the bin is now a thriving potted plant.
export function footerScene() {
  return svg('0 0 360 170', `
    <ellipse cx="180" cy="156" rx="140" ry="10" fill="#000" opacity="0.22"/>
    <g transform="translate(120,18) scale(0.92)">${conductor({ cls: 'anim-bob', baton: true })}</g>
    <!-- waving worker (arm up) -->
    <g transform="translate(36,60) scale(0.8)">
      <g class="anim-bob-2">${worker({})}</g>
      <g class="anim-wave" style="transform-origin:64px 50px"><rect x="64" y="22" width="9" height="24" rx="4.5" fill="${C.coral}" stroke="${C.stroke}" stroke-width="2.5"/></g>
    </g>
    <g transform="translate(250,64) scale(0.8)">${worker({ body: C.cyan, accent: C.green, eye: C.base, cls: 'anim-bob-3' })}</g>
    <!-- bin grown into a healthy potted plant -->
    <g transform="translate(298,40) scale(0.9)">${mulchBin({ sprouts: 3 })}</g>
  `, 'w-full h-auto')
}

/* --- small standalone characters for the Cast cards (section 2) -------------
   Height-bounded (h-40, width auto) so they sit neatly inside a narrow card. */
export function castCardConductor() {
  return svg('0 0 120 168', `<g transform="translate(10,6)">${conductor({ cls: 'anim-bob', baton: true })}</g>`, 'mx-auto h-40 w-auto')
}
export function castCardWorker() {
  return svg('0 0 90 110', `<g transform="translate(8,12)">${worker({ working: true, cls: 'anim-bob', ticketColor: C.amber, ticketIcon: 'implement' })}</g>`, 'mx-auto h-40 w-auto')
}
export function castCardMulch() {
  return svg('0 0 110 116', `<g transform="translate(8,6)">${mulchBin({ cls: 'anim-bob' })}</g>`, 'mx-auto h-40 w-auto')
}

/* --- benefit vignettes (section 6) ----------------------------------------- */
export function benefitScene(name) {
  switch (name) {
    case 'focus': // a worker in a tight spotlight = small, on-point context
      return svg('0 0 130 120', `
        <path d="M65 0 L102 110 L28 110 Z" fill="${C.amber}" opacity="0.14"/>
        <ellipse cx="65" cy="112" rx="40" ry="6" fill="${C.amber}" opacity="0.2"/>
        <g transform="translate(28,22) scale(0.78)">${worker({ working: true, cls: 'anim-bob', ticketColor: C.amber, ticketIcon: 'implement' })}</g>`, 'mx-auto h-24 w-auto')
    case 'parallel': // two workers side by side
      return svg('0 0 150 120', `
        <g transform="translate(8,18) scale(0.74)">${worker({ cls: 'anim-bob', ticketColor: C.coral, ticketIcon: 'research' })}</g>
        <g transform="translate(78,18) scale(0.74)">${worker({ cls: 'anim-bob-2', ticketColor: C.cyan, ticketIcon: 'implement' })}</g>`, 'mx-auto h-24 w-auto')
    case 'compound': // bin with a tall, thriving sprout
      return svg('0 0 120 130', `<g transform="translate(12,18) scale(0.95)">${mulchBin({ cls: 'anim-bob', sprouts: 3 })}</g>`, 'mx-auto h-24 w-auto')
    case 'repeat': // the conductor + a looping arrow
      return svg('0 0 130 130', `
        <g transform="translate(36,2) scale(0.62)">${conductor({ cls: 'anim-bob', baton: true })}</g>
        <g class="anim-breathe">
          <path d="M30 96 A38 30 0 1 1 100 96" fill="none" stroke="${C.purpleLt}" stroke-width="4" stroke-linecap="round"/>
          <path d="M100 96 l-2 -12 l12 6 Z" fill="${C.purpleLt}"/>
        </g>`, 'mx-auto h-24 w-auto')
    default:
      return ''
  }
}
