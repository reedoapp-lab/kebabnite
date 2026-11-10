import React, { useState, useEffect } from 'react';
import { Phone, Clock, Sparkles, Flame, CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { SHOP_INFO, WEEKDAY_SPECIALS } from '../data/menuData';
import { OrderItem, PageId } from '../types';

interface TodaysMenuPageProps {
  onAddToOrder: (item: OrderItem) => void;
  onNavigate: (page: PageId) => void;
}

export const TodaysMenuPage: React.FC<TodaysMenuPageProps> = ({ onAddToOrder, onNavigate }) => {
  const [dayName, setDayName] = useState<string>('Monday');
  const [ukTimeStr, setUkTimeStr] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Opens 4:00 PM');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Selected quick-build options
  const [selectedMeat, setSelectedMeat] = useState<string>('Doner Meat');
  const [selectedBread, setSelectedBread] = useState<string>('Fresh Pita');
  const [selectedSauce, setSelectedSauce] = useState<string>('House Garlic Mayo');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const ukFormatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/London',
          weekday: 'long',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        const parts = ukFormatter.formatToParts(now);
        let weekday = '';
        let hour = 0;
        let minute = 0;

        parts.forEach((p) => {
          if (p.type === 'weekday') weekday = p.value;
          if (p.type === 'hour') hour = parseInt(p.value, 10);
          if (p.type === 'minute') minute = parseInt(p.value, 10);
        });

        setDayName(weekday);
        setUkTimeStr(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);

        const isWeekendLate = weekday === 'Friday' || weekday === 'Saturday';
        if (hour >= 16) {
          setIsOpen(true);
          setStatusMessage(isWeekendLate ? 'OPEN NOW (Till 1:00 AM)' : 'OPEN NOW (Till Midnight)');
        } else if (hour === 0 && isWeekendLate) {
          setIsOpen(true);
          setStatusMessage('OPEN NOW (Late Night Till 1:00 AM)');
        } else {
          setIsOpen(false);
          setStatusMessage('OPENS TODAY AT 4:00 PM');
        }
      } catch (e) {
        console.error(e);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Today's special deal
  const currentDeal = WEEKDAY_SPECIALS.find(
    (d) => d.day.toLowerCase() === dayName.toLowerCase()
  ) || {
    day: dayName,
    title: 'Weekend Kebab Feast & Munchy Box Deal',
    price: 15.0,
    regularPrice: 20.0,
    desc: 'Succulent oven-roasted doner & chicken kebab with hot seasoned chips, dips and cold soft drink.',
    image: '/assets/food/munchy_box.jpg',
  };

  // Top fresh oven picks for today
  const todaysChefPicks = [
    {
      id: 'kebab-doner-large',
      name: 'Oven-Roasted Doner Kebab',
      category: 'Kebabs',
      price: 7.5,
      desc: 'Thinly sliced tender spiced doner meat roasted in our ovens, served in warm fresh pita bread with crisp salad & garlic mayo.',
      image: '/assets/food/doner_kebab.jpg',
      badge: 'Bestseller',
    },
    {
      id: 'hogie-mixed',
      name: 'Signature Mixed Kebab Naan Hogie',
      category: 'Hogies',
      price: 11.0,
      desc: 'Doner and roast chicken rolled in a massive fresh warm naan with seasoned chips, melted cheddar, salad & house sauce.',
      image: '/assets/food/signature_hogie.jpg',
      badge: 'Chef Favorite',
    },
    {
      id: 'pizza-special-12',
      name: '12" Kebab Nite Special Pizza',
      category: 'Pizzas',
      price: 12.0,
      desc: 'Freshly stretched dough baked in our hot oven with 100% mozzarella, doner meat, chicken, onions, peppers & chilli swirl.',
      image: '/assets/food/oven_pizza.jpg',
      badge: 'Oven Baked',
    },
    {
      id: 'munchy-10',
      name: '10" Super Munchy Box',
      category: 'Meal Deals',
      price: 11.0,
      desc: 'Box filled with doner meat, chicken goujons, onion rings, sausages, hot chips, 2 dips & salad.',
      image: '/assets/food/munchy_box.jpg',
      badge: 'Unbeatable Value',
    },
    {
      id: 'side-garlic-chips',
      name: 'Garlic Butter & Cheese Chips',
      category: 'Sides & Dips',
      price: 4.8,
      desc: 'Golden crisp chips tossed in aromatic garlic butter and smothered with grated melted cheddar cheese.',
      image: '/assets/food/garlic_cheese_chips.jpg',
      badge: 'Customer Choice',
    },
    {
      id: 'shake-choc',
      name: 'Deluxe Thick Milkshake',
      category: 'Drinks & Shakes',
      price: 3.5,
      desc: 'Ultra-thick creamy milkshake blended with rich dairy ice cream. Chocolate, strawberry or vanilla.',
      image: '/assets/food/thick_milkshake.jpg',
      badge: 'Sweet Treat',
    },
  ];

  const handleQuickAdd = (item: OrderItem) => {
    onAddToOrder(item);
    setAddedNotice(`Added "${item.name}" to your order list!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  const handleBuildSupperAdd = () => {
    const item: OrderItem = {
      itemId: `custom-${Date.now()}`,
      name: `Custom Supper: ${selectedMeat} in ${selectedBread}`,
      price: 8.5,
      quantity: 1,
      notes: `Sauce: ${selectedSauce}, Fresh Salad included`,
    };
    handleQuickAdd(item);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed top-24 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span className="text-xs sm:text-sm font-bold">{addedNotice}</span>
        </div>
      )}

      {/* Top Hero Banner with Real-time Clock & Store Status */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#170e13] via-[#240c14] to-[#170e13] border-2 border-red-600/40 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/50 text-red-400 text-xs font-bold">
              <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 live-pulse' : 'bg-amber-400'}`} />
              <span>LIVE KITCHEN STATUS · {dayName.toUpperCase()}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Today's Menu & Specials
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl">
              Freshly roasted oven kebabs, hot pizzas, and hearty hogies prepared to order at 18A High Street, Carrickfergus.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm font-medium text-slate-300 pt-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Clock className="w-4 h-4" />
                <span>UK Time: {ukTimeStr || '4:00 PM'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-emerald-400 live-pulse' : 'bg-amber-400'}`} />
                <span className="font-bold text-white">{statusMessage}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Collection & Carrickfergus Delivery</span>
              </div>
            </div>
          </div>

          {/* Quick Call Action Card */}
          <div className="shrink-0 cartoon-card p-5 bg-[#0e0e12] border border-red-600/50 flex flex-col items-center text-center space-y-3 w-full sm:w-auto min-w-[260px]">
            <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
              Quick Phone Ordering
            </span>
            <div className="font-display text-2xl font-black text-white font-mono">
              {SHOP_INFO.displayPhone}
            </div>
            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="cartoon-btn-call w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span>Tap to Call & Order</span>
            </a>
            <span className="text-[10px] text-slate-400">
              Kitchen prep time approx 15–20 mins
            </span>
          </div>
        </div>
      </div>

      {/* Today's Live Deal of the Day (Spotlight) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
              Tonight's Featured Offer
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {dayName}'s Live £15 Special
            </h2>
          </div>
          <button
            onClick={() => onNavigate('deals')}
            className="text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>See All Weekday Deals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="cartoon-card overflow-hidden border-2 border-red-500 bg-gradient-to-r from-[#191116] via-[#140e12] to-[#191116] grid grid-cols-1 md:grid-cols-12 shadow-2xl">
          {currentDeal.image && (
            <div className="md:col-span-5 relative min-h-[220px] md:min-h-full">
              <img
                src={currentDeal.image}
                alt={currentDeal.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Today's Live Special</span>
              </div>
            </div>
          )}

          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                  {currentDeal.day} Exclusive
                </span>
                <span className="text-xs text-slate-400 line-through">
                  Regular £{currentDeal.regularPrice.toFixed(2)}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-2">
                {currentDeal.title}
              </h3>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-mono text-3xl font-black text-amber-400">
                  £{currentDeal.price.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-red-400">
                  Save £{(currentDeal.regularPrice - currentDeal.price).toFixed(2)} Tonight!
                </span>
              </div>

              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                {currentDeal.desc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() =>
                  handleQuickAdd({
                    itemId: `special-${currentDeal.day.toLowerCase()}`,
                    name: `${currentDeal.day} Special: ${currentDeal.title}`,
                    price: currentDeal.price,
                    quantity: 1,
                  })
                }
                className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-red-500/40 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Add Deal to Order Notepad</span>
              </button>

              <a
                href={`tel:${SHOP_INFO.phone}`}
                className="cartoon-btn-call w-full sm:w-auto py-3 px-6 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <Phone className="w-4 h-4 animate-bounce" />
                <span>Call to Order Now</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Fresh Oven-Roasted Chef Highlights */}
      <section className="space-y-4 pt-4">
        <div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
            Most Popular For Tonight
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Today's Fresh Oven Picks
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Carefully seasoned meats roasted to juicy perfection in our hot ovens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaysChefPicks.map((item) => (
            <div
              key={item.id}
              className="cartoon-card overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-red-500/70"
            >
              <div className="relative w-full h-44 overflow-hidden bg-black">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-sm border border-red-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-400">
                  {item.badge}
                </div>
                <div className="absolute top-2.5 right-2.5 bg-red-600 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-white shadow-md">
                  £{item.price.toFixed(2)}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                    {item.category}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white mt-0.5 group-hover:text-red-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                  <button
                    onClick={() =>
                      handleQuickAdd({
                        itemId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                      })
                    }
                    className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-red-500/30 text-white text-xs font-bold transition-all text-center"
                  >
                    + Add to Order
                  </button>
                  <a
                    href={`tel:${SHOP_INFO.phone}`}
                    className="cartoon-btn-call py-2 px-3.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Quick Supper Builder */}
      <section className="cartoon-card p-6 sm:p-8 bg-gradient-to-r from-[#181116] via-[#1f0d14] to-[#181116] border border-red-600/40 space-y-6">
        <div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
            Customise Your Meal
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
            Build Tonight's Perfect Kebab Supper
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Pick your oven-roasted meat, bread, and signature sauce. We'll note it down for your phone order.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Meat Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wide block">
              1. Choose Oven-Roasted Meat
            </label>
            <div className="space-y-2">
              {['Doner Meat', 'Roast Chicken Kebab', 'Mixed Meat (Doner + Chicken)'].map((meat) => (
                <button
                  key={meat}
                  type="button"
                  onClick={() => setSelectedMeat(meat)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedMeat === meat
                      ? 'bg-red-600/25 border-red-500 text-white shadow-sm'
                      : 'bg-neutral-900/80 border-neutral-800 text-slate-300 hover:border-neutral-700'
                  }`}
                >
                  {meat}
                </button>
              ))}
            </div>
          </div>

          {/* Bread Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wide block">
              2. Served In
            </label>
            <div className="space-y-2">
              {['Fresh Pita Bread', 'Large Warm Naan Bread (+£1.00)', 'On Hot Fresh Chips'].map((bread) => (
                <button
                  key={bread}
                  type="button"
                  onClick={() => setSelectedBread(bread)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedBread === bread
                      ? 'bg-red-600/25 border-red-500 text-white shadow-sm'
                      : 'bg-neutral-900/80 border-neutral-800 text-slate-300 hover:border-neutral-700'
                  }`}
                >
                  {bread}
                </button>
              ))}
            </div>
          </div>

          {/* Sauce Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wide block">
              3. Signature Sauce
            </label>
            <div className="space-y-2">
              {['House Garlic Mayo', 'House Chilli Sauce', 'Sweet Chilli Sauce', 'BBQ Sauce'].map((sauce) => (
                <button
                  key={sauce}
                  type="button"
                  onClick={() => setSelectedSauce(sauce)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedSauce === sauce
                      ? 'bg-red-600/25 border-red-500 text-white shadow-sm'
                      : 'bg-neutral-900/80 border-neutral-800 text-slate-300 hover:border-neutral-700'
                  }`}
                >
                  {sauce}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Builder Summary & Action */}
        <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">Selected Combination:</div>
            <div className="font-display text-base font-bold text-white">
              {selectedMeat} in {selectedBread} with {selectedSauce}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleBuildSupperAdd}
              className="cartoon-btn-primary flex-1 sm:flex-none px-5 py-3 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md"
            >
              + Add Custom Supper (£8.50)
            </button>
            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="cartoon-btn-call flex-1 sm:flex-none px-5 py-3 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <Phone className="w-4 h-4" />
              <span>Call to Order</span>
            </a>
          </div>
        </div>
      </section>

      {/* Bottom CTA to browse all 90+ menu items */}
      <div className="text-center py-6">
        <p className="text-xs sm:text-sm text-slate-400 mb-3">
          Looking for burgers, hot dogs, fish bar, pizzas, or Indian starters?
        </p>
        <button
          onClick={() => {
            onNavigate('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cartoon-btn-primary px-8 py-3.5 rounded-2xl text-white font-display text-base font-bold shadow-xl hover:scale-105 inline-flex items-center gap-2"
        >
          <span>Explore All 90+ Menu Items</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
