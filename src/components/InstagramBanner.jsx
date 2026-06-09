import { useEffect, useState } from 'react'

// Behold feed ID — set VITE_BEHOLD_FEED_ID in your .env to enable the live feed.
// Get it free at https://behold.so → connect @capitalcoredance → copy the Feed ID.
const FEED_ID = import.meta.env.VITE_BEHOLD_FEED_ID
const PROFILE_URL = 'https://www.instagram.com/capitalcoredance'

const InstagramIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.62c-3.15 0-3.52.01-4.76.07-1.15.05-1.77.25-2.18.41-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.36 1.03-.41 2.18-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.05 1.15.25 1.77.41 2.18.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.36 2.18.41 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c1.15-.05 1.77-.25 2.18-.41.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.36-1.03.41-2.18.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.05-1.15-.25-1.77-.41-2.18a3.63 3.63 0 0 0-.88-1.35 3.63 3.63 0 0 0-1.35-.88c-.41-.16-1.03-.36-2.18-.41-1.24-.06-1.61-.07-4.76-.07Zm0 2.76a5.42 5.42 0 1 1 0 10.84 5.42 5.42 0 0 1 0-10.84Zm0 1.62a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm5.6-2.9a1.27 1.27 0 1 1 0 2.54 1.27 1.27 0 0 1 0-2.54Z" />
  </svg>
)

export default function InstagramBanner() {
  const [scriptReady, setScriptReady] = useState(false)

  useEffect(() => {
    if (!FEED_ID) return
    const SRC = 'https://w.behold.so/widget.js'
    if (document.querySelector(`script[src="${SRC}"]`)) {
      setScriptReady(true)
      return
    }
    const script = document.createElement('script')
    script.type = 'module'
    script.src = SRC
    script.onload = () => setScriptReady(true)
    document.head.appendChild(script)
  }, [])

  return (
    <section className="bg-white border-t border-surface-border px-6 py-14">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[#f4a8b4] hover:text-brand-red transition-colors"
          >
            <InstagramIcon className="w-7 h-7" />
            <span className="text-xl font-black tracking-wide">@capitalcoredance</span>
          </a>
          <p className="text-[#3a4a6a] text-sm mt-2">
            Follow along for recitals, behind-the-scenes, and studio moments.
          </p>
        </div>

        {FEED_ID && scriptReady ? (
          // eslint-disable-next-line react/no-unknown-property
          <behold-widget feed-id={FEED_ID}></behold-widget>
        ) : (
          <div className="text-center">
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#f4a8b4] hover:bg-brand-red text-white font-bold text-sm px-7 py-3 rounded-full transition-colors"
            >
              <InstagramIcon className="w-5 h-5" />
              Follow us on Instagram
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
