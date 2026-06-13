import ScrollFillText from '../components/anim/ScrollFillText'
import { Reveal } from '../components/anim/Reveal'

export default function Manifesto() {
  return (
    <section className="relative flex min-h-[100svh] w-full items-center px-6 py-32 sm:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <Reveal
          as="p"
          className="mb-12 flex items-center gap-4 font-body text-[11px] uppercase tracking-[0.4em] text-teal/70"
        >
          <span className="inline-block h-px w-12 bg-teal/50" />
          The premise
        </Reveal>

        <ScrollFillText
          className="font-serif text-[clamp(1.8rem,4.6vw,3.6rem)] font-500 leading-[1.22] tracking-tight text-bone"
          text="Medicine still makes the body come to the machine. I build the opposite — instruments that meet the patient where they are."
        />
      </div>
    </section>
  )
}
