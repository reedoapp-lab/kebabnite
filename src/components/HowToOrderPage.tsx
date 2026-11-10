import React from 'react';
import { Phone, CheckCircle2 } from 'lucide-react';
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
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-bold mb-3">
          <span>⚡ Fast & Easy Takeaway</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          How to Order by Phone
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2">
          No complicated apps or sign-ups. Just simple, friendly local service in 3 quick steps.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Step 1 */}
        <div className="cartoon-card p-6 flex flex-col justify-between relative">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 text-amber-400 font-display font-black text-2xl flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Pick Your Items
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Browse our complete menu of kebabs, loaded naan hogies, oven-baked pizzas, burgers and munchy boxes. Use our on-screen <strong>Order Notepad</strong> to keep track of prices and items!
            </p>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="mt-6 w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-red-500/30 text-white text-xs font-bold transition-all text-center"
          >
            Browse Menu Now →
          </button>
        </div>

        {/* Step 2 (Red highlight, no green) */}
        <div className="cartoon-card p-6 flex flex-col justify-between relative border-2 border-red-500 bg-gradient-to-b from-[#181014] to-[#0c0c0e]">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/50 text-red-400 font-display font-black text-2xl flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Tap 'Click to Call'
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tap any red call button on the site to dial <strong className="text-red-400">{SHOP_INFO.displayPhone}</strong>. Tell our counter whether you'd like delivery or collection, and read out your order!
            </p>
          </div>
          <a
            href={`tel:${SHOP_INFO.phone}`}
            className="mt-6 cartoon-btn-call w-full py-2.5 px-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call {SHOP_INFO.displayPhone}</span>
          </a>
        </div>

        {/* Step 3 */}
        <div className="cartoon-card p-6 flex flex-col justify-between relative">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 text-amber-400 font-display font-black text-2xl flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Collect or Enjoy at Home
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Collect hot & fresh at <strong>18A High Street, Carrickfergus</strong>, or wait for our speedy driver to bring it hot to your door. We accept cash and card payments!
            </p>
          </div>
          <button
            onClick={() => onNavigate('location')}
            className="mt-6 w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-red-500/30 text-white text-xs font-bold transition-all text-center"
          >
            Check Map & Hours →
          </button>
        </div>

      </div>

      {/* Useful Phone Ordering Tips (No green icons) */}
      <div className="cartoon-card p-6 sm:p-8 bg-gradient-to-r from-[#141418] via-[#1c1216] to-[#141418] border border-red-900/40 space-y-4">
        <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <span>💡</span>
          <span>Pro Tips for Phone Ordering</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="space-y-2">
            <p className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span><strong>Sauce Choices:</strong> Don't forget to specify your sauce (Garlic Mayo, House Chilli, Sweet Chilli, Taco, BBQ, Curry, Gravy).</span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span><strong>Naan or Chips:</strong> When ordering Doner, Tikka or Mixed Kebabs, mention if you want it on fresh warm naan or on golden chips.</span>
            </p>
          </div>

          <div className="space-y-2">
            <p className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span><strong>Salad Preferences:</strong> Let us know if you want full salad (lettuce, onion, tomato) or plain.</span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span><strong>Allergies:</strong> If you or anyone in your party has an allergy or dietary requirement, please inform our team member right away.</span>
            </p>
          </div>
        </div>

        {/* Big Call Banner */}
        <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-black text-red-500 block">Ready to order?</span>
            <span className="font-display text-xl font-bold text-white">Give us a quick ring at Kebab Nite</span>
          </div>

          <a
            href={`tel:${SHOP_INFO.phone}`}
            className="cartoon-btn-call px-6 py-3 rounded-2xl flex items-center gap-2 text-white font-display text-base font-bold shadow-xl"
          >
            <Phone className="w-4 h-4" />
            <span>028 9458 1596</span>
          </a>
        </div>
      </div>

    </div>
  );
};
