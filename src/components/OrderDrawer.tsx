import React from 'react';
import { X, Trash2, Phone, Plus, Minus, Copy, Check } from 'lucide-react';
import { SHOP_INFO } from '../data/menuData';
import { OrderItem } from '../types';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderList: OrderItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearOrder: () => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  orderList,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const totalItems = orderList.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPrice = orderList.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  const handleCopyOrder = () => {
    if (orderList.length === 0) return;
    const lines = [
      `🥙 Kebab Nite Carrickfergus - My Order:`,
      ...orderList.map(
        (item) => `• ${item.quantity}x ${item.name}${item.variant ? ` (${item.variant})` : ''} - £${(item.price * item.quantity).toFixed(2)}`
      ),
      `Total: £${totalPrice.toFixed(2)}`,
      `Call shop: ${SHOP_INFO.displayPhone}`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-md bg-[#0e0e11] border-l border-red-600/30 flex flex-col h-full shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-neutral-800 bg-[#141418] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 font-bold">
              📝
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white leading-tight">
                Your Order Notepad
              </h2>
              <p className="text-xs text-amber-400">
                Ready to read out when you call Kebab Nite
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {orderList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-900 border border-red-500/20 flex items-center justify-center text-3xl">
                🥙
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-base">
                  Your notepad is empty!
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Browse our menu and tap <strong>"+ Add to Order"</strong> on any kebabs, hogies, pizzas, or deals.
                </p>
              </div>
              <button
                onClick={onClose}
                className="cartoon-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold text-white tracking-wide"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>{totalItems} item{totalItems > 1 ? 's' : ''} in notepad</span>
                <button
                  onClick={onClearOrder}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear all</span>
                </button>
              </div>

              {orderList.map((item, index) => (
                <div
                  key={`${item.itemId}-${item.variant || ''}-${index}`}
                  className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-red-500/40 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-100 leading-tight">
                        {item.name}
                      </h4>
                      {item.variant && (
                        <span className="text-xs text-amber-400 font-medium block mt-0.5">
                          {item.variant}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-sm font-bold text-amber-400">
                      £{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
                    <div className="flex items-center gap-2 bg-neutral-950 rounded-lg p-0.5 border border-neutral-800">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-200 hover:text-white rounded hover:bg-neutral-800"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-mono text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-200 hover:text-white rounded hover:bg-neutral-800"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-xs text-slate-400 hover:text-red-400 p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Drawer Footer: Pricing & Phone Call CTA */}
        {orderList.length > 0 && (
          <div className="p-4 bg-[#141418] border-t border-neutral-800 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Estimated Subtotal</span>
                <span className="font-mono font-semibold text-white">£{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Delivery in Carrickfergus</span>
                <span>From £2.50 (paid to driver)</span>
              </div>
              <div className="flex justify-between text-red-400 font-bold text-base pt-1 border-t border-neutral-800">
                <span>Total Estimated</span>
                <span className="font-mono text-lg text-amber-400">£{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Direct Call to Order Button (Red & White) */}
            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="cartoon-btn-call w-full py-3.5 rounded-xl flex items-center justify-center gap-2.5 text-white font-display font-bold text-base shadow-xl"
            >
              <Phone className="w-5 h-5 animate-bounce" />
              <span>Call Shop: {SHOP_INFO.displayPhone}</span>
            </a>

            {/* Copy order button */}
            <button
              onClick={handleCopyOrder}
              className="w-full py-2 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300 font-bold">Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-red-400" />
                  <span>Copy list to message household</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400 italic">
              💡 Tip: When staff answers, mention collection or delivery first!
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
