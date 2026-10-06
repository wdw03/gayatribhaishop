import type { View } from "../../types"
import Icon from "../common/Icon"

export interface HeaderProps {
  view: View
  go: (v: View) => void
  menuOpen: boolean
  setMenuOpen: (v: boolean) => void
  setSearchOpen: (v: boolean) => void
  wishlistCount: number
  cartCount: number
}

export function Header({
  view,
  go,
  menuOpen,
  setMenuOpen,
  setSearchOpen,
  wishlistCount,
  cartCount,
}: HeaderProps) {
  const nav: [string, View][] = [
    ["Home", "home"],
    ["Shirts", "shop"],
    ["New Arrivals", "shop"],
    ["Best Sellers", "shop"],
    ["Collections", "shop"],
    ["Sale", "shop"],
  ]

  return (
    <header className="header">
      <div className="header-inner">
        <button
          className="icon-btn mobile-only"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
        <button
          className="logo"
          onClick={() => go("home")}
          aria-label="Avyr home"
        >
          <span>AVYR</span>
          <small>HANDCRAFTED SHIRTS</small>
        </button>
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          {nav.map(([label, target]) => (
            <button
              key={label}
              className={view === target ? "active" : ""}
              onClick={() => go(target)}
            >
              {label}
              {label === "Sale" && <sup>UP TO 30%</sup>}
            </button>
          ))}
          <div className="mobile-menu-foot">
            <p>Need personal styling?</p>
            <strong>Connect with our shirt specialist</strong>
          </div>
        </nav>
        <div className="header-actions">
          <button
            className="icon-btn search-text"
            onClick={() => setSearchOpen(true)}
          >
            <Icon name="search" />
            <span>Search shirts</span>
          </button>
          <button
            className="icon-btn desktop-only"
            onClick={() => go("account")}
            aria-label="Account"
          >
            <Icon name="user" />
          </button>
          <button
            className="icon-btn"
            onClick={() => go("wishlist")}
            aria-label="Wishlist"
          >
            <Icon name="heart" />
            {wishlistCount > 0 && <b>{wishlistCount}</b>}
          </button>
          <button
            className="icon-btn"
            onClick={() => go("bag")}
            aria-label="Bag"
          >
            <Icon name="bag" />
            {cartCount > 0 && <b>{cartCount}</b>}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
