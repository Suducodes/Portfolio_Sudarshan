import { RevealLines } from '../components/anim/Reveal'

export default function Tagline() {
  return (
    <section className="relative flex min-h-[80svh] w-full items-center justify-center px-6 py-24 text-center">
      <div className="relative z-10">
        <RevealLines
          as="h2"
          blur
          className="font-serif text-[clamp(2rem,6.5vw,5.5rem)] font-500 leading-[1.08] tracking-tight"
          lines={[
            <span key="1" className="text-stroke">This is not just engineering.</span>,
            <span key="2" className="text-bone">
              It’s a <span className="text-teal text-glow-teal">promise</span>
            </span>,
            <span key="3" className="text-bone/70">to everyone a machine could save.</span>,
          ]}
        />
      </div>
    </section>
  )
}
