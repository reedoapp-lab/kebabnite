import React, { useState, useEffect } from 'react';
import { Sparkles, Phone, Clock, ArrowRight, Flame, MapPin } from 'lucide-react';
import { SHOP_INFO, WEEKDAY_SPECIALS } from '../data/menuData';
import { PageId } from '../types';

interface TodayLiveTickerProps {
  onNavigate: (page: PageId) => void;
}

export const TodayLiveTicker: React.FC<TodayLiveTickerProps> = ({ onNavigate }) => {
  // Live UK Time & Status calculation
  const [ukTimeStr, setUkTimeStr] = useState<string>('');
  const [dayName, setDayName] = useState<string>('Monday');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('Opens 4:00 PM');
  const [todaySpecial, setTodaySpecial] = useState<{
    day: string;
    title: string;
    price: number;
    regularPrice: number;
    desc: string;
  } | null>(null);

  useEffect(() => {
    const updateTimeAndStatus = () => {
      try {
        const now = new Date();
        // Format to Europe/London (Carrickfergus timezone)
        const ukFormatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/London',
          weekday: 'long',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });

        const parts = ukFormatter.formatToParts(now);
        let currentDay = '';
        let hour = 0;
        let minute = 0;

        parts.forEach((p) => {
          if (p.type === 'weekday') currentDay = p.value;
          if (p.type === 'hour') hour = parseInt(p.value, 10);
          if (p.type === 'minute') minute = parseInt(p.value, 10);
        });

        setDayName(currentDay);
        setUkTimeStr(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);

        // Carrickfergus takeaway hours:
        // Mon-Thu & Sun: 16:00 to 00:00 (Midnight)
        // Fri-Sat: 16:00 to 01:00 (1:00 AM)
        const isWeekendLate = currentDay === 'Friday' || currentDay === 'Saturday';
        let open = false;
        let text = '';

        if (hour >= 16) {
          open = true;
          text = isWeekendLate ? 'OPEN NOW (Till 1:00 AM)' : 'OPEN NOW (Till Midnight)';
        } else if (hour === 0 && isWeekendLate) {
          // 00:00 - 00:59 on Friday/Saturday late night
          open = true;
          text = 'OPEN NOW (Late Night Till 1:00 AM)';
        } else {
          open = false;
          text = 'OPENS TODAY AT 4:00 PM';
        }

        setIsOpen(open);
        setStatusText(text);

        // Find weekday special if available, else weekend special
        const found = WEEKDAY_SPECIALS.find(
          (s) => s.day.toLowerCase() === currentDay.toLowerCase()
        );
        if (found) {
          setTodaySpecial(found);
        } else if (currentDay === 'Friday') {
          setTodaySpecial({
            day: 'Friday',
            title: 'Weekend Mega Kebab Platter',
            price: 15.0,
            regularPrice: 20.0,
            desc: 'Loaded Doner & Chicken Kebab with fresh warm pita and double house dips.',
          });
        } else if (currentDay === 'Saturday') {
          setTodaySpecial({
            day: 'Saturday',
            title: 'Saturday Munchy Feast',
            price: 15.0,
            regularPrice: 21.0,
            desc: '10" Munchy Box loaded with succulent meats, crispy goujons and chips.',
          });
        } else {
          setTodaySpecial({
            day: 'Sunday',
            title: 'Sunday Comfort Deal',
            price: 15.0,
            regularPrice: 20.0,
            desc: 'Any 2 Large Kebabs or 2 Fresh 10" Oven-Baked Pizzas.',
          });
        }
      } catch (err) {
        console.error('Time update error', err);
      }
    };

    updateTimeAndStatus();
    const interval = setInterval(updateTimeAndStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const tickerItems = [
    {
      id: 'status',
      icon: <span className={`w-2.5 h-2.5 rounded-full inline-block mr-1.5 ${isOpen ? 'bg-emerald-400 live-pulse' : 'bg-amber-400'}`} />,
      text: `${isOpen ? '🟢 ' : '🕒 '}${statusText}`,
      highlight: true,
    },
    {
      id: 'deal',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
      text: todaySpecial
        ? `🔥 ${todaySpecial.day.toUpperCase()} SPECIAL: ${todaySpecial.title} - Only £${todaySpecial.price.toFixed(2)}!`
        : "🔥 TODAY'S LIVE DEAL: 2 x 10\" Deals for £15.00!",
      highlight: false,
    },
    {
      id: 'oven',
      icon: <Flame className="w-3.5 h-3.5 text-red-500 shrink-0" />,
      text: 'Succulent Oven-Roasted Kebabs & Fresh Stone-Free Baked Pizzas',
      highlight: false,
    },
    {
      id: 'call',
      icon: <Phone className="w-3.5 h-3.5 text-red-400 shrink-0" />,
      text: `Order Line: ${SHOP_INFO.displayPhone} · Fast Collection & Delivery`,
      highlight: false,
    },
    {
      id: 'delivery',
      icon: <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
      text: '18A High Street, Carrickfergus · BT38 7AF',
      highlight: false,
    },
    {
      id: 'uktime',
      icon: <Clock className="w-3.5 h-3.5 text-slate-300 shrink-0" />,
      text: `Carrickfergus Live Time: ${ukTimeStr || '4:00 PM'}`,
      highlight: false,
    },
  ];

  return (
    <div className="w-full bg-[#111115] border-b border-red-600/40 text-xs text-slate-200 overflow-hidden relative shadow-lg">
      <div className="max-w-7xl mx-auto flex items-stretch">
        
        {/* Static Left Badge for immediate context */}
        <div className="shrink-0 z-10 flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-600 px-3 sm:px-4 py-2 font-display font-black text-white text-[11px] sm:text-xs shadow-md tracking-wider">
          <span className="w-2 h-2 rounded-full bg-white live-pulse" />
          <span className="hidden xs:inline">TODAY'S MENU</span>
          <span className="xs:hidden">LIVE</span>
        </div>

        {/* Continuous Smooth Horizontal Marquee Ticker */}
        <div className="flex-1 overflow-hidden py-2 relative flex items-center cursor-pointer" onClick={() => onNavigate('todays-menu')}>
          <div className="animate-ticker-marquee flex items-center gap-8 pl-4 whitespace-nowrap">
            {/* First Set */}
            {tickerItems.map((item) => (
              <div
                key={`a-${item.id}`}
                className="flex items-center gap-1.5 font-medium text-xs sm:text-sm text-slate-200 hover:text-white transition-colors"
              >
                {item.icon}
                <span className={item.highlight ? 'font-bold text-white' : ''}>
                  {item.text}
                </span>
                <span className="text-red-600/50 ml-4 font-bold">✦</span>
              </div>
            ))}

            {/* Repeated Set for Seamless Infinite Loop */}
            {tickerItems.map((item) => (
              <div
                key={`b-${item.id}`}
                className="flex items-center gap-1.5 font-medium text-xs sm:text-sm text-slate-200 hover:text-white transition-colors"
              >
                {item.icon}
                <span className={item.highlight ? 'font-bold text-white' : ''}>
                  {item.text}
                </span>
                <span className="text-red-600/50 ml-4 font-bold">✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right CTA Button: Direct Jump to Today's Menu */}
        <div className="shrink-0 z-10 flex items-center bg-[#111115] pl-2 pr-3">
          <button
            onClick={() => {
              onNavigate('todays-menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600 border border-red-500/50 text-white font-bold text-[10px] sm:text-xs transition-all hover:scale-105 whitespace-nowrap"
          >
            <span>View Specials</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
