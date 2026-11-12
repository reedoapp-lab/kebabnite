import React from 'react';
import { Phone, ShoppingBag, CreditCard } from 'lucide-react';
import { SHOP_INFO } from '../data/menuData';
import { OrderItem } from '../types';

interface MobileBottomCallBarProps {
  orderList: OrderItem[];
  setIsDrawerOpen: (open: boolean) => void;
  onOpenCheckout?: () => void;
}

export const MobileBottomCallBar: React.FC<MobileBottomCallBarProps> = ({
  orderList,
  setIsDrawerOpen,
  onOpenCheckout,
}) => {
  const totalItems = orderList.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPrice = orderList.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] sm:hidden bg-[#09090b]/95 backdrop-blur-md border-t border-red-600/30 shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2 max-w-md mx-auto w-full">
        {/* Food Cart Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center h-12 px-3 rounded-xl bg-neutral-900 border border-red-500/30 text-white font-semibold text-[11px] shrink-0 active:scale-95 transition-transform"
          aria-label="View Food Cart"
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>Food Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-neutral-900 shadow">
              {totalItems}
            </span>
          )}
        </button>

        {/* If items in Food Cart, offer direct online checkout */}
        {totalItems > 0 && onOpenCheckout ? (
          <>
            <button
              onClick={onOpenCheckout}
              className="cartoon-btn-primary flex-1 h-12 rounded-xl flex items-center justify-between px-3 text-white font-display font-bold shadow-lg active:scale-95 transition-transform overflow-hidden"
            >
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-300" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-black tracking-wider leading-none text-red-100">
                    Order Online
                  </span>
                  <span className="text-xs font-bold text-white leading-tight">
                    Checkout Now
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] block opacity-80 uppercase leading-none">Est. Subtotal</span>
                <span className="font-mono text-xs font-black text-amber-300">
                  £{totalPrice.toFixed(2)}
                </span>
              </div>
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-12 h-12 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white shrink-0 active:scale-95 transition-transform"
              title="View Cart"
              aria-label="Open Food Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </button>
          </>
        ) : (
          /* When cart empty: prominent Order Online action button */
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="cartoon-btn-primary flex-1 h-12 rounded-xl flex items-center justify-between px-4 text-white font-display font-bold shadow-lg active:scale-95 transition-transform overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shadow-inner">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-black tracking-wider leading-none text-red-100">
                  Online Ordering Live
                </span>
                <span className="text-sm font-bold text-white leading-tight">
                  Open Food Cart
                </span>
              </div>
            </div>

            <span className="text-xs font-bold bg-black/30 px-2.5 py-1 rounded-md text-amber-300">
              Order Online
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
