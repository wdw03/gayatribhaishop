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
  return (
    <article className="product-card group">
      <div className="product-image-wrap" onClick={onOpen}>
        <img
          src={product.images[0]}
          alt={`${product.name} front view`}
          className="product-image primary"
        />
        <img
          src={product.images[1] || product.images[0]}
          alt={`${product.name} alternate view`}
          className="product-image secondary"
        />
        <span
          className={`badge ${product.badge === "Limited" ? "badge-dark" : ""}`}
        >
          {product.badge}
        </span>
        {Object.values(product.stock).some((n) => n > 0 && n < 4) && (
          <span className="low-stock">Low stock</span>
        )}
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
