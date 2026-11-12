import React from 'react';
import { Phone, Heart, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { SHOP_INFO } from '../data/menuData';
import { PageId } from '../types';
import { PaymentMethodBadges } from './PaymentMethodBadges';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#050507] border-t border-red-900/30 pt-10 sm:pt-14 2xl:pt-16 pb-28 sm:pb-14 text-slate-400 text-xs 2xl:text-sm w-full overflow-x-hidden">
      <div className="fluid-4k-container px-3 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 2xl:gap-12 mb-8 sm:mb-12">
          
          {/* Brand & Address with transparent non-background logo */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 2xl:w-24 2xl:h-24 flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/kebab_nite_logo_nobg.png"
                  alt="Kebab Nite Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(220,38,38,0.65)]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-display font-black text-xl 2xl:text-2xl text-white block leading-none">
                  Kebab Nite
                </span>
                <span className="text-xs 2xl:text-sm text-amber-400 font-bold mt-1 block">
                  18A High Street, Carrickfergus
                </span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed 2xl:text-sm">
              {SHOP_INFO.address}
            </p>

            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="inline-flex items-center gap-1.5 text-red-500 font-bold hover:underline 2xl:text-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{SHOP_INFO.displayPhone}</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-display font-bold text-sm 2xl:text-base text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
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
                  Order Guide (Online Ordering & Payments)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('privacy-policy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-300 hover:text-white transition-colors font-semibold flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                  <span>Privacy Policy</span>
                </button>
              </li>
            </ul>

            {/* Dedicated My Orders Button in Footer with Soft Edges */}
            <div className="pt-2">
              <button
                onClick={() => {
                  onNavigate('my-orders');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cartoon-btn-primary w-full py-2.5 px-3 rounded-2xl text-white font-display text-xs 2xl:text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform text-center"
              >
                <span>📦 Track My Orders</span>
              </button>
            </div>
          </div>

          {/* Location & Opening Hours */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm 2xl:text-base text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Location & Opening Hours</span>
            </h4>
            <div className="space-y-1 text-slate-300 2xl:text-sm">
              <p>Monday – Thursday: 4:00 PM – Midnight</p>
              <p className="text-amber-400 font-medium">Friday & Saturday: 4:00 PM – 1:00 AM</p>
              <p>Sunday: 4:00 PM – Midnight</p>
            </div>
            
            <div className="pt-2 border-t border-neutral-800/80 space-y-1.5">
              <div className="flex items-start gap-1.5 text-slate-300 text-xs 2xl:text-sm">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">18A High Street</span>
                  <span className="text-[11px] 2xl:text-xs text-slate-400">Carrickfergus, BT38 7AF</span>
                </div>
              </div>
              <p className="text-[11px] 2xl:text-xs text-slate-400">
                Fast local delivery across Carrickfergus, Whitehead, Greenisland & Eden.
              </p>
              <button
                onClick={() => {
                  onNavigate('location');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1 text-red-400 hover:text-white font-bold text-xs 2xl:text-sm pt-0.5 transition-colors"
              >
                <span>View Full Map & Directions →</span>
              </button>
            </div>
          </div>

          {/* Online Ordering & Allergy Notice */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm 2xl:text-base text-white uppercase tracking-wider">
              Food Allergies?
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px] 2xl:text-xs">
              If you have any food allergies, you can specify them during our online checkout process or add notes for our kitchen team.
            </p>
            <button
              onClick={() => {
                onNavigate('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cartoon-btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs 2xl:text-sm font-bold text-white shadow-md active:scale-95 transition-transform"
            >
              <span>Order Online Now</span>
            </button>
          </div>

        </div>

        {/* Payment Icons Row (Visa, Mastercard, Amex, Apple Pay, Google Pay, Maestro) */}
        <div className="py-5 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="text-[11px] 2xl:text-xs font-bold text-white uppercase tracking-wider block">
              Accepted Payment Methods
            </span>
            <p className="text-[11px] 2xl:text-xs text-slate-400">
              Pay securely online with all major debit/credit cards and digital wallets
            </p>
          </div>
          <PaymentMethodBadges size="sm" />
        </div>

        {/* Bottom Bar with Privacy Policy & My Orders */}
        <div className="pt-5 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] 2xl:text-xs text-slate-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <p>© {new Date().getFullYear()} Kebab Nite Carrickfergus. All rights reserved.</p>
            <span className="text-neutral-700">·</span>
            <button
              onClick={() => {
                onNavigate('my-orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-amber-400 hover:text-white underline underline-offset-2 transition-colors font-medium"
            >
              My Orders
            </button>
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
