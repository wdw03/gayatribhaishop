import type { Product } from "../products"

export type View = "home" | "shop" | "product" | "wishlist" | "bag" | "checkout" | "account" | "admin"

export type CartItem = {
  id: string
  size: string
  quantity: number
}

export type IconName = "search" | "heart" | "bag" | "user" | "menu" | "close" | "arrow" | "star" | "filter" | "chevron" | "truck" | "shield" | "refresh" | "plus" | "minus" | "trash" | "check" | "share"

export const categories = [
  "Contemporary",
  "BeachSide",
  "Nature",
  "Floral",
  "Linen",
]

export const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]

export type { Product }
