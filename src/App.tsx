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
import { MyOrdersPage } from './components/MyOrdersPage';
import { NeedHelpBot } from './components/NeedHelpBot';
import { Footer } from './components/Footer';
import { MobileBottomCallBar } from './components/MobileBottomCallBar';
import { OrderDrawer } from './components/OrderDrawer';
import { TodayLiveTicker } from './components/TodayLiveTicker';
import { TodaysMenuPage } from './components/TodaysMenuPage';
import { CheckoutModal } from './components/CheckoutModal';
import { AddedToCartToast, ToastData } from './components/AddedToCartToast';
import { PageId, OrderItem } from './types';
import { SHOP_INFO } from './data/menuData';
import { Phone, Star } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [orderList, setOrderList] = useState<OrderItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [cartToast, setCartToast] = useState<ToastData | null>(null);

  // Add item or increment quantity in food cart with subtle UX toast
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

    // Pop-up notification for immediate tactile feedback
    setCartToast({
      item: newItem,
      id: Date.now(),
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
    <div className="min-h-screen bg-[#08080a] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white w-full overflow-x-hidden relative">
      
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
      <main key={currentPage} className="flex-1 pb-28 sm:pb-0 w-full overflow-x-hidden animate-soft-fade">
        {currentPage === 'home' && (
          <>
            <HeroSection onNavigate={setCurrentPage} />

            {/* Quick Story, Mascot & Quality Features (Vertical layout paired with transparent Mascot on black background) */}
            <section className="fluid-4k-container px-3 sm:px-6 lg:px-8 py-6 sm:py-10 2xl:py-14">
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 sm:gap-8 lg:gap-12 2xl:gap-16">
                
                {/* Mascot Showcase: Transparent PNG integrated directly onto the black background */}
                <div className="md:col-span-5 flex items-center justify-center relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 m-auto w-56 h-56 sm:w-72 sm:h-72 2xl:w-96 2xl:h-96 rounded-full bg-gradient-to-tr from-red-600/20 via-amber-500/10 to-transparent blur-3xl pointer-events-none"
                  />
                  <img
                    src="/assets/aistudio/Cheerful_Owl_Presenting_Kebab_Box_1a989572.png"
                    alt="Kebab Nite Owl Mascot presenting a fresh Kebab Nite box"
                    className="relative z-10 w-full max-w-[240px] sm:max-w-[300px] lg:max-w-[360px] 2xl:max-w-[440px] h-auto object-contain select-none filter drop-shadow-[0_20px_40px_rgba(220,38,38,0.22)] transition-transform duration-500 ease-out hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Three Signature Features Stacked Vertically */}
                <div className="md:col-span-7 flex flex-col justify-center gap-3.5 sm:gap-4 2xl:gap-5">
                  <div className="cartoon-card p-4 sm:p-5 lg:p-6 2xl:p-7 flex items-center gap-4 sm:gap-5 rounded-2xl sm:rounded-3xl">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 2xl:w-16 2xl:h-16 rounded-2xl bg-red-600/20 border border-red-500/25 text-red-500 flex items-center justify-center font-bold text-2xl 2xl:text-3xl shrink-0 shadow-inner">
                      🔥
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-base sm:text-lg 2xl:text-xl text-white">
                        Fresh Oven Roasted Flavour
                      </h4>
                      <p className="text-xs sm:text-sm 2xl:text-base text-slate-300 mt-0.5 leading-relaxed">
                        Succulent seasoned meats roasted to juicy perfection in our ovens.
                      </p>
                    </div>
                  </div>

                  <div className="cartoon-card p-4 sm:p-5 lg:p-6 2xl:p-7 flex items-center gap-4 sm:gap-5 rounded-2xl sm:rounded-3xl">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 2xl:w-16 2xl:h-16 rounded-2xl bg-amber-500/20 border border-amber-400/25 text-amber-400 flex items-center justify-center font-bold text-2xl 2xl:text-3xl shrink-0 shadow-inner">
                      🥖
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-base sm:text-lg 2xl:text-xl text-white">
                        Signature Naan Hogies
                      </h4>
                      <p className="text-xs sm:text-sm 2xl:text-base text-slate-300 mt-0.5 leading-relaxed">
                        Rolled fresh with chips, melted cheese & house sauce.
                      </p>
                    </div>
                  </div>

                  <div className="cartoon-card p-4 sm:p-5 lg:p-6 2xl:p-7 flex items-center gap-4 sm:gap-5 rounded-2xl sm:rounded-3xl">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 2xl:w-16 2xl:h-16 rounded-2xl bg-red-600/20 border border-red-500/25 text-red-500 flex items-center justify-center font-bold text-2xl 2xl:text-3xl shrink-0 shadow-inner">
                      ⚡
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-base sm:text-lg 2xl:text-xl text-white">
                        Fast Online Ordering
                      </h4>
                      <p className="text-xs sm:text-sm 2xl:text-base text-slate-300 mt-0.5 leading-relaxed">
                        Order in Food Cart with live order tracking & easy checkout.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            <PopularShowcase onAddToOrder={handleAddToOrder} onNavigate={setCurrentPage} />

            <WeekdaySpecialsBanner onAddToOrder={handleAddToOrder} />

            {/* Local Carrickfergus Testimonials / Community Love */}
            <section className="py-8 sm:py-14 px-3 sm:px-6 lg:px-8 fluid-4k-container">
              <div className="text-center max-w-2xl 2xl:max-w-3xl mx-auto mb-6 sm:mb-10">
                <span className="text-xs 2xl:text-sm font-bold uppercase tracking-wider text-red-500 block mb-1.5">
                  Local Word on High Street
                </span>
                <h3 className="font-display text-2xl sm:text-3xl 2xl:text-4xl font-bold text-white">
                  Why Carrickfergus Loves Kebab Nite
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 2xl:gap-8">
                <div className="cartoon-card p-6 2xl:p-8 space-y-4 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#141418] to-[#0c0c0e] flex flex-col justify-between">
                  <div>
                    <div className="flex text-amber-400 mb-2.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm 2xl:text-base text-slate-200 leading-relaxed italic">
                      "The Mixed Hogie is simply unmatched in Carrick. Naan was warm and soft, packed full of meat and the garlic mayo is addictive. Piping hot on delivery!"
                    </p>
                  </div>
                  <div className="text-xs 2xl:text-sm text-amber-400 font-bold pt-2 border-t border-neutral-800/80">
                    — Ryan M., Carrickfergus
                  </div>
                </div>

                <div className="cartoon-card p-6 2xl:p-8 space-y-4 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#141418] to-[#0c0c0e] flex flex-col justify-between">
                  <div>
                    <div className="flex text-amber-400 mb-2.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm 2xl:text-base text-slate-200 leading-relaxed italic">
                      "The 10\" Munchy Box feeds two of us easily with leftovers. Chicken goujons are crispy and the doner is proper quality, not greasy."
                    </p>
                  </div>
                  <div className="text-xs 2xl:text-sm text-amber-400 font-bold pt-2 border-t border-neutral-800/80">
                    — Claire D., Greenisland
                  </div>
                </div>

                <div className="cartoon-card p-6 2xl:p-8 space-y-4 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#141418] to-[#0c0c0e] sm:col-span-2 lg:col-span-1 flex flex-col justify-between">
                  <div>
                    <div className="flex text-amber-400 mb-2.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm 2xl:text-base text-slate-200 leading-relaxed italic">
                      "Called at 11:30 PM on a Friday night, order was ready for collection in under 15 minutes. Staff on the phone are always friendly and polite."
                    </p>
                  </div>
                  <div className="text-xs 2xl:text-sm text-amber-400 font-bold pt-2 border-t border-neutral-800/80">
                    — Mark S., Eden
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Order Online & Call Banner (Black & Red theme) */}
            <section className="fluid-4k-container px-3 sm:px-6 lg:px-8 py-6 sm:py-10 2xl:py-14">
              <div className="cartoon-card p-6 sm:p-8 lg:p-10 2xl:p-12 rounded-3xl bg-gradient-to-r from-[#170e12] via-[#220d14] to-[#170e12] border border-red-600/35 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 shadow-2xl">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs 2xl:text-sm font-black uppercase tracking-wider text-red-500">
                    Ready to eat?
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl 2xl:text-4xl font-bold text-white">
                    Order Online for Collection or Delivery
                  </h3>
                  <p className="text-xs sm:text-sm 2xl:text-base text-slate-300 max-w-lg 2xl:max-w-2xl">
                    18A High street, Carrickfergus · Order directly with your Food Cart or ring <strong className="text-red-400">{SHOP_INFO.displayPhone}</strong>.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => {
                      setCurrentPage('menu');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="cartoon-btn-primary w-full sm:w-auto px-7 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl text-white font-display text-sm 2xl:text-base font-bold shadow-xl whitespace-nowrap text-center"
                  >
                    Order Online Now
                  </button>

                  <a
                    href={`tel:${SHOP_INFO.phone}`}
                    className="w-full sm:w-auto px-5 py-3.5 2xl:px-6 2xl:py-4 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 hover:border-red-500/60 text-slate-200 font-display text-xs sm:text-sm 2xl:text-base font-bold shadow-md whitespace-nowrap text-center flex items-center justify-center gap-2 transition-all hover:bg-neutral-800"
                  >
                    <Phone className="w-4 h-4 text-red-500" />
                    <span>Call {SHOP_INFO.displayPhone}</span>
                  </a>
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

        {currentPage === 'my-orders' && (
          <MyOrdersPage
            onNavigate={setCurrentPage}
            onAddToCart={handleAddToOrder}
            onOpenCart={() => setIsDrawerOpen(true)}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={setCurrentPage} />

      {/* Mobile Bottom Sticky Call Bar */}
      <MobileBottomCallBar
        orderList={orderList}
        setIsDrawerOpen={setIsDrawerOpen}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Order Notepad Slide-Over Drawer */}
      <OrderDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderList={orderList}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearOrder={handleClearOrder}
        onOpenCheckout={() => {
          setIsDrawerOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Online Checkout & Order Modal (Cash & Card on Handover) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        orderList={orderList}
        onAddToOrder={handleAddToOrder}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearOrder={handleClearOrder}
      />

      {/* Floating AI Need Help & Order Tracking Bot (Right side) */}
      <NeedHelpBot
        onNavigate={setCurrentPage}
        onOpenCart={() => setIsDrawerOpen(true)}
      />

      {/* Subtle 'Added to Cart' Pop-up Notification */}
      <AddedToCartToast
        toast={cartToast}
        onClose={() => setCartToast(null)}
        onOpenCart={() => setIsDrawerOpen(true)}
      />

    </div>
  );
}
