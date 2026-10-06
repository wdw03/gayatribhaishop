import { useEffect, useState } from "react"
import { products } from "./products"
import type { CartItem, Product, View } from "./types"
import Icon from "./components/common/Icon"
import Announcement from "./components/layout/Announcement"
import Footer from "./components/layout/Footer"
import Header from "./components/layout/Header"
import MobileNav from "./components/layout/MobileNav"
import SearchOverlay from "./components/layout/SearchOverlay"
import AccountView from "./components/views/AccountView"
import AdminView from "./components/views/AdminView"
import BagView from "./components/views/BagView"
import CheckoutView from "./components/views/CheckoutView"
import HomeView from "./components/views/HomeView"
import ProductDetailView from "./components/views/ProductDetailView"
import ShopView from "./components/views/ShopView"
import WishlistView from "./components/views/WishlistView"

export function App() {
  const [view, setView] = useState<View>("home")
  const [selected, setSelected] = useState<Product>(products[0])
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("avyr-wishlist") || "[]")
    } catch {
      return []
    }
  })
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("avyr-cart") || "[]")
    } catch {
      return []
    }
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [toast, setToast] = useState("")

  useEffect(() => {
    try {
      localStorage.setItem("avyr-wishlist", JSON.stringify(wishlist))
    } catch {
      // storage unavailable
    }
  }, [wishlist])

  useEffect(() => {
    try {
      localStorage.setItem("avyr-cart", JSON.stringify(cart))
    } catch {
      // storage unavailable
    }
  }, [cart])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [view, selected])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(""), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  const go = (next: View) => {
    setView(next)
    setMenuOpen(false)
    setSearchOpen(false)
  }

  const openProduct = (product: Product) => {
    setSelected(product)
    go("product")
  }

  const toggleWish = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
    setToast(
      wishlist.includes(id)
        ? "Removed from your wishlist"
        : "Saved to your wishlist",
    )
  }

  const addToCart = (product: Product, size = "M") => {
    let chosenSize = size
    if (!product.stock[chosenSize]) {
      chosenSize =
        Object.keys(product.stock).find((s) => product.stock[s] > 0) || "M"
    }
    setCart((prev) => {
      const existing = prev.find(
        (x) => x.id === product.id && x.size === chosenSize,
      )
      return existing
        ? prev.map((x) =>
            x === existing ? { ...x, quantity: x.quantity + 1 } : x,
          )
        : [...prev, { id: product.id, size: chosenSize, quantity: 1 }]
    })
    setToast(`${product.name} added to bag`)
  }

  return (
    <div className="app">
      <Announcement />
      <Header
        view={view}
        go={go}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setSearchOpen={setSearchOpen}
        wishlistCount={wishlist.length}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />
      <main>
        {view === "home" && (
          <HomeView
            openProduct={openProduct}
            go={go}
            wishlist={wishlist}
            toggleWish={toggleWish}
            addToCart={addToCart}
          />
        )}
        {view === "shop" && (
          <ShopView
            openProduct={openProduct}
            wishlist={wishlist}
            toggleWish={toggleWish}
            addToCart={addToCart}
          />
        )}
        {view === "product" && (
          <ProductDetailView
            product={selected}
            openProduct={openProduct}
            wishlisted={wishlist.includes(selected.id)}
            toggleWish={() => toggleWish(selected.id)}
            addToCart={addToCart}
          />
        )}
        {view === "wishlist" && (
          <WishlistView
            ids={wishlist}
            openProduct={openProduct}
            onRemove={toggleWish}
            addToCart={addToCart}
            go={go}
          />
        )}
        {view === "bag" && (
          <BagView
            cart={cart}
            setCart={setCart}
            openProduct={openProduct}
            go={go}
          />
        )}
        {view === "checkout" && (
          <CheckoutView cart={cart} setCart={setCart} go={go} />
        )}
        {view === "account" && <AccountView go={go} />}
        {view === "admin" && <AdminView />}
      </main>
      {!["checkout", "admin"].includes(view) && <Footer go={go} />}
      <MobileNav view={view} go={go} cartCount={cart.length} />
      {searchOpen && (
        <SearchOverlay
          query={query}
          setQuery={setQuery}
          onClose={() => setSearchOpen(false)}
          openProduct={openProduct}
        />
      )}
      {toast && (
        <div className="toast">
          <Icon name="check" size={18} />
          {toast}
        </div>
      )}
    </div>
  )
}

export default App
