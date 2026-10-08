import { Reveal } from './anim/Reveal'

/**
 * Every chapter opens on the same instrument line — plate number, a rule,
 * the chapter name, and an optional reading on the far right.
 *   <ChapterMark n="03" title="Selected work" meta="7 specimens" />
 */
export default function ChapterMark({ n, title, meta, className = '', center = false }) {
  return (
    <Reveal
      y={14}
      className={`flex items-center gap-4 ${center ? 'justify-center' : ''} ${className}`}
    >
      <span className="label text-teal">{n}</span>
      <span className="h-px w-10 bg-bone/25" />
      <span className="label text-bone/70">{title}</span>
      {meta && !center && (
        <>
          <span className="hidden h-px flex-1 bg-gradient-to-r from-bone/15 to-transparent sm:block" />
          <span className="label hidden text-bone/30 sm:block">{meta}</span>
        </>
      )}
    </Reveal>
  )
}
