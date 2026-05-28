import { useParams, Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { breadcrumbSchema, blogPostingSchema, faqSchema } from '../lib/schema'
import { getPostBySlug, POSTS } from '../lib/blog'

const formatDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) return <Navigate to="/blog" replace />

  const primary = post.related[0]
  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={post.metaTitle}
        description={post.metaDescription}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        jsonLd={[
          blogPostingSchema({
            title: post.title,
            description: post.metaDescription,
            slug: post.slug,
            datePublished: post.date,
          }),
          faqSchema(post.faqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <Navbar />

      {/* Article header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0d1b36] via-[#1a1040] to-[#5a1020] py-14 px-6">
        <div
          className="absolute -top-10 -right-10 w-48 h-48 opacity-10 rounded-full"
          style={{ backgroundColor: post.accent }}
        />
        <div className="relative max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
            <span
              className="text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: post.accent }}
            >
              {post.category}
            </span>
            <span className="text-[#b8d4f0] text-xs">
              {formatDate(post.date)} · {post.readMinutes} min read
            </span>
          </div>
          <h1 className="text-white text-3xl md:text-4xl font-black tracking-tight leading-tight">
            {post.title}
          </h1>
        </div>
      </header>

      <article className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-xs text-[#9aa6ba] mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-brand-red transition-colors">Home</Link>
            <span className="mx-1.5">/</span>
            <Link to="/blog" className="hover:text-brand-red transition-colors">Blog</Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#5a6a8a]">{post.category}</span>
          </nav>

          {/* Quick answer (AEO) */}
          <div
            className="rounded-lg px-5 py-4 mb-8 border-l-4"
            style={{ backgroundColor: '#f0f6ff', borderLeftColor: post.accent }}
          >
            <p className="text-navy-dark text-xs font-bold uppercase tracking-[0.2em] mb-1.5">
              Quick answer
            </p>
            <p className="text-[#3a4a6a] text-sm leading-relaxed">{post.tldr}</p>
          </div>

          {/* Body sections */}
          <div className="flex flex-col gap-8">
            {post.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-navy-dark text-xl font-black mb-3 leading-snug">
                  {section.heading}
                </h2>
                {section.body?.map((para, j) => (
                  <p key={j} className="text-[#3a4a6a] text-sm md:text-[15px] leading-relaxed mb-3">
                    {para}
                  </p>
                ))}
                {section.list && (
                  <ul className="flex flex-col gap-2 mt-1">
                    {section.list.map((item, k) => (
                      <li key={k} className="flex gap-2.5 text-[#3a4a6a] text-sm leading-relaxed">
                        <span style={{ color: post.accent }} className="font-bold flex-shrink-0">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Primary CTA — links to the page this article is about */}
          <div className="mt-10 bg-navy-dark rounded-xl px-6 py-6 text-center">
            <p className="text-white font-black text-lg mb-1">Want the details?</p>
            <p className="text-[#b8d4f0] text-sm mb-4">{primary.label}</p>
            <Link
              to={primary.to}
              className="inline-block bg-brand-red text-white font-bold px-8 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              {primary.label} →
            </Link>
          </div>

          {/* Related pages on the site */}
          {post.related.length > 0 && (
            <div className="mt-8 border border-surface-border rounded-lg px-5 py-4">
              <p className="text-[#5a7aaa] text-xs font-bold uppercase tracking-widest mb-3">
                Related at Capital Core
              </p>
              <ul className="flex flex-col gap-2">
                {post.related.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-brand-red text-sm font-semibold hover:underline"
                    >
                      {link.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQ (AEO) */}
          {post.faqs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-navy-dark text-xl font-black mb-4">Frequently asked questions</h2>
              <div className="flex flex-col gap-3">
                {post.faqs.map(({ q, a }) => (
                  <div
                    key={q}
                    className="border border-surface-border border-l-4 rounded-lg px-5 py-4"
                    style={{ borderLeftColor: post.accent }}
                  >
                    <p className="text-navy-dark font-bold text-sm mb-1.5">{q}</p>
                    <p className="text-[#3a4a6a] text-sm leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* More from the blog */}
          <div className="mt-12 pt-8 border-t border-surface-border">
            <p className="text-[#5a7aaa] text-xs font-bold uppercase tracking-widest mb-4">
              More from the blog
            </p>
            <div className="flex flex-col gap-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="group flex items-center justify-between gap-4 border border-surface-border rounded-lg px-4 py-3 hover:bg-[#f8faff] transition-colors"
                >
                  <span className="text-navy-dark text-sm font-semibold leading-snug group-hover:text-brand-red transition-colors">
                    {p.title}
                  </span>
                  <span className="text-brand-red text-sm flex-shrink-0">→</span>
                </Link>
              ))}
            </div>
            <Link
              to="/blog"
              className="inline-block mt-5 text-brand-red text-sm font-bold hover:underline"
            >
              ← Back to all articles
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
