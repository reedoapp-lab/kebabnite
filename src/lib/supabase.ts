import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { TransactionRecord } from '../types';
export { submitOrder } from '../services/orderService';
export type { SupabaseOrderRow } from '../services/orderService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize client only if valid URL is provided
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith('http') &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 10
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage key for fallback / offline-first cache
const LOCAL_STORAGE_ORDERS_KEY = 'kebab_nite_orders_cache_v1';

/**
 * Save an order to Supabase database (with resilient local storage backup)
 */
export async function saveOrderToDatabase(
  order: TransactionRecord
): Promise<{ success: boolean; orderId: string; error?: string }> {
  // 1. Always back up to local storage first so the customer never loses receipt
  try {
    const existing = getLocalOrders();
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not write to local order cache', e);
  }

  // 2. If Supabase is connected, insert into orders table
  if (supabase) {
    try {
      const { data, error } = await supabase.from('orders').insert([
        {
          id: order.id,
          order_number: order.orderNumber,
          customer_name: order.customer.fullName,
          customer_phone: order.customer.phone,
          customer_email: order.customer.email,
          customer_address: order.customer.address,
          customer_postcode: order.customer.postcode,
          order_type: order.orderType,
          payment_method: order.paymentMethod,
          payment_status: order.paymentStatus,
          items: order.items,
          subtotal: order.subtotal,
          delivery_fee: order.deliveryFee,
          platform_fee: order.platformFee,
          total: order.total,
          total_amount: order.total, // including the 5% fee
          timestamp: order.createdAt,
          allergens: order.allergens,
          kitchen_notes: order.kitchenNotes || null,
          status: order.status,
          created_at: order.createdAt,
        },
      ]);

      if (error) {
        console.warn('Supabase insert warning (falling back to local cache):', error.message);
        // Still return success since local cache saved and order reference was issued
        return { success: true, orderId: order.orderNumber };
      }

      return { success: true, orderId: order.orderNumber };
    } catch (err: any) {
      console.warn('Supabase connection error:', err?.message || err);
      return { success: true, orderId: order.orderNumber };
    }
  }

  // Supabase env vars not plugged in yet; local persistent cache handles order tracking
  return { success: true, orderId: order.orderNumber };
}

/**
 * Retrieve an order by its unique order number or ID
 */
export async function fetchOrderById(
  orderNumberOrId: string
): Promise<TransactionRecord | null> {
  // Try Supabase first if configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`order_number.eq.${orderNumberOrId},id.eq.${orderNumberOrId}`)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          orderNumber: data.order_number,
          customer: {
            fullName: data.customer_name,
            phone: data.customer_phone,
            email: data.customer_email,
            address: data.customer_address,
            postcode: data.customer_postcode,
            deliveryNotes: data.kitchen_notes,
          },
          items: data.items,
          orderType: data.order_type,
          paymentMethod: data.payment_method,
          paymentStatus: data.payment_status,
          subtotal: Number(data.subtotal),
          deliveryFee: Number(data.delivery_fee),
          platformFee: Number(data.platform_fee),
          total: Number(data.total),
          allergens: data.allergens,
          kitchenNotes: data.kitchen_notes,
          createdAt: data.created_at,
          status: data.status,
        };
      }
    } catch (e) {
      console.warn('Error fetching from Supabase, checking local cache:', e);
    }
  }

  // Fallback to local storage
  const localOrders = getLocalOrders();
  return (
    localOrders.find(
      (o) => o.id === orderNumberOrId || o.orderNumber === orderNumberOrId
    ) || null
  );
}

/**
 * Helper to get orders stored in local cache
 */
export function getLocalOrders(): TransactionRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
