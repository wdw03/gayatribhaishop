import type { Product } from "../products"

export type View = "home" | "shop" | "product" | "wishlist" | "bag" | "checkout" | "account" | "admin" | "login"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  joinedDate?: string
}

export interface Address {
  id: string
  name: string
  phone: string
  street: string
  area?: string
  city: string
  state: string
  pincode: string
  type: "HOME" | "WORK" | "OTHER"
  isDefault?: boolean
}

export type CartItem = {
  id: string
  size: string
  quantity: number
}

export type IconName =
  | "search"
  | "heart"
  | "bag"
  | "user"
  | "menu"
  | "close"
  | "arrow"
  | "star"
  | "filter"
  | "chevron"
  | "truck"
  | "shield"
  | "refresh"
  | "plus"
  | "minus"
  | "trash"
  | "check"
  | "share"
  | "edit"
  | "map-pin"
  | "mail"
  | "phone"
  | "lock"
  | "eye"
  | "eye-off"

export const categories = [
  "Contemporary",
  "BeachSide",
  "Nature",
  "Floral",
  "Linen",
]

export const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]

export type { Product }
