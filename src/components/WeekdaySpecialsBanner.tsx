import React from 'react';
import { Phone, Clock, Sparkles } from 'lucide-react';
import { WEEKDAY_SPECIALS, SHOP_INFO } from '../data/menuData';
import { OrderItem } from '../types';

interface WeekdaySpecialsBannerProps {
  onAddToOrder: (item: OrderItem) => void;
}

export const WeekdaySpecialsBanner: React.FC<WeekdaySpecialsBannerProps> = ({ onAddToOrder }) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];

  return (
    <section className="py-8 sm:py-14 2xl:py-16 px-3 sm:px-6 lg:px-8 fluid-4k-container">
      {/* Title */}
      <div className="text-center max-w-2xl 2xl:max-w-3xl mx-auto mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/15 border border-red-500/40 text-red-400 text-xs 2xl:text-sm font-bold mb-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Available Monday to Thursday · 5:00 PM – 9:00 PM</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl 2xl:text-4xl font-bold text-white">
          Weekday £15 Specials
        </h2>
        <p className="text-xs sm:text-sm 2xl:text-base text-slate-300 mt-2 max-w-xl mx-auto">
          Massive portions, unbeatable value. Order online for collection or fast delivery across Carrickfergus.
        </p>
      </div>

      {/* 4 Cards Grid with Images & Soft Edges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 2xl:gap-8">
        {WEEKDAY_SPECIALS.map((deal) => {
          const isToday = deal.day === todayName;

          return (
            <div
              key={deal.day}
              className={`cartoon-card overflow-hidden flex flex-col justify-between relative transition-all duration-300 h-full rounded-3xl ${
                isToday
                  ? 'border-2 border-red-500 bg-gradient-to-b from-[#181316] to-[#0d0d0f] shadow-[0_0_35px_rgba(220,38,38,0.35)] scale-[1.02]'
                  : 'border border-red-950/40'
              }`}
            >
              {isToday && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-red-600 text-white text-[10px] 2xl:text-xs uppercase font-black px-3 py-0.5 rounded-full shadow-lg flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Today's Live Offer</span>
                </div>
              )}

              {/* Deal Image with Soft Rounded Top */}
              {deal.image && (
                <div className="relative w-full h-36 sm:h-40 2xl:h-48 overflow-hidden bg-black">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141318] via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              <div className="p-5 2xl:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs 2xl:text-sm font-bold text-amber-400 mb-1">
                    <span>{deal.day}</span>
                    <span className="text-[11px] 2xl:text-xs font-semibold text-slate-400 line-through">
                      Was £{deal.regularPrice.toFixed(2)}
                    </span>
                  </div>

                  <h3 className="font-display text-lg 2xl:text-xl font-bold text-white mt-1">
                    {deal.title}
                  </h3>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-mono text-2xl 2xl:text-3xl font-black text-amber-400">
                      £{deal.price.toFixed(2)}
                    </span>
                    <span className="text-xs 2xl:text-sm text-red-400 font-bold">
                      Save £{(deal.regularPrice - deal.price).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs 2xl:text-sm text-slate-300 mt-2.5 leading-relaxed">
                    {deal.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-800">
                  <button
                    onClick={() =>
                      onAddToOrder({
                        itemId: `deal-${deal.day.toLowerCase()}`,
                        name: `${deal.day} Special: ${deal.title}`,
                        price: deal.price,
                        quantity: 1,
                      })
                    }
                    className="cartoon-btn-primary w-full py-2.5 px-3 rounded-2xl text-white text-xs 2xl:text-sm font-bold flex items-center justify-center gap-1.5 shadow active:scale-95 transition-transform"
                  >
                    <span>+ Add to Food Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
