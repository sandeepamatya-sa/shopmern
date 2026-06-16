export interface ProductData {
  _id: string
  name: string
  description: string
  shortDescription: string
  price: number
  discountedPrice: number
  categoryId: { _id: string; name: string } | string
  brandId: { _id: string; name: string } | string
  images: string[]
  status: boolean
  featured: boolean
  image?: string   // normalized helper field
}

export interface CategoryData {
  _id: string
  name: string
  status: boolean
}

export interface BrandData {
  _id: string
  name: string
  status: boolean
}

export interface ReviewData {
  _id: string
  productId: string
  userId: { _id: string; name: string }
  rating: number
  comment: string
  status: boolean
  createdAt: string
}

export interface OrderData {
  _id: string
  userId: { _id: string; name: string; email: string }
  cart: { productId: { _id: string; name: string; price: number; images: string[] }; qty: number }[]
  totalAmount: number
  status: string
  createdAt: string
}
