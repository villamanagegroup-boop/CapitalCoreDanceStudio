import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://capitalcoredance.com'
const DEFAULT_OG_IMAGE = '/og-image.jpg'

export default function SEO({ title, description, canonical, ogImage = DEFAULT_OG_IMAGE }) {
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL
  const imageUrl = `${SITE_URL}${ogImage}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Capital Core Dance Studio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  )
}
