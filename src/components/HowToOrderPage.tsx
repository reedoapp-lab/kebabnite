import React from 'react';
import { ShoppingBag, CreditCard, Banknote, ShieldCheck, MapPin, Search } from 'lucide-react';
import { SHOP_INFO } from '../data/menuData';
import { PageId } from '../types';

interface HowToOrderPageProps {
  onNavigate: (page: PageId) => void;
  onOpenNotepad: () => void;
}

export const HowToOrderPage: React.FC<HowToOrderPageProps> = ({
  onNavigate,
  onOpenNotepad,
}) => {
  return (
    <div className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-bold mb-3">
          <span>⚡ Fast & Easy Food Ordering</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          How to Order & Payment Guide
        </h1>
        <p className="text-xs sm:text-base text-slate-300 mt-2">
          Order your favourite hot kebabs, pizzas, burgers and deals online in minutes with transparent payments and live order tracking.
        </p>
      </div>

      {/* 4 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Step 1 */}
        <div className="cartoon-card p-5 sm:p-6 flex flex-col justify-between relative h-full">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 text-amber-400 font-display font-black text-2xl flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              1. Choose & Customize
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore our full menu, £15 meal deals, hot dogs, and soft drinks. Select sauces (Garlic Mayo, House Chilli, Taco, BBQ) and add dietary or allergen notes.
            </p>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="mt-6 w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-red-500/30 text-white text-xs font-bold transition-all text-center"
          >
            Explore Full Menu →
          </button>
        </div>

        {/* Step 2 */}
        <div className="cartoon-card p-5 sm:p-6 flex flex-col justify-between relative h-full">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 text-amber-400 font-display font-black text-2xl flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              2. Open Food Cart
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Review your items in the <strong>Food Cart</strong>. Choose between <strong>Collection</strong> at 18A High Street or <strong>Fast Delivery</strong> in Carrickfergus and surrounding areas.
            </p>
          </div>
          <button
            onClick={onOpenNotepad}
            className="mt-6 w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-red-500/30 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-red-500" />
            <span>Open Food Cart</span>
          </button>
        </div>

        {/* Step 3 (Red highlight) */}
        <div className="cartoon-card p-5 sm:p-6 flex flex-col justify-between relative border-2 border-red-500 bg-gradient-to-b from-[#181014] to-[#0c0c0e]">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/50 text-red-400 font-display font-black text-2xl flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              3. Secure Online Payment
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pay directly online with <strong>Card (Visa, Mastercard, Amex)</strong> or <strong>Apple Pay</strong> via Stripe. If you don't have a card with you, <strong>Cash on Delivery</strong> is available as an optional backup.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-900/80 border border-red-500/20 text-slate-300 text-xs">
            <CreditCard className="w-4 h-4 text-red-400" />
            <span className="font-semibold text-white">Stripe & Apple Pay</span>
            <span className="text-neutral-600">•</span>
            <Banknote className="w-4 h-4 text-amber-400" />
            <span className="text-neutral-400">Optional Cash</span>
          </div>
        </div>

        {/* Step 4 */}
        <div className="cartoon-card p-5 sm:p-6 flex flex-col justify-between relative h-full">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 text-amber-400 font-display font-black text-2xl flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              4. Track Live Status
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your order is recorded instantly in our kitchen database. Enter your phone number in <strong>My Orders</strong> anytime to check progress or repeat your favourite meal!
            </p>
          </div>
          <button
            onClick={() => onNavigate('my-orders')}
            className="mt-6 w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track My Orders →</span>
          </button>
        </div>

      </div>

      {/* Payment and Fee Clarification */}
      <div className="cartoon-card p-6 sm:p-8 bg-gradient-to-r from-[#141418] via-[#1c1216] to-[#141418] border border-red-900/40 space-y-5">
        <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-red-500" />
          <span>Online Payment Gateway & Ordering Policy</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300">
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-red-400" />
              <span>1. Primary: Online Payments with Stripe & Apple Pay</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Pay directly online using credit/debit cards (Visa, Mastercard, American Express) or 1-click Apple Pay / Google Pay. Protected by Stripe's bank-grade 256-bit SSL encryption.
            </p>
            <h4 className="font-bold text-white text-sm flex items-center gap-2 pt-2">
              <Banknote className="w-4 h-4 text-amber-400" />
              <span>2. Optional Backup: Cash on Delivery / Collection</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              In case you do not have your payment card with you, you can optionally select Cash on Delivery. Our drivers carry change for standard notes.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>Transparent 5% Platform & Online Ordering Fee</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              A standard 5% platform and online ordering fee applies to orders. This fee supports digital order processing, secure Stripe payment gateway compliance, packaging, and real-time kitchen tracking.
            </p>
            <p className="text-slate-400 leading-relaxed">
              The fee is itemized only at the <strong>summary of payment before transactions</strong> in your Food Cart checkout, maintaining total pricing clarity with no hidden charges.
            </p>
          </div>
        </div>

        {/* Action Banner */}
        <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <span className="text-xs uppercase font-black text-red-500 block">Kebab Nite Carrickfergus</span>
              <span className="font-display text-sm sm:text-base font-bold text-white">{SHOP_INFO.address}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('my-orders')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-red-500 text-slate-200 text-xs font-bold transition-all text-center"
            >
              Check My Orders
            </button>
            <button
              onClick={() => onNavigate('menu')}
              className="flex-1 sm:flex-initial cartoon-btn-primary px-5 py-2.5 rounded-xl text-white font-display text-xs sm:text-sm font-bold shadow-xl text-center"
            >
              Order Online Now
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
