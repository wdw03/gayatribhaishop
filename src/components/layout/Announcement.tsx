"use client"

import { useEffect, useState } from "react"
import Icon from "../common/Icon"

const ANNOUNCEMENTS = [
  {
    tag: "SHIPPING",
    text: "Complimentary Express Delivery on all orders above ₹1,999",
    highlight: "Free Shipping",
  },
  {
    tag: "HERITAGE",
    text: "Handcrafted in India · 100% Breathable Cotton & Pure French Linen",
    highlight: "Artisan Made",
  },
  {
    tag: "WELCOME",
    text: "Use code 'LUXE10' for 10% off your first order · Easy 7-Day Returns",
    highlight: "Special Offer",
  },
]

export function Announcement() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)
    }, 4200)
    return () => clearInterval(timer)
  }, [])

  const next = () => setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)
  const prev = () =>
    setIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)

  const active = ANNOUNCEMENTS[index]

  return (
    <aside className="announcement" aria-label="Store Announcements">
      {/* Left side desktop note */}
      <div className="announcement-col announcement-left desktop-only">
        <span className="announcement-pill">AVYR ATELIER</span>
        <span>A new language of Indian menswear</span>
      </div>

      {/* Center animated ticker (Mobile & Desktop) */}
      <div className="announcement-ticker">
        <button
          type="button"
          className="ticker-nav-btn mobile-only"
          onClick={prev}
          aria-label="Previous announcement"
        >
          ‹
        </button>
        <div className="ticker-content" key={index}>
          <span className="ticker-highlight">{active.highlight}</span>
          <span className="ticker-text">{active.text}</span>
        </div>
        <button
          type="button"
          className="ticker-nav-btn mobile-only"
          onClick={next}
          aria-label="Next announcement"
        >
          ›
        </button>
      </div>

      {/* Right side desktop quick actions */}
      <div className="announcement-col announcement-right desktop-only">
        <span className="announcement-link">
          <Icon name="truck" size={13} />
          <span>Track Order</span>
        </span>
        <span className="announcement-sep">·</span>
        <span className="announcement-link">
          <Icon name="refresh" size={13} />
          <span>7-Day Return</span>
        </span>
        <span className="announcement-sep">·</span>
        <span className="announcement-badge">INR (₹)</span>
      </div>
    </aside>
  )
}

export default Announcement
