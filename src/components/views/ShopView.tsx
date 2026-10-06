import { useMemo, useState } from "react"
import { products } from "../../products"
import { allSizes, categories, type Product } from "../../types"
import Button from "../common/Button"
import Empty from "../common/Empty"
import Icon from "../common/Icon"
import ProductCard from "../product/ProductCard"
import FilterGroup from "./FilterGroup"

export interface ShopViewProps {
  openProduct: (p: Product) => void
  wishlist: string[]
  toggleWish: (id: string) => void
  addToCart: (p: Product) => void
}

interface ColorOption {
  name: string
  label: string
  hex: string
}

const COLOR_OPTIONS: ColorOption[] = [
  { name: "White", label: "White & Ivory", hex: "#fcfbf7" },
  { name: "Blue", label: "Sky & Sea Blue", hex: "#7eb8da" },
  { name: "Green", label: "Mint & Sea Green", hex: "#7fb79e" },
  { name: "Rust", label: "Rust & Terracotta", hex: "#b85d34" },
  { name: "Pink", label: "Salmon & Rose", hex: "#e8a598" },
  { name: "Red", label: "True Red", hex: "#b33939" },
  { name: "Maroon", label: "Maroon & Berry", hex: "#7b1126" },
  { name: "Brown", label: "Earth Brown", hex: "#8a5c38" },
]

export function ShopView({
  openProduct,
  wishlist,
  toggleWish,
  addToCart,
}: ShopViewProps) {
  // Filter states
  const [sort, setSort] = useState("Recommended")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [category, setCategory] = useState("All Shirts")
  const [size, setSize] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedFit, setSelectedFit] = useState("")
  const [selectedSleeve, setSelectedSleeve] = useState("")
  const [selectedCollar, setSelectedCollar] = useState("")
  const [selectedPattern, setSelectedPattern] = useState("")
  const [selectedFabric, setSelectedFabric] = useState("")
  const [selectedOccasion, setSelectedOccasion] = useState("")
  const [minDiscount, setMinDiscount] = useState<number>(0)
  const [minRating, setMinRating] = useState<number>(0)
  const [availability, setAvailability] = useState("")
  const [visible, setVisible] = useState(12)

  // Toggle color filter
  const toggleColor = (c: string) => {
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    )
  }

  // Clear all filters
  const clearAllFilters = () => {
    setCategory("All Shirts")
    setSize("")
    setPriceRange("")
    setSelectedColors([])
    setSelectedFit("")
    setSelectedSleeve("")
    setSelectedCollar("")
    setSelectedPattern("")
    setSelectedFabric("")
    setSelectedOccasion("")
    setMinDiscount(0)
    setMinRating(0)
    setAvailability("")
    setVisible(12)
  }

  // Check if any filter is active
  const hasActiveFilters =
    category !== "All Shirts" ||
    Boolean(size) ||
    Boolean(priceRange) ||
    selectedColors.length > 0 ||
    Boolean(selectedFit) ||
    Boolean(selectedSleeve) ||
    Boolean(selectedCollar) ||
    Boolean(selectedPattern) ||
    Boolean(selectedFabric) ||
    Boolean(selectedOccasion) ||
    minDiscount > 0 ||
    minRating > 0 ||
    Boolean(availability)

  // Count active filters
  const activeFilterCount =
    (category !== "All Shirts" ? 1 : 0) +
    (size ? 1 : 0) +
    (priceRange ? 1 : 0) +
    selectedColors.length +
    (selectedFit ? 1 : 0) +
    (selectedSleeve ? 1 : 0) +
    (selectedCollar ? 1 : 0) +
    (selectedPattern ? 1 : 0) +
    (selectedFabric ? 1 : 0) +
    (selectedOccasion ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (availability ? 1 : 0)

  // Filtered and sorted product list
  const list = useMemo(() => {
    let result = [...products]

    // 1. Category
    if (category !== "All Shirts") {
      result = result.filter((p) =>
        category === "Linen"
          ? p.fabric.toLowerCase().includes("linen")
          : p.category.toLowerCase().includes(category.toLowerCase()) ||
            p.name.toLowerCase().includes(category.toLowerCase()),
      )
    }

    // 2. Size
    if (size) {
      result = result.filter((p) => p.stock[size] && p.stock[size] > 0)
    }

    // 3. Price
    if (priceRange === "under1500") {
      result = result.filter((p) => p.price < 1500)
    } else if (priceRange === "1500-2000") {
      result = result.filter((p) => p.price >= 1500 && p.price <= 2000)
    } else if (priceRange === "2000-2500") {
      result = result.filter((p) => p.price > 2000 && p.price <= 2500)
    } else if (priceRange === "above2500") {
      result = result.filter((p) => p.price > 2500)
    }

    // 4. Color
    if (selectedColors.length > 0) {
      result = result.filter((p) => {
        const pColor = p.color.toLowerCase()
        return selectedColors.some((c) => pColor.includes(c.toLowerCase()))
      })
    }

    // 5. Fit
    if (selectedFit === "relaxed") {
      result = result.filter(
        (p) =>
          p.description.toLowerCase().includes("relaxed") ||
          p.occasion.toLowerCase().includes("relaxed"),
      )
    } else if (selectedFit === "regular") {
      result = result.filter(
        (p) =>
          !p.description.toLowerCase().includes("relaxed") ||
          p.category === "Contemporary",
      )
    }

    // 6. Sleeve
    if (selectedSleeve === "half") {
      result = result.filter(
        (p) =>
          p.category === "BeachSide" ||
          p.description.toLowerCase().includes("breezy") ||
          p.price <= 2399,
      )
    } else if (selectedSleeve === "full") {
      result = result.filter(
        (p) => p.category === "Contemporary" || p.price > 2399,
      )
    }

    // 7. Collar
    if (selectedCollar === "cuban") {
      result = result.filter(
        (p) =>
          p.category === "BeachSide" ||
          p.name.toLowerCase().includes("beach") ||
          p.name.toLowerCase().includes("havana"),
      )
    } else if (selectedCollar === "classic") {
      result = result.filter((p) => p.category !== "BeachSide")
    }

    // 8. Pattern
    if (selectedPattern === "embroidered") {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes("embroidered") ||
          p.description.toLowerCase().includes("embroidery"),
      )
    } else if (selectedPattern === "handcrafted") {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes("handcrafted") ||
          p.name.toLowerCase().includes("artisan"),
      )
    } else if (selectedPattern === "botanical") {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes("leaf") ||
          p.name.toLowerCase().includes("tree") ||
          p.name.toLowerCase().includes("leaves") ||
          p.category === "Nature",
      )
    }

    // 9. Fabric
    if (selectedFabric === "linen-blend") {
      result = result.filter((p) => p.fabric.toLowerCase().includes("linen"))
    } else if (selectedFabric === "cotton") {
      result = result.filter((p) => p.fabric.toLowerCase().includes("cotton"))
    }

    // 10. Occasion
    if (selectedOccasion === "beach") {
      result = result.filter(
        (p) =>
          p.category === "BeachSide" ||
          p.occasion.toLowerCase().includes("beach") ||
          p.occasion.toLowerCase().includes("vacation"),
      )
    } else if (selectedOccasion === "casual") {
      result = result.filter(
        (p) =>
          p.category === "Contemporary" ||
          p.occasion.toLowerCase().includes("casual"),
      )
    } else if (selectedOccasion === "evening") {
      result = result.filter(
        (p) =>
          p.occasion.toLowerCase().includes("evening") || p.badge === "Limited",
      )
    }

    // 11. Discount
    if (minDiscount > 0) {
      result = result.filter((p) => p.discount >= minDiscount)
    }

    // 12. Rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating)
    }

    // 13. Availability & Badges
    if (availability === "instock") {
      result = result.filter((p) => Object.values(p.stock).some((s) => s > 0))
    } else if (availability === "new") {
      result = result.filter((p) => p.badge.toLowerCase() === "new")
    } else if (availability === "bestseller") {
      result = result.filter((p) => p.badge.toLowerCase() === "bestseller")
    } else if (availability === "limited") {
      result = result.filter((p) => p.badge.toLowerCase() === "limited")
    }

    // Sorting
    if (sort === "Price: Low to High") result.sort((a, b) => a.price - b.price)
    if (sort === "Price: High to Low") result.sort((a, b) => b.price - a.price)
    if (sort === "Customer Rating") result.sort((a, b) => b.rating - a.rating)
    if (sort === "Discount") result.sort((a, b) => b.discount - a.discount)
    if (sort === "Newest") {
      result.sort(
        (a, b) => (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0),
      )
    }

    return result
  }, [
    category,
    size,
    priceRange,
    selectedColors,
    selectedFit,
    selectedSleeve,
    selectedCollar,
    selectedPattern,
    selectedFabric,
    selectedOccasion,
    minDiscount,
    minRating,
    availability,
    sort,
  ])

  return (
    <div className="shop-page">
      {/* Shop Hero Banner */}
      <div className="shop-hero">
        <span className="eyebrow">The Shirt Collection</span>
        <h1>{"Men's Shirts"}</h1>
        <p>
          Distinctive shirts, naturally made. Explore hand embroidery, relaxed
          resort silhouettes and contemporary classics.
        </p>
        <div className="category-pills">
          {[
            "All Shirts",
            "Contemporary",
            "BeachSide",
            "Nature",
            "Floral",
            "Linen",
          ].map((c) => (
            <button
              className={category === c ? "active" : ""}
              key={c}
              onClick={() => setCategory(c)}
              type="button"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Bar with count and sorting */}
      <div className="catalog-bar">
        <div className="catalog-count-wrap">
          <span>
            Showing <strong>{list.length}</strong> of {products.length} shirts
          </span>
          {hasActiveFilters && (
            <span className="active-filter-indicator">
              ({activeFilterCount} active)
            </span>
          )}
        </div>

        <div className="catalog-actions-wrap">
          <Button
            variant="outline"
            className="filter-toggle"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Icon name="filter" /> Filters
            {activeFilterCount > 0 && <b>{activeFilterCount}</b>}
          </Button>

          <label className="sort-label">
            Sort by:{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {[
                "Recommended",
                "Newest",
                "Customer Rating",
                "Price: Low to High",
                "Price: High to Low",
                "Discount",
              ].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Main Catalog Layout with Sticky Filters Sidebar */}
      <div className="catalog-layout">
        {/* Semi-transparent Half-Screen Backdrop for Side Drawer */}
        <div
          className={`filter-backdrop ${filtersOpen ? "open" : ""}`}
          onClick={() => setFiltersOpen(false)}
          aria-hidden="true"
        />

        {/* Half-Screen Side Filter Drawer */}
        <aside className={`filters ${filtersOpen ? "open" : ""}`}>
          {/* Sidebar Top Header with Reset All */}
          <div className="filters-sidebar-header">
            <div className="filter-title-box">
              <Icon name="filter" size={17} />
              <strong>Filters</strong>
              {activeFilterCount > 0 && (
                <span className="filter-badge-number">{activeFilterCount}</span>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="clear-all-link"
                onClick={clearAllFilters}
              >
                Reset all
              </button>
            )}

            {/* Mobile Close Button */}
            <button
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
              type="button"
              className="filter-mobile-close"
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          {/* 1. Category Filter */}
          <FilterGroup
            title="Category"
            activeCount={category !== "All Shirts" ? 1 : 0}
          >
            <div className="filter-checkbox-list">
              {["All Shirts", ...categories].map((x) => {
                const isSelected = category === x
                const count =
                  x === "All Shirts"
                    ? products.length
                    : x === "Linen"
                      ? products.filter((p) =>
                          p.fabric.toLowerCase().includes("linen"),
                        ).length
                      : products.filter(
                          (p) =>
                            p.category
                              .toLowerCase()
                              .includes(x.toLowerCase()) ||
                            p.name.toLowerCase().includes(x.toLowerCase()),
                        ).length

                return (
                  <label
                    key={x}
                    className={`filter-radio-label ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="category-filter"
                      checked={isSelected}
                      onChange={() => setCategory(x)}
                    />
                    <span className="filter-item-name">{x} Shirts</span>
                    <span className="filter-item-count">{count}</span>
                  </label>
                )
              })}
            </div>
          </FilterGroup>

          {/* 2. Size Filter */}
          <FilterGroup title="Size" activeCount={size ? 1 : 0}>
            <div className="size-filter-grid">
              {allSizes.map((x) => {
                const count = products.filter(
                  (p) => p.stock[x] && p.stock[x] > 0,
                ).length
                const isSelected = size === x

                return (
                  <button
                    className={`size-btn ${isSelected ? "active" : ""}`}
                    onClick={() => setSize(isSelected ? "" : x)}
                    key={x}
                    type="button"
                    title={`${count} shirts available in ${x}`}
                  >
                    <span>{x}</span>
                    <small>{count}</small>
                  </button>
                )
              })}
            </div>
          </FilterGroup>

          {/* 3. Price Filter */}
          <FilterGroup title="Price" activeCount={priceRange ? 1 : 0}>
            <div className="filter-checkbox-list">
              {[
                {
                  id: "under1500",
                  label: "Under ₹1,500",
                  count: products.filter((p) => p.price < 1500).length,
                },
                {
                  id: "1500-2000",
                  label: "₹1,500 – ₹1,999",
                  count: products.filter(
                    (p) => p.price >= 1500 && p.price <= 2000,
                  ).length,
                },
                {
                  id: "2000-2500",
                  label: "₹2,000 – ₹2,499",
                  count: products.filter(
                    (p) => p.price > 2000 && p.price <= 2500,
                  ).length,
                },
                {
                  id: "above2500",
                  label: "₹2,500 & Above",
                  count: products.filter((p) => p.price > 2500).length,
                },
              ].map((p) => {
                const isSelected = priceRange === p.id
                return (
                  <label
                    key={p.id}
                    className={`filter-radio-label ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="price-filter"
                      checked={isSelected}
                      onChange={() => setPriceRange(isSelected ? "" : p.id)}
                    />
                    <span className="filter-item-name">{p.label}</span>
                    <span className="filter-item-count">{p.count}</span>
                  </label>
                )
              })}
            </div>
          </FilterGroup>

          {/* 4. Color Palette Filter */}
          <FilterGroup title="Color" activeCount={selectedColors.length}>
            <div className="color-filter-list">
              {COLOR_OPTIONS.map((col) => {
                const isSelected = selectedColors.includes(col.name)
                const count = products.filter((p) =>
                  p.color.toLowerCase().includes(col.name.toLowerCase()),
                ).length

                if (count === 0) return null

                return (
                  <button
                    key={col.name}
                    type="button"
                    className={`color-chip-btn ${isSelected ? "active" : ""}`}
                    onClick={() => toggleColor(col.name)}
                  >
                    <span
                      className="color-dot"
                      style={{
                        backgroundColor: col.hex,
                        border:
                          col.name === "White" ? "1px solid #ccc" : "none",
                      }}
                    />
                    <span className="color-label">{col.label}</span>
                    <span className="color-count">{count}</span>
                  </button>
                )
              })}
            </div>
          </FilterGroup>

          {/* 5. Fit Filter */}
          <FilterGroup title="Fit" activeCount={selectedFit ? 1 : 0} collapsed>
            <div className="filter-checkbox-list">
              {[
                { id: "relaxed", label: "Relaxed Fit", count: 18 },
                { id: "regular", label: "Contemporary Regular", count: 9 },
              ].map((f) => {
                const isSelected = selectedFit === f.id
                return (
                  <label
                    key={f.id}
                    className={`filter-radio-label ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="fit-filter"
                      checked={isSelected}
                      onChange={() => setSelectedFit(isSelected ? "" : f.id)}
                    />
                    <span className="filter-item-name">{f.label}</span>
                    <span className="filter-item-count">{f.count}</span>
                  </label>
                )
              })}
            </div>
          </FilterGroup>

          {/* 6. Sleeve Filter */}
          <FilterGroup
            title="Sleeve"
            activeCount={selectedSleeve ? 1 : 0}
            collapsed
          >
            <div className="filter-checkbox-list">
              {[
                { id: "half", label: "Half Sleeve (Resort)", count: 15 },
                { id: "full", label: "Full Sleeve", count: 8 },
              ].map((s) => {
                const isSelected = selectedSleeve === s.id
                return (
                  <label
                    key={s.id}
                    className={`filter-radio-label ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="sleeve-filter"
                      checked={isSelected}
                      onChange={() => setSelectedSleeve(isSelected ? "" : s.id)}
                    />
                    <span className="filter-item-name">{s.label}</span>
                    <span className="filter-item-count">{s.count}</span>
                  </label>
                )
              })}
            </div>
          </FilterGroup>

          {/* 7. Collar Filter */}
          <FilterGroup
            title="Collar"
            activeCount={selectedCollar ? 1 : 0}
            collapsed
          >
            <div className="filter-checkbox-list">
              {[
                { id: "cuban", label: "Cuban / Resort Collar", count: 12 },
                { id: "classic", label: "Classic Spread Collar", count: 11 },
              ].map((c) => {
                const isSelected = selectedCollar === c.id
                return (
                  <label
                    key={c.id}
                    className={`filter-radio-label ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="collar-filter"
                      checked={isSelected}
                      onChange={() => setSelectedCollar(isSelected ? "" : c.id)}
                    />
                    <span className="filter-item-name">{c.label}</span>
                    <span className="filter-item-count">{c.count}</span>
                  </label>
                )
              })}
            </div>
          </FilterGroup>

          {/* 8. Pattern & Craft Filter */}
          <FilterGroup
            title="Pattern"
            activeCount={selectedPattern ? 1 : 0}
            collapsed
          >
            <div className="filter-checkbox-list">
              {[
                { id: "embroidered", label: "Hand Embroidered", count: 16 },
                {
                  id: "botanical",
                  label: "Botanical & Floral Motifs",
                  count: 12,
                },
                {
                  id: "handcrafted",
                  label: "Handcrafted Threadwork",
                  count: 8,
                },
              ].map((pt) => {
                const isSelected = selectedPattern === pt.id
                return (
                  <label
                    key={pt.id}
                    className={`filter-radio-label ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="pattern-filter"
                      checked={isSelected}
                      onChange={() =>
                        setSelectedPattern(isSelected ? "" : pt.id)
                      }
                    />
                    <span className="filter-item-name">{pt.label}</span>
                    <span className="filter-item-count">{pt.count}</span>
                  </label>
                )
              })}
            </div>
          </FilterGroup>

          {/* 9. Fabric Filter */}
          <FilterGroup
            title="Fabric"
            activeCount={selectedFabric ? 1 : 0}
            collapsed
          >
            <div className="filter-checkbox-list">
              {[
                { id: "linen-blend", label: "Cotton-Linen Blend", count: 21 },
                { id: "cotton", label: "100% Pure Cotton", count: 2 },
              ].map((fb) => {
                const isSelected = selectedFabric === fb.id
                return (
                  <label
                    key={fb.id}
                    className={`filter-radio-label ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="fabric-filter"
                      checked={isSelected}
                      onChange={() =>
                        setSelectedFabric(isSelected ? "" : fb.id)
                      }
                    />
                    <span className="filter-item-name">{fb.label}</span>
                    <span className="filter-item-count">{fb.count}</span>
                  </label>
                )
              })}
            </div>
          </FilterGroup>

          {/* 10. Occasion Filter */}
          <FilterGroup
            title="Occasion"
            activeCount={selectedOccasion ? 1 : 0}
            collapsed
          >
            <div className="filter-checkbox-list">
              {[
                { id: "beach", label: "Beach & Resort Vacation", count: 8 },
                { id: "casual", label: "Casual Outings & Brunch", count: 14 },
                { id: "evening", label: "Evening Rooftop & Party", count: 6 },
              ].map((oc) => {
                const isSelected = selectedOccasion === oc.id
                return (
                  <label
                    key={oc.id}
                    className={`filter-radio-label ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="occasion-filter"
                      checked={isSelected}
                      onChange={() =>
                        setSelectedOccasion(isSelected ? "" : oc.id)
                      }
                    />
                    <span className="filter-item-name">{oc.label}</span>
                    <span className="filter-item-count">{oc.count}</span>
                  </label>
                )
              })}
            </div>
          </FilterGroup>

          {/* 11. Discount Filter */}
          <FilterGroup
            title="Discount"
            activeCount={minDiscount > 0 ? 1 : 0}
            collapsed
          >
            <div className="filter-checkbox-list">
              {[
                {
                  val: 15,
                  label: "15% & Above",
                  count: products.filter((p) => p.discount >= 15).length,
                },
                {
                  val: 10,
                  label: "10% & Above",
                  count: products.filter((p) => p.discount >= 10).length,
                },
              ].map((d) => {
                const isSelected = minDiscount === d.val
                return (
                  <label
                    key={d.val}
                    className={`filter-radio-label ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="discount-filter"
                      checked={isSelected}
                      onChange={() => setMinDiscount(isSelected ? 0 : d.val)}
                    />
                    <span className="filter-item-name">{d.label}</span>
                    <span className="filter-item-count">{d.count}</span>
                  </label>
                )
              })}
            </div>
          </FilterGroup>

          {/* 12. Rating Filter */}
          <FilterGroup
            title="Rating"
            activeCount={minRating > 0 ? 1 : 0}
            collapsed
          >
            <div className="filter-checkbox-list">
              {[
                {
                  val: 4.5,
                  label: "4.5★ & Above",
                  count: products.filter((p) => p.rating >= 4.5).length,
                },
                {
                  val: 4.0,
                  label: "4.0★ & Above",
                  count: products.filter((p) => p.rating >= 4.0).length,
                },
              ].map((r) => {
                const isSelected = minRating === r.val
                return (
                  <label
                    key={r.val}
                    className={`filter-radio-label ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="rating-filter"
                      checked={isSelected}
                      onChange={() => setMinRating(isSelected ? 0 : r.val)}
                    />
                    <span className="filter-item-name">{r.label}</span>
                    <span className="filter-item-count">{r.count}</span>
                  </label>
                )
              })}
            </div>
          </FilterGroup>

          {/* 13. Availability & Drops */}
          <FilterGroup
            title="Availability"
            activeCount={availability ? 1 : 0}
            collapsed
          >
            <div className="filter-checkbox-list">
              {[
                {
                  id: "instock",
                  label: "In Stock Only",
                  count: products.length,
                },
                {
                  id: "new",
                  label: "New Arrivals",
                  count: products.filter((p) => p.badge === "New").length,
                },
                {
                  id: "bestseller",
                  label: "Best Sellers",
                  count: products.filter((p) => p.badge === "Bestseller")
                    .length,
                },
                {
                  id: "limited",
                  label: "Limited Edition",
                  count: products.filter((p) => p.badge === "Limited").length,
                },
              ].map((av) => {
                const isSelected = availability === av.id
                return (
                  <label
                    key={av.id}
                    className={`filter-radio-label ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="availability-filter"
                      checked={isSelected}
                      onChange={() => setAvailability(isSelected ? "" : av.id)}
                    />
                    <span className="filter-item-name">{av.label}</span>
                    <span className="filter-item-count">{av.count}</span>
                  </label>
                )
              })}
            </div>
          </FilterGroup>

          {/* Mobile Drawer Bottom CTA */}
          <Button
            className="apply-filter"
            onClick={() => setFiltersOpen(false)}
          >
            Show {list.length} shirts
          </Button>
        </aside>

        {/* Product Catalog Display (Independent Scroll) */}
        <div className="catalog-products">
          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="active-filters-bar">
              <span className="active-filters-label">Active:</span>

              {category !== "All Shirts" && (
                <button
                  type="button"
                  className="filter-tag-chip"
                  onClick={() => setCategory("All Shirts")}
                >
                  Category: {category}
                  <Icon name="close" size={12} />
                </button>
              )}

              {size && (
                <button
                  type="button"
                  className="filter-tag-chip"
                  onClick={() => setSize("")}
                >
                  Size: {size}
                  <Icon name="close" size={12} />
                </button>
              )}

              {priceRange && (
                <button
                  type="button"
                  className="filter-tag-chip"
                  onClick={() => setPriceRange("")}
                >
                  Price:{" "}
                  {priceRange === "under1500"
                    ? "< ₹1.5k"
                    : priceRange === "1500-2000"
                      ? "₹1.5k–₹2k"
                      : priceRange === "2000-2500"
                        ? "₹2k–₹2.5k"
                        : "> ₹2.5k"}
                  <Icon name="close" size={12} />
                </button>
              )}

              {selectedColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="filter-tag-chip"
                  onClick={() => toggleColor(c)}
                >
                  Color: {c}
                  <Icon name="close" size={12} />
                </button>
              ))}

              {selectedFit && (
                <button
                  type="button"
                  className="filter-tag-chip"
                  onClick={() => setSelectedFit("")}
                >
                  Fit: {selectedFit}
                  <Icon name="close" size={12} />
                </button>
              )}

              {selectedSleeve && (
                <button
                  type="button"
                  className="filter-tag-chip"
                  onClick={() => setSelectedSleeve("")}
                >
                  Sleeve: {selectedSleeve}
                  <Icon name="close" size={12} />
                </button>
              )}

              {selectedCollar && (
                <button
                  type="button"
                  className="filter-tag-chip"
                  onClick={() => setSelectedCollar("")}
                >
                  Collar: {selectedCollar}
                  <Icon name="close" size={12} />
                </button>
              )}

              {selectedPattern && (
                <button
                  type="button"
                  className="filter-tag-chip"
                  onClick={() => setSelectedPattern("")}
                >
                  Pattern: {selectedPattern}
                  <Icon name="close" size={12} />
                </button>
              )}

              {selectedFabric && (
                <button
                  type="button"
                  className="filter-tag-chip"
                  onClick={() => setSelectedFabric("")}
                >
                  Fabric: {selectedFabric}
                  <Icon name="close" size={12} />
                </button>
              )}

              {selectedOccasion && (
                <button
                  type="button"
                  className="filter-tag-chip"
                  onClick={() => setSelectedOccasion("")}
                >
                  Occasion: {selectedOccasion}
                  <Icon name="close" size={12} />
                </button>
              )}

              {minDiscount > 0 && (
                <button
                  type="button"
                  className="filter-tag-chip"
                  onClick={() => setMinDiscount(0)}
                >
                  Discount: {minDiscount}%+
                  <Icon name="close" size={12} />
                </button>
              )}

              {minRating > 0 && (
                <button
                  type="button"
                  className="filter-tag-chip"
                  onClick={() => setMinRating(0)}
                >
                  Rating: {minRating}★+
                  <Icon name="close" size={12} />
                </button>
              )}

              {availability && (
                <button
                  type="button"
                  className="filter-tag-chip"
                  onClick={() => setAvailability("")}
                >
                  {availability}
                  <Icon name="close" size={12} />
                </button>
              )}

              <button
                type="button"
                className="clear-all-chips-btn"
                onClick={clearAllFilters}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Cards Grid or Empty State */}
          {list.length > 0 ? (
            <div className="product-grid shop-grid">
              {list.slice(0, visible).map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  wishlisted={wishlist.includes(p.id)}
                  onWish={() => toggleWish(p.id)}
                  onOpen={() => openProduct(p)}
                  onAdd={() => addToCart(p)}
                />
              ))}
            </div>
          ) : (
            <div className="catalog-empty-wrap">
              <Empty
                icon="filter"
                title="No shirts match your filters"
                copy="Try adjusting your size, color, or price filters to see more handcrafted shirts."
                action="Reset all filters"
                onAction={clearAllFilters}
              />
            </div>
          )}

          {/* Load More Button */}
          {visible < list.length && (
            <Button
              variant="outline"
              className="load-more"
              onClick={() => setVisible(visible + 8)}
            >
              Load more shirts ({list.length - visible} remaining)
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShopView
