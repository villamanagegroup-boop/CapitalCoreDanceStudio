import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { simpleBreadcrumb, blogListSchema } from '../lib/schema'
import { POSTS } from '../lib/blog'

const formatDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Dance Studio Blog — Classes, Camps & Events | Capital Core Dance Studio"
        description="News, guides, and tips on dance classes, summer camps, the annual recital, birthday parties, and studio events at Capital Core Dance Studio in Midlothian, VA. Serving Chesterfield County and Richmond."
        canonical="/blog"
        jsonLd={[
          blogListSchema(POSTS),
          simpleBreadcrumb('Blog', '/blog'),
        ]}
      />

      <Navbar />
      <PageHeader
        eyebrow="The Studio Blog"
        title="Dance News, Guides & Events"
        subtitle="Everything happening at Capital Core — upcoming camps, classes, the recital, parties, and tips to help your family get the most out of the studio."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto flex flex-col gap-5">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block border border-surface-border border-l-4 rounded-lg px-5 py-5 hover:bg-[#f8faff] hover:shadow-sm transition-all"
              style={{ borderLeftColor: post.accent }}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: post.accent }}
                >
                  {post.category}
                </span>
                <span className="text-[#9aa6ba] text-xs">
                  {formatDate(post.date)} · {post.readMinutes} min read
                </span>
              </div>
              <h2 className="text-navy-dark text-lg font-black leading-snug mb-2 group-hover:text-brand-red transition-colors">
                {post.title}
              </h2>
              <p className="text-[#3a4a6a] text-sm leading-relaxed mb-3">
                {post.excerpt}
              </p>
              <span className="text-brand-red text-xs font-bold tracking-wide">
                Read article →
              </span>
            </Link>
          ))}

          <div className="bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-5 text-center mt-2">
            <p className="text-navy-dark font-black text-base mb-1">Ready to get your dancer started?</p>
            <p className="text-[#5a6a8a] text-sm mb-4">Your first class is always free — no commitment required.</p>
            <Link
              to="/contact"
              className="inline-block bg-brand-red text-white font-bold px-8 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Claim a Free Trial Class
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
