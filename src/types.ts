export type Currency = 'AED' | 'USD' | 'GBP' | 'EUR' | 'INR';

export type PropertyType =
  | 'Apartment'
  | 'Penthouse'
  | 'Villa'
  | 'Townhouse'
  | 'Mansion'
  | 'Plot';

export type ListingStatus = 'For Sale' | 'For Rent';

export type Tag = 'Exclusive' | 'New' | 'Waterfront' | 'Sky Villa' | 'Branded Residence';

export interface Property {
  id: string;
  slug: string;
  title: string;
  community: string;
  subCommunity?: string;
  type: PropertyType;
  status: ListingStatus;
  priceAED: number;
  rentPeriod?: 'yearly' | 'monthly';
  beds: number;
  baths: number;
  sizeSqft: number;
  plotSqft?: number;
  furnishing: 'Furnished' | 'Unfurnished' | 'Partly Furnished';
  completion: 'Ready' | 'Off-Plan';
  images: string[];
  description: string;
  amenities: string[];
  agentId: string;
  tags?: Tag[];
  featured?: boolean;
  yearBuilt?: number;
  reference: string;
  location?: { lat: number; lng: number };
}

export type ProjectStatus = 'Launching Soon' | 'Presale' | 'Under Construction' | 'Ready';

export interface PaymentPlan {
  onBooking: number;
  duringConstruction: number;
  onHandover: number;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  developer: string;
  community: string;
  status: ProjectStatus;
  priceFromAED: number;
  paymentPlan: PaymentPlan;
  handover: string;
  images: string[];
  description: string;
  unitTypes: string[];
  amenities: string[];
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  image: string;
  tagline: string;
  description: string;
  avgPricePerSqft: number;
  listingsCount: number;
  popularFor: string[];
  location?: { lat: number; lng: number };
}

export interface Agent {
  id: string;
  slug: string;
  name: string;
  title: string;
  photo: string;
  phone: string;
  whatsapp: string;
  email: string;
  languages: string[];
  specialties: string[];
  bio: string;
  listingsCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
}

export type ArticleCategory = 'Market Insight' | 'Buying Guide' | 'Neighborhood Guide' | 'Off-Plan' | 'Lifestyle';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  images?: string[];
  category: ArticleCategory;
  authorId?: string;
  publishedAt: string;
  readMinutes?: number;
  featured?: boolean;
}
