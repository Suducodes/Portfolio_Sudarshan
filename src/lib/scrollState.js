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
  heartReveal: 0, // 0 hidden → 1 fully present
  heartY: 0, // slide offset: below on enter, above on exit
}
