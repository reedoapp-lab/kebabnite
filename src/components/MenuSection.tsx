import React, { useState, useMemo } from 'react';
import { Search, Flame, Leaf, Plus, Phone, Check } from 'lucide-react';
import { CATEGORIES, MENU_ITEMS, SHOP_INFO, MenuItem } from '../data/menuData';
import { OrderItem } from '../types';

interface MenuSectionProps {
  onAddToOrder: (item: OrderItem) => void;
  onOpenCart?: () => void;
  initialCategory?: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onAddToOrder,
  onOpenCart,
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
    <section className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 fluid-4k-container">
      
      {/* Toast alert when item is added (Red, soft edges) */}
      {addedNotice && (
        <div className="fixed top-20 right-4 z-50 bg-red-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce border border-red-400">
          <Check className="w-4 h-4 text-white" />
          <span>Added "{addedNotice}" to Food Cart!</span>
        </div>
      )}

      {/* Menu Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs 2xl:text-sm font-bold mb-2">
            <span>🥙 Carrickfergus Takeaway Menu</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl 2xl:text-5xl font-bold text-white tracking-tight">
            Our Complete Menu
          </h1>
          <p className="text-xs sm:text-sm 2xl:text-base text-slate-300 mt-1 max-w-2xl">
            Pick your favourites, customize items, and order online for fast local delivery or collection.
          </p>
        </div>

        {/* View Food Cart Button */}
        {onOpenCart && (
          <button
            onClick={onOpenCart}
            className="cartoon-btn-primary px-5 py-2.5 2xl:px-6 2xl:py-3 rounded-2xl text-white text-xs 2xl:text-sm font-bold flex items-center justify-center gap-2 self-stretch sm:self-auto shadow-md"
          >
            <span>View Food Cart</span>
          </button>
        )}
      </div>

      {/* Search & Dietary Filters Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 bg-[#111114] p-3 2xl:p-4 rounded-3xl border border-red-900/30 shadow-lg">
        
        {/* Search input with soft edges */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search kebabs, hogies, pizzas, burgers, chips, dips..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 text-white placeholder-slate-400 text-xs sm:text-sm 2xl:text-base focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
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

        {/* Dietary Toggles */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setFilterSpicyOnly(!filterSpicyOnly)}
            className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-2xl text-xs 2xl:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              filterSpicyOnly
                ? 'bg-red-600 text-white border border-red-400 shadow-md'
                : 'bg-neutral-900 text-slate-300 border border-neutral-700 hover:border-red-400/50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Spicy Only</span>
          </button>

          <button
            onClick={() => setFilterVegOnly(!filterVegOnly)}
            className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-2xl text-xs 2xl:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              filterVegOnly
                ? 'bg-amber-500 text-black border border-amber-400 shadow-md'
                : 'bg-neutral-900 text-slate-300 border border-neutral-700 hover:border-amber-400/50'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-amber-400" />
            <span>Veg Only</span>
          </button>
        </div>
      </div>

      {/* Category Tabs - smooth horizontal swiping */}
      <div className="mb-6 overflow-x-auto pb-2 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs 2xl:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
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
        <div className="mb-6 p-3.5 rounded-2xl bg-neutral-900/60 border border-red-950/50 text-xs 2xl:text-sm text-amber-300 flex items-center justify-between">
          <span>{CATEGORIES.find((c) => c.id === selectedCategory)?.description}</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-red-400 hover:text-white font-bold underline ml-2 shrink-0"
          >
            Show All
          </button>
        </div>
      )}

      {/* Items Grid with 4K Scaling & Soft Edges */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 cartoon-card p-8 rounded-3xl">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-4 sm:gap-5 2xl:gap-6">
          {filteredItems.map((item) => {
            const currentVariant = selectedVariants[item.id] || (item.variants ? item.variants[0] : null);
            const displayPrice = currentVariant ? currentVariant.price : item.price;

            return (
              <div
                key={item.id}
                className="cartoon-card overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 h-full rounded-3xl"
              >
                {/* Realistic Menu Item Photo */}
                {item.image && (
                  <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-black border-b border-red-900/30">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141318] via-transparent to-transparent pointer-events-none" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                      {item.badge && (
                        <span className="text-[10px] 2xl:text-xs font-black uppercase px-2.5 py-0.5 rounded-lg bg-red-600 text-white shadow">
                          {item.badge}
                        </span>
                      )}
                      {item.spicy && (
                        <span className="text-[10px] 2xl:text-xs font-black uppercase px-2 py-0.5 rounded-lg bg-amber-500 text-black shadow">
                          Spicy
                        </span>
                      )}
                      {item.vegetarian && (
                        <span className="text-[10px] 2xl:text-xs font-black uppercase px-2 py-0.5 rounded-lg bg-neutral-900 text-white border border-neutral-600 shadow">
                          Veg
                        </span>
                      )}
                    </div>

                    {/* Price tag over photo */}
                    <div className="absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-red-500/40">
                      <span className="font-mono text-sm 2xl:text-base font-black text-amber-400">
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
                  <div className="mt-4 pt-3 border-t border-neutral-800">
                    <button
                      onClick={() => handleAddItem(item)}
                      className="cartoon-btn-primary w-full py-2.5 px-3 rounded-2xl text-xs 2xl:text-sm font-bold flex items-center justify-center gap-1.5 tracking-wide shadow-md active:scale-95 transition-transform"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add to Food Cart</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Takeaway Info */}
      <div className="mt-12 2xl:mt-16 p-6 sm:p-8 2xl:p-10 rounded-3xl bg-gradient-to-r from-[#181014] via-[#200e12] to-[#181014] border border-red-600/30 text-center space-y-4 shadow-2xl">
        <h4 className="font-display text-xl sm:text-2xl 2xl:text-3xl font-bold text-white">
          Ordering for the Family or a Late Night Session?
        </h4>
        <p className="text-xs sm:text-sm 2xl:text-base text-slate-300 max-w-xl 2xl:max-w-2xl mx-auto leading-relaxed">
          All food is freshly oven-baked and prepared upon order. Order online now for fast counter pickup or hot local delivery across Carrickfergus!
        </p>
        <div>
          <button
            onClick={onOpenCart}
            className="cartoon-btn-primary inline-flex items-center gap-2 px-7 sm:px-9 py-3.5 rounded-2xl text-sm 2xl:text-base font-bold text-white shadow-xl active:scale-95 transition-transform"
          >
            <span>View Food Cart & Order Online</span>
          </button>
        </div>
      </div>

    </section>
  );
};
