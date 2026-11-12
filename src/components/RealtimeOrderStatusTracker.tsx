import React, { useState, useEffect } from 'react';
import {
  Clock,
  Flame,
  Truck,
  CheckCircle2,
  Package,
  RefreshCw,
  MapPin,
  Phone,
  Radio,
  ShoppingBag,
  ChevronRight
} from 'lucide-react';
import { getOrderById, updateOrderStatus, supabase } from '../services/orderService';
import { SHOP_INFO } from '../data/menuData';

interface RealtimeOrderStatusTrackerProps {
  order: any;
  onStatusChange?: (updatedOrder: any) => void;
  onRefreshList?: () => void;
}

export type OrderPhase = 'received' | 'preparing' | 'on_the_way' | 'ready_for_collection' | 'completed';

export const RealtimeOrderStatusTracker: React.FC<RealtimeOrderStatusTrackerProps> = ({
  order,
  onStatusChange,
  onRefreshList,
}) => {
  const [currentOrder, setCurrentOrder] = useState<any>(order);
  const [isPolling, setIsPolling] = useState<boolean>(true);
  const [lastPolledAt, setLastPolledAt] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const [isManualRefreshing, setIsManualRefreshing] = useState<boolean>(false);
  const [showSimControls, setShowSimControls] = useState<boolean>(false);

  // Sync internal state when parent order prop changes
  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  // Polling function that queries Supabase 'orders' table
  const pollSupabaseStatus = async () => {
    if (!currentOrder) return;
    const orderKey = currentOrder.orderNumber || currentOrder.id;
    if (!orderKey) return;

    try {
      const freshData = await getOrderById(orderKey);
      if (freshData && freshData.status) {
        setLastPolledAt(new Date());
        setSecondsAgo(0);

        if (freshData.status !== currentOrder.status) {
          const updated = { ...currentOrder, status: freshData.status };
          setCurrentOrder(updated);
          if (onStatusChange) {
            onStatusChange(updated);
          }
        }
      }
    } catch (err) {
      console.warn('Real-time polling check encountered an issue:', err);
    }
  };

  // Set up 5-second polling interval to Supabase 'orders' table
  useEffect(() => {
    if (!isPolling || !currentOrder) return;

    // Initial poll
    pollSupabaseStatus();

    const pollInterval = setInterval(() => {
      pollSupabaseStatus();
    }, 5000);

    // Heartbeat ticker for 'last polled X seconds ago'
    const ticker = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);

    // Supabase Realtime channel subscription if client is available
    let realtimeChannel: any = null;
    if (supabase && currentOrder.id) {
      try {
        realtimeChannel = supabase
          .channel(`order-tracker-${currentOrder.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'orders',
              filter: `id=eq.${currentOrder.id}`,
            },
            (payload: any) => {
              if (payload.new && payload.new.status) {
                const updated = { ...currentOrder, status: payload.new.status };
                setCurrentOrder(updated);
                if (onStatusChange) onStatusChange(updated);
              }
            }
          )
          .subscribe();
      } catch (e) {
        // Realtime fallback to polling
      }
    }

    return () => {
      clearInterval(pollInterval);
      clearInterval(ticker);
      if (realtimeChannel && supabase) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [currentOrder?.id, currentOrder?.orderNumber, isPolling]);

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    await pollSupabaseStatus();
    if (onRefreshList) {
      onRefreshList();
    }
    setTimeout(() => {
      setIsManualRefreshing(false);
    }, 500);
  };

  const handleSimulateStatus = async (newPhase: OrderPhase) => {
    const orderKey = currentOrder.orderNumber || currentOrder.id;
    await updateOrderStatus(orderKey, newPhase);
    const updated = { ...currentOrder, status: newPhase };
    setCurrentOrder(updated);
    if (onStatusChange) onStatusChange(updated);
    if (onRefreshList) onRefreshList();
  };

  if (!currentOrder) return null;

  const currentStatus: OrderPhase = (currentOrder.status as OrderPhase) || 'received';
  const isDelivery = currentOrder.orderType === 'delivery';

  // 4 Sequential Progress Steps
  const steps: {
    key: OrderPhase;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'received',
      label: 'Order Received',
      description: 'Order logged & kitchen ticket printed at 18A High Street',
      icon: <Package className="w-4 h-4" />,
    },
    {
      key: 'preparing',
      label: 'Preparing & Oven-Roasting',
      description: 'Flame-grilling meat, baking fresh pizzas & assembling wraps',
      icon: <Flame className="w-4 h-4" />,
    },
    {
      key: isDelivery ? 'on_the_way' : 'ready_for_collection',
      label: isDelivery ? 'Out for Delivery' : 'Ready at Counter',
      description: isDelivery
        ? 'Courier en route to your Carrickfergus address'
        : 'Ready for collection at 18A High Street counter',
      icon: isDelivery ? <Truck className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />,
    },
    {
      key: 'completed',
      label: 'Delivered & Complete',
      description: 'Food safely handed over. Enjoy your meal!',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  ];

  // Helper to determine step index
  const getStepIndex = (status: OrderPhase): number => {
    switch (status) {
      case 'received':
        return 0;
      case 'preparing':
        return 1;
      case 'on_the_way':
      case 'ready_for_collection':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);
  const progressPercentage = (currentIndex / 3) * 100;

  return (
    <div className="cartoon-card p-5 sm:p-7 bg-gradient-to-b from-[#160f14] via-[#100d12] to-[#0a0a0c] border-2 border-red-500/50 shadow-2xl space-y-6 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-red-500 block">
              Live Order Tracker
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-Time Polling</span>
            </div>
          </div>
          
          <h3 className="font-display text-xl sm:text-2xl font-black text-white mt-0.5 flex items-center gap-2">
            <span>Order #{((currentOrder.orderNumber || currentOrder.id) as string).slice(-6).toUpperCase()}</span>
            <span className="text-sm font-sans font-normal text-slate-400">
              ({isDelivery ? 'Delivery' : 'Collection'})
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Polling Heartbeat Badge */}
          <div className="hidden sm:flex flex-col items-end text-[10px] text-slate-400 pr-1">
            <span className="flex items-center gap-1 text-slate-300">
              <Radio className="w-3 h-3 text-red-500 animate-pulse" />
              <span>Supabase Table: orders</span>
            </span>
            <span className="text-neutral-500">
              Polled {secondsAgo}s ago (every 5s)
            </span>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isManualRefreshing}
            className="cartoon-btn-primary px-3.5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md active:scale-95 transition-transform shrink-0"
            title="Refresh status from Supabase orders table"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isManualRefreshing ? 'animate-spin' : ''}`} />
            <span>Check Now</span>
          </button>
        </div>
      </div>

      {/* Progress Line Bar */}
      <div className="space-y-3 pt-1">
        <div className="relative">
          {/* Background track */}
          <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
            {/* Animated active bar */}
            <div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* 4 Steps Indicator Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
          {steps.map((s, idx) => {
            const isPassed = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isUpcoming = idx > currentIndex;

            return (
              <div
                key={s.key}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-gradient-to-b from-red-600/25 to-[#1a0e14] border-red-500 text-white shadow-lg ring-1 ring-red-500/50'
                    : isPassed
                    ? 'bg-neutral-900/90 border-emerald-500/30 text-slate-200'
                    : 'bg-neutral-950/70 border-neutral-800/80 text-neutral-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isCurrent
                          ? 'bg-red-600 text-white shadow'
                          : isPassed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : s.icon}
                    </div>

                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                        isCurrent
                          ? 'bg-red-600 text-white animate-pulse'
                          : isPassed
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'text-neutral-600'
                      }`}
                    >
                      {isCurrent ? 'Active Phase' : isPassed ? 'Completed' : `Step ${idx + 1}`}
                    </span>
                  </div>

                  <h4
                    className={`font-display font-bold text-xs sm:text-sm leading-tight ${
                      isCurrent ? 'text-white' : isPassed ? 'text-slate-200' : 'text-neutral-400'
                    }`}
                  >
                    {s.label}
                  </h4>

                  <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                    {s.description}
                  </p>
                </div>

                {isCurrent && (
                  <div className="mt-2.5 pt-2 border-t border-red-500/30 flex items-center gap-1.5 text-[10px] text-amber-300 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span>In progress right now</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Phase Live Details Banner */}
      <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
            {currentStatus === 'preparing' ? (
              <Flame className="w-6 h-6 animate-bounce" />
            ) : currentStatus === 'on_the_way' ? (
              <Truck className="w-6 h-6 animate-pulse" />
            ) : currentStatus === 'ready_for_collection' ? (
              <ShoppingBag className="w-6 h-6 animate-bounce" />
            ) : currentStatus === 'completed' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            ) : (
              <Package className="w-6 h-6 animate-pulse" />
            )}
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-red-500 block">
              Current Kitchen Phase
            </span>
            <div className="font-display font-bold text-base sm:text-lg text-white">
              {currentStatus === 'received' && 'Phase 1: Order Queued in Kitchen'}
              {currentStatus === 'preparing' && 'Phase 2: Cooking & Assembling Fresh Meal'}
              {currentStatus === 'on_the_way' && 'Phase 3: Courier En Route with Hot Food'}
              {currentStatus === 'ready_for_collection' && 'Phase 3: Food Hot & Ready on Counter'}
              {currentStatus === 'completed' && 'Phase 4: Order Delivered & Complete'}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {currentStatus === 'received' && 'Our kitchen staff has received your order and is verifying items.'}
              {currentStatus === 'preparing' && 'Freshly carving succulent doner, roasting chicken tikka, and baking naan.'}
              {currentStatus === 'on_the_way' && `Dispatched with our local driver to ${currentOrder.customer?.address || 'Carrickfergus'}.`}
              {currentStatus === 'ready_for_collection' && 'Packaged hot and waiting at 18A High Street, Carrickfergus.'}
              {currentStatus === 'completed' && 'Thank you for ordering with Kebab Nite Carrickfergus!'}
            </p>
          </div>
        </div>

        {/* ETA & Fulfilment */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-neutral-800 pt-3 md:pt-0 md:pl-5 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Estimated Ready Time
            </span>
            <div className="font-display text-lg font-black text-amber-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>
                {currentStatus === 'completed'
                  ? 'Delivered'
                  : isDelivery
                  ? '30–45 Mins'
                  : '15–20 Mins'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {isDelivery ? 'Carrickfergus Delivery' : '18A High St Collection'}
            </span>
          </div>

          <a
            href={`tel:${SHOP_INFO.phone}`}
            className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-red-400 hover:text-white transition-colors"
            title="Call Kebab Nite kitchen"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Testing & Kitchen Simulation Controls (Allows user to test phase transitions) */}
      <div className="pt-1">
        <button
          onClick={() => setShowSimControls((prev) => !prev)}
          className="text-[11px] text-neutral-400 hover:text-slate-200 underline font-medium"
        >
          {showSimControls ? '▲ Hide Kitchen Status Simulator' : '▼ Test Kitchen Status Simulator (Demo)'}
        </button>

        {showSimControls && (
          <div className="mt-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <span className="text-[11px] text-slate-400 font-semibold block">
              Simulate kitchen status transition in Supabase 'orders' table:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSimulateStatus('received')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                  currentStatus === 'received'
                    ? 'bg-amber-600 text-white border-amber-500'
                    : 'bg-neutral-900 text-slate-300 border-neutral-700 hover:text-white'
                }`}
              >
                1. Received
              </button>
              <button
                onClick={() => handleSimulateStatus('preparing')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                  currentStatus === 'preparing'
                    ? 'bg-red-600 text-white border-red-500'
                    : 'bg-neutral-900 text-slate-300 border-neutral-700 hover:text-white'
                }`}
              >
                2. Preparing
              </button>
              <button
                onClick={() => handleSimulateStatus(isDelivery ? 'on_the_way' : 'ready_for_collection')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                  currentStatus === 'on_the_way' || currentStatus === 'ready_for_collection'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-neutral-900 text-slate-300 border-neutral-700 hover:text-white'
                }`}
              >
                3. {isDelivery ? 'Out for Delivery' : 'Ready for Pickup'}
              </button>
              <button
                onClick={() => handleSimulateStatus('completed')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                  currentStatus === 'completed'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-neutral-900 text-slate-300 border-neutral-700 hover:text-white'
                }`}
              >
                4. Completed
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
