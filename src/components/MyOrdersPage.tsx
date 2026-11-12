import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  RefreshCw,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Package,
  Calendar,
  CreditCard,
  Banknote,
  ChevronRight,
  Flame
} from 'lucide-react';
import { fetchOrdersByPhone } from '../services/orderService';
import { PageId, OrderItem } from '../types';
import { RealtimeOrderStatusTracker } from './RealtimeOrderStatusTracker';

interface MyOrdersPageProps {
  onNavigate: (page: PageId) => void;
  onAddToCart: (item: OrderItem) => void;
  onOpenCart: () => void;
}

export const MyOrdersPage: React.FC<MyOrdersPageProps> = ({
  onNavigate,
  onAddToCart,
  onOpenCart,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [reorderedMessage, setReorderedMessage] = useState<string | null>(null);

  // Auto-fill from recent checkout if available
  useEffect(() => {
    try {
      const raw = localStorage.getItem('kebab_nite_orders_cache_v1');
      if (raw) {
        const cached = JSON.parse(raw);
        if (Array.isArray(cached) && cached.length > 0) {
          const recentPhone = cached[0]?.customer?.phone || cached[0]?.customer_phone;
          if (recentPhone && !phoneNumber) {
            setPhoneNumber(recentPhone);
            handleSearch(recentPhone);
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSearch = async (phoneToSearch?: string) => {
    const target = phoneToSearch !== undefined ? phoneToSearch : phoneNumber;
    if (!target.trim() || target.trim().length < 5) {
      alert('Please enter a valid phone number (at least 5 digits).');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await fetchOrdersByPhone(target);
      setOrders(results);
      if (results.length > 0) {
        // Default to active order (preparing/received/on_the_way) or most recent
        const active = results.find((o) => o.status !== 'completed' && o.status !== 'cancelled') || results[0];
        setTrackedOrderId(active.orderNumber || active.id);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderStatusUpdate = (updatedOrder: any) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (
          o.id === updatedOrder.id ||
          o.orderNumber === updatedOrder.orderNumber ||
          (updatedOrder.order_number && o.orderNumber === updatedOrder.order_number)
        ) {
          return { ...o, status: updatedOrder.status };
        }
        return o;
      })
    );
  };

  const trackedOrder = orders.find(
    (o) => (o.orderNumber && o.orderNumber === trackedOrderId) || (o.id && o.id === trackedOrderId)
  ) || (orders.length > 0 ? orders[0] : null);

  const handleReorder = (order: any) => {
    if (!Array.isArray(order.items) || order.items.length === 0) return;

    order.items.forEach((item: any) => {
      onAddToCart({
        itemId: item.itemId || item.id || `item_${Math.random()}`,
        name: item.name,
        price: Number(item.price || 0),
        quantity: item.quantity || 1,
        variant: item.variant,
        category: item.category,
      });
    });

    setReorderedMessage(`Added ${order.items.length} items from order #${order.orderNumber} to Food Cart!`);
    setTimeout(() => {
      setReorderedMessage(null);
      onOpenCart();
    }, 1200);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Order Received
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/40">
            <Flame className="w-3.5 h-3.5 text-red-500 animate-bounce" />
            Freshly Oven-Roasting
          </span>
        );
      case 'on_the_way':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 live-pulse" />
            Out for Delivery
          </span>
        );
      case 'ready_for_collection':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-600/20 text-amber-400 border border-amber-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            Ready at Counter (18A High St)
          </span>
        );
      case 'completed':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-800 text-slate-300 border border-neutral-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
            Completed
          </span>
        );
    }
  };

  return (
    <div className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 sm:space-y-10 min-h-[75vh]">
      
      {/* Back to Home Button */}
      <button
        onClick={() => {
          onNavigate('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="inline-flex items-center gap-2 text-xs font-bold text-red-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-bold">
          <Package className="w-3.5 h-3.5" />
          <span>Supabase Live Orders Database</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          My Previous Orders
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Enter your contact phone number to track live status or view receipts of past orders placed at Kebab Nite Carrickfergus.
        </p>
      </div>

      {/* Reordered Notification */}
      {reorderedMessage && (
        <div className="p-4 rounded-2xl bg-red-600 text-white font-bold text-center text-sm shadow-xl flex items-center justify-center gap-2 animate-bounce">
          <ShoppingBag className="w-5 h-5 text-amber-300" />
          <span>{reorderedMessage}</span>
        </div>
      )}

      {/* Search Bar Box */}
      <div className="cartoon-card p-5 sm:p-7 bg-[#111116] border border-red-900/40 max-w-2xl mx-auto shadow-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="space-y-3"
        >
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Enter Phone Number Used For Order
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 07700 900123 or 02893..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm font-medium placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="cartoon-btn-primary px-6 py-3 rounded-xl text-white font-display text-sm font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Find Orders</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            💡 Queries the Supabase orders database directly by your phone number.
          </p>
        </form>
      </div>

      {/* Orders Results List */}
      <div className="space-y-5">
        {isLoading && (
          <div className="text-center py-12 space-y-3">
            <RefreshCw className="w-8 h-8 text-red-500 animate-spin mx-auto" />
            <p className="text-sm text-slate-400 font-semibold">
              Connecting to Supabase and retrieving your order history...
            </p>
          </div>
        )}

        {!isLoading && hasSearched && orders.length === 0 && (
          <div className="cartoon-card p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 bg-[#0e0e12]">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-3xl mx-auto">
              🔍
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">No Orders Found</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                We couldn't find any orders matching phone number <strong>"{phoneNumber}"</strong>. Double-check your number or start a fresh online order!
              </p>
            </div>
            <button
              onClick={() => {
                onNavigate('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cartoon-btn-primary px-6 py-3 rounded-xl text-xs font-bold text-white shadow-md inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Menu & Order Online</span>
            </button>
          </div>
        )}

        {!isLoading && orders.length > 0 && (
          <div className="space-y-6">
            
            {/* Real-time Status Tracker Component polling Supabase 'orders' table */}
            {trackedOrder && (
              <div id="realtime-order-tracker">
                <RealtimeOrderStatusTracker
                  order={trackedOrder}
                  onStatusChange={handleOrderStatusUpdate}
                  onRefreshList={() => handleSearch()}
                />
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-2">
              <span className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
                <Receipt className="w-4 h-4 text-red-500" />
                <span>All Orders Placed ({orders.length})</span>
              </span>
              <button
                onClick={() => handleSearch()}
                className="text-red-400 hover:text-white flex items-center gap-1 font-bold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh History</span>
              </button>
            </div>

            <div className="space-y-4">
              {orders.map((order) => {
                const orderDate = new Date(order.createdAt || order.timestamp || Date.now());
                const formattedDate = orderDate.toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                const isCurrentTracked = trackedOrderId === (order.orderNumber || order.id);

                return (
                  <div
                    key={order.id || order.orderNumber}
                    className={`cartoon-card p-5 sm:p-7 bg-[#111116] border transition-all space-y-5 ${
                      isCurrentTracked
                        ? 'border-red-500 shadow-lg ring-1 ring-red-500/30'
                        : 'border-neutral-800 hover:border-red-500/40'
                    }`}
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-base sm:text-lg font-black text-amber-400">
                            #{order.orderNumber}
                          </span>
                          {getStatusBadge(order.status || 'received')}
                          {isCurrentTracked && (
                            <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                              Tracked Above
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isCurrentTracked && (
                          <button
                            onClick={() => {
                              setTrackedOrderId(order.orderNumber || order.id);
                              document.getElementById('realtime-order-tracker')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 text-xs font-semibold text-slate-200 transition-colors"
                          >
                            Track Live →
                          </button>
                        )}

                        <button
                          onClick={() => handleReorder(order)}
                          className="cartoon-btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Re-Order This Feast</span>
                        </button>
                      </div>
                    </div>

                  {/* Customer and Fulfilment Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                      <span className="text-slate-400 block font-semibold">Fulfilment</span>
                      <span className="text-white font-bold block">
                        {order.orderType === 'delivery' ? '🚚 Delivery' : '🛍️ Counter Collection'}
                      </span>
                      {order.customer?.address && (
                        <p className="text-slate-400 text-[11px] truncate">
                          {order.customer.address}, {order.customer.postcode}
                        </p>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                      <span className="text-slate-400 block font-semibold">Payment</span>
                      <span className="text-white font-bold block flex items-center gap-1">
                        {order.paymentMethod === 'online_card' ? (
                          <>
                            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Online Card (Stripe)</span>
                          </>
                        ) : order.paymentMethod === 'apple_pay' ? (
                          <>
                            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Apple / Google Pay</span>
                          </>
                        ) : (
                          <>
                            <Banknote className="w-3.5 h-3.5 text-amber-400" />
                            <span>Cash on Delivery</span>
                          </>
                        )}
                      </span>
                      <span className={`text-[11px] font-semibold block ${order.paymentMethod === 'cash' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {order.paymentMethod === 'cash' ? 'Optional cash on handover' : 'Paid securely online'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1 sm:col-span-2 lg:col-span-1">
                      <span className="text-slate-400 block font-semibold">Total Paid / Due</span>
                      <span className="font-mono text-base font-black text-amber-400 block">
                        £{Number(order.total || order.total_amount || 0).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Includes 5% platform & online ordering fee
                      </span>
                    </div>
                  </div>

                  {/* Ordered Items List */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Items in Order ({Array.isArray(order.items) ? order.items.length : 0})
                    </span>
                    <div className="divide-y divide-neutral-800/80 rounded-xl bg-neutral-950/60 border border-neutral-800 px-3 py-1">
                      {Array.isArray(order.items) &&
                        order.items.map((item: any, i: number) => (
                          <div
                            key={i}
                            className="py-2.5 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-md bg-red-600/20 text-red-400 font-mono font-bold flex items-center justify-center text-xs">
                                {item.quantity}x
                              </span>
                              <div>
                                <span className="font-bold text-white block">
                                  {item.name}
                                </span>
                                {item.variant && (
                                  <span className="text-[11px] text-amber-400">
                                    {item.variant}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="font-mono font-bold text-slate-300">
                              £{(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Allergens Notification */}
                  {order.allergens && order.allergens.hasAllergies && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Allergens Declared:</span>
                        <span>
                          {Array.isArray(order.allergens.selectedAllergens)
                            ? order.allergens.selectedAllergens.join(', ')
                            : 'Custom allergen details noted'}
                        </span>
                        {order.allergens.allergenDetails && (
                          <span className="block italic mt-0.5">
                            "{order.allergens.allergenDetails}"
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
