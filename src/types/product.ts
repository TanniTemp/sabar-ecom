export interface Product {
    id: number
    name: string
    slug: string
    description?: string
    price: number
    original_price?: number
    category?: string
    status: 'active' | 'inactive'
    keywords?: string[]
    tags?: string[]
    rating: number
    reviews_count: number
    images?: { url: string; alt?: string; is_primary?: boolean }[]
    variants?: {
      color: string;
      hex?: string;
      sizes: {
        [size: string]: number; // quantity for each size
      };
    }[];
    created_at: string
    updated_at: string
    ordered_count: number
    fit: string[]
    care: string[]
  }
  