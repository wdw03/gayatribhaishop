import { products } from "../../products"
import type { BlogPost, Product, View } from "../../types"
import Button from "../common/Button"
import Icon from "../common/Icon"
import SectionTitle from "../common/SectionTitle"
import ProductCard from "../product/ProductCard"

import HeroSlider from "../home/HeroSlider"
import ReelsSection from "../home/ReelsSection"
import BlogPreviewSection from "../home/BlogPreviewSection"

export interface HomeViewProps {
  openProduct: (p: Product) => void
  go: (v: View) => void
  wishlist: string[]
  toggleWish: (id: string) => void
  addToCart: (p: Product) => void
  onOpenArticle?: (post: BlogPost) => void
}

export function HomeView({
  openProduct,
  go,
  wishlist,
  toggleWish,
  addToCart,
  onOpenArticle,
}: HomeViewProps) {
  return (
    <>
      <HeroSlider go={go} openProduct={openProduct} products={products} />

      <section className="trust-strip">
        <span>
          <Icon name="truck" /> Free shipping over ₹1,999
        </span>
        <span>
          <Icon name="shield" /> Secure checkout
        </span>
        <span>
          <Icon name="refresh" /> Easy 7-day returns
        </span>
        <span>
          <img src="/assets/site_media/luxury_hanger_icon.png" alt="" /> Made in
          limited quantities
        </span>
      </section>

      <section className="page-section">
        <SectionTitle
          eyebrow="Just In"
          title="New arrivals"
          action="View all shirts"
          onAction={() => go("shop")}
        />
        <div className="product-grid">
          {products.slice(0, 4).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wishlisted={wishlist.includes(p.id)}
              onWish={() => toggleWish(p.id)}
              onOpen={() => openProduct(p)}
              onAdd={() => addToCart(p)}
            />
          ))}
        </div>
      </section>

      <section className="collection-banner">
        <img
          src="/assets/site_banners/home_banner_secondary.jpeg"
          alt="The coastal shirt collection"
        />
        <div className="collection-copy">
          <span className="eyebrow light">Destination Dressing</span>
          <h2>
            Coastal
            <br />
            State of Mind
          </h2>
          <p>
            Airy cotton-linen shirts, hand-finished with motifs drawn from
            shorelines and summer skies.
          </p>
          <Button variant="light" onClick={() => go("shop")}>
            Discover beach shirts <Icon name="arrow" />
          </Button>
        </div>
        <div className="collection-number">02 / 04</div>
      </section>

      <section className="page-section categories-section">
        <SectionTitle eyebrow="Find Your Shirt" title="Shop by mood" />
        <div className="category-grid">
          {[
            ["The Embroidered Edit", products[5].images[0], "Crafted detail"],
            ["Resort & Beach", products[2].images[0], "Easy silhouettes"],
            ["Modern Linen", products[12].images[0], "Natural texture"],
            ["After Dark", products[18].images[0], "Statement shirts"],
          ].map(([name, image, caption], i) => (
            <button
              className={`category-card cat-${i + 1}`}
              key={name}
              onClick={() => go("shop")}
              type="button"
            >
              <img src={image} alt={name} />
              <span>
                <small>{caption}</small>
                <strong>{name}</strong>
                <i>
                  Explore <Icon name="arrow" size={15} />
                </i>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Luxury Lookbook Reels in Motion */}
      <ReelsSection
        openProduct={openProduct}
        addToCart={addToCart}
        go={go}
      />

      <section className="story">
        <div className="story-images">
          <img
            src="/assets/site_media/instagram_lookbook_ing1.jpg"
            alt="Artisan shirt lookbook"
          />
          <img
            src="/assets/site_media/instagram_lookbook_ing3.jpg"
            alt="Embroidered shirt detail"
          />
        </div>
        <div className="story-copy">
          <span className="eyebrow">The AVYR Journal</span>
          <h2>
            Made by hands.
            <br />
            <em>Remembered by heart.</em>
          </h2>
          <p>
            We believe a shirt should carry more than a label. Every AVYR piece
            begins with a story, travels through the hands of skilled artisans,
            and is made in quantities small enough to remain personal.
          </p>
          <Button variant="text">
            Our craft story <Icon name="arrow" />
          </Button>
          <blockquote>
            {
              "“The embroidery has a beautiful human quality—you can feel the hours in it.”"
            }
            <cite>— Arjun Mehta, Mumbai</cite>
          </blockquote>
        </div>
      </section>

      <section className="page-section">
        <SectionTitle
          eyebrow="Most Loved"
          title="The best sellers"
          action="Shop best sellers"
          onAction={() => go("shop")}
        />
        <div className="product-grid">
          {products.slice(8, 12).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wishlisted={wishlist.includes(p.id)}
              onWish={() => toggleWish(p.id)}
              onOpen={() => openProduct(p)}
              onAdd={() => addToCart(p)}
            />
          ))}
        </div>
      </section>

      {/* SEO & Craft Storytelling: Journal Blog Preview */}
      <BlogPreviewSection go={go} onOpenArticle={onOpenArticle} />

      <section className="reviews">
        <span className="eyebrow">Worn & Loved</span>
        <h2>Shirts people keep talking about.</h2>
        <div className="review-grid">
          {[
            [
              "The fabric is genuinely premium and the handwork gets compliments every time. Fits true to size.",
              "Karan S.",
              "Verified buyer · Bengaluru",
            ],
            [
              "Packaging, finish, and fit all felt considered. My Coastal King shirt is now my holiday essential.",
              "Dev Malhotra",
              "Verified buyer · Delhi",
            ],
            [
              "Rare to find Indian craft presented this cleanly. The shirt feels special without trying too hard.",
              "Neil D.",
              "Verified buyer · Pune",
            ],
          ].map(([quote, name, meta]) => (
            <article key={name}>
              <div className="stars">★★★★★</div>
              <p>“{quote}”</p>
              <strong>{name}</strong>
              <small>{meta}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="newsletter">
        <span className="eyebrow light">The Inner Circle</span>
        <h2>First look. Private access.</h2>
        <p>
          Join for early access to limited drops, thoughtful styling notes and a
          welcome offer of 10%.
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Your email address"
            aria-label="Email address"
          />
          <Button variant="light" type="submit">
            Join AVYR <Icon name="arrow" />
          </Button>
        </form>
        <small>By subscribing, you agree to our privacy policy.</small>
      </section>
    </>
  )
}

export default HomeView
