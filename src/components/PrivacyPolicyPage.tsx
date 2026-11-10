import React from 'react';
import { ShieldCheck, Lock, Phone, MapPin, Mail, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import { SHOP_INFO } from '../data/menuData';
import { PageId } from '../types';

interface PrivacyPolicyPageProps {
  onNavigate: (page: PageId) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      
      {/* Back Button */}
      <button
        onClick={() => {
          onNavigate('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="inline-flex items-center gap-2 text-xs font-bold text-red-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>UK GDPR Compliant · Customer Privacy</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          How Kebab Nite protects your personal data when you browse our menu and place takeaway orders.
        </p>
        <span className="text-xs text-amber-400 block font-semibold">
          Last Updated: November 2026 · Kebab Nite Carrickfergus
        </span>
      </div>

      {/* Main Privacy Policy Content */}
      <div className="cartoon-card p-6 sm:p-10 space-y-8 text-slate-300 text-sm leading-relaxed border border-red-900/40 bg-[#0e0e11]">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
            <span className="text-red-500">01.</span>
            <h2>Who We Are & Our Privacy Commitment</h2>
          </div>
          <p>
            Welcome to <strong>Kebab Nite</strong>, located at <strong>18A High street, Carrickfergus, BT38 7AF</strong>. We are a family-friendly local takeaway serving Carrickfergus and surrounding areas with freshly oven-baked pizzas, succulent kebabs, loaded hogies, and takeaway favourites.
          </p>
          <p>
            We take your privacy seriously and are committed to safeguarding any personal information you provide when using our website or dialling our phone line (<strong>{SHOP_INFO.displayPhone}</strong>) to place an order for delivery or collection.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
            <span className="text-red-500">02.</span>
            <h2>What Information We Collect</h2>
          </div>
          <p>
            Because we operate a phone-first ordering takeaway service, we keep data collection strictly limited to what is essential to prepare and deliver your meal:
          </p>
          <ul className="space-y-2 pl-4 list-disc marker:text-red-500 text-slate-300">
            <li>
              <strong>Contact Details:</strong> Your name and telephone number so our counter team can confirm your order and contact you if there is a query with your delivery.
            </li>
            <li>
              <strong>Delivery Information:</strong> Your delivery address and postal code (e.g. within Carrickfergus, Eden, Greenisland, Woodburn, or Trooperslane) for our delivery drivers to reach your door.
            </li>
            <li>
              <strong>Order Details & Dietary Notes:</strong> Items ordered, customizations (sauces, salads, sizes), and any allergen notifications you share with our staff.
            </li>
            <li>
              <strong>Website Order Notepad Data:</strong> When you use the on-screen "Order Notepad", items are stored locally in your browser so you do not lose your list while browsing. We do not transmit or sell this data to external tracking platforms.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
            <span className="text-red-500">03.</span>
            <h2>How We Use Your Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="font-bold text-white block">Order Fulfillment</span>
              <p className="text-slate-400">To freshly prepare your food and provide our kitchen team with exact specifications and allergy notices.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="font-bold text-white block">Local Delivery</span>
              <p className="text-slate-400">To direct our delivery driver straight to your address quickly while the food is piping hot.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="font-bold text-white block">Phone Updates</span>
              <p className="text-slate-400">To call you back if a particular item is unavailable or to confirm delivery timing during peak hours.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="font-bold text-white block">Customer Service</span>
              <p className="text-slate-400">To handle inquiries, feedback, receipts, and order confirmation requests.</p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
            <span className="text-red-500">04.</span>
            <h2>Payment Security & Card Details</h2>
          </div>
          <p>
            We do not store or capture full credit/debit card numbers on this website. Payment is conducted either via:
          </p>
          <ul className="space-y-1.5 pl-4 list-disc marker:text-red-500">
            <li><strong>Cash on Delivery or Collection:</strong> Handled in person.</li>
            <li><strong>Card Terminals:</strong> Processed in real-time through encrypted, certified portable chip & pin / contactless payment terminals handled by authorized delivery staff or counter staff.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
            <span className="text-red-500">05.</span>
            <h2>Cookies & Browser Storage</h2>
          </div>
          <p>
            Our website uses standard essential local cookies and session storage strictly necessary to operate our digital menu, remember your Order Notepad between pages, and ensure smooth, responsive browsing. We do not employ third-party advertising trackers or sell browsing profiles.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
            <span className="text-red-500">06.</span>
            <h2>Information Sharing (Our No-Sale Policy)</h2>
          </div>
          <p>
            <strong>We will never sell, rent, lease, or trade your personal information to third parties.</strong> Your delivery address and telephone number are shared exclusively with our trusted delivery drivers and counter personnel for the singular purpose of completing your order.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
            <span className="text-red-500">07.</span>
            <h2>Your Rights Under UK GDPR</h2>
          </div>
          <p>
            Under UK Data Protection legislation and the UK GDPR, you have the right to:
          </p>
          <ul className="space-y-1 pl-4 list-disc marker:text-red-500">
            <li>Request access to the personal data we hold about you.</li>
            <li>Request that any incorrect or outdated information be rectified.</li>
            <li>Request the deletion of your customer contact record from our internal order history.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-3 pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
            <span className="text-red-500">08.</span>
            <h2>Contact Us Regarding Privacy</h2>
          </div>
          <p>
            If you have questions regarding this Privacy Policy, wish to exercise any of your data protection rights, or have a question regarding a past order, please reach out to our team:
          </p>
          <div className="p-4 rounded-xl bg-neutral-900/90 border border-red-500/30 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-white font-bold">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Kebab Nite · 18A High street, Carrickfergus, BT38 7AF</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-red-500" />
              <span>Telephone: {SHOP_INFO.displayPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-red-500" />
              <span>Email: {SHOP_INFO.email}</span>
            </div>
          </div>
        </section>

      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#141418] border border-neutral-800">
        <div>
          <span className="text-xs text-slate-400 block">Ready for dinner?</span>
          <span className="font-display font-bold text-white text-base">Check our full Carrickfergus takeaway menu</span>
        </div>
        <button
          onClick={() => {
            onNavigate('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cartoon-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md"
        >
          View Full Menu
        </button>
      </div>

    </div>
  );
};
