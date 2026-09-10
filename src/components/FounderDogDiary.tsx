import diary from '@/lib/founderDogVideos.json'
import { asset } from '@/lib/asset'

export default function FounderDogDiary() {
  return (
    <section id="founder-dog-diary" aria-labelledby="dog-diary-heading" className="mb-12 scroll-mt-28 rounded-3xl border border-sand bg-warmwhite p-5 md:p-8">
      <p className="mono-label text-clinical !text-[11px]">OWNER-SUBMITTED VIDEO DIARY</p>
      <h2 id="dog-diary-heading" className="mt-3 font-serif text-3xl text-espresso">{diary.heading}</h2>
      <p className="mt-4 text-espresso-70">{diary.intro}</p>
      <p className="mt-4 rounded-xl bg-cream p-4 text-sm text-espresso-70">{diary.context}</p>
      <ol className="mt-6 space-y-8">
        {diary.clips.map(clip => (
          <li key={clip.number}>
            <figure>
              <figcaption id={`dog-clip-${clip.number}`} className="mb-3">
                <h3 className="font-semibold text-espresso">{clip.number}. {clip.title}</h3>
                <p className="mt-1 text-sm text-espresso-70">{clip.description}</p>
              </figcaption>
              <video controls playsInline preload="none" poster={asset(clip.poster)} aria-labelledby={`dog-clip-${clip.number}`} className="max-h-[520px] w-full rounded-2xl bg-black">
                <source src={asset(clip.src)} type="video/mp4" />
                Your browser cannot play this video. <a href={asset(clip.src)}>Open clip {clip.number}</a>.
              </video>
            </figure>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-sm text-espresso-70">{diary.editing}</p>
    </section>
  )
}
