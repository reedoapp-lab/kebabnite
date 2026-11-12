export type PageId = 'home' | 'todays-menu' | 'menu' | 'deals' | 'location' | 'how-to-order' | 'privacy-policy' | 'order-status' | 'my-orders';

export interface OrderItem {
  itemId: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  notes?: string;
  category?: string;
}

export type PaymentMethod = 'online_card' | 'apple_pay' | 'cash';
export type OrderType = 'delivery' | 'collection';
export type PaymentStatus = 'paid_online' | 'pending_cash' | 'completed' | 'processing';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  postcode: string;
  deliveryNotes?: string;
}

export interface AllergenInfo {
  hasAllergies: boolean;
  selectedAllergens: string[];
  allergenDetails: string;
  acknowledged: boolean;
}

export interface TransactionRecord {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  deliveryFee: number;
  platformFee: number; // 5% online ordering & platform fee
  total: number;
  allergens: AllergenInfo;
  kitchenNotes?: string;
  createdAt: string;
  status: 'received' | 'preparing' | 'on_the_way' | 'ready_for_collection' | 'completed';
}
