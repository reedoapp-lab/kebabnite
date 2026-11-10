import React from 'react';
import { Phone, ShoppingBag } from 'lucide-react';
import { SHOP_INFO } from '../data/menuData';
import { OrderItem } from '../types';

interface MobileBottomCallBarProps {
  orderList: OrderItem[];
  setIsDrawerOpen: (open: boolean) => void;
}

export const MobileBottomCallBar: React.FC<MobileBottomCallBarProps> = ({
  orderList,
  setIsDrawerOpen,
}) => {
  const totalItems = orderList.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPrice = orderList.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:hidden bg-[#09090b]/95 backdrop-blur-md border-t border-red-600/30 shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Order Notepad Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center h-12 px-3 rounded-xl bg-neutral-900 border border-red-500/30 text-white font-semibold text-[11px] shrink-0 active:scale-95 transition-transform"
          aria-label="View Order List"
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>Order</span>
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-neutral-900 shadow">
              {totalItems}
            </span>
          )}
        </button>

        {/* Primary Click to Call button (Red & White, no green) */}
        <a
          href={`tel:${SHOP_INFO.phone}`}
          className="cartoon-btn-call flex-1 h-12 rounded-xl flex items-center justify-between px-4 text-white font-display font-bold shadow-lg active:scale-95 transition-transform overflow-hidden"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shadow-inner">
              <Phone className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-black tracking-wider leading-none text-red-100">
                Tap to Call & Order
              </span>
              <span className="font-mono text-sm font-bold text-white leading-tight">
                {SHOP_INFO.displayPhone}
              </span>
            </div>
          </div>

          {totalPrice > 0 ? (
            <div className="text-right">
              <span className="text-[10px] block opacity-80 uppercase leading-none">Est. Total</span>
              <span className="font-mono text-xs font-bold text-amber-300">
                £{totalPrice.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-xs font-bold bg-black/30 px-2 py-0.5 rounded-md">
              Fast Delivery
            </span>
          )}
        </a>
      </div>
    </div>
  );
};
