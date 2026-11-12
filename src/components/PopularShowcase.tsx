import React from 'react';
import { motion } from 'motion/react';
import { Plus, Phone, Sparkles } from 'lucide-react';
import { MENU_ITEMS, SHOP_INFO } from '../data/menuData';
import { OrderItem, PageId } from '../types';

interface PopularShowcaseProps {
  onAddToOrder: (item: OrderItem) => void;
  onNavigate: (page: PageId) => void;
}

export const PopularShowcase: React.FC<PopularShowcaseProps> = ({
  onAddToOrder,
  onNavigate,
}) => {
  const popularIds = ['box-munchy', 'hogie-mixed', 'hogie-doner', 'pizza-special', 'burger-double-decker', 'side-garlic-cheese-chips'];
  const popularItems = MENU_ITEMS.filter((i) => popularIds.includes(i.id));

  return (
    <section className="py-8 sm:py-14 2xl:py-16 bg-[#0c0c0e] border-y border-red-900/20 relative">
      <div className="fluid-4k-container px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs 2xl:text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span>Carrickfergus Cravings</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl 2xl:text-4xl font-bold text-white mt-1">
              Top Customer Favourites
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-red-400 hover:text-white text-xs sm:text-sm 2xl:text-base font-bold flex items-center gap-1.5 group self-start sm:self-auto transition-colors"
          >
            <span>See complete menu (100+ items)</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Popular Grid with 4K Scaling & Soft Edges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-6 gap-4 sm:gap-6 2xl:gap-7">
          {popularItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="cartoon-card overflow-hidden flex flex-col justify-between group relative h-full rounded-3xl"
            >
              {/* Realistic Food Photo with Soft Rounded Inner Framing */}
              {item.image && (
                <div className="relative w-full h-48 sm:h-52 2xl:h-56 overflow-hidden bg-black border-b border-red-900/30">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141318] via-transparent to-transparent pointer-events-none" />
                  
                  {/* Badge over photo */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.badge && (
                      <span className="text-[10px] 2xl:text-xs font-black uppercase px-2.5 py-1 rounded-xl bg-red-600 text-white shadow-md">
                        {item.badge}
                      </span>
                    )}
                    {item.spicy && (
                      <span className="text-[10px] 2xl:text-xs font-black uppercase px-2 py-0.5 rounded-lg bg-amber-500 text-black shadow-md">
                        Spicy
                      </span>
                    )}
                  </div>

                  {/* Price Tag over photo with soft glass effect */}
                  <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md px-3 py-1 rounded-2xl border border-red-500/40 shadow-lg">
                    <span className="font-mono text-sm 2xl:text-base font-black text-amber-400">
                      £{item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 2xl:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg 2xl:text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-xs 2xl:text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Action Buttons (Red and Black/Amber theme, soft edges) */}
                <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center gap-2">
                  <button
                    onClick={() =>
                      onAddToOrder({
                        itemId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                      })
                    }
                    className="cartoon-btn-primary flex-1 py-2.5 px-3 rounded-2xl text-xs 2xl:text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Food Cart</span>
                  </button>

                  <a
                    href={`tel:${SHOP_INFO.phone}`}
                    className="p-2.5 rounded-2xl bg-neutral-900/90 hover:bg-red-600 text-white transition-colors border border-neutral-700/80"
                    title="Call now to order this"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
