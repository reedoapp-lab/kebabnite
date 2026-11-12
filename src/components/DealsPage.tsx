import React from 'react';
import { Phone, Plus, Clock, Gift, Users } from 'lucide-react';
import { SHOP_INFO, WEEKDAY_SPECIALS, MENU_ITEMS } from '../data/menuData';
import { OrderItem } from '../types';

interface DealsPageProps {
  onAddToOrder: (item: OrderItem) => void;
}

export const DealsPage: React.FC<DealsPageProps> = ({ onAddToOrder }) => {
  const boxDeals = MENU_ITEMS.filter((i) => i.category === 'boxes_deals');

  return (
    <div className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-12">
      
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-bold mb-3">
          <Gift className="w-3.5 h-3.5" />
          <span>Carrickfergus Big Feasts & Bundles</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Deals, Boxes & Group Feasts
        </h1>
        <p className="text-xs sm:text-base text-slate-300 mt-2">
          From our famous 10" and 12" Munchy Boxes to full family pizza bundles. All freshly oven-baked for rapid collection or hot door-to-door delivery.
        </p>
        {/* Quick CTA */}
        <div className="mt-4 sm:mt-5 flex justify-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-neutral-900 border border-red-500/30 shadow-lg">
            <span>✨ All deals available for Online Order & Fast Delivery</span>
          </div>
        </div>
      </div>

      {/* Weekday Specials Section */}
      <div className="bg-[#121215] p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-red-900/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Monday – Thursday · 5PM to 9PM</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
              Weekday £15 Specials
            </h2>
          </div>
          <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full self-start sm:self-auto font-semibold">
            Order Online for Delivery or Collection
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WEEKDAY_SPECIALS.map((sp) => (
            <div
              key={sp.day}
              className="cartoon-card overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[#18181c] to-[#0e0e11] h-full"
            >
              {sp.image && (
                <div className="relative w-full h-32 overflow-hidden bg-black">
                  <img
                    src={sp.image}
                    alt={sp.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-amber-400 block mb-1">
                    {sp.day}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    {sp.title}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-mono text-xl font-black text-amber-400">
                      £{sp.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      £{sp.regularPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {sp.desc}
                  </p>
                </div>

                <button
                  onClick={() =>
                    onAddToOrder({
                      itemId: `special-${sp.day}`,
                      name: `${sp.day} Special: ${sp.title}`,
                      price: sp.price,
                      quantity: 1,
                    })
                  }
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-red-500/30 text-white text-xs font-bold transition-all text-center"
                >
                  + Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mega Feast & Pizza Boxes */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-red-500" />
          <h2 className="font-display text-2xl font-bold text-white">
            Sharing Boxes & Party Meals
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {boxDeals.map((box) => (
            <div
              key={box.id}
              className="cartoon-card overflow-hidden flex flex-col justify-between group transition-all duration-200 hover:-translate-y-1 h-full"
            >
              {/* Realistic Box Photo */}
              {box.image && (
                <div className="relative w-full h-48 overflow-hidden bg-black border-b border-red-900/30">
                  <img
                    src={box.image}
                    alt={box.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-3 left-3">
                    {box.badge ? (
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-red-600 text-white shadow">
                        {box.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-black/80 text-white border border-neutral-700">
                        Sharing Feast
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-md px-3 py-1 rounded-xl border border-red-500/40">
                    <span className="font-mono text-base font-black text-amber-400">
                      £{box.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {!box.image && (
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-red-600 text-white">
                        {box.badge || 'Sharing Feast'}
                      </span>
                      <span className="font-mono text-xl font-black text-amber-400">
                        £{box.price.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <h3 className="font-display text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                    {box.name}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {box.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-neutral-800">
                  <button
                    onClick={() =>
                      onAddToOrder({
                        itemId: box.id,
                        name: box.name,
                        price: box.price,
                        quantity: 1,
                      })
                    }
                    className="cartoon-btn-primary w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow active:scale-95 transition-transform"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Deal to Food Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
