import React from 'react';
import { Phone, Heart, ShieldCheck } from 'lucide-react';
import { SHOP_INFO } from '../data/menuData';
import { PageId } from '../types';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#050507] border-t border-red-900/40 pt-8 sm:pt-12 pb-28 sm:pb-12 text-slate-400 text-xs w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10">
          
          {/* Brand & Address with transparent non-background logo */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/kebab_nite_logo_nobg.png"
                  alt="Kebab Nite Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(220,38,38,0.65)]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-display font-black text-xl text-white block leading-none">
                  Kebab Nite
                </span>
                <span className="text-xs text-amber-400 font-bold mt-1 block">
                  18A High Street, Carrickfergus
                </span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed">
              {SHOP_INFO.address}
            </p>

            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="inline-flex items-center gap-1.5 text-red-500 font-bold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{SHOP_INFO.displayPhone}</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-red-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('todays-menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-red-400 hover:text-white transition-colors font-bold flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse" />
                  <span>Today's Live Menu</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-red-400 transition-colors"
                >
                  Full Takeaway Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('deals');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-red-400 transition-colors"
                >
                  Weekday Deals & Munchy Boxes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('location');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-red-400 transition-colors"
                >
                  Opening Hours & Location
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('how-to-order');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-red-400 transition-colors"
                >
                  How to Order Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('privacy-policy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-amber-400 hover:text-white transition-colors font-semibold flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                  <span>Privacy Policy</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Opening Hours Summary */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Opening Times
            </h4>
            <div className="space-y-1 text-slate-300">
              <p>Monday – Thursday: 4:00 PM – Midnight</p>
              <p className="text-amber-400 font-medium">Friday & Saturday: 4:00 PM – 1:00 AM</p>
              <p>Sunday: 4:00 PM – Midnight</p>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Deliveries available across Carrickfergus & surrounding areas.
            </p>
          </div>

          {/* Allergy Notice & Call CTA */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Food Allergies?
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              If you have any food allergies or dietary intolerances, please speak with our staff when placing your phone order so we can take extra care with your food.
            </p>
            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="cartoon-btn-call inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: {SHOP_INFO.displayPhone}</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar with Privacy Policy */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <p>© {new Date().getFullYear()} Kebab Nite Carrickfergus. All rights reserved.</p>
            <span className="text-neutral-700">·</span>
            <button
              onClick={() => {
                onNavigate('privacy-policy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-300 hover:text-red-400 underline underline-offset-2 transition-colors font-medium"
            >
              Privacy Policy
            </button>
          </div>

          <p className="flex items-center justify-center gap-1">
            <span>Fresh oven-baked flavour for Carrickfergus</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </p>
        </div>

      </div>
    </footer>
  );
};
