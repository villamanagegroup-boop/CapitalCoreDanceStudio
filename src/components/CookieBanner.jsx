import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'ccd-consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  function accept() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ status: 'accepted', at: new Date().toISOString() })
      )
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    // Outer wrapper has pointer-events-none so empty space around the banner
    // never intercepts clicks on the form/submit buttons underneath.
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Privacy and cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none"
    >
      <div className="relative max-w-2xl mx-auto bg-navy-dark text-white rounded-lg sm:rounded-xl shadow-2xl border border-[#2a3a5a] pointer-events-auto px-4 py-3 sm:px-5 sm:py-4 pr-9 sm:pr-10">
        {/* Close (X) — top-right */}
        <button
          type="button"
          onClick={accept}
          aria-label="Dismiss privacy notice"
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-7 h-7 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors text-lg leading-none"
        >
          ×
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-[#b8d4f0] text-xs leading-relaxed flex-1">
            We use cookies and store the info you submit through our forms (enrollment,
            contact, parties, orders) to run the studio. We don't sell your data. See our{' '}
            <Link to="/privacy" className="underline text-white hover:text-[#f4a8b4]">
              Privacy Policy
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={accept}
            className="w-full sm:w-auto bg-brand-red text-white text-xs font-bold px-5 py-2 rounded-md hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
