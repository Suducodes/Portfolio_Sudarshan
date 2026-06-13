// Resolve a /public asset against Vite's base URL so it works both at root
// and under a GitHub Pages subpath (e.g. /repo/).
export const asset = (p) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`
