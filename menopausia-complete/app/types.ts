
export enum PlanTier {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM'
}

export type ProductCategory = 'LETTER' | 'BONUS' | 'UPSELL' | 'MAIN';

export interface Product {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  pdfUrl?: string; // If present, opens PDF (or Checkout if not owned)
  audioUrl?: string;
  category: 'LETTER' | 'BONUS' | 'UPSELL' | 'MAIN';
  tier?: 'BASIC' | 'PREMIUM';
  isUpsell?: boolean;
  price?: number;
  contentKey?: string;
  hotmartId?: string;
  checkoutUrl?: string;
}

export interface Chapter {
  id: string;
  product_id: string;
  title: string;
  order_index: number;
  pdf_url?: string;
  audio_url?: string;
  created_at?: string;
}

export interface UserState {
  plan: PlanTier;
  ownedUpsells: string[];
}
