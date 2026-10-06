import type { View } from "../../types"

export interface FooterProps {
  go: (v: View) => void
}

export function Footer({ go }: FooterProps) {
  return (
    <footer>
      <div className="footer-brand">
        <div className="logo inverse">
          <span>AVYR</span>
          <small>HANDCRAFTED SHIRTS</small>
        </div>
        <p>
          A modern Indian shirt label celebrating patient craft, natural fabric
          and expressive detail.
        </p>
        <div className="socials">
          <button type="button" aria-label="Instagram">
            IG
          </button>
          <button type="button" aria-label="YouTube">
            YT
          </button>
          <button type="button" aria-label="Pinterest">
            PI
          </button>
        </div>
      </div>
      <div>
        <strong>Shop</strong>
        {[
          "New arrivals",
          "Best sellers",
          "Embroidered shirts",
          "Resort shirts",
          "Linen shirts",
          "Sale",
        ].map((x) => (
          <button type="button" onClick={() => go("shop")} key={x}>
            {x}
          </button>
        ))}
      </div>
      <div>
        <strong>Help</strong>
        {[
          "Contact us",
          "Shipping & delivery",
          "Returns & exchanges",
          "Size guide",
          "Track order",
          "FAQs",
        ].map((x) => (
          <button type="button" key={x}>
            {x}
          </button>
        ))}
      </div>
      <div>
        <strong>About AVYR</strong>
        {[
          "Our story",
          "The craft",
          "Journal",
          "Careers",
          "Privacy policy",
          "Terms",
        ].map((x) => (
          <button type="button" key={x}>
            {x}
          </button>
        ))}
      </div>
      <div className="footer-contact">
        <strong>Visit our atelier</strong>
        <p>Surat, Gujarat, India</p>
        <strong>Customer care</strong>
        <p>
          Mon–Sat, 10am–7pm
          <br />
          care@avyr.in
          <br />
          +91 98347 04067
        </p>
      </div>
      <div className="footer-bottom">
        <span>© 2026 AVYR. All rights reserved.</span>
        <span>Made thoughtfully in India</span>
        <span>Visa · Mastercard · UPI · Razorpay</span>
      </div>
    </footer>
  )
}

export default Footer
