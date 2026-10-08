"use client"

import React, { useEffect, useRef, useState } from "react"
import { products } from "../../products"
import type { Address, IconName, User, View } from "../../types"
import { money } from "../../utils/format"
import Button from "../common/Button"
import Icon from "../common/Icon"
import Modal from "../common/Modal"

export interface AccountViewProps {
  user: User | null
  onUpdateUser: (updated: User) => void
  onLogout: () => void
  addresses: Address[]
  onSaveAddress: (addr: Address) => void
  onDeleteAddress: (id: string) => void
  onSetDefaultAddress: (id: string) => void
  go: (v: View) => void
  showToast: (msg: string) => void
}

export function OrderTracking() {
  const stages = [
    "Order Placed",
    "Payment Confirmed",
    "Order Confirmed",
    "Processing",
    "Packed",
    "Shipped",
    "In Transit",
    "Out for Delivery",
    "Delivered",
  ]

  return (
    <article className="order-detail">
      <div className="order-top">
        <span>
          <small>ORDER #AVY260102</small>
          <strong>Placed 21 April 2026</strong>
        </span>
        <b>In transit</b>
      </div>
      <div className="ordered-product">
        <img src={products[3].images[0]} alt={products[3].name} />
        <span>
          <strong>{products[3].name}</strong>
          <small>Off White · M · Qty 1</small>
          <b>{money(products[3].price)}</b>
        </span>
        <Button variant="outline">View details</Button>
      </div>
      <div className="tracking-head">
        <span>
          <small>Expected delivery</small>
          <strong>Tuesday, 28 April</strong>
        </span>
        <span>
          <small>Courier partner</small>
          <strong>BlueDart · AWB 774921063</strong>
        </span>
        <Button variant="text">
          Track shipment <Icon name="arrow" />
        </Button>
      </div>
      <div className="timeline">
        {stages.map((x, i) => (
          <div className={i <= 6 ? "done" : ""} key={x}>
            <i>{i <= 6 && <Icon name="check" size={11} />}</i>
            <span>
              <strong>{x}</strong>
              {i <= 6 && (
                <small>
                  {i === 6
                    ? "Today, 09:42 AM"
                    : `${21 + Math.floor(i / 2)} April`}
                </small>
              )}
            </span>
          </div>
        ))}
      </div>
      <div className="support-line">
        <span>Need help with this order?</span>
        <Button variant="outline">Contact support</Button>
        <Button variant="outline">Request return / exchange</Button>
      </div>
    </article>
  )
}

export function AccountView({
  user,
  onUpdateUser,
  onLogout,
  addresses,
  onSaveAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  go,
  showToast,
}: AccountViewProps) {
  const [tab, setTab] = useState<string>("Profile")

  // Edit Profile Modal State
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [profileName, setProfileName] = useState(user?.name || "")
  const [profilePhone, setProfilePhone] = useState(user?.phone || "")
  const [profileEmail, setProfileEmail] = useState(user?.email || "")

  // Address Modal State (Add or Edit)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addrName, setAddrName] = useState("")
  const [addrPhone, setAddrPhone] = useState("")
  const [addrStreet, setAddrStreet] = useState("")
  const [addrArea, setAddrArea] = useState("")
  const [addrCity, setAddrCity] = useState("")
  const [addrState, setAddrState] = useState("Maharashtra")
  const [addrPincode, setAddrPincode] = useState("")
  const [addrType, setAddrType] = useState<"HOME" | "WORK" | "OTHER">("HOME")
  const [addrIsDefault, setAddrIsDefault] = useState(false)
  const [addrError, setAddrError] = useState("")

  const tabs = [
    "Profile",
    "Addresses",
    "Orders",
    "Track Order",
    "Wishlist",
    "Coupons",
    "Help & Support",
  ]

  const tabIcons: Record<string, IconName> = {
    Profile: "user",
    Addresses: "map-pin",
    Orders: "bag",
    "Track Order": "truck",
    Wishlist: "heart",
    Coupons: "star",
    "Help & Support": "shield",
  }

  const tabsScrollRef = useRef<HTMLDivElement>(null)
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState(false)
  const [canScrollTabsRight, setCanScrollTabsRight] = useState(true)

  const checkTabsScroll = () => {
    const el = tabsScrollRef.current
    if (!el) return
    setCanScrollTabsLeft(el.scrollLeft > 10)
    setCanScrollTabsRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10)
  }

  useEffect(() => {
    const el = tabsScrollRef.current
    if (!el) return
    checkTabsScroll()
    el.addEventListener("scroll", checkTabsScroll, { passive: true })
    window.addEventListener("resize", checkTabsScroll)
    return () => {
      el.removeEventListener("scroll", checkTabsScroll)
      window.removeEventListener("resize", checkTabsScroll)
    }
  }, [])

  useEffect(() => {
    const activeEl = tabsScrollRef.current?.querySelector(
      ".account-nav-btn.active",
    ) as HTMLElement | null
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      })
    }
  }, [tab])

  // If user is not logged in, show an inviting login prompt
  if (!user) {
    return (
      <div className="account-page guest-view">
        <div className="guest-account-card">
          <div className="guest-icon-wrap">
            <Icon name="user" size={32} />
          </div>
          <span className="eyebrow">Atelier Client Privilege</span>
          <h2>Sign In to View Your Account</h2>
          <p>
            Sign in with your email to view your personalized profile, saved
            delivery addresses, order history, and artisanal wishlist.
          </p>
          <div className="guest-actions">
            <Button onClick={() => go("login")}>
              Sign In with Email <Icon name="arrow" size={16} />
            </Button>
            <Button variant="outline" onClick={() => go("shop")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Handle Profile Edit submission
  const handleOpenEditProfile = () => {
    setProfileName(user.name)
    setProfilePhone(user.phone)
    setProfileEmail(user.email)
    setEditProfileOpen(true)
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileName.trim()) {
      showToast("Name cannot be empty")
      return
    }
    const updated: User = {
      ...user,
      name: profileName.trim(),
      phone: profilePhone.trim(),
      email: profileEmail.trim(),
    }
    onUpdateUser(updated)
    setEditProfileOpen(false)
    showToast("Profile updated successfully!")
  }

  // Handle Opening Address Form for Add or Edit
  const handleOpenAddAddress = () => {
    setEditingAddressId(null)
    setAddrName(user.name)
    setAddrPhone(user.phone.replace(/[^\d+]/g, ""))
    setAddrStreet("")
    setAddrArea("")
    setAddrCity("Mumbai")
    setAddrState("Maharashtra")
    setAddrPincode("")
    setAddrType("HOME")
    setAddrIsDefault(addresses.length === 0)
    setAddrError("")
    setAddressModalOpen(true)
  }

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id)
    setAddrName(addr.name)
    setAddrPhone(addr.phone)
    setAddrStreet(addr.street)
    setAddrArea(addr.area || "")
    setAddrCity(addr.city)
    setAddrState(addr.state)
    setAddrPincode(addr.pincode)
    setAddrType(addr.type)
    setAddrIsDefault(Boolean(addr.isDefault))
    setAddrError("")
    setAddressModalOpen(true)
  }

  const handleSaveAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAddrError("")

    if (!addrName.trim()) {
      setAddrError("Please enter recipient name.")
      return
    }
    if (!addrPhone.trim() || addrPhone.replace(/\D/g, "").length < 10) {
      setAddrError("Please enter a valid 10-digit phone number.")
      return
    }
    if (!addrStreet.trim()) {
      setAddrError("Please enter house/flat/street details.")
      return
    }
    if (!addrCity.trim()) {
      setAddrError("Please enter city.")
      return
    }
    if (!addrPincode.trim() || addrPincode.replace(/\D/g, "").length !== 6) {
      setAddrError("Please enter a valid 6-digit PIN code.")
      return
    }

    const savedAddr: Address = {
      id: editingAddressId || "addr_" + Date.now().toString(36),
      name: addrName.trim(),
      phone: addrPhone.trim(),
      street: addrStreet.trim(),
      area: addrArea.trim(),
      city: addrCity.trim(),
      state: addrState.trim(),
      pincode: addrPincode.trim(),
      type: addrType,
      isDefault: addrIsDefault || addresses.length === 0,
    }

    onSaveAddress(savedAddr)
    setAddressModalOpen(false)
    showToast(
      editingAddressId
        ? "Address updated successfully!"
        : "New address added successfully!",
    )
  }

  // Get User Initials for Monogram Avatar
  const initials =
    user.name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AV"

  return (
    <div className="account-page">
      {/* Sidebar Navigation */}
      <aside className="account-sidebar">
        <span className="eyebrow">Client Atelier</span>

        {/* User Card */}
        <div className="account-person">
          <div className="user-avatar-monogram">{initials}</div>
          <div className="user-info-text">
            <div className="user-name-title-row">
              <strong>{user.name}</strong>
              <span className="user-verified-badge">
                <Icon name="check" size={10} /> Verified
              </span>
            </div>
            <small>{user.email}</small>
            {user.phone && (
              <small className="user-phone-line">{user.phone}</small>
            )}
            <span className="member-tier">Patron Member</span>
          </div>
          <button
            type="button"
            className="account-edit-profile-pill"
            onClick={handleOpenEditProfile}
            aria-label="Edit Profile"
          >
            <Icon name="edit" size={13} />
            <span>Edit</span>
          </button>
        </div>

        {/* Quick Shortcut Stats Strip (Immediate clarity on mobile & desktop) */}
        <div className="account-mobile-stats-row">
          <button
            type="button"
            className="mobile-stat-box"
            onClick={() => setTab("Orders")}
          >
            <span className="stat-box-val">1</span>
            <span className="stat-box-name">Active Order</span>
            <small className="stat-box-sub">In transit →</small>
          </button>
          <button
            type="button"
            className="mobile-stat-box"
            onClick={() => setTab("Addresses")}
          >
            <span className="stat-box-val">{addresses.length}</span>
            <span className="stat-box-name">Addresses</span>
            <small className="stat-box-sub">Manage →</small>
          </button>
          <div className="mobile-stat-box">
            <span className="stat-box-val gold-val">1,450</span>
            <span className="stat-box-name">Craft Points</span>
            <small className="stat-box-sub">Worth ₹1,450</small>
          </div>
        </div>

        {/* Tab Buttons (Scrollable Horizontal Pill Bar on Mobile) */}
        <div className="account-tabs-container">
          <div className="account-tabs-header-bar mobile-only">
            <span className="account-tabs-label">Account Menu</span>
            <span className="account-tabs-hint">
              Swipe tabs <Icon name="arrow" size={10} />
            </span>
          </div>

          <div className="account-tabs-scroll-track-wrap">
            {canScrollTabsLeft && (
              <div className="tabs-fade-left" aria-hidden="true" />
            )}
            <nav
              className="account-nav-list"
              ref={tabsScrollRef}
              aria-label="Account Tabs"
            >
              {tabs.map((x) => (
                <button
                  className={`account-nav-btn ${tab === x ? "active" : ""}`}
                  onClick={() => {
                    if (x === "Wishlist") {
                      go("wishlist")
                    } else {
                      setTab(x)
                    }
                  }}
                  key={x}
                  type="button"
                >
                  {tabIcons[x] && (
                    <Icon
                      name={tabIcons[x]}
                      size={13}
                      className="tab-btn-icon"
                    />
                  )}
                  <span>{x}</span>
                  {x === "Addresses" && (
                    <b className="tab-pill-count">{addresses.length}</b>
                  )}
                  <Icon name="arrow" size={14} className="desktop-arrow" />
                </button>
              ))}
            </nav>
            {canScrollTabsRight && (
              <div className="tabs-fade-right" aria-hidden="true" />
            )}
          </div>
        </div>

        {/* Logout & Admin Action Buttons */}
        <div className="account-sidebar-actions">
          <button
            type="button"
            className="account-logout-btn"
            onClick={() => {
              onLogout()
              showToast("You have been signed out.")
            }}
          >
            <Icon name="arrow" size={14} />
            <span>Sign Out</span>
          </button>
          <button
            type="button"
            className="admin-link-btn"
            onClick={() => go("admin")}
          >
            <span>Atelier Inventory Dashboard</span>
            <Icon name="arrow" size={13} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="account-content-pane">
        {/* TAB 1: PROFILE MANAGEMENT */}
        {tab === "Profile" && (
          <div className="profile-section">
            {/* Luxury Atelier Cover Banner */}
            <div className="profile-cover-banner">
              <div className="cover-badge-tag">
                <Icon name="sparkles" size={13} />
                <span>AVYR CLUB PRIVÉ · VIP ATELIER</span>
              </div>
              <div className="cover-title-group">
                <h2>
                  Welcome to your Private Atelier, {user.name.split(" ")[0]}
                </h2>
                <p>
                  Generational bespoke tailoring, priority order dispatch, and
                  private drop access.
                </p>
              </div>
              <div className="cover-perks-strip">
                <span className="perk-pill">
                  <Icon name="award" size={13} /> Gold Artisan Tier
                </span>
                <span className="perk-pill">
                  <Icon name="truck" size={13} /> Complimentary 48h Express
                  Shipping
                </span>
                <span className="perk-pill">
                  <Icon name="shield" size={13} /> 100% Craft Guarantee
                </span>
              </div>
            </div>

            {/* Quick Stat Counter Cards */}
            <div className="profile-stats-strip">
              <div
                className="profile-stat-box"
                onClick={() => setTab("Orders")}
              >
                <span className="stat-label">Active Orders</span>
                <strong className="stat-value">1</strong>
                <small className="stat-hint">
                  Order #AVY260102 · In transit →
                </small>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">Craft Points</span>
                <strong className="stat-value gold-text">1,450</strong>
                <small className="stat-hint">Worth ₹1,450 on next order</small>
              </div>
              <div
                className="profile-stat-box"
                onClick={() => setTab("Addresses")}
              >
                <span className="stat-label">Saved Addresses</span>
                <strong className="stat-value">{addresses.length}</strong>
                <small className="stat-hint">Manage 1-click delivery →</small>
              </div>
              <div className="profile-stat-box" onClick={() => go("wishlist")}>
                <span className="stat-label">Wishlist</span>
                <strong className="stat-value">Saved</strong>
                <small className="stat-hint">View saved shirts →</small>
              </div>
            </div>

            <div className="pane-header">
              <div>
                <span className="eyebrow">Personal Information</span>
                <h1>My Profile</h1>
              </div>
              <Button
                variant="outline"
                className="edit-profile-trigger"
                onClick={handleOpenEditProfile}
              >
                <Icon name="edit" size={15} /> Edit Profile
              </Button>
            </div>

            {/* Profile Overview Card */}
            <div className="profile-overview-card">
              <div className="profile-avatar-banner">
                <div className="large-monogram">{initials}</div>
                <div className="profile-headline">
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                  <span className="account-active-badge">
                    <Icon name="check" size={12} /> Verified Atelier Member
                  </span>
                </div>
              </div>

              <div className="profile-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Full Name</span>
                  <strong className="detail-value">{user.name}</strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email Address</span>
                  <strong className="detail-value">{user.email}</strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone Number</span>
                  <strong className="detail-value">
                    {user.phone || "Not provided"}
                  </strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Client Since</span>
                  <strong className="detail-value">
                    {user.joinedDate || "April 2026"}
                  </strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Default Shipping</span>
                  <strong className="detail-value">
                    {addresses.find((a) => a.isDefault)?.city
                      ? `${addresses.find((a) => a.isDefault)?.city}, India`
                      : "No default address set"}
                  </strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Account Security</span>
                  <strong className="detail-value security-safe">
                    <Icon name="shield" size={14} /> Password Protected
                  </strong>
                </div>
              </div>
            </div>

            {/* Quick Addresses Snapshot */}
            <div className="profile-sub-section">
              <div className="sub-section-head">
                <div>
                  <h3>Saved Delivery Addresses</h3>
                  <p>Addresses used during checkout for 1-click delivery.</p>
                </div>
                <Button variant="outline" onClick={() => setTab("Addresses")}>
                  Manage All Addresses ({addresses.length})
                </Button>
              </div>

              <div className="address-quick-grid">
                {addresses.slice(0, 2).map((addr) => (
                  <div
                    key={addr.id}
                    className={`address-mini-card ${
                      addr.isDefault ? "default" : ""
                    }`}
                  >
                    <div className="addr-mini-top">
                      <span className="addr-type-pill">{addr.type}</span>
                      {addr.isDefault && (
                        <span className="default-badge">DEFAULT</span>
                      )}
                    </div>
                    <strong>{addr.name}</strong>
                    <p>
                      {addr.street}
                      {addr.area ? `, ${addr.area}` : ""}, {addr.city},{" "}
                      {addr.state} - {addr.pincode}
                    </p>
                    <small>{addr.phone}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADDRESS MANAGEMENT (SET, ADD, EDIT, DELETE) */}
        {tab === "Addresses" && (
          <div className="addresses-section">
            <div className="pane-header">
              <div>
                <span className="eyebrow">Delivery & Shipping</span>
                <h1>Saved Addresses</h1>
                <p className="pane-sub">
                  Manage your delivery destinations for bespoke tailor
                  deliveries.
                </p>
              </div>
              <Button onClick={handleOpenAddAddress}>
                <Icon name="plus" size={15} /> Add New Address
              </Button>
            </div>

            {addresses.length === 0 ? (
              <div className="empty-address-state">
                <Icon name="map-pin" size={38} />
                <h3>No addresses saved yet</h3>
                <p>
                  Add your home or work address for seamless, one-click
                  checkout.
                </p>
                <Button onClick={handleOpenAddAddress}>
                  <Icon name="plus" size={15} /> Add First Address
                </Button>
              </div>
            ) : (
              <div className="addresses-grid">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`address-card-detailed ${
                      addr.isDefault ? "is-default" : ""
                    }`}
                  >
                    <div className="addr-header">
                      <div className="addr-tags">
                        <span className="addr-type-tag">
                          {addr.type === "HOME"
                            ? "🏠 HOME"
                            : addr.type === "WORK"
                              ? "🏢 WORK"
                              : "📍 OTHER"}
                        </span>
                        {addr.isDefault && (
                          <span className="default-tag">
                            <Icon name="check" size={11} /> DEFAULT ADDRESS
                          </span>
                        )}
                      </div>
                      <div className="addr-quick-actions">
                        <button
                          type="button"
                          className="addr-action-icon edit"
                          onClick={() => handleOpenEditAddress(addr)}
                          title="Edit Address"
                          aria-label="Edit address"
                        >
                          <Icon name="edit" size={15} />
                        </button>
                        <button
                          type="button"
                          className="addr-action-icon delete"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete address for "${addr.name}"?`,
                              )
                            ) {
                              onDeleteAddress(addr.id)
                              showToast("Address deleted.")
                            }
                          }}
                          title="Delete Address"
                          aria-label="Delete address"
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="addr-body">
                      <h4 className="addr-recipient">{addr.name}</h4>
                      <p className="addr-lines">
                        {addr.street}
                        {addr.area && (
                          <>
                            <br />
                            {addr.area}
                          </>
                        )}
                        <br />
                        {addr.city}, {addr.state} -{" "}
                        <strong>{addr.pincode}</strong>
                      </p>
                      <div className="addr-phone">
                        <Icon name="phone" size={13} />
                        <span>{addr.phone}</span>
                      </div>
                    </div>

                    <div className="addr-footer">
                      {!addr.isDefault ? (
                        <button
                          type="button"
                          className="make-default-btn"
                          onClick={() => {
                            onSetDefaultAddress(addr.id)
                            showToast("Set as default delivery address!")
                          }}
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="default-indicator-text">
                          Primary Delivery Destination
                        </span>
                      )}
                      <Button
                        variant="outline"
                        className="edit-addr-btn"
                        onClick={() => handleOpenEditAddress(addr)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {(tab === "Orders" || tab === "Track Order") && (
          <div className="orders-section">
            <div className="pane-header">
              <div>
                <span className="eyebrow">Bespoke Orders</span>
                <h1>Your Orders</h1>
              </div>
            </div>
            <OrderTracking />
          </div>
        )}

        {/* OTHER TABS (Coupons, Help) */}
        {!["Profile", "Addresses", "Orders", "Track Order"].includes(tab) && (
          <div className="generic-tab-section">
            <div className="pane-header">
              <div>
                <span className="eyebrow">Atelier Service</span>
                <h1>{tab}</h1>
              </div>
            </div>
            <div className="concierge-card">
              <Icon name="shield" size={32} />
              <h3>Concierge Assistance</h3>
              <p>
                Our personal tailoring specialists are available 24/7 for
                bespoke sizing adjustments, private consultations, and return
                dispatches.
              </p>
              <Button
                onClick={() =>
                  showToast("A specialist will contact you shortly!")
                }
              >
                Request Concierge Call
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* 1. EDIT PROFILE MODAL */}
      {editProfileOpen && (
        <Modal onClose={() => setEditProfileOpen(false)}>
          <div className="modal-head">
            <span className="eyebrow">Client Settings</span>
            <h2>Edit Personal Profile</h2>
            <p>Update your display name and contact preferences.</p>
          </div>

          <form onSubmit={handleSaveProfile} className="modal-form">
            <div className="form-group">
              <label htmlFor="edit-name">
                <span>Full Name</span>
                <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <Icon name="user" size={16} />
                </span>
                <input
                  id="edit-name"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-email">
                <span>Email Address</span>
                <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <Icon name="mail" size={16} />
                </span>
                <input
                  id="edit-email"
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-phone">
                <span>Mobile Phone</span>
                <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <Icon name="phone" size={16} />
                </span>
                <input
                  id="edit-phone"
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>

            <div className="modal-actions">
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditProfileOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 2. ADD / EDIT ADDRESS MODAL */}
      {addressModalOpen && (
        <Modal onClose={() => setAddressModalOpen(false)}>
          <div className="modal-head">
            <span className="eyebrow">Delivery Destination</span>
            <h2>{editingAddressId ? "Edit Address" : "Add New Address"}</h2>
            <p>Enter exact shipping coordinates for swift dispatch.</p>
          </div>

          {addrError && (
            <div className="modal-error-alert" role="alert">
              <Icon name="close" size={13} />
              <span>{addrError}</span>
            </div>
          )}

          <form onSubmit={handleSaveAddressSubmit} className="modal-form">
            {/* Address Type Selector Pills */}
            <div className="address-type-selector">
              <label className="type-label">Address Type</label>
              <div className="type-pills-row">
                {(["HOME", "WORK", "OTHER"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`type-pill-btn ${
                      addrType === t ? "active" : ""
                    }`}
                    onClick={() => setAddrType(t)}
                  >
                    {t === "HOME"
                      ? "🏠 Home"
                      : t === "WORK"
                        ? "🏢 Work / Office"
                        : "📍 Other"}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="addr-name">
                  <span>Contact Name</span>
                  <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <input
                    id="addr-name"
                    type="text"
                    value={addrName}
                    onChange={(e) => setAddrName(e.target.value)}
                    placeholder="e.g. Arjun Mehta"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addr-phone">
                  <span>10-Digit Mobile Number</span>
                  <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <input
                    id="addr-phone"
                    type="tel"
                    value={addrPhone}
                    onChange={(e) =>
                      setAddrPhone(e.target.value.replace(/[^\d+]/g, ""))
                    }
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="addr-street">
                <span>House / Flat No., Apartment / Building Name</span>
                <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <input
                  id="addr-street"
                  type="text"
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  placeholder="e.g. Flat 402, Royal Palms Apartments"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="addr-area">
                <span>Street / Area / Landmark</span>
              </label>
              <div className="input-wrap">
                <input
                  id="addr-area"
                  type="text"
                  value={addrArea}
                  onChange={(e) => setAddrArea(e.target.value)}
                  placeholder="e.g. Opposite Oberoi Mall, Goregaon East"
                />
              </div>
            </div>

            <div className="form-row-three">
              <div className="form-group">
                <label htmlFor="addr-city">
                  <span>City / Town</span>
                  <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <input
                    id="addr-city"
                    type="text"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    placeholder="Mumbai"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addr-state">
                  <span>State</span>
                  <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <select
                    id="addr-state"
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Other">Other State</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addr-pincode">
                  <span>PIN Code</span>
                  <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <input
                    id="addr-pincode"
                    type="text"
                    maxLength={6}
                    value={addrPincode}
                    onChange={(e) =>
                      setAddrPincode(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    placeholder="400050"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                />
                <span>Set as my default delivery destination</span>
              </label>
            </div>

            <div className="modal-actions">
              <Button
                variant="outline"
                type="button"
                onClick={() => setAddressModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingAddressId ? "Update Address" : "Save Delivery Address"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default AccountView
