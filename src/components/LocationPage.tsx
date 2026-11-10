import React from 'react';
import { MapPin, Phone, Clock, Navigation, CheckCircle2 } from 'lucide-react';
import { SHOP_INFO } from '../data/menuData';

export const LocationPage: React.FC = () => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Kebab Nite 18A High street Carrickfergus BT38 7AF')}`;

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-bold mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>Carrickfergus Town Centre</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Find Us & Opening Times
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2">
          Drop by 18A High Street for rapid counter collection, or call for fast hot delivery straight to your living room.
        </p>
      </div>

      {/* Main Grid: Store Info Cards & Interactive Map View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Contact details & Opening Hours */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Shop Card with Transparent Logo */}
          <div className="cartoon-card p-6 sm:p-7 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-red-500 block mb-1">
                  Our Takeaway Shop
                </span>
                <h2 className="font-display text-2xl font-bold text-white">
                  Kebab Nite
                </h2>
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                  18A High street<br />
                  Carrickfergus<br />
                  <strong className="text-white">BT38 7AF</strong>
                </p>
              </div>

              <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/kebab_nite_logo_nobg.png"
                  alt="Kebab Nite Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(220,38,38,0.65)]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Direct Call Button (Red & White, no green) */}
            <div className="pt-2">
              <a
                href={`tel:${SHOP_INFO.phone}`}
                className="cartoon-btn-call w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 text-white font-display font-bold text-base shadow-lg"
              >
                <Phone className="w-5 h-5 animate-pulse" />
                <span>Call Shop: {SHOP_INFO.displayPhone}</span>
              </a>
            </div>

            {/* Directions Button */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Navigation className="w-4 h-4 text-red-400" />
              <span>Get Directions on Google Maps</span>
            </a>
          </div>

          {/* Delivery & Payment Badges (No green) */}
          <div className="cartoon-card p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-white">
              Delivery Coverage & Details
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span><strong>Areas Covered:</strong> Carrickfergus Town, Eden, Greenisland, Woodburn, Trooperslane.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span><strong>Delivery Fee:</strong> From £2.50 depending on distance (Minimum order £10).</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span><strong>Payments Accepted:</strong> Cash on delivery, or card payment upon delivery / collection.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Weekly Schedule & Map Visual */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Hours Card */}
          <div className="cartoon-card p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2 text-red-500">
              <Clock className="w-5 h-5" />
              <h3 className="font-display text-xl font-bold text-white">
                Opening Hours
              </h3>
            </div>

            <div className="divide-y divide-neutral-800">
              {SHOP_INFO.hours.map((h) => {
                const isWeekend = h.day === 'Friday' || h.day === 'Saturday';
                return (
                  <div
                    key={h.day}
                    className="py-2.5 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <span className="font-medium text-slate-300">{h.day}</span>
                    <span className={`font-mono font-bold ${isWeekend ? 'text-amber-400' : 'text-slate-200'}`}>
                      {h.time}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-amber-400 pt-2 italic">
              * Last delivery orders taken 20 minutes before closing.
            </p>
          </div>

          {/* Map Preview Box */}
          <div className="cartoon-card overflow-hidden p-0 border border-red-900/40">
            <div className="p-4 bg-[#141418] border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="font-display font-bold text-sm text-white">18A High Street, Carrickfergus</span>
              </div>
              <span className="text-[11px] text-amber-400 font-bold bg-neutral-900 px-2.5 py-0.5 rounded border border-neutral-700">
                Easy Parking Nearby
              </span>
            </div>

            {/* Map Visual Container */}
            <div className="relative h-56 bg-[#0a0a0d] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-xl animate-bounce">
                  📍
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-white">
                    Carrickfergus Town Centre
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    18A High street, BT38 7AF
                  </p>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 transition-colors shadow"
                >
                  <span>Open in Google Maps</span>
                  <Navigation className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
