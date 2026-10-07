import type { View } from "../../types"
import Icon from "../common/Icon"

export interface MobileNavProps {
  view: View
  go: (v: View) => void
  cartCount: number
  wishlistCount?: number
  onSearchOpen?: () => void
}

export function MobileNav({
  view,
  go,
  cartCount,
  wishlistCount = 0,
  onSearchOpen,
}: MobileNavProps) {
  return (
    <nav className="mobile-nav" aria-label="Mobile Bottom Navigation">
      {/* 1. Home */}
      <button
        className={`mobile-tab ${view === "home" ? "active" : ""}`}
        onClick={() => go("home")}
        type="button"
        aria-label="Home"
      >
        <div className="tab-icon-wrap">
          <span className="tab-monogram">A</span>
        </div>
        <span className="tab-label">Home</span>
        {view === "home" && <span className="tab-indicator" />}
      </button>

      {/* 2. Shop */}
      <button
        className={`mobile-tab ${view === "shop" ? "active" : ""}`}
        onClick={() => go("shop")}
        type="button"
        aria-label="Shop Shirts"
      >
        <div className="tab-icon-wrap">
          <Icon name="filter" size={18} />
        </div>
        <span className="tab-label">Shirts</span>
        {view === "shop" && <span className="tab-indicator" />}
      </button>

      {/* 3. Search */}
      <button
        className="mobile-tab"
        onClick={() => (onSearchOpen ? onSearchOpen() : go("shop"))}
        type="button"
        aria-label="Search Collection"
      >
        <div className="tab-icon-wrap">
          <Icon name="search" size={18} />
        </div>
        <span className="tab-label">Search</span>
      </button>

      {/* 4. Wishlist */}
      <button
        className={`mobile-tab ${view === "wishlist" ? "active" : ""}`}
        onClick={() => go("wishlist")}
        type="button"
        aria-label={`Wishlist, ${wishlistCount} items`}
      >
        <div className="tab-icon-wrap">
          <Icon name="heart" size={18} filled={wishlistCount > 0} />
          {wishlistCount > 0 && <b className="tab-badge">{wishlistCount}</b>}
        </div>
        <span className="tab-label">Wishlist</span>
        {view === "wishlist" && <span className="tab-indicator" />}
      </button>

      {/* 5. Bag */}
      <button
        className={`mobile-tab ${view === "bag" ? "active" : ""}`}
        onClick={() => go("bag")}
        type="button"
        aria-label={`Shopping Bag, ${cartCount} items`}
      >
        <div className="tab-icon-wrap">
          <Icon name="bag" size={18} />
          {cartCount > 0 && (
            <b className="tab-badge bag-tab-badge">{cartCount}</b>
          )}
        </div>
        <span className="tab-label">Bag</span>
        {view === "bag" && <span className="tab-indicator" />}
      </button>
    </nav>
  )
}

export default MobileNav
