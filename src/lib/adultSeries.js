// Shared constants for the Adult Summer Series registration flow
// (form → payment → thank-you). Kept out of the page components so the
// constants can be imported anywhere without tripping react-refresh.

export const PASS_PRICE = 120
export const DROP_IN_PRICE = 25

// The six Monday sessions, starting June 29, 2026.
export const SESSION_DATES = [
  { value: '2026-06-29', label: 'Monday, June 29' },
  { value: '2026-07-06', label: 'Monday, July 6' },
  { value: '2026-07-13', label: 'Monday, July 13' },
  { value: '2026-07-20', label: 'Monday, July 20' },
  { value: '2026-07-27', label: 'Monday, July 27' },
  { value: '2026-08-03', label: 'Monday, August 3' },
]

export const dateLabel = (value) =>
  SESSION_DATES.find((d) => d.value === value)?.label || value
