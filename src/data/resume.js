export const profile =
  'Third-year Biomedical Engineering student building open-source, low-cost clinical tools for resource-constrained healthcare — from gesture-controlled surgical DICOM viewers to semi-supervised deep learning for coronary artery segmentation. Dual focus: translational wet-lab biomaterials and full-stack medical software.'

export const research = [
  {
    tag: 'Computational',
    title: 'Coronary Artery Segmentation',
    sub: 'Semi-supervised deep learning · with Dr. Haseeb Hassan',
    year: '2025 — Present',
    points: [
      'Trained the Cross-Pseudo-Supervision (CPS) framework on ImageCAS (1,000 cases, 10% labeled).',
      'Mean Dice 0.5725 · HD95 48.73 mm on 20 validation cases — ~30 h on an RTX 5060 (CUDA 12.8, Blackwell sm_120).',
      'Patched PyTorch 2.7 / sm_120 compatibility, SSL4MIS EMA, and the preprocessing pipeline; generating NIfTI predictions for a co-authored paper.',
    ],
  },
  {
    tag: 'Wet-lab',
    title: 'Sono-Ink — Ultrasound-Curable Bio-Ink',
    sub: 'Lead researcher · ICIRIMST 2024 publication',
    year: '2024',
    points: [
      'Formulated a novel ultrasound-responsive polymer bio-ink for biomedical casting and bone repair.',
      'Published abstract at the 7th ICIRIMST; presented at Green Gala, PSG College of Technology.',
    ],
  },
  {
    tag: 'Wet-lab',
    title: 'Banana-Peel & Aloe Wound Patch',
    sub: 'Independent research · KPRIET Biomedical Lab',
    year: '2024',
    points: [
      'Developed a bio-active wound dressing from banana-peel extract + aloe vera gel.',
      'Full wet-lab workflow: extraction, formulation, pH/conductivity characterisation, optical microscopy; studied inflammation & proliferation in-vitro.',
    ],
  },
  {
    tag: 'Wet-lab',
    title: 'Green-Synthesised Copper Nanoparticles',
    sub: 'Independent research · KPRIET Biomedical Lab',
    year: '2024',
    points: [
      'Synthesised eco-friendly Cu nanoparticles using banana-peel extract as a green reducing agent — low-cost, scalable, no hazardous reagents.',
      'Evaluated antibacterial efficacy via agar-diffusion assays; characterised morphology & stability.',
    ],
  },
]

export const publications = [
  {
    n: '01',
    cite: 'S. Vasanthakumar et al., “Zero-Footprint Virtual Dissection: Touchless DICOM Navigation via Hand Gesture Recognition.”',
    venue: 'IEEE EMBC 2026 · Paper #4706 · Health Equity Track — Accepted',
  },
  {
    n: '02',
    cite: 'S. Vasanthakumar, “Sono-Ink: Novel Ultrasound-Responsive Polymer Ink for Biomedical Casting & Repair.”',
    venue: '7th ICIRIMST, 2024',
  },
  {
    n: '03',
    cite: 'Poster — “Carbon Capture via Cyanobacteria.”',
    venue: 'Green Gala, PSG College of Technology, 2024 — Innovation Award',
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

export const awards = [
  'Academic Topper — 3rd in B.E. Biomedical Engineering batch, KPRIET',
  'Gold Best Cadet of Tamil Nadu — NCC Air Wing, Senior Division',
  '4th Place, All India Best Cadet Competition (Senior Division)',
  'IEEE EMBS Travel Grant Applicant 2026 — EMBC Paper #4706',
  'Green Gala Innovation Award — PSG College of Technology, 2024',
  "NCC 'C' Certificate (A Grade) — highest national NCC certification",
]
