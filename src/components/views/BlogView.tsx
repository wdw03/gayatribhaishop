import React, { useState } from "react"
import { BLOG_POSTS } from "../../data/blogData"
import { products } from "../../products"
import type { BlogPost, Product, View } from "../../types"
import { money } from "../../utils/format"
import Button from "../common/Button"
import Icon from "../common/Icon"
import Modal from "../common/Modal"

export interface BlogViewProps {
  go: (v: View) => void
  openProduct: (p: Product) => void
  addToCart: (p: Product) => void
}

export function BlogView({ go, openProduct, addToCart }: BlogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Essays")
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null)
  const [copied, setCopied] = useState(false)

  const categories = [
    "All Essays",
    "Fabric Science",
    "Style Guides",
    "Craft & Atelier",
    "Resort Life",
  ]

  const filteredPosts =
    selectedCategory === "All Essays"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === selectedCategory)

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0]

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div className="blog-page-container">
      {/* Blog Hero Header (SEO optimized) */}
      <header className="blog-hero-section">
        <div className="blog-hero-badge">
          <Icon name="sparkles" size={13} />
          <span>THE AVYR JOURNAL · VOLUME IV</span>
        </div>
        <h1>Essays on Craft, Linen & Modern Style</h1>
        <p className="blog-hero-lead">
          Thoughtful explorations of hand-guided embroidery, European flax cultivation,
          and relaxed Riviera menswear, penned by our designers and master karigars in Surat.
        </p>

        {/* Category Tabs */}
        <div className="blog-category-nav" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`blog-cat-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Featured Headline Story (shown when All Essays selected) */}
      {selectedCategory === "All Essays" && featuredPost && (
        <section className="featured-blog-card" onClick={() => setActiveArticle(featuredPost)}>
          <div className="featured-blog-img-wrap">
            <img src={featuredPost.coverImage} alt={featuredPost.title} loading="eager" />
            <span className="featured-badge">FEATURED ESSAY</span>
          </div>
          <div className="featured-blog-copy">
            <div className="article-meta-row">
              <span className="blog-cat-tag">{featuredPost.category}</span>
              <span className="meta-bullet">·</span>
              <span className="read-time-pill">
                <Icon name="clock" size={12} /> {featuredPost.readTime}
              </span>
              <span className="meta-bullet">·</span>
              <time dateTime={featuredPost.date}>{featuredPost.date}</time>
            </div>
            <h2>{featuredPost.title}</h2>
            <p className="featured-subtitle">{featuredPost.subtitle}</p>
            <p className="featured-excerpt">{featuredPost.excerpt}</p>
            <div className="featured-footer-row">
              <div className="author-pill">
                <span className="author-avatar">{featuredPost.author.avatar}</span>
                <div>
                  <strong>{featuredPost.author.name}</strong>
                  <small>{featuredPost.author.role}</small>
                </div>
              </div>
              <Button variant="dark" className="read-article-btn">
                Read Full Essay <Icon name="arrow" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="blog-articles-section">
        <div className="blog-grid-header">
          <h3>
            {selectedCategory === "All Essays" ? "Latest Dispatches" : selectedCategory}
          </h3>
          <span>{filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}</span>
        </div>

        <div className="blog-articles-grid">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="blog-card"
              onClick={() => setActiveArticle(post)}
            >
              <div className="blog-card-media">
                <img src={post.coverImage} alt={post.title} loading="lazy" />
                <span className="card-cat-badge">{post.category}</span>
              </div>
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span>
                    <Icon name="clock" size={11} /> {post.readTime}
                  </span>
                  <span>{post.date}</span>
                </div>
                <h4>{post.title}</h4>
                <p>{post.excerpt}</p>
                <div className="blog-card-footer">
                  <div className="mini-author">
                    <span className="mini-avatar">{post.author.avatar}</span>
                    <small>{post.author.name}</small>
                  </div>
                  <span className="read-more-link">
                    Read <Icon name="arrow" size={13} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <Modal onClose={() => setActiveArticle(null)}>
          <div className="article-reader-container">
            {/* Article Top Header */}
            <div className="reader-header">
              <div className="reader-badge-row">
                <span className="blog-cat-tag">{activeArticle.category}</span>
                <span>·</span>
                <span><Icon name="clock" size={12} /> {activeArticle.readTime}</span>
                <span>·</span>
                <span>{activeArticle.date}</span>
              </div>
              <h1>{activeArticle.title}</h1>
              <p className="reader-subtitle">{activeArticle.subtitle}</p>

              {/* Author Banner */}
              <div className="reader-author-banner">
                <span className="author-avatar large">{activeArticle.author.avatar}</span>
                <div>
                  <strong>{activeArticle.author.name}</strong>
                  <p>{activeArticle.author.role}</p>
                </div>
              </div>
            </div>

            {/* Main Cover Banner */}
            <div className="reader-cover-wrap">
              <img src={activeArticle.coverImage} alt={activeArticle.title} />
            </div>

            {/* Key Takeaways Box */}
            <div className="reader-takeaways-card">
              <div className="takeaways-head">
                <Icon name="sparkles" size={16} />
                <strong>Atelier Key Takeaways</strong>
              </div>
              <ul>
                {activeArticle.keyTakeaways.map((point, idx) => (
                  <li key={idx}>
                    <Icon name="check" size={14} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Paragraphs */}
            <div className="reader-body-copy">
              {activeArticle.content.map((p, idx) => (
                <p key={idx} className={idx === 0 ? "first-paragraph-dropcap" : ""}>
                  {p}
                </p>
              ))}
            </div>

            {/* Tags Strip */}
            <div className="reader-tags-strip">
              <span>Tags:</span>
              {activeArticle.tags.map((tag) => (
                <span key={tag} className="article-tag-chip">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Related Shirts to Shop Section */}
            {activeArticle.relatedProductIds.length > 0 && (
              <div className="reader-related-products">
                <div className="related-products-head">
                  <span className="eyebrow">From This Story</span>
                  <h3>Artisanal Shirts Featured in this Essay</h3>
                </div>
                <div className="reader-products-grid">
                  {activeArticle.relatedProductIds.map((pId) => {
                    const product = products.find((p) => p.id === pId)
                    if (!product) return null
                    return (
                      <div key={product.id} className="reader-product-card">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          onClick={() => {
                            openProduct(product)
                            setActiveArticle(null)
                          }}
                        />
                        <div className="reader-product-info">
                          <small>{product.category}</small>
                          <strong
                            onClick={() => {
                              openProduct(product)
                              setActiveArticle(null)
                            }}
                          >
                            {product.name}
                          </strong>
                          <span className="reader-price">{money(product.price)}</span>
                        </div>
                        <div className="reader-product-btns">
                          <Button
                            variant="light"
                            onClick={() => {
                              addToCart(product)
                            }}
                          >
                            + Quick Bag
                          </Button>
                          <Button
                            variant="dark"
                            onClick={() => {
                              openProduct(product)
                              setActiveArticle(null)
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Share Article Bar */}
            <div className="reader-share-bar">
              <span>Share this essay:</span>
              <div className="share-buttons-group">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Read this insightful menswear essay: "${activeArticle.title}" on AVYR Journal:\n${window.location.href}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn whatsapp"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `"${activeArticle.title}" - A thoughtful exploration from AVYR Atelier Journal.`
                  )}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn twitter"
                >
                  Twitter / X
                </a>
                <button type="button" className="social-btn copy" onClick={handleCopyLink}>
                  {copied ? "Copied! ✓" : "Copy Link"}
                </button>
              </div>
            </div>

            <div className="reader-close-action">
              <Button onClick={() => setActiveArticle(null)}>
                ← Back to All Journal Essays
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default BlogView
