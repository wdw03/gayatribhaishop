import React from "react"
import { BLOG_POSTS } from "../../data/blogData"
import type { BlogPost, View } from "../../types"
import Button from "../common/Button"
import Icon from "../common/Icon"
import SectionTitle from "../common/SectionTitle"

export interface BlogPreviewSectionProps {
  go: (v: View) => void
  onOpenArticle?: (post: BlogPost) => void
}

export function BlogPreviewSection({
  go,
  onOpenArticle,
}: BlogPreviewSectionProps) {
  const topPosts = BLOG_POSTS.slice(0, 3)

  return (
    <section className="page-section home-blog-section">
      <SectionTitle
        eyebrow="The AVYR Journal"
        title="Stories of craft, linen & style"
        action="Read all essays"
        onAction={() => go("blog")}
      />

      <div className="home-blog-grid">
        {topPosts.map((post) => (
          <article
            key={post.id}
            className="home-blog-card"
            onClick={() => {
              if (onOpenArticle) {
                onOpenArticle(post)
              } else {
                go("blog")
              }
            }}
          >
            <div className="home-blog-media">
              <img src={post.coverImage} alt={post.title} loading="lazy" />
              <span className="blog-pill-tag">{post.category}</span>
            </div>
            <div className="home-blog-content">
              <div className="home-blog-meta">
                <span>
                  <Icon name="clock" size={11} /> {post.readTime}
                </span>
                <span>·</span>
                <time>{post.date}</time>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="home-blog-footer">
                <span className="author-name">By {post.author.name}</span>
                <span className="read-arrow">
                  Read essay <Icon name="arrow" size={14} />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BlogPreviewSection
