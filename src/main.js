import './style.css'
import {
  heroScene, problemScene, loopScene, orchestrationScene, mulchScene,
  qualityScene, metaScene, footerScene,
  castCardConductor, castCardWorker, castCardMulch, benefitScene,
} from './cast.js'

/* ============================================================================
   MOUNT THE CAST
   Each scene is hand-authored inline SVG (see cast.js). We inject it into its
   placeholder by id; missing nodes are simply skipped, so the page degrades
   gracefully if markup changes.
   ========================================================================== */
const scenes = {
  'scene-hero': heroScene,
  'scene-problem': problemScene,
  'scene-loop': loopScene,
  'scene-orchestration': orchestrationScene,
  'scene-mulch': mulchScene,
  'scene-quality': qualityScene,
  'scene-meta': metaScene,
  'scene-footer': footerScene,
  'scene-cast-conductor': castCardConductor,
  'scene-cast-worker': castCardWorker,
  'scene-cast-mulch': castCardMulch,
  'benefit-focus': () => benefitScene('focus'),
  'benefit-parallel': () => benefitScene('parallel'),
  'benefit-compound': () => benefitScene('compound'),
  'benefit-repeat': () => benefitScene('repeat'),
}

for (const [id, build] of Object.entries(scenes)) {
  const el = document.getElementById(id)
  if (el) el.innerHTML = build()
}

/* ============================================================================
   SCROLL-REVEAL  +  SCENE BEATS
   One IntersectionObserver toggles `.is-in` on:
     • .reveal elements  → fade-up (with optional --reveal-delay stagger)
     • .scene  elements  → fires the one-shot fx-* signature animations
   prefers-reduced-motion is honored entirely in CSS, so the JS stays identical
   either way (it just adds a class; CSS decides what that class does).
   ========================================================================== */
const animated = document.querySelectorAll('.reveal, .scene')

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        // Reveal is a one-shot; scene beats also play once. Stop observing.
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
  )
  animated.forEach((el) => io.observe(el))
} else {
  // No IO support → just show everything.
  animated.forEach((el) => el.classList.add('is-in'))
}

/* ============================================================================
   SCROLL-PROGRESS BATON
   Drives the rainbow bar at the top of the page. Uses a rAF latch so we touch
   the DOM at most once per frame regardless of scroll-event frequency.
   ========================================================================== */
const bar = document.getElementById('progress-bar')
if (bar) {
  let ticking = false
  const update = () => {
    const doc = document.documentElement
    const max = doc.scrollHeight - doc.clientHeight
    const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0
    bar.style.setProperty('--scroll', `${pct.toFixed(2)}%`)
    ticking = false
  }
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(update)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  update()
}
