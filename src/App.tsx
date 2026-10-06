import { useEffect, useState } from "react"
import { products } from "./products"
import type { Address, CartItem, Product, User, View } from "./types"
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
import BlogView from "./components/views/BlogView"
import LoginView from "./components/views/LoginView"
import ProductDetailView from "./components/views/ProductDetailView"
import ShopView from "./components/views/ShopView"
import WishlistView from "./components/views/WishlistView"

export function App() {
  const [view, setView] = useState<View>("home")
  const [previousView, setPreviousView] = useState<View>("home")
  const [selected, setSelected] = useState<Product>(products[0])
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null)

  // User Authentication State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("avyr-user")
      if (saved) return JSON.parse(saved)
      return {
        id: "usr_1",
        name: "Arjun Mehta",
        email: "arjun@example.com",
        phone: "+91 98765 43210",
        joinedDate: "April 2026",
      }
    } catch {
      return null
    }
  })

  // User Saved Addresses State
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const saved = localStorage.getItem("avyr-addresses")
      if (saved) return JSON.parse(saved)
      return [
        {
          id: "addr_1",
          name: "Arjun Mehta",
          phone: "+91 98765 43210",
          street: "14, Sea View Apartments, Bandra West",
          area: "Near Pali Hill",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400050",
          type: "HOME",
          isDefault: true,
        },
        {
          id: "addr_2",
          name: "Arjun Mehta",
          phone: "+91 98765 43210",
          street: "Floor 4, Peninsula Business Park, Tower B",
          area: "Lower Parel",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400013",
          type: "WORK",
          isDefault: false,
        },
      ]
    } catch {
      return []
    }
  })

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
      if (user) {
        localStorage.setItem("avyr-user", JSON.stringify(user))
      } else {
        localStorage.removeItem("avyr-user")
      }
    } catch {
      // storage unavailable
    }
  }, [user])

  useEffect(() => {
    try {
      localStorage.setItem("avyr-addresses", JSON.stringify(addresses))
    } catch {
      // storage unavailable
    }
  }, [addresses])

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
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [view, selected])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(""), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  const go = (next: View) => {
    if (view !== "product") {
      setPreviousView(view)
    }
    if (next !== "blog") {
      setSelectedBlogId(null)
    }
    setView(next)
    setMenuOpen(false)
    setSearchOpen(false)
  }

  const goBackFromProduct = () => {
    setView(previousView === "product" ? "shop" : previousView)
  }

  const openProduct = (product: Product) => {
    if (view !== "product") {
      setPreviousView(view)
    }
    setSelected(product)
    setView("product")
    setMenuOpen(false)
    setSearchOpen(false)
  }

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const handleUpdateUser = (updated: User) => {
    setUser(updated)
  }

  const handleSaveAddress = (addr: Address) => {
    setAddresses((prev) => {
      let next = [...prev]
      if (addr.isDefault) {
        next = next.map((a) => ({ ...a, isDefault: false }))
      }
      const existingIdx = next.findIndex((a) => a.id === addr.id)
      if (existingIdx >= 0) {
        next[existingIdx] = addr
      } else {
        next.push(addr)
      }
      return next
    })
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => {
      const remaining = prev.filter((a) => a.id !== id)
      if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
        remaining[0].isDefault = true
      }
      return remaining
    })
  }

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    )
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
        user={user}
      />
      <main>
        {view === "home" && (
          <HomeView
            openProduct={openProduct}
            go={go}
            wishlist={wishlist}
            toggleWish={toggleWish}
            addToCart={addToCart}
            onOpenArticle={(post) => {
              setSelectedBlogId(post.id)
              go("blog")
            }}
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
            go={go}
            goBack={goBackFromProduct}
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
          <CheckoutView
            cart={cart}
            setCart={setCart}
            go={go}
            addresses={addresses}
            user={user}
          />
        )}
        {view === "login" && (
          <LoginView
            onLogin={handleLogin}
            go={go}
            showToast={(msg) => setToast(msg)}
          />
        )}
        {view === "account" && (
          <AccountView
            user={user}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            addresses={addresses}
            onSaveAddress={handleSaveAddress}
            onDeleteAddress={handleDeleteAddress}
            onSetDefaultAddress={handleSetDefaultAddress}
            go={go}
            showToast={(msg) => setToast(msg)}
          />
        )}
        {view === "blog" && (
          <BlogView
            go={go}
            openProduct={openProduct}
            addToCart={(p) => addToCart(p)}
            selectedBlogId={selectedBlogId}
            setSelectedBlogId={setSelectedBlogId}
          />
        )}
        {view === "admin" && <AdminView />}
      </main>
      {!["checkout", "admin", "login"].includes(view) && <Footer go={go} />}
      {!["product", "checkout", "login"].includes(view) && (
        <MobileNav
          view={view}
          go={go}
          cartCount={cart.reduce((n, i) => n + i.quantity, 0)}
          wishlistCount={wishlist.length}
          onSearchOpen={() => setSearchOpen(true)}
        />
      )}
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
