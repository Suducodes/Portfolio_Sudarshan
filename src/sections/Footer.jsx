import { credentials, contact } from '../data/contact'

export default function Footer({ scrollTo }) {
  return (
    <footer className="relative w-full px-6 pb-10 pt-20 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 border-t border-bone/10 pt-10 md:flex-row md:items-end md:justify-between">
          <div>
            <button
              onClick={() => scrollTo(0)}
              data-cursor="hover"
              className="font-serif text-3xl font-500 tracking-tight text-bone transition-colors hover:text-teal"
            >
              Sudarshan&nbsp;V.<span className="text-teal">.</span>
            </button>
            <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-bone/45">
              Biomedical engineer building instruments for precision medicine.
            </p>
          </div>

          <div className="flex flex-col gap-2 font-body text-sm text-bone/55 md:items-end">
            <a href={`mailto:${contact.email}`} data-cursor="hover" className="transition-colors hover:text-teal">
              {contact.email}
            </a>
            <div className="flex gap-4">
              <a href={contact.linkedin} target="_blank" rel="noreferrer" data-cursor="hover" className="transition-colors hover:text-teal">LinkedIn</a>
              <a href={contact.github} target="_blank" rel="noreferrer" data-cursor="hover" className="transition-colors hover:text-teal">GitHub</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 text-[11px] tracking-[0.18em] text-bone/30 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body uppercase">{credentials}</p>
          <p className="font-body">© {new Date().getFullYear()} Sudarshan V. — Built with intent.</p>
        </div>
      </div>
    </footer>
  )
}
