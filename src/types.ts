export type PageId = 'home' | 'todays-menu' | 'menu' | 'deals' | 'location' | 'how-to-order' | 'privacy-policy';

export interface OrderItem {
  itemId: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  notes?: string;
}
