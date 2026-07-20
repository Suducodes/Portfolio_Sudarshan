import { useMemo, useState } from 'react'

/**
 * Capabilities as a synapse map. Skills are neurons; the edges are the paths
 * they actually fire along in Sudu's real projects — Python→PyTorch→CPS→SSL4MIS
 * for the coronary work, trimesh→Three.js→MediaPipe for Bio-Vision, and so on.
 * Hovering a node fires its synapses and dims the rest of the net.
 *
 * SVG edges + HTML chips, positioned in a 0–100 space. No <canvas> anywhere —
 * a canvas layered over the WebGL background is what tanked the Works section.
 */
const GROUPS = {
  wet: { label: 'Wet-lab', color: '#C1121F' },
  lang: { label: 'Languages', color: '#00E5C4' },
  ml: { label: 'ML / DL', color: '#8b7bd8' },
  img: { label: 'Medical Imaging', color: '#6ec6ff' },
  app: { label: 'Frontend / App', color: '#E8A33D' },
  elec: { label: 'Electronics', color: '#7ee787' },
}

// x / y are percentages of the plot box
const NODES = [
  // wet-lab — its own island, bridged to hardware through the wound-patch work
  { id: 'biomat', label: 'Biomaterials', g: 'wet', x: 9, y: 19 },
  { id: 'hydro', label: 'Hydrogels', g: 'wet', x: 22, y: 12 },
  { id: 'nano', label: 'Green nanosynthesis', g: 'wet', x: 8, y: 31 },
  { id: 'micro', label: 'Microbiology', g: 'wet', x: 23, y: 26 },
  { id: 'agar', label: 'Agar-diffusion assays', g: 'wet', x: 14, y: 40 },

  // languages — Python is the trunk of the whole computational side
  { id: 'py', label: 'Python', g: 'lang', x: 35, y: 52 },
  { id: 'matlab', label: 'MATLAB', g: 'lang', x: 46, y: 45 },
  { id: 'c', label: 'C', g: 'lang', x: 31, y: 64 },
  { id: 'java', label: 'Java', g: 'lang', x: 24, y: 50 },
  { id: 'ts', label: 'TypeScript', g: 'lang', x: 20, y: 60 },
  { id: 'js', label: 'JavaScript', g: 'lang', x: 17, y: 70 },

  // ml / dl — the coronary segmentation chain
  { id: 'torch', label: 'PyTorch', g: 'ml', x: 52, y: 30 },
  { id: 'cuda', label: 'CUDA (Blackwell)', g: 'ml', x: 64, y: 21 },
  { id: 'ssup', label: 'Semi-supervised', g: 'ml', x: 47, y: 16 },
  { id: 'cps', label: 'CPS', g: 'ml', x: 61, y: 35 },
  { id: 'ssl', label: 'SSL4MIS', g: 'ml', x: 71, y: 28 },

  // medical imaging
  { id: 'sitk', label: 'SimpleITK', g: 'img', x: 79, y: 44 },
  { id: 'dicom', label: 'DICOM', g: 'img', x: 89, y: 37 },
  { id: 'nifti', label: 'NIfTI', g: 'img', x: 91, y: 51 },
  { id: 'vtk', label: 'VTK', g: 'img', x: 76, y: 56 },
  { id: 'skimage', label: 'scikit-image', g: 'img', x: 86, y: 62 },
  { id: 'trimesh', label: 'trimesh', g: 'img', x: 69, y: 47 },
  { id: 'cornerstone', label: 'Cornerstone.js', g: 'img', x: 87, y: 74 },

  // frontend / app
  { id: 'three', label: 'Three.js', g: 'app', x: 62, y: 63 },
  { id: 'react', label: 'React', g: 'app', x: 55, y: 73 },
  { id: 'next', label: 'Next.js', g: 'app', x: 66, y: 80 },
  { id: 'vite', label: 'Vite', g: 'app', x: 47, y: 81 },
  { id: 'electron', label: 'Electron', g: 'app', x: 40, y: 74 },
  { id: 'mediapipe', label: 'MediaPipe', g: 'app', x: 55, y: 90 },
  { id: 'flask', label: 'Flask', g: 'app', x: 37, y: 88 },

  // electronics
  { id: 'arduino', label: 'Arduino', g: 'elec', x: 18, y: 81 },
  { id: 'rp2040', label: 'RP2040', g: 'elec', x: 9, y: 89 },
  { id: 'sensor', label: 'Sensor interfacing', g: 'elec', x: 24, y: 93 },
  { id: 'proto', label: 'Device prototyping', g: 'elec', x: 8, y: 73 },
]

const EDGES = [
  // wet-lab chain
  ['biomat', 'hydro'], ['biomat', 'nano'], ['nano', 'micro'], ['micro', 'agar'], ['hydro', 'micro'],
  // the wound-patch bridge: wet chemistry becomes a real device
  ['biomat', 'proto'],
  // python trunk
  ['py', 'torch'], ['py', 'sitk'], ['py', 'trimesh'], ['py', 'flask'], ['py', 'skimage'], ['py', 'matlab'],
  // coronary segmentation chain
  ['torch', 'cuda'], ['torch', 'ssup'], ['ssup', 'cps'], ['cps', 'ssl'], ['torch', 'ssl'],
  // imaging
  ['sitk', 'dicom'], ['sitk', 'nifti'], ['dicom', 'nifti'], ['dicom', 'cornerstone'],
  ['vtk', 'trimesh'], ['vtk', 'skimage'], ['sitk', 'vtk'],
  // MedMesh: DICOM volumes become meshes on the web
  ['trimesh', 'three'],
  // Bio-Vision: gestures drive a 3D viewer in a desktop shell
  ['mediapipe', 'three'], ['mediapipe', 'electron'], ['electron', 'cornerstone'],
  // web stack
  ['three', 'react'], ['react', 'next'], ['react', 'vite'], ['react', 'electron'],
  ['ts', 'react'], ['ts', 'next'], ['js', 'ts'], ['js', 'three'],
  // firmware
  ['c', 'arduino'], ['c', 'rp2040'], ['arduino', 'sensor'], ['rp2040', 'sensor'],
  ['sensor', 'proto'], ['arduino', 'proto'], ['c', 'java'],
]

export default function SynapseMap() {
  const [active, setActive] = useState(null)

  const pos = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), [])
  const neighbours = useMemo(() => {
    const m = {}
    for (const [a, b] of EDGES) {
      ;(m[a] ||= new Set()).add(b)
      ;(m[b] ||= new Set()).add(a)
    }
    return m
  }, [])

  const isLit = (id) => !active || id === active || neighbours[active]?.has(id)

  return (
    <div
      className="relative aspect-[16/10] w-full select-none"
      onMouseLeave={() => setActive(null)}
    >
      {/* faint domain labels sitting behind the net */}
      {[
        { g: 'wet', x: 15, y: 5 },
        { g: 'ml', x: 59, y: 8 },
        { g: 'img', x: 85, y: 29 },
        { g: 'lang', x: 30, y: 40 },
        { g: 'app', x: 52, y: 57 },
        { g: 'elec', x: 15, y: 66 },
      ].map(({ g, x, y }) => (
        <span
          key={g}
          className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap font-body text-[10px] uppercase tracking-[0.34em] transition-opacity duration-500"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            color: GROUPS[g].color,
            opacity: active ? 0.16 : 0.42,
          }}
        >
          {GROUPS[g].label}
        </span>
      ))}

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {EDGES.map(([a, b], i) => {
          const A = pos[a]
          const B = pos[b]
          if (!A || !B) return null
          const lit = active && (a === active || b === active)
          return (
            <line
              key={i}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              vectorEffect="non-scaling-stroke"
              className={lit ? 'animate-dashflow' : undefined}
              stroke={lit ? GROUPS[pos[active].g].color : '#F0EDE6'}
              strokeOpacity={lit ? 0.85 : active ? 0.045 : 0.13}
              strokeWidth={lit ? 1.5 : 0.9}
              strokeDasharray={lit ? '3 5' : undefined}
              strokeLinecap="round"
            />
          )
        })}
      </svg>

      {NODES.map((n) => {
        const c = GROUPS[n.g].color
        const lit = isLit(n.id)
        const isActive = active === n.id
        return (
          <button
            key={n.id}
            onMouseEnter={() => setActive(n.id)}
            onFocus={() => setActive(n.id)}
            data-cursor="hover"
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2.5 py-1 font-body text-[11px] tracking-wide transition-all duration-300"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              opacity: lit ? 1 : 0.2,
              color: isActive ? '#070A0D' : lit ? '#F0EDE6' : 'rgba(240,237,230,0.6)',
              background: isActive ? c : lit && active ? `${c}1f` : 'rgba(255,255,255,0.045)',
              borderColor: isActive ? c : lit && active ? `${c}66` : 'rgba(255,255,255,0.12)',
              boxShadow: isActive ? `0 0 22px ${c}88` : 'none',
              transform: `translate(-50%,-50%) scale(${isActive ? 1.14 : 1})`,
            }}
          >
            {n.label}
          </button>
        )
      })}
    </div>
  )
}
