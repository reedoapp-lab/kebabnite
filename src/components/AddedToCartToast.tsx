import React, { useEffect, useState } from 'react';
import { ShoppingBag, Check, X, ArrowRight } from 'lucide-react';
import { OrderItem } from '../types';

export interface ToastData {
  item: OrderItem;
  id: number;
}

interface AddedToCartToastProps {
  toast: ToastData | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const AddedToCartToast: React.FC<AddedToCartToastProps> = ({
  toast,
  onClose,
  onOpenCart,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) return;

    setProgress(100);
    const duration = 2800; // 2.8 seconds
    const intervalTime = 30;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return Math.max(0, prev - step);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-50 top-20 right-3 sm:right-6 sm:top-24 max-w-sm w-[calc(100vw-1.5rem)] sm:w-auto animate-in slide-in-from-top-3 sm:slide-in-from-right-4 fade-in duration-200"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#170e12] via-[#200c14] to-[#120f16] border-2 border-red-500/50 shadow-[0_10px_30px_rgba(220,38,38,0.35)] p-3.5 sm:p-4 text-white">
        
        {/* Subtle red accent glow */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-red-600/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative flex items-center gap-3">
          {/* Animated Cart Icon Badge */}
          <div className="relative w-10 h-10 rounded-xl bg-red-600/25 border border-red-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <ShoppingBag className="w-5 h-5 text-red-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Added to Food Cart
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            
            <p className="font-display font-bold text-xs sm:text-sm text-white truncate leading-tight mt-0.5">
              {toast.item.name}
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-0.5">
              {toast.item.variant && (
                <span className="text-amber-400 font-medium truncate max-w-[120px]">
                  {toast.item.variant}
                </span>
              )}
              <span className="font-mono font-bold text-amber-300">
                £{(toast.item.price * toast.item.quantity).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions: View Cart button + Dismiss */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="cartoon-btn-primary px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-transform flex items-center gap-1 whitespace-nowrap"
            >
              <span>Cart</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-neutral-900/60 hover:bg-neutral-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Auto-dismiss progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-800">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-amber-400 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>
    </div>
  );
};
