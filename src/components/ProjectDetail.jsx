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
const pad = (n) => String(n).padStart(2, '0')
// internal links (the TENCON page) live under this site's base path
const resolve = (href) => (/^https?:/.test(href) ? href : asset(href))

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
          <div className="absolute inset-0 bg-void/88 backdrop-blur-2xl" onClick={onClose} />

          <motion.article
            key={project.id}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative z-10 grid max-h-full w-full max-w-6xl grid-cols-1 items-center gap-8 overflow-y-auto md:grid-cols-[1.1fr_1fr] md:gap-14"
            data-lenis-prevent
          >
            <motion.figure
              variants={item}
              className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px]"
              style={{ border: `1px solid ${project.color}40`, boxShadow: `0 40px 120px -50px ${project.color}55` }}
            >
              {project.image ? (
                <img src={asset(project.image)} alt={project.title} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-void-2">
                  <ProjectMotif motif="ecg" color={project.color} className="absolute inset-0 h-full w-full" />
                </div>
              )}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: `linear-gradient(115deg, rgba(255,255,255,0.12), transparent 40%)` }}
              />
            </motion.figure>

            <div className="flex flex-col">
              <motion.div variants={item} className="flex items-center gap-4">
                <span className="label" style={{ color: project.color }}>
                  {pad(index + 1)} / {pad(total)}
                </span>
                <span className="h-px flex-1" style={{ background: `${project.color}40` }} />
                <span className="label-sm text-bone/45">
                  {project.year} · {project.status}
                </span>
              </motion.div>

              <motion.h2 variants={item} className="display mt-5 text-[clamp(1.7rem,4vw,3.2rem)] font-[620] text-bone">
                {project.title}
              </motion.h2>
              <motion.p variants={item} className="mt-3 font-body text-base text-bone/60">
                {project.subtitle}
              </motion.p>

              {project.kicker && (
                <motion.p
                  variants={item}
                  className="label-sm mt-4 inline-flex w-fit rounded-full px-3 py-1.5"
                  style={{ background: `${project.color}18`, color: project.color }}
                >
                  ★ {project.kicker}
                </motion.p>
              )}

              <motion.p variants={item} className="mt-6 max-w-xl font-body text-[15px] leading-relaxed text-bone/80">
                {project.detail}
              </motion.p>
              {project.credit && (
                <motion.p variants={item} className="label-sm mt-4 text-bone/40">
                  {project.credit}
                </motion.p>
              )}

              <motion.div variants={item} className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span key={s} className="rounded-md border border-bone/10 px-2.5 py-1 font-mono text-[10px] tracking-wide text-bone/65">
                    {s}
                  </span>
                ))}
              </motion.div>

              {(project.href || project.repo) && (
                <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
                  {project.href && (
                    <a
                      href={resolve(project.href)}
                      target="_blank"
                      rel="noreferrer"
                      className="label rounded-full bg-teal px-5 py-3 text-[10px] text-void transition-shadow hover:shadow-[0_0_40px_-8px_rgba(0,229,196,0.8)]"
                    >
                      Open live ↗
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="label rounded-full border border-bone/20 px-5 py-3 text-[10px] text-bone/80 transition-colors hover:border-teal/50 hover:text-teal"
                    >
                      Source ↗
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          </motion.article>

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full text-bone/60 transition-colors hover:bg-bone/10 hover:text-teal"
          >
            ✕
          </button>

          <div className="label-sm absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-6">
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
