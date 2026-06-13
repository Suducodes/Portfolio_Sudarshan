import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectMotif from './fx/ProjectMotif'
import { asset } from '../lib/asset'

const ease = [0.16, 1, 0.3, 1]
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
}

export default function ProjectDetail({ project, index, total, onClose, onNav }) {
  useEffect(() => {
    if (!project) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [project, onClose, onNav])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          data-modal-open
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          className="fixed inset-0 z-[95] flex items-center justify-center p-5 sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* blurred takeover backdrop */}
          <div
            className="absolute inset-0 bg-void/85 backdrop-blur-2xl"
            onClick={onClose}
          />

          <motion.article
            key={project.id}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative z-10 grid max-h-full w-full max-w-6xl grid-cols-1 items-center gap-8 overflow-y-auto md:grid-cols-2 md:gap-14"
          >
            {/* visual */}
            <motion.figure
              variants={item}
              className="relative aspect-[4/3] w-full overflow-hidden border p-3"
              style={{ borderColor: `${project.color}40` }}
            >
              <div className="relative h-full w-full overflow-hidden bg-void">
                <ProjectMotif motif={project.motif} color={project.color} className="absolute inset-0 h-full w-full" />
                <img
                  src={asset(project.image)}
                  alt={project.title}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: `radial-gradient(130% 100% at 50% 120%, ${project.color}22, transparent 55%)` }}
                />
              </div>
            </motion.figure>

            {/* info */}
            <div className="flex flex-col">
              <motion.div variants={item} className="flex items-center gap-4">
                <span className="font-body text-sm tracking-[0.3em]" style={{ color: project.color }}>
                  [{project.index}]
                </span>
                <span className="h-px flex-1" style={{ background: `${project.color}40` }} />
                <span className="font-body text-[11px] uppercase tracking-[0.25em] text-bone/40">
                  {project.date}
                </span>
              </motion.div>

              <motion.h2
                variants={item}
                className="mt-5 font-serif text-[clamp(2.2rem,5vw,4rem)] font-500 uppercase leading-[0.95] tracking-tight text-bone"
              >
                {project.title}
              </motion.h2>
              <motion.p variants={item} className="mt-2 font-body text-base text-bone/55">
                {project.subtitle}
              </motion.p>

              {project.featured && (
                <motion.p
                  variants={item}
                  className="mt-4 inline-flex w-fit rounded-full px-3 py-1 font-body text-[11px] uppercase tracking-[0.15em]"
                  style={{ background: `${project.color}14`, color: project.color }}
                >
                  ★ {project.featured}
                </motion.p>
              )}

              <motion.p variants={item} className="mt-6 max-w-xl font-body text-[15px] leading-relaxed text-bone/80">
                {project.detail}
              </motion.p>

              <motion.div variants={item} className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span key={s} className="rounded-md bg-bone/5 px-2.5 py-1 font-body text-[11px] tracking-wide text-bone/65">
                    {s}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.article>

          {/* close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full text-bone/60 transition-colors hover:bg-bone/10 hover:text-teal"
          >
            ✕
          </button>

          {/* prev / next */}
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-6 font-body text-[11px] uppercase tracking-[0.25em]">
            <button onClick={() => onNav(-1)} className="text-bone/55 transition-colors hover:text-teal">
              ← Prev
            </button>
            <span className="text-bone/30">
              {index + 1} / {total}
            </span>
            <button onClick={() => onNav(1)} className="text-bone/55 transition-colors hover:text-teal">
              Next →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
