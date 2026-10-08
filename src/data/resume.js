export const profile =
  'Final-year Biomedical Engineering student at KPRIET, Coimbatore — building low-cost, on-device clinical tools: touchless surgical visualisation, semi-supervised coronary segmentation, webcam-based screening. Published at IEEE EMBC 2026 (Toronto) and IEEE TENCON 2026 (Bali). President of BMESI, Technical Lead of IEEE EMBS, intern at UnivLabs Technologies.'

// Home base for the flight log — KPRIET, Arasur, Coimbatore.
export const home = { code: 'CBE', city: 'Coimbatore', lat: 11.08, lng: 77.14 }

/**
 * Papers, each a stamp in the passport. `lat/lng` place it on the globe;
 * `ink` is the stamp colour.
 */
export const publications = [
  {
    id: 'embc',
    venue: 'IEEE EMBC 2026',
    full: 'Engineering in Medicine & Biology Conference',
    city: 'Toronto',
    country: 'Canada',
    code: 'YYZ',
    lat: 43.65,
    lng: -79.38,
    when: 'JUL 2026',
    title: 'Zero-Footprint Virtual Dissection: Democratizing Anatomy Education via Web-Based Monocular Gesture Recognition',
    note: 'Paper #4706 · Health Equity track',
    ink: '#E2364B',
    project: 'bio-vision',
  },
  {
    id: 'tencon',
    venue: 'IEEE TENCON 2026',
    full: 'IEEE Region 10 Conference',
    city: 'Bali',
    country: 'Indonesia',
    code: 'DPS',
    lat: -8.65,
    lng: 115.22,
    when: '2026',
    title: 'Bio-Vision Surgical: A Browser-Native, Gesture-Interactive Pipeline for Patient-Specific Coronary Visualization on Consumer Hardware',
    note: 'Poster P-A05 · with Dhakshatha M K',
    ink: '#4C86FF',
    project: 'bio-vision-surgical',
  },
  {
    id: 'bhi',
    venue: 'IEEE BHI 2026',
    full: 'Biomedical & Health Informatics',
    when: '2026',
    title: 'Geometry-Aware Risk Estimation from Semi-Supervised Coronary Segmentation',
    note: 'with Dhakshatha M K',
    ink: '#A57BFF',
    project: 'coronary',
  },
  {
    id: 'icirimst',
    venue: '7th ICIRIMST',
    full: 'International conference',
    when: '2024',
    title: 'Sono-Ink: Novel Ultrasound-Responsive Polymer Ink for Biomedical Casting & Repair',
    note: 'Lead author',
    ink: '#3FBF73',
  },
  {
    id: 'greengala',
    venue: 'Green Gala 2024',
    full: 'PSG College of Technology',
    when: '2024',
    title: 'Carbon Capture via Cyanobacteria',
    note: 'Poster · Innovation Award',
    ink: '#C9A46A',
  },
]

// The wet bench — research that never needed a GPU.
export const benchwork = [
  {
    title: 'Sono-Ink',
    line: 'An ultrasound-curable polymer bio-ink for casting and bone repair.',
    year: '2024',
  },
  {
    title: 'Banana-peel & aloe wound patch',
    line: 'A bio-active dressing — extraction, formulation, pH and conductivity, optical microscopy, in-vitro.',
    year: '2024',
  },
  {
    title: 'Green copper nanoparticles',
    line: 'Cu nanoparticles reduced with banana-peel extract; antibacterial efficacy by agar diffusion.',
    year: '2024',
  },
]

/** The offices I hold — what people trust me with. */
export const roles = [
  {
    role: 'President',
    org: 'BMESI · KPRIET',
    since: 'Jul 2026 —',
    line: "Leading the department's Biomedical Engineering Society — and building its platform, journal pipeline and events from zero.",
  },
  {
    role: 'Technical Lead',
    org: 'IEEE EMBS · KPRIET SBC',
    since: '2025 —',
    line: 'Projects and workshops — and the research that became two IEEE papers.',
  },
  {
    role: 'Intern',
    org: 'UnivLabs Technologies',
    since: 'Feb 2026 —',
    line: 'Surgical modules team — operating-room software for a collaborative surgical platform.',
  },
  {
    role: 'Coordinator',
    org: "IGNUZ'26 · National symposium",
    since: 'Oct 2026',
    line: 'Six events over two days at our department — and the website that sold the passes.',
  },
]

export const skillGroups = [
  { label: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'C', 'MATLAB', 'Java'] },
  { label: 'ML / DL', items: ['PyTorch', 'CUDA (Blackwell)', 'Semi-supervised', 'CPS', 'SSL4MIS'] },
  { label: 'Medical Imaging', items: ['SimpleITK', 'VTK', 'scikit-image', 'DICOM', 'NIfTI', 'Cornerstone.js', 'trimesh'] },
  { label: 'Frontend / App', items: ['Electron', 'React', 'Next.js', 'Vite', 'Three.js', 'MediaPipe', 'Flask'] },
  { label: 'Wet-lab', items: ['Biomaterials', 'Hydrogels', 'Green nanosynthesis', 'Microbiology', 'Agar-diffusion assays'] },
  { label: 'Electronics', items: ['Arduino', 'RP2040', 'Sensor interfacing', 'Device prototyping'] },
]

/**
 * Honours as a service-ribbon rack. `ribbon` is the stripe order (left→right),
 * `device` is the metal pinned on the bar, `tier` drives its finish.
 */
export const awards = [
  {
    title: 'Gold Best Cadet of Tamil Nadu',
    detail: 'NCC Air Wing · Senior Division',
    year: '2025',
    tier: 'gold',
    device: '★',
    ribbon: ['#0a3457', '#1a6ea8', '#E8C063', '#1a6ea8', '#0a3457'],
  },
  {
    title: '4th Place, All India Best Cadet',
    detail: 'Republic Day Camp, New Delhi · Senior Division',
    year: '2025',
    tier: 'silver',
    device: '4',
    ribbon: ['#7a3f14', '#C8621F', '#EDE7DA', '#2E7D4F', '#14361f'],
  },
  {
    title: 'Academic Topper — Rank 3',
    detail: 'B.E. Biomedical Engineering batch, KPRIET · CGPA 8.5',
    year: '2025',
    tier: 'silver',
    device: '3',
    ribbon: ['#0a3b38', '#00E5C4', '#F0EDE6', '#00E5C4', '#0a3b38'],
  },
  {
    title: "NCC 'C' Certificate — A Grade",
    detail: 'Highest national NCC certification',
    year: '2024',
    tier: 'bronze',
    device: 'A',
    ribbon: ['#B3222B', '#123E7C', '#4FA3D9', '#123E7C', '#B3222B'],
  },
  {
    title: 'Green Gala Innovation Award',
    detail: 'PSG College of Technology · Carbon capture via cyanobacteria',
    year: '2024',
    tier: 'bronze',
    device: '✦',
    ribbon: ['#14361f', '#3FA85F', '#E8C063', '#3FA85F', '#14361f'],
  },
  {
    title: 'IEEE EMBS Travel Grant',
    detail: 'EMBC 2026 · Paper #4706 — applicant',
    year: '2026',
    tier: 'bronze',
    device: '✈',
    ribbon: ['#0b2e4f', '#1B6FB3', '#EDE7DA', '#1B6FB3', '#0b2e4f'],
  },
]
