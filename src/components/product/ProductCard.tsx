import { useState } from "react"
import type { Product } from "../../types"
import { money } from "../../utils/format"
import Button from "../common/Button"
import Icon from "../common/Icon"

export interface ProductCardProps {
  product: Product
  wishlisted: boolean
  onWish: () => void
  onOpen: () => void
  onAdd: () => void
}

export function ProductCard({
  product,
  wishlisted,
  onWish,
  onOpen,
  onAdd,
}: ProductCardProps) {
  const [imgIndex, setImgIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setImgIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    )
  }

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setImgIndex((prev) => (prev + 1) % product.images.length)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} (${money(product.price)}) on AVYR!`,
      url: window.location.href,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // fallback
      }
    }
    try {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <article className="product-card group">
      <div className="product-image-wrap" onClick={onOpen}>
        {/* Slidable Product Image */}
        <img
          src={product.images[imgIndex] || product.images[0]}
          alt={`${product.name} view ${imgIndex + 1}`}
          className="product-image primary"
          loading="lazy"
        />

        {/* Card Left & Right Slide Controls */}
        {product.images.length > 1 && (
          <>
            <button
              type="button"
              className="card-nav-arrow card-prev"
              onClick={prevSlide}
              aria-label="Previous photo (slide left)"
            >
              <span
                style={{ display: "inline-flex", transform: "rotate(90deg)" }}
              >
                <Icon name="chevron" size={13} />
              </span>
            </button>
            <button
              type="button"
              className="card-nav-arrow card-next"
              onClick={nextSlide}
              aria-label="Next photo (slide right)"
            >
              <span
                style={{ display: "inline-flex", transform: "rotate(-90deg)" }}
              >
                <Icon name="chevron" size={13} />
              </span>
            </button>
            {/* Card mini dots */}
            <div className="card-mini-dots">
              {product.images.slice(0, 5).map((_, i) => (
                <span
                  key={i}
                  className={`card-dot ${i === imgIndex ? "active" : ""}`}
                />
              ))}
            </div>
          </>
        )}

        <span
          className={`badge ${product.badge === "Limited" ? "badge-dark" : ""}`}
        >
          {product.badge}
        </span>
        {Object.values(product.stock).some((n) => n > 0 && n < 4) && (
          <span className="low-stock">Low stock</span>
        )}

        {/* Card Action Buttons (Wishlist & Share) */}
        <div className="card-top-actions">
          <button
            className={`wish-btn ${wishlisted ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation()
              onWish()
            }}
            aria-label="Toggle wishlist"
          >
            <Icon name="heart" filled={wishlisted} />
          </button>
          <button
            className="card-share-btn"
            onClick={handleShare}
            aria-label="Share product"
            title={copied ? "Link copied!" : "Share product"}
          >
            <Icon name="share" size={13} />
            {copied && <span className="card-copied-tag">Copied!</span>}
          </button>
        </div>

        <div className="quick-actions">
          <Button
            variant="light"
            onClick={(e) => {
              e?.stopPropagation?.()
              onOpen()
            }}
          >
            Quick view
          </Button>
          <Button
            onClick={(e) => {
              e?.stopPropagation?.()
              onAdd()
            }}
          >
            Quick add
          </Button>
        </div>
      </div>
      <div className="product-info" onClick={onOpen}>
        <div className="product-meta">
          <span>{product.category}</span>
          <span className="rating">
            <Icon name="star" size={12} filled /> {product.rating} (
            {product.reviews})
          </span>
        </div>
        <h3>{product.name}</h3>
        <div className="price">
          <strong>{money(product.price)}</strong>
          <s>{money(product.mrp)}</s>
          <span>{product.discount}% off</span>
        </div>
        <p>{product.color} · Cotton linen</p>
      </div>
    </article>
  )
}

export default ProductCard
