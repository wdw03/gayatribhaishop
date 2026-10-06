import { useState } from "react"
import { products } from "../../products"
import type { View } from "../../types"
import { money } from "../../utils/format"
import Button from "../common/Button"
import Icon from "../common/Icon"

export interface AccountViewProps {
  go: (v: View) => void
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

export function AccountPanel({ tab }: { tab: string }) {
  return (
    <div className="account-panel">
      <h2>{tab}</h2>
      <p>
        This area is ready to connect with your customer API. Manage your{" "}
        {tab.toLowerCase()}, communication preferences, saved details and
        support requests from one place.
      </p>
      <div className="account-placeholder">
        <Icon
          name={
            tab.includes("Address")
              ? "truck"
              : tab.includes("Help")
                ? "user"
                : "shield"
          }
          size={28}
        />
        <strong>Your {tab.toLowerCase()} will appear here</strong>
        <span>All changes are securely saved to your account.</span>
      </div>
    </div>
  )
}

export function AccountView({ go }: AccountViewProps) {
  const [tab, setTab] = useState("Orders")
  const tabs = [
    "Profile",
    "Orders",
    "Track Order",
    "Wishlist",
    "Addresses",
    "Coupons",
    "Returns & Exchanges",
    "Notifications",
    "Help & Support",
  ]

  return (
    <div className="account-page">
      <aside>
        <span className="eyebrow">My AVYR</span>
        <div className="account-person">
          <div>AM</div>
          <span>
            <strong>Arjun Mehta</strong>
            <small>arjun@example.com</small>
          </span>
        </div>
        {tabs.map((x) => (
          <button
            className={tab === x ? "active" : ""}
            onClick={() => (x === "Wishlist" ? go("wishlist") : setTab(x))}
            key={x}
            type="button"
          >
            {x}
            <Icon name="arrow" size={15} />
          </button>
        ))}
        <button type="button">
          Logout <Icon name="arrow" size={15} />
        </button>
        <button
          type="button"
          className="admin-link"
          onClick={() => go("admin")}
        >
          Open admin dashboard
        </button>
      </aside>
      <section>
        <span className="eyebrow">Welcome Back</span>
        <h1>{tab === "Orders" ? "Your orders" : tab}</h1>
        {tab === "Orders" || tab === "Track Order" ? (
          <OrderTracking />
        ) : (
          <AccountPanel tab={tab} />
        )}
      </section>
    </div>
  )
}

export default AccountView
