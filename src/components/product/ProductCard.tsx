import React, { useRef, useState } from "react"
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

  // Drag / Swipe state tracking to distinguish drag-slide from click-to-open
  const dragStartX = useRef<number | null>(null)
  const isDragging = useRef<boolean>(false)

  const prevSlide = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation()
    setImgIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    )
  }

  const nextSlide = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation()
    setImgIndex((prev) => (prev + 1) % product.images.length)
  }

  // Mouse Drag handlers for Desktop slide
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only handle primary mouse button
    if (e.button !== 0) return
    dragStartX.current = e.clientX
    isDragging.current = false
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX.current === null) return
    const diff = dragStartX.current - e.clientX
    if (Math.abs(diff) > 8) {
      isDragging.current = true
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragStartX.current !== null && isDragging.current) {
      const diff = dragStartX.current - e.clientX
      if (Math.abs(diff) > 30) {
        if (diff > 0) {
          nextSlide(e)
        } else {
          prevSlide(e)
        }
      }
    }
    dragStartX.current = null
    // Reset dragging flag shortly after to allow click handler to inspect it
    setTimeout(() => {
      isDragging.current = false
    }, 50)
  }

  // Touch Swipe handlers for Mobile & Tablet slide
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX
    isDragging.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return
    const diff = dragStartX.current - e.touches[0].clientX
    if (Math.abs(diff) > 8) {
      isDragging.current = true
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX.current !== null && isDragging.current) {
      const diff = dragStartX.current - e.changedTouches[0].clientX
      if (Math.abs(diff) > 30) {
        if (diff > 0) {
          nextSlide(e)
        } else {
          prevSlide(e)
        }
      }
    }
    dragStartX.current = null
    setTimeout(() => {
      isDragging.current = false
    }, 50)
  }

  // Card click handler - only open if user didn't drag/slide
  const handleCardClick = (e: React.MouseEvent) => {
    if (isDragging.current) {
      e.stopPropagation()
      return
    }
    onOpen()
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
      <div
        className="product-image-wrap"
        onClick={handleCardClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Hardware-accelerated Horizontal Sliding Track */}
        <div
          className="card-slider-track"
          style={{ transform: `translateX(-${imgIndex * 100}%)` }}
        >
          {product.images.map((imgSrc, idx) => (
            <div key={imgSrc + idx} className="card-slide-item">
              <img
                src={imgSrc}
                alt={`${product.name} view ${idx + 1}`}
                className="product-image"
                loading={idx === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Card Left & Right Slide Arrows (Elevated z-index, stops click propagation) */}
        {product.images.length > 1 && (
          <>
            <button
              type="button"
              className="card-nav-arrow card-prev"
              onClick={prevSlide}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="Previous photo (slide left)"
              title="Previous photo"
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
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="Next photo (slide right)"
              title="Next photo"
            >
              <span
                style={{ display: "inline-flex", transform: "rotate(-90deg)" }}
              >
                <Icon name="chevron" size={13} />
              </span>
            </button>

            {/* Interactive Card Mini Dots */}
            <div
              className="card-mini-dots"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {product.images.slice(0, 6).map((_, i) => (
                <button
                  type="button"
                  key={i}
                  className={`card-dot ${i === imgIndex ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setImgIndex(i)
                  }}
                  onMouseEnter={() => setImgIndex(i)}
                  aria-label={`Slide to photo ${i + 1}`}
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

        {/* Card Top Action Buttons (Wishlist & Share) */}
        <div
          className="card-top-actions"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
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

        {/* Quick Actions (Quick view & Quick add) */}
        <div
          className="quick-actions"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
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
