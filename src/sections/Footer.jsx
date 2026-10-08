import { credentials, contact } from '../data/contact'

const LINKS = [
  ['Work', '#work'],
  ['Index', '#index'],
  ['Research', '#research'],
  ['Office', '#office'],
  ['Story', '#story'],
  ['Contact', '#contact'],
]

export default function Footer({ scrollTo }) {
  return (
    <footer className="relative w-full overflow-hidden px-6 pb-8 pt-16 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 border-t border-bone/10 pt-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <p className="label text-bone/45">Sudarshan Vasanthakumar</p>
            <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-bone/45">
              Biomedical engineer building instruments for precision medicine — on the hardware hospitals already own.
            </p>
          </div>
          <nav className="flex flex-col gap-2">
            {LINKS.map(([label, href]) => (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className="label-sm w-fit text-bone/50 transition-colors hover:text-teal"
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="flex flex-col gap-2">
            <a href={`mailto:${contact.email}`} className="label-sm break-all text-bone/50 transition-colors hover:text-teal">
              Email
            </a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer" className="label-sm text-bone/50 transition-colors hover:text-teal">
              LinkedIn ↗
            </a>
            <a href={contact.github} target="_blank" rel="noreferrer" className="label-sm text-bone/50 transition-colors hover:text-teal">
              GitHub ↗
            </a>
            <button onClick={() => scrollTo(0)} className="label-sm mt-3 w-fit text-teal/80 transition-colors hover:text-bone">
              Back to the pulse ↑
            </button>
          </div>
        </div>
      </div>

      {/* the monumental sign-off */}
      <p
        aria-hidden
        className="display pointer-events-none mt-16 select-none whitespace-nowrap text-center text-[11.2vw] font-[700] leading-[0.8] tracking-[-0.06em]"
        style={{
          backgroundImage: 'linear-gradient(180deg, rgba(236,230,218,0.16), rgba(236,230,218,0.02) 85%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Sudarshan
      </p>

      <div className="mx-auto mt-6 flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="label-sm text-bone/25">{credentials}</p>
        <p className="label-sm text-bone/25">© {new Date().getFullYear()} · designed & built in Coimbatore</p>
      </div>
    </footer>
  )
}
