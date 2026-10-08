import OrbitRings from '../components/OrbitRings'
import ScrubWords from '../components/anim/ScrubWords'
import ChapterMark from '../components/ChapterMark'

/**
 * The planet beat. A pinned scene: the heart (rendered in the WebGL layer
 * behind this DOM) rises into the centre of an orbital instrument while the
 * premise sharpens word by word on either side of it.
 */
export default function Premise() {
  return (
    <section id="premise" className="relative h-[230vh] w-full">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div className="absolute left-6 right-6 top-24 sm:left-10 sm:right-10 sm:top-28">
          <ChapterMark n="01" title="The premise" meta="Specimen 01 · Human heart" />
        </div>

        {/* the instrument the heart sits in */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(118vw,74vh)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(78vh,64vw)]">
          <OrbitRings className="h-full w-full" rings={[0.36, 0.55, 0.78]} />
        </div>

        {/* left — the negation */}
        <ScrubWords
          as="h2"
          trigger="#premise"
          start="top 20%"
          end="top -50%"
          className="display absolute left-6 top-[22%] max-w-[78vw] text-[clamp(1.35rem,6.2vw,2rem)] font-[560] text-bone sm:left-10 sm:top-auto sm:bottom-[22%] sm:max-w-[30vw] sm:text-[clamp(1.4rem,2.6vw,2.6rem)]"
          parts={[{ t: 'This is not just engineering.' }]}
        />

        {/* right — the promise */}
        <ScrubWords
          as="p"
          trigger="#premise"
          start="top -40%"
          end="top -115%"
          className="display absolute bottom-[14%] right-6 max-w-[80vw] text-right text-[clamp(1.35rem,6.2vw,2rem)] font-[560] text-bone sm:bottom-auto sm:right-10 sm:top-[30%] sm:max-w-[32vw] sm:text-[clamp(1.4rem,2.6vw,2.6rem)]"
          parts={[{ t: 'It’s a ' }, { t: 'promise', accent: true }, { t: ' to everyone a machine could save.' }]}
        />
      </div>
    </section>
  )
}
