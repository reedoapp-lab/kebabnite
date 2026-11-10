import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PopularShowcase } from './components/PopularShowcase';
import { WeekdaySpecialsBanner } from './components/WeekdaySpecialsBanner';
import { MenuSection } from './components/MenuSection';
import { DealsPage } from './components/DealsPage';
import { LocationPage } from './components/LocationPage';
import { HowToOrderPage } from './components/HowToOrderPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { Footer } from './components/Footer';
import { MobileBottomCallBar } from './components/MobileBottomCallBar';
import { OrderDrawer } from './components/OrderDrawer';
import { TodayLiveTicker } from './components/TodayLiveTicker';
import { TodaysMenuPage } from './components/TodaysMenuPage';
import { PageId, OrderItem } from './types';
import { SHOP_INFO } from './data/menuData';
import { Phone, Star } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [orderList, setOrderList] = useState<OrderItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Add item or increment quantity in notepad
  const handleAddToOrder = (newItem: OrderItem) => {
    setOrderList((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.itemId === newItem.itemId && item.variant === newItem.variant
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setOrderList((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setOrderList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearOrder = () => {
    setOrderList([]);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Global Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        orderList={orderList}
        setIsDrawerOpen={setIsDrawerOpen}
      />

      {/* Real-time Ticker & Store Clock (Always visible across pages) */}
      <TodayLiveTicker onNavigate={setCurrentPage} />

      {/* Main Content Area Based on Page */}
      <main className="flex-1 pb-16 sm:pb-0">
        {currentPage === 'home' && (
          <>
            <HeroSection onNavigate={setCurrentPage} />

            {/* Quick Story & Quality Banner (Oven roasted, no charcoal/stone) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="cartoon-card p-4 sm:p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-xl shrink-0">
                    🔥
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">Fresh Oven Roasted Flavour</h4>
                    <p className="text-xs text-slate-300">Succulent seasoned meats roasted to juicy perfection in our ovens.</p>
                  </div>
                </div>

                <div className="cartoon-card p-4 sm:p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl shrink-0">
                    🥖
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">Signature Naan Hogies</h4>
                    <p className="text-xs text-slate-300">Rolled fresh with chips, melted cheese & house sauce.</p>
                  </div>
                </div>

                <div className="cartoon-card p-4 sm:p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-xl shrink-0">
                    ⚡
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">Quick Phone Ordering</h4>
                    <p className="text-xs text-slate-300">One tap on your phone, fast collection or delivery.</p>
                  </div>
                </div>
              </div>
            </section>

            <PopularShowcase onAddToOrder={handleAddToOrder} onNavigate={setCurrentPage} />

            <WeekdaySpecialsBanner onAddToOrder={handleAddToOrder} />

            {/* Local Carrickfergus Testimonials / Community Love */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-red-500 block mb-1">
                  Local Word on High Street
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Why Carrickfergus Loves Kebab Nite
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="cartoon-card p-5 space-y-3 bg-gradient-to-b from-[#141418] to-[#0c0c0e]">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    "The Mixed Hogie is simply unmatched in Carrick. Naan was warm and soft, packed full of meat and the garlic mayo is addictive. Piping hot on delivery!"
                  </p>
                  <div className="text-xs text-amber-400 font-bold">
                    — Ryan M., Carrickfergus
                  </div>
                </div>

                <div className="cartoon-card p-5 space-y-3 bg-gradient-to-b from-[#141418] to-[#0c0c0e]">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    "The 10" Munchy Box feeds two of us easily with leftovers. Chicken goujons are crispy and the doner is proper quality, not greasy."
                  </p>
                  <div className="text-xs text-amber-400 font-bold">
                    — Claire D., Greenisland
                  </div>
                </div>

                <div className="cartoon-card p-5 space-y-3 bg-gradient-to-b from-[#141418] to-[#0c0c0e]">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    "Called at 11:30 PM on a Friday night, order was ready for collection in under 15 minutes. Staff on the phone are always friendly and polite."
                  </p>
                  <div className="text-xs text-amber-400 font-bold">
                    — Mark S., Eden
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Call & Location Banner (Black & Red theme) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="cartoon-card p-6 sm:p-10 bg-gradient-to-r from-[#170e12] via-[#220d14] to-[#170e12] border border-red-600/40 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs font-black uppercase tracking-wider text-red-500">
                    Ready to eat?
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    Place Your Order by Phone Now
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                    18A High street, Carrickfergus · Call <strong className="text-red-400">{SHOP_INFO.displayPhone}</strong> for immediate counter pickup or fast local delivery.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <a
                    href={`tel:${SHOP_INFO.phone}`}
                    className="cartoon-btn-call px-6 py-3.5 rounded-2xl flex items-center gap-2 text-white font-display text-base font-bold shadow-xl whitespace-nowrap"
                  >
                    <Phone className="w-5 h-5 animate-pulse" />
                    <span>Call {SHOP_INFO.displayPhone}</span>
                  </a>

                  <button
                    onClick={() => {
                      setCurrentPage('menu');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="cartoon-btn-primary px-5 py-3.5 rounded-2xl text-white font-display text-sm font-bold shadow-md whitespace-nowrap"
                  >
                    View Full Menu
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {currentPage === 'todays-menu' && (
          <TodaysMenuPage
            onAddToOrder={handleAddToOrder}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'menu' && (
          <MenuSection onAddToOrder={handleAddToOrder} />
        )}

        {currentPage === 'deals' && (
          <DealsPage onAddToOrder={handleAddToOrder} />
        )}

        {currentPage === 'location' && (
          <LocationPage />
        )}

        {currentPage === 'how-to-order' && (
          <HowToOrderPage
            onNavigate={setCurrentPage}
            onOpenNotepad={() => setIsDrawerOpen(true)}
          />
        )}

        {currentPage === 'privacy-policy' && (
          <PrivacyPolicyPage
            onNavigate={setCurrentPage}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={setCurrentPage} />

      {/* Mobile Bottom Sticky Call Bar */}
      <MobileBottomCallBar
        orderList={orderList}
        setIsDrawerOpen={setIsDrawerOpen}
      />

      {/* Order Notepad Slide-Over Drawer */}
      <OrderDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderList={orderList}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearOrder={handleClearOrder}
      />

    </div>
  );
}
