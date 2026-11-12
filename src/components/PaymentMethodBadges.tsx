import React from 'react';

interface PaymentMethodBadgesProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const PaymentMethodBadges: React.FC<PaymentMethodBadgesProps> = ({
  className = '',
  size = 'md',
  showLabel = false,
}) => {
  const badgeHeight = size === 'sm' ? 'h-6' : size === 'lg' ? 'h-8' : 'h-7';
  const badgePadding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1';
  const textScale = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <div className={`flex flex-col items-center sm:items-start gap-2 ${className}`}>
      {showLabel && (
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Accepted Payment Methods
        </span>
      )}

      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
        
        {/* Visa */}
        <div
          className={`${badgeHeight} ${badgePadding} rounded-md bg-white border border-neutral-300 shadow-sm flex items-center justify-center transition-transform hover:scale-105`}
          title="Visa Debit & Credit"
        >
          <svg className="h-3.5 sm:h-4 w-auto" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.125 15.111H15.938L17.938 2.889H21.125L19.125 15.111Z" fill="#1A1F71"/>
            <path d="M29.563 3.111C28.938 2.889 27.938 2.667 26.688 2.667C23.688 2.667 21.563 4.222 21.563 6.444C21.563 8.111 23.063 9 24.188 9.556C25.313 10.111 25.688 10.444 25.688 11C25.688 11.778 24.688 12.111 23.813 12.111C22.688 12.111 22.063 11.889 21.188 11.444L20.813 11.222L20.438 13.556C21.188 14 22.438 14.333 23.688 14.333C26.938 14.333 29.063 12.778 29.063 10.444C29.063 9 28.188 8 26.563 7.222C25.563 6.667 25 6.333 25 5.778C25 5.222 25.563 4.778 26.688 4.778C27.688 4.778 28.438 5 29.063 5.333L29.438 5.444L29.563 3.111Z" fill="#1A1F71"/>
            <path d="M34.813 10.889C35.063 10.222 36.188 7.333 36.188 7.333C36.188 7.333 36.438 6.667 36.563 6.222L36.813 7.333C36.813 7.333 37.438 10.333 37.563 10.889H34.813ZM39.563 2.889H37.063C36.313 2.889 35.688 3.333 35.438 4L30.313 15.111H33.563L34.188 13.333H38.188L38.563 15.111H41.438L39.563 2.889Z" fill="#1A1F71"/>
            <path d="M12.938 2.889L9.813 11.222L9.438 9.333C8.813 7.222 6.938 4.889 4.938 3.778L7.813 15.111H11.063L16.063 2.889H12.938Z" fill="#1A1F71"/>
            <path d="M6.938 2.889H1.813L1.688 3.111C5.688 4.111 9.063 6.556 10.188 9.556L9.188 4.222C9.063 3.222 8.313 2.889 6.938 2.889Z" fill="#F7B600"/>
          </svg>
        </div>

        {/* Mastercard */}
        <div
          className={`${badgeHeight} ${badgePadding} rounded-md bg-white border border-neutral-300 shadow-sm flex items-center justify-center transition-transform hover:scale-105`}
          title="Mastercard Debit & Credit"
        >
          <svg className="h-3.5 sm:h-4 w-auto" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="38" height="24" rx="2" fill="white"/>
            <circle cx="14" cy="12" r="8" fill="#EB001B"/>
            <circle cx="24" cy="12" r="8" fill="#F79E1B"/>
            <path d="M19 6.34A7.98 7.98 0 0 0 16 12a7.98 7.98 0 0 0 3 5.66A7.98 7.98 0 0 0 22 12a7.98 7.98 0 0 0-3-5.66z" fill="#FF5F00"/>
          </svg>
        </div>

        {/* American Express (Amex) */}
        <div
          className={`${badgeHeight} ${badgePadding} rounded-md bg-[#006FCF] border border-[#005ba8] shadow-sm flex items-center justify-center transition-transform hover:scale-105`}
          title="American Express"
        >
          <span className="font-sans font-black text-white text-[10px] sm:text-[11px] tracking-wider leading-none">
            AMEX
          </span>
        </div>

        {/* Apple Pay */}
        <div
          className={`${badgeHeight} ${badgePadding} rounded-md bg-black border border-neutral-700 shadow-sm flex items-center justify-center gap-1 transition-transform hover:scale-105`}
          title="Apple Pay"
        >
          <svg className="h-3 sm:h-3.5 w-auto fill-white" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.5-7.79-11.41-14.14-5.66-9.24-10.08-19.78-13.25-31.62-3.17-11.85-4.76-22.95-4.76-33.31 0-14.47 3.56-26.69 10.67-36.65 7.11-9.97 16.27-15.08 27.48-15.34 4.57 0 9.75 1.25 15.54 3.75 5.79 2.49 9.69 3.75 11.71 3.75 1.83 0 5.73-1.3 11.71-3.9 5.97-2.6 11.06-3.8 15.28-3.6 11.39.54 20.67 4.79 27.84 12.75-9.91 6-14.77 14.54-14.59 25.64.19 8.71 3.5 16.03 9.94 21.97 6.44 5.93 14.07 9.38 22.9 10.35-2.06 6.09-4.58 12.06-7.55 17.9zm-29.62-108.57c0-7.39 2.65-14.3 7.95-20.73 5.3-6.43 11.83-10.45 19.59-12.07.11.98.17 1.85.17 2.61 0 7.39-2.73 14.39-8.19 21-5.46 6.6-12.05 10.6-19.76 12-0.11-.98-.17-1.85-.17-2.61z"/>
          </svg>
          <span className="font-sans font-bold text-white text-[10px] sm:text-[11px] leading-none">
            Pay
          </span>
        </div>

        {/* Google Pay */}
        <div
          className={`${badgeHeight} ${badgePadding} rounded-md bg-white border border-neutral-300 shadow-sm flex items-center justify-center gap-1 transition-transform hover:scale-105`}
          title="Google Pay"
        >
          <svg className="h-3 sm:h-3.5 w-auto" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.09C3.26 21.3 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.32a7.18 7.18 0 0 1 0-4.64V6.59H1.26a11.936 11.936 0 0 0 0 10.82l4.02-3.09z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.26 6.59l4.02 3.09c.95-2.83 3.6-4.93 6.72-4.93z"/>
          </svg>
          <span className="font-sans font-bold text-neutral-800 text-[10px] sm:text-[11px] leading-none">
            Pay
          </span>
        </div>

        {/* Maestro */}
        <div
          className={`${badgeHeight} ${badgePadding} rounded-md bg-white border border-neutral-300 shadow-sm flex items-center justify-center transition-transform hover:scale-105`}
          title="Maestro Debit"
        >
          <svg className="h-3.5 sm:h-4 w-auto" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="38" height="24" rx="2" fill="white"/>
            <circle cx="14" cy="12" r="8" fill="#0061A8"/>
            <circle cx="24" cy="12" r="8" fill="#EB001B"/>
            <path d="M19 6.34A7.98 7.98 0 0 0 16 12a7.98 7.98 0 0 0 3 5.66A7.98 7.98 0 0 0 22 12a7.98 7.98 0 0 0-3-5.66z" fill="#7368B0"/>
          </svg>
        </div>

      </div>
    </div>
  );
};
