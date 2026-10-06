import { useEffect, useState } from "react"
import type { User, View } from "../../types"
import Icon from "../common/Icon"

export interface HeaderProps {
  view: View
  go: (v: View) => void
  menuOpen: boolean
  setMenuOpen: (v: boolean) => void
  setSearchOpen: (v: boolean) => void
  wishlistCount: number
  cartCount: number
  user?: User | null
}

interface NavItem {
  label: string
  target: View
  badge?: string
  dot?: boolean
}

export function Header({
  view,
  go,
  menuOpen,
  setMenuOpen,
  setSearchOpen,
  wishlistCount,
  cartCount,
  user,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  // Track page scroll to toggle compact glassmorphism header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Global shortcut (⌘K or Ctrl+K) to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setSearchOpen])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const navItems: NavItem[] = [
    { label: "Home", target: "home" },
    { label: "All Shirts", target: "shop" },
    { label: "New Arrivals", target: "shop", dot: true },
    { label: "Resort Edit", target: "shop" },
    { label: "Journal", target: "blog" },
    { label: "Sale", target: "shop", badge: "30% OFF" },
  ]

  const mobileCategories = [
    "Cuban Collar",
    "Hand-Embroidered",
    "Pure Linen",
    "Botanical Prints",
    "Classic Solids",
  ]

  const handleNavClick = (target: View) => {
    go(target)
    setMenuOpen(false)
  }

  return (
    <>
      <header
        className={`header ${isScrolled ? "scrolled" : ""} ${menuOpen ? "menu-active" : ""}`}
      >
        <div className="header-inner">
          {/* Mobile Hamburger Menu Toggle */}
          <button
            className="icon-btn mobile-toggle mobile-only"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className="hamburger-box">
              <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
            </span>
          </button>

          {/* Luxury Brand Logo */}
          <button
            className="logo"
            onClick={() => handleNavClick("home")}
            aria-label="AVYR Artisanal Shirts Home"
          >
            <div className="logo-spark">
              <span className="logo-mark">A</span>
              <span className="logo-diamond">◆</span>
            </div>
            <div className="logo-text-group">
              <span className="logo-title">AVYR</span>
              <small className="logo-sub">HAUTE ARTISANAL SHIRTS</small>
            </div>
          </button>

          {/* Desktop Primary Navigation */}
          <nav className="desktop-nav desktop-only" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive =
                item.target === view &&
                (item.label !== "Home" || view === "home")
              return (
                <button
                  key={item.label}
                  className={`nav-link ${isActive ? "active" : ""}`}
                  onClick={() => handleNavClick(item.target)}
                >
                  <span>{item.label}</span>
                  {item.dot && <span className="nav-dot" aria-hidden="true" />}
                  {item.badge && (
                    <span className="nav-badge" aria-label="Sale promotion">
                      {item.badge}
                    </span>
                  )}
                  <span className="nav-underline" aria-hidden="true" />
                </button>
              )
            })}
          </nav>

          {/* Actions & Utilities (Search, Account, Wishlist, Bag) */}
          <div className="header-actions">
            {/* Desktop Quick Search Pill */}
            <button
              className="search-pill desktop-only"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products (Shortcut: Command K)"
              title="Search products (⌘K)"
            >
              <Icon name="search" size={15} />
              <span className="search-placeholder">Search shirts, linen...</span>
              <kbd className="search-shortcut">⌘K</kbd>
            </button>

            {/* Mobile Search Button */}
            <button
              className="icon-btn action-icon-btn mobile-only"
              onClick={() => setSearchOpen(true)}
              aria-label="Search shirts"
            >
              <Icon name="search" size={20} />
            </button>

            {/* Account / Profile Button (Desktop & Mobile) */}
            <button
              className="icon-btn action-icon-btn account-icon-btn"
              onClick={() => handleNavClick(user ? "account" : "login")}
              aria-label={user ? `Account: ${user.name}` : "Sign In"}
              title={user ? `Account (${user.name})` : "Sign In / Register"}
            >
              {user ? (
                <span className="header-user-avatar">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
              ) : (
                <Icon name="user" size={19} />
              )}
            </button>

            {/* Wishlist Button with Live Count */}
            <button
              className="icon-btn action-icon-btn wishlist-icon-btn"
              onClick={() => handleNavClick("wishlist")}
              aria-label={`Wishlist, ${wishlistCount} items`}
              title="Wishlist"
            >
              <Icon name="heart" size={19} filled={wishlistCount > 0} />
              {wishlistCount > 0 && (
                <b className="action-badge" key={wishlistCount}>
                  {wishlistCount}
                </b>
              )}
            </button>

            {/* Shopping Bag Button with Live Count */}
            <button
              className="icon-btn action-icon-btn bag-icon-btn"
              onClick={() => handleNavClick("bag")}
              aria-label={`Shopping bag, ${cartCount} items`}
              title="Shopping Bag"
            >
              <Icon name="bag" size={19} />
              {cartCount > 0 && (
                <b className="action-badge bag-badge" key={cartCount}>
                  {cartCount}
                </b>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop Overlay */}
      <div
        className={`mobile-drawer-backdrop ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer */}
      <aside
        className={`mobile-drawer ${menuOpen ? "open" : ""}`}
        aria-label="Mobile Navigation"
        aria-hidden={!menuOpen}
      >
        <div className="mobile-drawer-header">
          <div className="drawer-brand">
            <span className="drawer-title">AVYR</span>
            <span className="drawer-subtitle">ATELIER · 2026</span>
          </div>
          <button
            className="drawer-close-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="mobile-drawer-body">
          {/* User Account / Sign In Drawer Card */}
          <div className="drawer-user-card">
            {user ? (
              <div
                className="drawer-user-logged"
                onClick={() => handleNavClick("account")}
              >
                <div className="drawer-user-avatar">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="drawer-user-meta">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                  <span className="drawer-account-link">
                    Profile & Saved Addresses →
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="drawer-guest-box"
                onClick={() => handleNavClick("login")}
              >
                <div className="drawer-guest-icon">
                  <Icon name="user" size={18} />
                </div>
                <div className="drawer-guest-meta">
                  <strong>Sign In / Register</strong>
                  <small>Manage addresses & track orders</small>
                </div>
                <Icon name="arrow" size={14} />
              </div>
            )}
          </div>

          {/* Main Navigation List */}
          <nav className="mobile-drawer-nav">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`drawer-link ${view === item.target ? "active" : ""}`}
                onClick={() => handleNavClick(item.target)}
              >
                <span className="drawer-link-text">{item.label}</span>
                {item.badge && <span className="drawer-sale-badge">{item.badge}</span>}
                <Icon name="arrow" size={15} />
              </button>
            ))}
          </nav>

          {/* Quick Categories Filter */}
          <div className="drawer-section">
            <span className="drawer-section-title">CURATED EDITS</span>
            <div className="drawer-pills">
              {mobileCategories.map((cat) => (
                <button
                  key={cat}
                  className="drawer-pill"
                  onClick={() => handleNavClick("shop")}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Support & Concierge */}
          <div className="drawer-section">
            <span className="drawer-section-title">CONCIERGE & CARE</span>
            <div className="drawer-service-list">
              <button
                className="drawer-service-item"
                onClick={() => handleNavClick("account")}
              >
                <Icon name="truck" size={16} />
                <span>Track My Order</span>
              </button>
              <button
                className="drawer-service-item"
                onClick={() => handleNavClick("wishlist")}
              >
                <Icon name="heart" size={16} />
                <span>My Wishlist ({wishlistCount})</span>
              </button>
              <button
                className="drawer-service-item"
                onClick={() => handleNavClick("account")}
              >
                <Icon name="shield" size={16} />
                <span>Size & Fit Assistant</span>
              </button>
            </div>
          </div>

          {/* Styling Specialist Banner */}
          <div className="drawer-consultation">
            <div className="consultation-icon">🌿</div>
            <div>
              <strong>Personal Styling Concierge</strong>
              <p>Connect with our master shirt craftsperson</p>
            </div>
          </div>
        </div>

        <div className="mobile-drawer-footer">
          <div className="drawer-footer-line">
            <span>Complimentary Shipping ₹1,999+</span>
            <b>INDIA (INR ₹)</b>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Header
