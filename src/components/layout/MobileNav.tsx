import type { View } from "../../types"
import Icon from "../common/Icon"

export interface MobileNavProps {
  view: View
  go: (v: View) => void
  cartCount: number
}

export function MobileNav({ view, go, cartCount }: MobileNavProps) {
  return (
    <div className="mobile-nav">
      <button
        className={view === "home" ? "active" : ""}
        onClick={() => go("home")}
        type="button"
      >
        <span>AV</span>Home
      </button>
      <button
        className={view === "shop" ? "active" : ""}
        onClick={() => go("shop")}
        type="button"
      >
        <Icon name="search" />
        Shop
      </button>
      <button
        className={view === "wishlist" ? "active" : ""}
        onClick={() => go("wishlist")}
        type="button"
      >
        <Icon name="heart" />
        Wishlist
      </button>
      <button
        className={view === "bag" ? "active" : ""}
        onClick={() => go("bag")}
        type="button"
      >
        <span>
          <Icon name="bag" />
          {cartCount > 0 && <b>{cartCount}</b>}
        </span>
        Bag
      </button>
      <button
        className={view === "account" ? "active" : ""}
        onClick={() => go("account")}
        type="button"
      >
        <Icon name="user" />
        Account
      </button>
    </div>
  )
}

export default MobileNav
