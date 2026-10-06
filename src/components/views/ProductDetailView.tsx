import { useEffect, useState } from "react"
import { products } from "../../products"
import { allSizes, type Product } from "../../types"
import { money } from "../../utils/format"
import Button from "../common/Button"
import Icon from "../common/Icon"
import Modal from "../common/Modal"
import SectionTitle from "../common/SectionTitle"
import ProductAccordion from "../product/ProductAccordion"
import ProductCard from "../product/ProductCard"

export interface ProductDetailViewProps {
  product: Product
  openProduct: (p: Product) => void
  wishlisted: boolean
  toggleWish: () => void
  addToCart: (p: Product, size?: string) => void
}

export function ProductDetailView({
  product,
  openProduct,
  wishlisted,
  toggleWish,
  addToCart,
}: ProductDetailViewProps) {
  const [image, setImage] = useState(0)
  const [size, setSize] = useState(() => {
    try {
      return localStorage.getItem("avyr-size") || ""
    } catch {
      return ""
    }
  })
  const [sizeGuide, setSizeGuide] = useState(false)
  const [pincode, setPincode] = useState("")
  const [checked, setChecked] = useState(false)

  useEffect(() => setImage(0), [product])

  const selectSize = (s: string) => {
    setSize(s)
    try {
      localStorage.setItem("avyr-size", s)
    } catch {
      // storage unavailable
    }
  }

  return (
    <div className="product-page">
      <div className="breadcrumbs">
        Home / {"Men's Shirts"} / {product.category} /{" "}
        <strong>{product.name}</strong>
      </div>
      <div className="product-detail">
        <div className="gallery">
          <div className="thumbnails">
            {product.images.slice(0, 6).map((src, i) => (
              <button
                className={image === i ? "active" : ""}
                onClick={() => setImage(i)}
                key={src}
                type="button"
              >
                <img src={src} alt={`${product.name} view ${i + 1}`} />
              </button>
            ))}
          </div>
          <div className="main-image">
            <img
              src={product.images[image]}
              alt={`${product.name} enlarged view`}
            />
            <span>Hover to explore detail</span>
          </div>
        </div>
        <div className="product-summary">
          <span className="eyebrow">AVYR · Artisan Series</span>
          <h1>{product.name}</h1>
          <div className="detail-rating">
            <span>
              <Icon name="star" size={14} filled /> {product.rating}
            </span>
            <button type="button">{product.reviews} reviews</button>
            <b>Handcrafted</b>
          </div>
          <div className="detail-price">
            <strong>{money(product.price)}</strong>
            <s>{money(product.mrp)}</s>
            <span>Save {product.discount}%</span>
          </div>
          <p className="tax">
            Inclusive of all taxes · or 3 interest-free payments
          </p>
          <div className="offer">
            <strong>PRIVATE OFFER</strong>
            <span>
              Use <b>FIRST10</b> for 10% off your first order
            </span>
          </div>
          <div className="selection-head">
            <div>
              <strong>Colour</strong>
              <span>{product.color}</span>
            </div>
          </div>
          <button className="color-swatch active" type="button">
            <img src={product.images[0]} alt={product.color} />
          </button>
          <div className="selection-head">
            <div>
              <strong>Select size</strong>
              {size && <span>Your preferred size: {size}</span>}
            </div>
            <button type="button" onClick={() => setSizeGuide(true)}>
              Size guide
            </button>
          </div>
          <div className="size-grid">
            {allSizes.map((s) => (
              <button
                key={s}
                disabled={!product.stock[s]}
                className={size === s ? "active" : ""}
                onClick={() => selectSize(s)}
                type="button"
              >
                <span>{s}</span>
                {product.stock[s] > 0 && product.stock[s] < 4 && (
                  <small>Only {product.stock[s]}</small>
                )}
              </button>
            ))}
          </div>
          {!size && (
            <p className="size-note">
              Select your size to continue. Relaxed fit—we recommend your usual
              size.
            </p>
          )}
          <div className="detail-actions">
            <Button
              className="add-bag"
              disabled={!size}
              onClick={() => addToCart(product, size)}
            >
              Add to bag <Icon name="bag" />
            </Button>
            <Button
              variant="outline"
              className={wishlisted ? "wishlisted" : ""}
              onClick={toggleWish}
            >
              <Icon name="heart" filled={wishlisted} />
              {wishlisted ? "Saved" : "Wishlist"}
            </Button>
          </div>
          <div className="delivery">
            <strong>Check delivery</strong>
            <div>
              <input
                value={pincode}
                onChange={(e) =>
                  setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter pincode"
              />
              <button
                type="button"
                onClick={() => setChecked(pincode.length === 6)}
              >
                Check
              </button>
            </div>
            {checked && (
              <p>
                <Icon name="check" size={15} /> Delivery by Tuesday · Free
                shipping available
              </p>
            )}
          </div>
          <div className="service-row">
            <span>
              <Icon name="truck" />
              <b>48-hour dispatch</b>
            </span>
            <span>
              <Icon name="refresh" />
              <b>Easy 7-day return</b>
            </span>
            <span>
              <Icon name="shield" />
              <b>Authentic craft</b>
            </span>
          </div>
          <ProductAccordion product={product} />
        </div>
      </div>
      <section className="page-section recommendations">
        <SectionTitle eyebrow="Style It Your Way" title="You may also like" />
        <div className="product-grid">
          {products
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                wishlisted={false}
                onWish={() => {}}
                onOpen={() => openProduct(p)}
                onAdd={() => addToCart(p)}
              />
            ))}
        </div>
      </section>
      <div className="mobile-sticky-add">
        <div>
          <strong>{money(product.price)}</strong>
          <span>{size || "Select size"}</span>
        </div>
        <Button disabled={!size} onClick={() => addToCart(product, size)}>
          Add to bag
        </Button>
      </div>
      {sizeGuide && (
        <Modal onClose={() => setSizeGuide(false)}>
          <span className="eyebrow">Find Your Fit</span>
          <h2>{"Men's shirt size guide"}</h2>
          <p>
            Measurements are in inches. For a relaxed fit, choose your regular
            size.
          </p>
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest</th>
                <th>Shoulder</th>
                <th>Length</th>
              </tr>
            </thead>
            <tbody>
              {allSizes.map((s, i) => (
                <tr key={s}>
                  <td>{s}</td>
                  <td>{36 + i * 2}</td>
                  <td>{16 + i}</td>
                  <td>{27 + i}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button onClick={() => setSizeGuide(false)}>Got it</Button>
        </Modal>
      )}
    </div>
  )
}

export default ProductDetailView
