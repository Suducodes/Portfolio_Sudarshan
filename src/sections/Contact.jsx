import { useState } from 'react'
import { RevealLines, Reveal } from '../components/anim/Reveal'
import { contact } from '../data/contact'
import { Magnetic } from '../hooks/useMagnetic'
import { sfx } from '../lib/sfx'

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
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-6 py-32 text-center"
    >
      <Reveal as="p" className="mb-10 font-body text-[11px] uppercase tracking-[0.5em] text-teal/70">
        The Signal
      </Reveal>

      <RevealLines
        as="h2"
        blur
        className="font-serif text-[clamp(2.2rem,7vw,6rem)] font-500 leading-[1.05] tracking-tight text-bone"
        lines={[
          <>If you’re building</>,
          <>something that <span className="text-teal text-glow-teal">matters</span></>,
          <span key="t" className="text-bone/70">— let’s talk.</span>,
        ]}
      />

      <Reveal delay={0.2} className="mt-14 flex flex-col items-center gap-7">
        <Magnetic strength={0.4}>
          <button
            onClick={copyEmail}
            onMouseEnter={() => sfx.tick()}
            data-cursor="hover"
            className="group flex items-center gap-3 rounded-full bg-teal px-8 py-4 font-body text-sm font-500 tracking-wide text-void transition-all duration-300 hover:shadow-[0_0_50px_-8px_rgba(0,229,196,0.8)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-void/40 animate-pulse-dot" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-void" />
            </span>
            {copied ? 'Copied to clipboard' : contact.email}
          </button>
        </Magnetic>

        <div className="flex items-center gap-3">
          {[
            { href: contact.linkedin, label: 'LinkedIn', d: 'M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM9 9h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06C20.4 8.58 22 10.66 22 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21V21H9z' },
            { href: contact.github, label: 'GitHub', d: 'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.36 9.36 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z' },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              data-cursor="hover"
              className="flex h-12 w-12 items-center justify-center rounded-full text-bone/55 transition-all duration-300 hover:bg-teal/10 hover:text-teal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d={s.d} />
              </svg>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
