export interface Product {
    id: number
    name: string
    slug: string
    description?: string
    price: number
    category?: string
    status: 'active' | 'inactive'
    keywords?: string[]
    tags?: string[]
    rating: number
    reviews_count: number
    images?: { url: string; alt?: string; is_primary?: boolean }[]
    variants?: { size: string; color: string; hex?: string; quantity: number }[]
    created_at: string
    updated_at: string
    ordered_count: number
  }
  