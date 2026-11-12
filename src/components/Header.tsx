import React from 'react';
import { Phone, ShoppingBag, Menu as MenuIcon, X } from 'lucide-react';
import { SHOP_INFO } from '../data/menuData';
import { PageId, OrderItem } from '../types';

interface HeaderProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  orderList: OrderItem[];
  setIsDrawerOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  orderList,
  setIsDrawerOpen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const totalItems = orderList.reduce((acc, curr) => acc + curr.quantity, 0);

  const navLinks: { id: PageId; label: string; isLive?: boolean }[] = [
    { id: 'home', label: 'Home' },
    { id: 'todays-menu', label: "Today's Menu", isLive: true },
    { id: 'menu', label: 'Full Menu' },
    { id: 'deals', label: 'Deals & Boxes' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08080a]/90 backdrop-blur-xl border-b border-red-600/20 shadow-2xl transition-all">
      {/* Top Banner Notice: Black & Red */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white text-[11px] sm:text-xs 2xl:text-sm py-1.5 px-3 sm:px-4 text-center font-bold tracking-wide">
        <span className="block truncate">
          🔥 Serving Carrickfergus · Open Today From 4:00 PM · Online Ordering Available
        </span>
      </div>

      <div className="fluid-4k-container px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-6 h-16 sm:h-20 lg:h-22 2xl:h-24 py-1 sm:py-2">
          
          {/* Zone 1: Brand Zone */}
          <button
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 sm:gap-3.5 text-left focus:outline-none group shrink-0 min-w-0"
          >
            {/* Responsive Logo Container */}
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 2xl:w-22 2xl:h-22 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/assets/aistudio/kebab_nite_logo_nobg.png"
                alt="Kebab Nite Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_14px_rgba(220,38,38,0.55)]"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-display text-lg sm:text-2xl lg:text-3xl 2xl:text-4xl font-black tracking-tight text-white group-hover:text-red-400 transition-colors leading-tight truncate">
                Kebab Nite
              </span>
              <span className="text-[10px] sm:text-xs 2xl:text-sm font-bold text-amber-400 tracking-wider truncate hidden sm:block">
                18A High Street, Carrickfergus
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 2xl:gap-10 text-sm 2xl:text-base font-semibold">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentPage(link.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`relative py-2 px-3 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-red-600/20 font-bold border border-red-500/30 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isLive && (
                    <span className="px-1.5 py-0.5 rounded-full bg-red-600/30 border border-red-500 text-[9px] 2xl:text-[10px] font-black uppercase text-amber-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse" />
                      LIVE
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-red-500 via-amber-400 to-red-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Food Cart */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Food Cart button with soft edges */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative flex items-center gap-2 p-2 sm:px-4 sm:py-2.5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-red-500/30 text-white text-xs 2xl:text-sm font-bold transition-all shadow-md active:scale-95"
              title="View my Food Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Food Cart</span>
              {totalItems > 0 && (
                <span className="px-2 py-0.5 text-[10px] 2xl:text-xs font-black rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Header Order Online button (without phone number) */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="cartoon-btn-primary flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm 2xl:text-base font-bold tracking-wide shadow-lg whitespace-nowrap active:scale-95 transition-transform"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Online</span>
            </button>

            {/* Mobile / Tablet Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-white hover:text-red-400 rounded-2xl bg-neutral-900/90 border border-neutral-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e0e12] border-b border-red-500/30 px-4 pt-3 pb-5 space-y-2.5 shadow-2xl">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider px-3 pb-1 border-b border-neutral-800">
            📍 18A High Street, Carrickfergus · BT38 7AF
          </div>
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentPage(link.id);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between min-h-[44px] ${
                  isActive
                    ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                    : 'text-slate-200 hover:bg-neutral-800'
                }`}
              >
                <span>{link.label}</span>
                {link.isLive && (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-[10px] font-black text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white live-pulse" />
                    LIVE
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsDrawerOpen(true);
              }}
              className="cartoon-btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 text-base font-bold shadow-lg min-h-[46px]"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>View Food Cart & Order Online</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
