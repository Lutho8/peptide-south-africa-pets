import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { asset } from '@/lib/asset'

/** An aspirational editorial interlude, separate from product evidence or outcomes. */
export default function MoreGoodDays() {
  const [paused, setPaused] = useState(false)

  return (
    <section aria-labelledby="more-good-days-heading" className="more-good-days">
      <div className="more-good-days-stage">
        <h2 id="more-good-days-heading" className="sr-only">More walks. More play. More good days together.</h2>
        <p className="more-good-days-note">For the moments you share.</p>
        <img
          src={asset('/dog-owner-more-retriever-v1.webp')}
          alt=""
          width="1536"
          height="1024"
          loading="lazy"
          className="more-good-days-dog"
        />
        <div aria-hidden="true" className="more-good-days-type">
          <span>More</span>
          <span className="more-good-days-window">
            <span className="more-good-days-words" style={{ animationPlayState: paused ? 'paused' : 'running' }}>
              {['walks', 'play', 'fetch', 'days', 'walks'].map((word, index) => <span key={index}>{word}</span>)}
            </span>
          </span>
        </div>
        <button
          type="button"
          aria-label={paused ? 'Play word animation' : 'Pause word animation'}
          aria-pressed={paused}
          onClick={() => setPaused(value => !value)}
          className="more-good-days-control motion-reduce:hidden"
        >
          {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
        </button>
      </div>
    </section>
  )
}
