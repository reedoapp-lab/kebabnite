import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';
import { WEEKDAY_SPECIALS } from '../data/menuData';
import { PageId } from '../types';

interface HeroSectionProps {
  onNavigate: (page: PageId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const todaySpecial = WEEKDAY_SPECIALS.find((s) => s.day === todayName);

  return (
    <section className="relative overflow-hidden pt-3 pb-6 sm:pt-4 sm:pb-8 lg:pt-6 lg:pb-12 bg-[#08080a]">
      {/* Background Subtle Ambient Glows - scaled for wide/4K displays */}
      <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 2xl:w-[600px] h-72 sm:h-96 2xl:h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none max-w-full -z-0" />
      <div className="absolute top-1/3 right-6 w-64 sm:w-80 2xl:w-[500px] h-64 sm:h-80 2xl:h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none max-w-full -z-0" />

      <div className="fluid-4k-container px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* HERO GRAPHIC POST (Pure image with all details, soft rounded edges for 4K) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl sm:rounded-3xl 2xl:rounded-[36px] overflow-hidden border border-red-600/25 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.95)] bg-black group w-full"
        >
          <picture className="block w-full h-auto">
            <source srcSet="/assets/aistudio/A_Bite_of_Perfection__2__8ce69a99.webp" type="image/webp" />
            <img
              src="/assets/aistudio/A_Bite_of_Perfection__2__8ce69a99.png"
              alt="Craving Late-Night? Taste Kebab Nite. Delivery Order: Online orders available, Store: 18A High street, Carrickfergus, BT38 7AF"
              className="w-full h-auto object-cover block"
              referrerPolicy="no-referrer"
              loading="eager"
            />
          </picture>
        </motion.div>

        {/* AFTER HERO SECTION: BROWSE FULL MENU ACTION */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-4 sm:mt-6 lg:mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-5 sm:p-6 2xl:p-8 rounded-3xl bg-gradient-to-r from-[#141418] via-[#1f1015] to-[#141418] border border-red-600/25 shadow-2xl w-full"
        >
          <div className="text-center md:text-left">
            <span className="text-[11px] sm:text-xs 2xl:text-sm font-black uppercase tracking-wider text-red-500 block">
              100+ Delicious Items Oven-Fresh
            </span>
            <h3 className="font-display text-lg sm:text-xl lg:text-2xl 2xl:text-3xl font-bold text-white mt-0.5">
              Explore Our Takeaway Menu
            </h3>
            <p className="text-xs sm:text-sm 2xl:text-base text-slate-300 mt-1 max-w-2xl">
              Succulent kebabs, naan hogies, fresh oven-baked pizzas, burgers, chicken & sharing munchy boxes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 w-full md:w-auto">
            {todaySpecial && (
              <button
                onClick={() => onNavigate('deals')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 2xl:px-5 2xl:py-3.5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-amber-500/30 text-amber-300 text-xs 2xl:text-sm font-bold transition-all text-center"
              >
                <span>🔥 {todaySpecial.day} £15 Deal</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('menu')}
              className="cartoon-btn-primary w-full sm:w-auto px-6 sm:px-8 py-3.5 2xl:px-10 2xl:py-4 rounded-2xl flex items-center justify-center gap-2.5 text-white font-display text-base sm:text-lg 2xl:text-xl font-bold shadow-2xl tracking-wide group"
            >
              <UtensilsCrossed className="w-5 h-5 text-white" />
              <span>Browse Full Menu</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
