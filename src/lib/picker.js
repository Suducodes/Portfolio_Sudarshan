// The WebGL canvas is pointer-events:none behind the DOM, so the DOM asks it:
// picker.pick(ndcX, ndcY) → the id of the glass plate under that point, or null.
// GlassPanels registers the implementation while it's mounted.
export const picker = { pick: null }
