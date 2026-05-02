// Shared JSON-LD schema helpers for SEO + AI-search structured data.
// Schema.org reference: https://schema.org/

const SITE_URL = 'https://capitalcoredance.com'
const PHONE = '+1-804-234-4014'
const EMAIL = 'info@capitalcoredance.com'

// Address used everywhere
const ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: '13110 Midlothian Turnpike',
  addressLocality: 'Midlothian',
  addressRegion: 'VA',
  postalCode: '23113',
  addressCountry: 'US',
}

const GEO = {
  '@type': 'GeoCoordinates',
  latitude: 37.50376329673492,
  longitude: -77.64043756100419,
}

const SOCIAL = [
  'https://www.instagram.com/capitalcoredance',
  'https://www.facebook.com/p/Capital-Core-Dance-Challenge-61566002721661/',
]

const HOURS = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '15:00',
    closes: '20:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: 'Saturday',
    opens: '09:00',
    closes: '14:00',
  },
]

const AREA_SERVED = [
  { '@type': 'City', name: 'Midlothian', '@id': 'https://en.wikipedia.org/wiki/Midlothian,_Virginia' },
  { '@type': 'City', name: 'Richmond' },
  { '@type': 'City', name: 'Chesterfield' },
  { '@type': 'AdministrativeArea', name: 'Chesterfield County' },
]

// ── Reusable: organization / business ─────────────────────────
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'DanceSchool',
  '@id': `${SITE_URL}/#dance-school`,
  name: 'Capital Core Dance Studio',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: PHONE,
  email: EMAIL,
  address: ADDRESS,
  geo: GEO,
  openingHoursSpecification: HOURS,
  priceRange: '$$',
  description:
    'Capital Core Dance Studio offers dance classes, summer camps, birthday parties, and an annual recital for kids and adults in Midlothian, VA. Styles include ballet, jazz, hip hop, contemporary, tap, acro, tumbling, lyrical, musical theatre, Irish, and pom/cheer.',
  areaServed: AREA_SERVED,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Capital Core Dance Studio Programs',
    itemListElement: [
      { '@type': 'Offer', name: 'Year-Round Dance Classes', url: `${SITE_URL}/classes` },
      { '@type': 'Offer', name: 'Summer Dance Camps', url: `${SITE_URL}/camps` },
      { '@type': 'Offer', name: 'Mini Series Spring Classes', url: `${SITE_URL}/mini-series` },
      { '@type': 'Offer', name: 'Birthday Party Packages', url: `${SITE_URL}/birthdays` },
      { '@type': 'Offer', name: 'Annual Recital', url: `${SITE_URL}/recital` },
    ],
  },
  sameAs: SOCIAL,
}

// ── Breadcrumbs ───────────────────────────────────────────────
// items: [{ name: 'Home', path: '/' }, { name: 'Classes', path: '/classes' }]
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

// ── Event (recital) ───────────────────────────────────────────
export function eventSchema({
  name,
  description,
  startDate,
  endDate,
  performer,
  offerUrl,
  offerPrice,
  offerName,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TheaterEvent',
    name,
    description,
    startDate,
    endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Richmond Christian School',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '6511 Belmont Rd',
        addressLocality: 'Chesterfield',
        addressRegion: 'VA',
        postalCode: '23832',
        addressCountry: 'US',
      },
    },
    image: `${SITE_URL}/ticket-banner.png`,
    organizer: {
      '@type': 'Organization',
      name: 'Capital Core Dance Studio',
      url: SITE_URL,
    },
    performer: performer || {
      '@type': 'PerformingGroup',
      name: 'Capital Core Dance Studio Dancers',
    },
    offers: offerUrl
      ? {
          '@type': 'Offer',
          name: offerName || 'General Admission',
          price: offerPrice,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: offerUrl,
        }
      : undefined,
  }
}

// ── Course (classes) ──────────────────────────────────────────
// styles: array of strings (e.g. 'Ballet', 'Hip Hop', etc.)
export function courseListSchema(styles) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Dance Classes at Capital Core Dance Studio',
    itemListElement: styles.map((style, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: `${style} — Capital Core Dance Studio`,
        description: `${style} dance classes for kids, teens, and adults in Midlothian, VA. Beginner through advanced levels.`,
        provider: {
          '@type': 'DanceSchool',
          name: 'Capital Core Dance Studio',
          url: SITE_URL,
          sameAs: SITE_URL,
        },
        url: `${SITE_URL}/classes`,
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'in-person',
          location: {
            '@type': 'Place',
            name: 'Capital Core Dance Studio',
            address: ADDRESS,
          },
        },
      },
    })),
  }
}

// ── Product (recital shirts/tickets) ──────────────────────────
export function productSchema({ name, description, image, price, priceCurrency = 'USD', availability = 'https://schema.org/InStock', url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: image ? `${SITE_URL}${image}` : `${SITE_URL}/og-image.jpg`,
    brand: {
      '@type': 'Brand',
      name: 'Capital Core Dance Studio',
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency,
      availability,
      url: url ? `${SITE_URL}${url}` : SITE_URL,
    },
  }
}

// Convenience: build a "Home > X" breadcrumb
export function simpleBreadcrumb(currentName, currentPath) {
  return breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: currentName, path: currentPath },
  ])
}
