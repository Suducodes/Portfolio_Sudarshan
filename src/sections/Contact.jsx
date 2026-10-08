import { useState } from 'react'
import { RevealLines, Reveal } from '../components/anim/Reveal'
import OrbitRings from '../components/OrbitRings'
import ChapterMark from '../components/ChapterMark'
import { contact } from '../data/contact'
import { Magnetic } from '../hooks/useMagnetic'
import { sfx } from '../lib/sfx'

const SOCIAL = [
  {
    href: contact.linkedin,
    label: 'LinkedIn',
    d: 'M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM9 9h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06C20.4 8.58 22 10.66 22 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21V21H9z',
  },
  {
    href: contact.github,
    label: 'GitHub',
    d: 'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.36 9.36 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z',
  },
]

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
    } catch {
      /* clipboard blocked — the mailto link below still works */
    }
    sfx.confirm()
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section
      id="contact"
      className="relative flex min-h-[110svh] w-full flex-col items-center justify-center overflow-hidden px-6 py-32 text-center"
    >
      {/* the portal — the instrument at full scale, the invitation at its core */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[150vw] -translate-x-1/2 -translate-y-1/2 sm:w-[min(112vh,96vw)]">
        <OrbitRings className="h-full w-full" rings={[0.3, 0.46, 0.64, 0.82]} label="THE SIGNAL · OPEN CHANNEL" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(224,48,58,0.14), rgba(0,229,196,0.05) 55%, transparent)' }}
      />

      <ChapterMark n="10" title="The signal" center className="relative mb-10" />

      <RevealLines
        as="h2"
        blur
        className="display relative text-[clamp(1.55rem,6.4vw,2.4rem)] font-[600] leading-[1.05] text-bone sm:text-[clamp(2rem,4.6vw,4.6rem)]"
        lines={[
          <>If you’re building</>,
          <>
            something that <span className="text-teal">matters</span>
          </>,
          <span key="t" className="text-bone/55">
            — let’s talk.
          </span>,
        ]}
      />

      <Reveal delay={0.2} className="relative mt-14 flex flex-col items-center gap-7">
        <Magnetic strength={0.4}>
          <button
            onClick={copyEmail}
            onMouseEnter={() => sfx.tick()}
            data-cursor="hover"
            className="group flex items-center gap-3 rounded-full bg-teal px-7 py-4 text-void transition-all duration-300 hover:shadow-[0_0_50px_-8px_rgba(0,229,196,0.8)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-void/40 animate-pulse-dot" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-void" />
            </span>
            <span className="font-mono text-[11px] tracking-[0.04em] sm:text-[13px]">
              {copied ? 'Copied to clipboard' : contact.email}
            </span>
          </button>
        </Magnetic>

        <div className="flex items-center gap-3">
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              data-cursor="hover"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/10 text-bone/60 transition-all duration-300 hover:border-teal/40 hover:bg-teal/10 hover:text-teal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d={s.d} />
              </svg>
            </a>
          ))}
        </div>
        <p className="label-sm text-bone/30">Coimbatore, India · IST (UTC+5:30)</p>
      </Reveal>
    </section>
  )
}
