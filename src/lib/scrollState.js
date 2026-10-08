// Mutable, render-loop-friendly scroll state shared between Lenis (writer)
// and the WebGL scene (reader). Avoids React re-renders on every scroll tick.
export const scrollState = {
  progress: 0, // 0..1 down the page
  velocity: 0,
  mouseX: 0.5,
  mouseY: 0.5,
  worksActive: false, // inside the Works descent section
  worksProgress: 0, // 0..1 through the Works descent
  worksRot: 0, // panel-ring rotation in degrees — the heart matches it (pinned)
  heartReveal: 0, // 0 hidden → 1 fully present (premise through works)
  heartY: 0, // slide offset: below on enter, above on exit
  premiseP: 0, // 0..1 through the pinned premise scene
  heartMode: 0, // 0 = planet (premise) → 1 = dive (works descent)
  hoverPanel: null, // id of the glass plate under the pointer
  // flight log (research chapter)
  flightReveal: 0,
  flightP: 0,
  flightTop: 1, // the chapter's top edge, in viewport heights
  // the signal (contact) portal
  portalReveal: 0,
}
