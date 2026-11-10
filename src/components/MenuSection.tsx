import React, { useState, useMemo } from 'react';
import { Search, Flame, Leaf, Plus, Phone, Check } from 'lucide-react';
import { CATEGORIES, MENU_ITEMS, SHOP_INFO, MenuItem } from '../data/menuData';
import { OrderItem } from '../types';

interface MenuSectionProps {
  onAddToOrder: (item: OrderItem) => void;
  initialCategory?: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onAddToOrder,
  initialCategory = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSpicyOnly, setFilterSpicyOnly] = useState<boolean>(false);
  const [filterVegOnly, setFilterVegOnly] = useState<boolean>(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, { name: string; price: number }>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Filter items based on category, search query, dietary flags
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category check
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Dietary checks
      if (filterSpicyOnly && !item.spicy) return false;
      if (filterVegOnly && !item.vegetarian) return false;

      // Search check
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchBadge = item.badge?.toLowerCase().includes(query);
        return matchName || matchDesc || matchBadge;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, filterSpicyOnly, filterVegOnly]);

  const handleVariantSelect = (itemId: string, variant: { name: string; price: number }) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [itemId]: variant,
    }));
  };

  const handleAddItem = (item: MenuItem) => {
    const chosenVariant = selectedVariants[item.id] || (item.variants ? item.variants[0] : undefined);
    const priceToUse = chosenVariant ? chosenVariant.price : item.price;
    const variantName = chosenVariant ? chosenVariant.name : undefined;

    onAddToOrder({
      itemId: item.id,
      name: item.name,
      variant: variantName,
      price: priceToUse,
      quantity: 1,
    });

    setAddedNotice(item.name);
    setTimeout(() => setAddedNotice(null), 1800);
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Toast alert when item is added (Red, no green) */}
      {addedNotice && (
        <div className="fixed top-20 right-4 z-50 bg-red-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce border border-red-400">
          <Check className="w-4 h-4 text-white" />
          <span>Added "{addedNotice}" to Order Notepad!</span>
        </div>
      )}

      {/* Menu Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-bold mb-2">
            <span>🥙 Carrickfergus Takeaway Menu</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Our Complete Menu
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Pick your favorites, add them to your notepad, then tap to call <strong className="text-red-400">{SHOP_INFO.displayPhone}</strong>.
          </p>
        </div>

        {/* Quick Call Button */}
        <a
          href={`tel:${SHOP_INFO.phone}`}
          className="cartoon-btn-call px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 self-start md:self-auto shadow-md"
        >
          <Phone className="w-4 h-4" />
          <span>Call: {SHOP_INFO.displayPhone}</span>
        </a>
      </div>

      {/* Search & Dietary Filters Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#111114] p-3 rounded-2xl border border-red-900/30">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search kebabs, hogies, pizzas, burgers, chips, dips..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-red-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dietary Toggles (No green) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setFilterSpicyOnly(!filterSpicyOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filterSpicyOnly
                ? 'bg-red-600 text-white border border-red-400'
                : 'bg-neutral-900 text-slate-300 border border-neutral-700 hover:border-red-400/50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Spicy Only</span>
          </button>

          <button
            onClick={() => setFilterVegOnly(!filterVegOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filterVegOnly
                ? 'bg-amber-500 text-black border border-amber-400'
                : 'bg-neutral-900 text-slate-300 border border-neutral-700 hover:border-amber-400/50'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-amber-400" />
            <span>Veg Only</span>
          </button>
        </div>
      </div>

      {/* Category Tabs (Segmented Buttons) */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105'
                    : 'bg-neutral-900/80 text-slate-300 border border-neutral-800 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Description Notice */}
      {selectedCategory !== 'all' && (
        <div className="mb-6 p-3 rounded-xl bg-neutral-900/60 border border-red-950/50 text-xs text-amber-300 flex items-center justify-between">
          <span>{CATEGORIES.find((c) => c.id === selectedCategory)?.description}</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-red-400 hover:text-white font-bold underline ml-2 shrink-0"
          >
            Show All
          </button>
        </div>
      )}

      {/* Items Grid with Realistic Food Photos */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 cartoon-card p-8">
          <p className="text-3xl mb-2">🔍</p>
          <h3 className="font-display text-lg font-bold text-white">No items found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the dietary filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilterSpicyOnly(false);
              setFilterVegOnly(false);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const currentVariant = selectedVariants[item.id] || (item.variants ? item.variants[0] : null);
            const displayPrice = currentVariant ? currentVariant.price : item.price;

            return (
              <div
                key={item.id}
                className="cartoon-card overflow-hidden flex flex-col justify-between group transition-all duration-200 hover:-translate-y-0.5"
              >
                {/* Realistic Menu Item Photo */}
                {item.image && (
                  <div className="relative w-full h-44 overflow-hidden bg-black border-b border-red-900/30">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-transparent to-transparent pointer-events-none" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                      {item.badge && (
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-red-600 text-white shadow">
                          {item.badge}
                        </span>
                      )}
                      {item.spicy && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500 text-black shadow">
                          Spicy
                        </span>
                      )}
                      {item.vegetarian && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-neutral-900 text-white border border-neutral-600 shadow">
                          Veg
                        </span>
                      )}
                    </div>

                    {/* Price tag over photo */}
                    <div className="absolute bottom-2.5 right-2.5 bg-black/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-red-500/40">
                      <span className="font-mono text-sm font-black text-amber-400">
                        £{displayPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {!item.image && (
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {item.badge && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-red-600 text-white">
                              {item.badge}
                            </span>
                          )}
                          {item.spicy && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500 text-black">
                              Spicy
                            </span>
                          )}
                          {item.vegetarian && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-neutral-800 text-white">
                              Veg
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-base font-black text-amber-400 shrink-0">
                          £{displayPrice.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Optional Variants Selector */}
                    {item.variants && item.variants.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-neutral-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Choose Style / Size:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.variants.map((v) => {
                            const isSelected = currentVariant?.name === v.name;
                            return (
                              <button
                                key={v.name}
                                onClick={() => handleVariantSelect(item.id, v)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                  isSelected
                                    ? 'bg-red-600 text-white font-bold shadow'
                                    : 'bg-neutral-800 text-slate-300 hover:bg-neutral-700'
                                }`}
                              >
                                <span>{v.name}</span>
                                <span className="ml-1 opacity-80">£{v.price.toFixed(2)}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center gap-2">
                    <button
                      onClick={() => handleAddItem(item)}
                      className="cartoon-btn-primary flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 tracking-wide shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Order Notepad</span>
                    </button>

                    <a
                      href={`tel:${SHOP_INFO.phone}`}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-red-600 text-white transition-colors border border-neutral-700"
                      title={`Call now to order ${item.name}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Takeaway Info */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#181014] via-[#200e12] to-[#181014] border border-red-600/30 text-center">
        <h4 className="font-display text-xl font-bold text-white mb-2">
          Ordering for the Family or a Late Night Session?
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-4">
          All food is freshly oven-baked and prepared upon order. Call our counter directly on <strong className="text-red-400">{SHOP_INFO.displayPhone}</strong> for fast collection or quick local delivery across Carrickfergus!
        </p>
        <a
          href={`tel:${SHOP_INFO.phone}`}
          className="cartoon-btn-call inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-xl"
        >
          <Phone className="w-4 h-4 animate-bounce" />
          <span>Call 028 9458 1596 Now</span>
        </a>
      </div>

    </section>
  );
};
