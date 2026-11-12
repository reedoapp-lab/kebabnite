import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { TransactionRecord, OrderItem } from '../types';

export type OrderRecord = TransactionRecord;

// Environment variables from .env.example
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Check if valid Supabase credentials are configured
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith('http') &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 10 &&
    !supabaseUrl.includes('your-project')
  );
};

/**
 * Supabase client instance initialized from environment variables
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local persistent cache key for offline/fallback order history
const LOCAL_STORAGE_ORDERS_KEY = 'kebab_nite_orders_cache_v1';

/**
 * Standard Order record for the 'orders' table
 * As required:
 * - customer name
 * - items
 * - total amount (including the 5% fee)
 * - payment method
 * - timestamp
 */
export interface SupabaseOrderRow {
  id?: string;
  order_number?: string;
  customer_name: string;
  items: OrderItem[] | any[];
  total_amount: number; // includes the 5% platform fee
  payment_method: string;
  timestamp: string;
  // Extended fields for kitchen dispatch:
  customer_phone?: string;
  customer_address?: string;
  customer_postcode?: string;
  order_type?: string;
  platform_fee?: number;
  delivery_fee?: number;
  allergens?: any;
  kitchen_notes?: string;
  status?: string;
  [key: string]: any;
}

/**
 * Service to handle order submissions to the Supabase 'orders' table
 */
export async function submitOrder(
  order: TransactionRecord | SupabaseOrderRow
): Promise<{ success: boolean; orderId: string; error?: string }> {
  const isTransactionRecord = 'customer' in order && typeof order.customer === 'object';
  
  // Format the payload matching the required 'orders' table schema
  const customerName = isTransactionRecord
    ? (order as TransactionRecord).customer.fullName
    : (order as SupabaseOrderRow).customer_name;

  const items = isTransactionRecord
    ? (order as TransactionRecord).items
    : (order as SupabaseOrderRow).items;

  const totalAmount = isTransactionRecord
    ? (order as TransactionRecord).total
    : (order as SupabaseOrderRow).total_amount;

  const paymentMethod = isTransactionRecord
    ? (order as TransactionRecord).paymentMethod
    : (order as SupabaseOrderRow).payment_method;

  const timestamp = isTransactionRecord
    ? (order as TransactionRecord).createdAt
    : (order as SupabaseOrderRow).timestamp || new Date().toISOString();

  const orderNumber = isTransactionRecord
    ? (order as TransactionRecord).orderNumber
    : (order as SupabaseOrderRow).order_number || `KN-${Date.now().toString().slice(-4)}`;

  const orderId = isTransactionRecord
    ? (order as TransactionRecord).id
    : (order as SupabaseOrderRow).id || `ord_${Date.now()}`;

  // 1. Always save to local backup cache so customer never loses confirmation
  try {
    const cachedOrders = getStoredOrders();
    const backupRecord = isTransactionRecord ? order : {
      id: orderId,
      orderNumber,
      customer: {
        fullName: customerName,
        phone: (order as any).customer_phone || '',
        email: '',
        address: (order as any).customer_address || '',
        postcode: (order as any).customer_postcode || '',
      },
      items,
      orderType: (order as any).order_type || 'delivery',
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending_cash' : 'paid_online',
      subtotal: (order as any).subtotal || totalAmount,
      deliveryFee: (order as any).delivery_fee || 0,
      platformFee: (order as any).platform_fee || Number((totalAmount * 0.05).toFixed(2)),
      total: totalAmount,
      allergens: (order as any).allergens || { hasAllergies: false, selectedAllergens: [], allergenDetails: '', acknowledged: true },
      createdAt: timestamp,
      status: 'received',
    };
    
    const updated = [backupRecord, ...cachedOrders.filter((o: any) => o.id !== orderId)];
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not write to local cache', err);
  }

  // 2. Submit to Supabase 'orders' table if client is initialized
  if (supabase) {
    try {
      // First attempt: Comprehensive payload with all table fields
      const { error } = await supabase.from('orders').insert([
        {
          id: orderId,
          order_number: orderNumber,
          customer_name: customerName,
          items,
          total_amount: totalAmount,
          payment_method: paymentMethod,
          timestamp,
          customer_phone: isTransactionRecord ? (order as TransactionRecord).customer.phone : (order as any).customer_phone,
          customer_address: isTransactionRecord ? (order as TransactionRecord).customer.address : (order as any).customer_address,
          customer_postcode: isTransactionRecord ? (order as TransactionRecord).customer.postcode : (order as any).customer_postcode,
          order_type: isTransactionRecord ? (order as TransactionRecord).orderType : (order as any).order_type,
          platform_fee: isTransactionRecord ? (order as TransactionRecord).platformFee : (order as any).platform_fee,
          delivery_fee: isTransactionRecord ? (order as TransactionRecord).deliveryFee : (order as any).delivery_fee,
          status: 'received',
        },
      ]);

      if (error) {
        console.warn('Supabase extended insert error, trying core 5-field schema:', error.message);
        
        // Secondary attempt: Strictly the 5 fields requested by user
        const { error: coreError } = await supabase.from('orders').insert([
          {
            customer_name: customerName,
            items,
            total_amount: totalAmount,
            payment_method: paymentMethod,
            timestamp,
          },
        ]);

        if (coreError) {
          console.warn('Supabase core insert error (saved locally):', coreError.message);
          return { success: true, orderId: orderNumber, error: coreError.message };
        }
      }

      return { success: true, orderId: orderNumber };
    } catch (e: any) {
      console.warn('Network exception while submitting order to Supabase:', e);
      return { success: true, orderId: orderNumber, error: e?.message };
    }
  }

  // Supabase not yet configured with production keys; local cache holds the order
  return { success: true, orderId: orderNumber };
}

/**
 * Retrieve stored orders from local cache
 */
export function getStoredOrders(): any[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

/**
 * Fetch order by ID or Order Number
 */
export async function getOrderById(orderNumberOrId: string): Promise<any | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`order_number.eq.${orderNumberOrId},id.eq.${orderNumberOrId}`)
        .maybeSingle();

      if (!error && data) return data;
    } catch (e) {
      console.warn('Error fetching from Supabase, checking local cache:', e);
    }
  }

  const cached = getStoredOrders();
  return (
    cached.find(
      (o) => o.id === orderNumberOrId || o.orderNumber === orderNumberOrId
    ) || null
  );
}

/**
 * Update order status in Supabase 'orders' table and local cache
 */
export async function updateOrderStatus(orderNumberOrId: string, newStatus: string): Promise<boolean> {
  try {
    const cached = getStoredOrders();
    const updated = cached.map((o) => {
      if (o.id === orderNumberOrId || o.orderNumber === orderNumberOrId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not update local order cache:', e);
  }

  if (supabase) {
    try {
      await supabase
        .from('orders')
        .update({ status: newStatus })
        .or(`order_number.eq.${orderNumberOrId},id.eq.${orderNumberOrId}`);
    } catch (e) {
      console.warn('Could not update status in Supabase:', e);
    }
  }

  return true;
}

/**
 * Normalizes phone numbers for flexible search (e.g. 02893321805 vs 028 9332 1805)
 */
function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Fetch previous customer orders by their phone number from Supabase 'orders' table
 * (with fallback to local storage cache for maximum reliability)
 */
export async function fetchOrdersByPhone(phoneQuery: string): Promise<any[]> {
  const cleanQuery = normalizePhone(phoneQuery);
  if (!cleanQuery || cleanQuery.length < 5) return [];

  const results: any[] = [];
  const seenIds = new Set<string>();

  // 1. Fetch from Supabase if configured
  if (supabase) {
    try {
      // Query orders table where customer_phone contains or matches
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        for (const row of data) {
          const rowPhone = normalizePhone(
            row.customer_phone || row.phone || (row.customer && row.customer.phone) || ''
          );
          if (rowPhone && (rowPhone.includes(cleanQuery) || cleanQuery.includes(rowPhone))) {
            const key = row.order_number || row.id;
            if (!seenIds.has(key)) {
              seenIds.add(key);
              results.push({
                id: row.id,
                orderNumber: row.order_number || row.id,
                customer: {
                  fullName: row.customer_name || (row.customer && row.customer.fullName) || 'Customer',
                  phone: row.customer_phone || row.phone || cleanQuery,
                  email: row.customer_email || '',
                  address: row.customer_address || (row.customer && row.customer.address) || '',
                  postcode: row.customer_postcode || (row.customer && row.customer.postcode) || '',
                },
                items: Array.isArray(row.items) ? row.items : [],
                orderType: row.order_type || 'delivery',
                paymentMethod: row.payment_method || 'cash',
                paymentStatus: row.payment_status || 'completed',
                subtotal: Number(row.subtotal || row.total_amount || 0),
                deliveryFee: Number(row.delivery_fee || 0),
                platformFee: Number(row.platform_fee || 0),
                total: Number(row.total_amount || row.total || 0),
                allergens: row.allergens || { hasAllergies: false, selectedAllergens: [] },
                createdAt: row.timestamp || row.created_at || new Date().toISOString(),
                status: row.status || 'received',
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error querying Supabase by phone, checking local cache:', e);
    }
  }

  // 2. Also search local storage cached orders to ensure no local orders are missed
  const localOrders = getStoredOrders();
  for (const localOrder of localOrders) {
    const localPhone = normalizePhone(
      (localOrder.customer && localOrder.customer.phone) || localOrder.customer_phone || ''
    );
    if (localPhone && (localPhone.includes(cleanQuery) || cleanQuery.includes(localPhone))) {
      const key = localOrder.orderNumber || localOrder.id;
      if (!seenIds.has(key)) {
        seenIds.add(key);
        results.push(localOrder);
      }
    }
  }

  // Sort by date descending (newest orders first)
  results.sort((a, b) => {
    const timeA = new Date(a.createdAt || a.timestamp || 0).getTime();
    const timeB = new Date(b.createdAt || b.timestamp || 0).getTime();
    return timeB - timeA;
  });

  return results;
}
