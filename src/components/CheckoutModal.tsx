import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  ShieldCheck,
  Plus,
  Check,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Lock,
  ChevronRight,
  Receipt,
  Smartphone
} from 'lucide-react';
import {
  OrderItem,
  PaymentMethod,
  OrderType,
  CustomerInfo,
  AllergenInfo,
  TransactionRecord
} from '../types';
import { SHOP_INFO, RECOMMENDED_UPSELLS, UpsellItem } from '../data/menuData';
import { submitOrder } from '../services/orderService';
import { PaymentMethodBadges } from './PaymentMethodBadges';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderList: OrderItem[];
  onAddToOrder: (item: OrderItem) => void;
  onUpdateQuantity: (index: number, qty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearOrder: () => void;
}

const COMMON_ALLERGENS = [
  'Gluten / Wheat',
  'Milk / Dairy',
  'Nuts / Peanuts',
  'Eggs',
  'Celery',
  'Mustard',
  'Sesame Seeds',
  'Fish / Shellfish',
  'Soya',
  'No Known Allergies',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  orderList,
  onAddToOrder,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');

  // Customer Details
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '18 High Street area',
    postcode: 'BT38',
    deliveryNotes: '',
  });

  // Allergens
  const [hasAllergies, setHasAllergies] = useState<boolean>(false);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [allergenDetails, setAllergenDetails] = useState<string>('');
  const [allergenAcknowledged, setAllergenAcknowledged] = useState<boolean>(false);
  const [allergenError, setAllergenError] = useState<string | null>(null);

  // Online Payments is the primary method; Cash is an optional fallback
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online_card');

  // Online Card details (Stripe online payment)
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');
  const [cardholderName, setCardholderName] = useState<string>('');
  const [cardError, setCardError] = useState<string | null>(null);

  // Submission & Processing States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>('Processing...');
  const [completedOrder, setCompletedOrder] = useState<TransactionRecord | null>(null);

  if (!isOpen) return null;

  // Pricing calculations
  const itemsSubtotal = orderList.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? 2.50 : 0.00;
  
  // 5% platform and online ordering fee (calculated on pre-fee sum)
  const platformFee = Number(((itemsSubtotal + deliveryFee) * 0.05).toFixed(2));
  const totalAmount = Number((itemsSubtotal + deliveryFee + platformFee).toFixed(2));

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if (cardError) setCardError(null);
  };

  // Format Expiry (MM/YY)
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Format CVC
  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(raw);
  };

  const handleToggleAllergen = (item: string) => {
    if (item === 'No Known Allergies') {
      setSelectedAllergens(['No Known Allergies']);
      setHasAllergies(false);
      return;
    }
    const filtered = selectedAllergens.filter((a) => a !== 'No Known Allergies');
    if (filtered.includes(item)) {
      setSelectedAllergens(filtered.filter((a) => a !== item));
    } else {
      setSelectedAllergens([...filtered, item]);
      setHasAllergies(true);
    }
  };

  const handleQuickAddUpsell = (upsell: UpsellItem) => {
    onAddToOrder({
      itemId: upsell.id,
      name: upsell.name,
      price: upsell.price,
      quantity: 1,
      category: upsell.category,
    });
  };

  const validateDetailsStep = (): boolean => {
    if (!customer.fullName.trim()) {
      alert('Please enter your full name for the order.');
      return false;
    }
    if (!customer.phone.trim() || customer.phone.length < 8) {
      alert('Please enter a valid contact phone number so our team can reach you.');
      return false;
    }
    if (orderType === 'delivery') {
      if (!customer.address.trim() || customer.address.length < 5) {
        alert('Please enter your Carrickfergus delivery street address.');
        return false;
      }
      if (!customer.postcode.trim()) {
        alert('Please enter your Carrickfergus postcode (e.g. BT38).');
        return false;
      }
    }
    if (hasAllergies && !allergenDetails.trim() && selectedAllergens.length === 0) {
      setAllergenError('Please select or specify your allergen details.');
      return false;
    }
    if (!allergenAcknowledged) {
      setAllergenError('Please confirm the allergen acknowledgment checkbox to proceed.');
      return false;
    }
    setAllergenError(null);
    return true;
  };

  const handleProceedToPayment = () => {
    if (validateDetailsStep()) {
      if (!cardholderName.trim()) {
        setCardholderName(customer.fullName);
      }
      setStep('payment');
    }
  };

  const handleExecutePaymentAndOrder = async (chosenMethod: PaymentMethod = paymentMethod) => {
    if (orderList.length === 0) {
      alert('Your cart is empty. Please add items to order.');
      return;
    }

    // Validate online card details if paying via card
    if (chosenMethod === 'online_card') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15) {
        setCardError('Please enter a valid 16-digit card number.');
        return;
      }
      if (cardExpiry.length < 5) {
        setCardError('Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (cardCvc.length < 3) {
        setCardError('Please enter your 3 or 4 digit CVC security code.');
        return;
      }
      if (!cardholderName.trim()) {
        setCardError('Please enter the name printed on the card.');
        return;
      }
    }

    setCardError(null);
    setIsSubmitting(true);

    // Online payment processing simulation (Stripe gateway handoff)
    if (chosenMethod === 'online_card' || chosenMethod === 'apple_pay') {
      setProcessingStatus(
        chosenMethod === 'apple_pay'
          ? 'Authorizing Apple Pay biometrics...'
          : 'Connecting to Stripe secure gateway...'
      );
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStatus('Verifying card credentials...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStatus('Payment authorized! Dispatching ticket to Kebab Nite kitchen...');
      await new Promise((r) => setTimeout(r, 500));
    } else {
      setProcessingStatus('Registering Cash on Delivery order with kitchen...');
      await new Promise((r) => setTimeout(r, 500));
    }

    const now = new Date();
    const orderNum = `KN-${now.getFullYear().toString().slice(-2)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction: TransactionRecord = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      orderNumber: orderNum,
      customer: {
        ...customer,
      },
      items: [...orderList],
      orderType,
      paymentMethod: chosenMethod,
      paymentStatus: chosenMethod === 'cash' ? 'pending_cash' : 'paid_online',
      subtotal: itemsSubtotal,
      deliveryFee,
      platformFee,
      total: totalAmount,
      allergens: {
        hasAllergies,
        selectedAllergens,
        allergenDetails,
        acknowledged: allergenAcknowledged,
      },
      kitchenNotes: customer.deliveryNotes,
      createdAt: now.toISOString(),
      status: 'received',
    };

    // Save to Supabase 'orders' table (storing customer name, items, total amount with 5% fee, payment method, timestamp)
    await submitOrder(transaction);

    setCompletedOrder(transaction);
    setIsSubmitting(false);
    setStep('confirmation');
    onClearOrder();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-2xl bg-[#0e0e12] border-2 border-red-600/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-neutral-800 bg-gradient-to-r from-[#170e12] via-[#200c14] to-[#170e12] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 font-bold">
              {step === 'confirmation' ? '🎉' : '🛍️'}
            </div>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-white leading-tight">
                {step === 'confirmation'
                  ? 'Order & Payment Confirmed!'
                  : step === 'payment'
                  ? 'Secure Online Payment'
                  : 'Online Food Checkout'}
              </h2>
              <p className="text-xs text-amber-400">
                {step === 'confirmation'
                  ? 'Sent directly to Kebab Nite kitchen'
                  : 'Pay online securely with Card or Apple Pay'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ================= STEP 1: DETAILS, ADD-ONS & ALLERGENS ================= */}
          {step === 'details' && (
            <>
              {/* Order Items Review */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-red-500" />
                    <span>Selected Items ({orderList.length})</span>
                  </h3>
                  <span className="text-xs text-slate-400">Subtotal: £{itemsSubtotal.toFixed(2)}</span>
                </div>

                {orderList.length === 0 ? (
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center text-xs text-slate-400">
                    Your Food Cart is empty. Please add delicious items from our menu first.
                  </div>
                ) : (
                  <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                    {orderList.map((item, idx) => (
                      <div
                        key={`${item.itemId}-${idx}`}
                        className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex-1 pr-2">
                          <span className="font-bold text-white block">{item.name}</span>
                          {item.variant && (
                            <span className="text-[11px] text-amber-400">{item.variant}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-200">
                            {item.quantity}x £{item.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => onRemoveItem(idx)}
                            className="text-slate-500 hover:text-red-400 text-xs p-1"
                            title="Remove item"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RECOMMENDED ADD-ONS & SOFT DRINKS (Bulk Up Order) */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-red-950/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-500">
                      Bulk Up Your Feast
                    </span>
                    <h4 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Soft Drinks, Traditional Ayran & Dips</span>
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400">1-Tap Add</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {RECOMMENDED_UPSELLS.slice(0, 6).map((upsell) => (
                    <button
                      key={upsell.id}
                      type="button"
                      onClick={() => handleQuickAddUpsell(upsell)}
                      className="p-2.5 rounded-xl bg-[#141418] hover:bg-[#1c1c24] border border-neutral-800 hover:border-red-500/50 text-left transition-all group flex flex-col justify-between"
                    >
                      <div>
                        {upsell.badge && (
                          <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30 inline-block mb-1">
                            {upsell.badge}
                          </span>
                        )}
                        <span className="font-bold text-xs text-slate-100 group-hover:text-white block leading-tight">
                          {upsell.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">
                          {upsell.description}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between pt-1 border-t border-neutral-800">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          £{upsell.price.toFixed(2)}
                        </span>
                        <span className="w-5 h-5 rounded-lg bg-red-600/30 text-red-400 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                          +
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Type: Delivery vs Collection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Fulfilment Option
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                      orderType === 'delivery'
                        ? 'bg-red-600/25 border-red-500 text-white shadow-md'
                        : 'bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🚚 Delivery (+£2.50)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('collection')}
                    className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                      orderType === 'collection'
                        ? 'bg-red-600/25 border-red-500 text-white shadow-md'
                        : 'bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🛍️ Collection (Free)</span>
                  </button>
                </div>
              </div>

              {/* Customer Contact & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    placeholder="e.g. John Miller"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="e.g. 07700 900123"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                {orderType === 'delivery' && (
                  <>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">Delivery Street Address *</label>
                      <input
                        type="text"
                        required
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder="e.g. 14 Marine Highway, Flat 2"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Postcode *</label>
                      <input
                        type="text"
                        required
                        value={customer.postcode}
                        onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })}
                        placeholder="e.g. BT38 7AF"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email (for Stripe payment receipt)</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="e.g. john@example.co.uk"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* ALLERGENS & DIETARY REQUIREMENTS */}
              <div className="p-4 rounded-2xl bg-[#141217] border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h4 className="font-display text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Allergens & Dietary Requirements
                  </h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Food safety is paramount. Please select or note any allergies or dietary requirements.
                </p>

                {/* Allergen select chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {COMMON_ALLERGENS.map((allergen) => {
                    const isSelected = selectedAllergens.includes(allergen);
                    return (
                      <button
                        key={allergen}
                        type="button"
                        onClick={() => handleToggleAllergen(allergen)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                          isSelected
                            ? allergen === 'No Known Allergies'
                              ? 'bg-neutral-800 border-neutral-600 text-white'
                              : 'bg-red-600/30 border-red-500 text-white shadow-sm'
                            : 'bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {allergen}
                      </button>
                    );
                  })}
                </div>

                {/* Additional instructions */}
                <div className="pt-2">
                  <textarea
                    rows={2}
                    value={allergenDetails}
                    onChange={(e) => setAllergenDetails(e.target.value)}
                    placeholder="Special kitchen notes (e.g. No onions, sauce separate, buzzer code)..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Required Confirmation Checkbox */}
                <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allergenAcknowledged}
                    onChange={(e) => setAllergenAcknowledged(e.target.checked)}
                    className="mt-0.5 accent-red-600 rounded w-4 h-4"
                  />
                  <span className="text-[11px] text-slate-300">
                    I confirm that the contact details and dietary information provided are accurate.
                  </span>
                </label>

                {allergenError && (
                  <p className="text-xs text-red-400 font-bold">{allergenError}</p>
                )}
              </div>
            </>
          )}

          {/* ================= STEP 2: ONLINE PAYMENT (STRIPE GATEWAY) & FEE SUMMARY ================= */}
          {step === 'payment' && (
            <div className="space-y-6">
              
              {/* Back to Details trigger */}
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs font-bold text-red-400 hover:text-white flex items-center gap-1"
              >
                ← Back to Order Details
              </button>

              {/* PAYMENT METHODS SELECTOR */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Choose How to Pay
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  
                  {/* Option 1: Online Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('online_card');
                      setCardError(null);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === 'online_card'
                        ? 'bg-red-600/20 border-red-500 text-white shadow-lg ring-1 ring-red-500'
                        : 'bg-neutral-900/80 border-neutral-800 text-slate-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                        <CreditCard className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs sm:text-sm text-white">
                        Online Card
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Visa, Mastercard, Amex
                      </p>
                    </div>
                  </button>

                  {/* Option 2: Apple Pay / Google Pay / Wallets */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('apple_pay');
                      setCardError(null);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-red-600/20 border-red-500 text-white shadow-lg ring-1 ring-red-500'
                        : 'bg-neutral-900/80 border-neutral-800 text-slate-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white font-bold text-xs">
                        Pay
                      </div>
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs sm:text-sm text-white">
                        Apple / Google Pay
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        1-Click device wallet
                      </p>
                    </div>
                  </button>

                  {/* Option 3: Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('cash');
                      setCardError(null);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === 'cash'
                        ? 'bg-red-600/20 border-red-500 text-white shadow-lg ring-1 ring-red-500'
                        : 'bg-neutral-900/80 border-neutral-800 text-slate-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
                        <Banknote className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs sm:text-sm text-white">
                        Cash on Delivery
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Pay upon arrival
                      </p>
                    </div>
                  </button>

                </div>
              </div>

              {/* CARD DETAILS FORM (When online_card is selected) */}
              {paymentMethod === 'online_card' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-red-900/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs text-white">Card Payment Details</span>
                    </div>
                    <PaymentMethodBadges size="sm" />
                  </div>

                  <div className="space-y-3">
                    {/* Cardholder Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Name on Card *</label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="e.g. John Miller"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-red-500 font-medium"
                      />
                    </div>

                    {/* Card Number */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Card Number *</label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4532 •••• •••• 8892"
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-red-500 font-mono tracking-wider"
                        />
                        <CreditCard className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* Expiry & CVC */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-300">Expiry (MM/YY) *</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={cardExpiry}
                          onChange={handleCardExpiryChange}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                          <span>CVC / CVV *</span>
                          <span className="text-[10px] text-slate-400">3 or 4 digits</span>
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            inputMode="numeric"
                            value={cardCvc}
                            onChange={handleCardCvcChange}
                            placeholder="•••"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                          />
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {cardError && (
                      <p className="text-xs text-red-400 font-bold bg-red-950/40 p-2 rounded-lg border border-red-900/60">
                        {cardError}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Card details are encrypted and never stored locally.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* APPLE PAY / GOOGLE PAY BUTTON (When apple_pay is selected) */}
              {paymentMethod === 'apple_pay' && (
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-4">
                  <div className="max-w-sm mx-auto space-y-2">
                    <span className="text-xs text-slate-300 font-semibold block">
                      Fast 1-Click Wallet Checkout
                    </span>
                    <button
                      type="button"
                      onClick={() => handleExecutePaymentAndOrder('apple_pay')}
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-neutral-100 text-black font-display font-bold text-sm flex items-center justify-center gap-2 shadow-xl active:scale-98 transition-all"
                    >
                      <span className="text-base font-black"></span>
                      <span>Pay with Apple Pay (£{totalAmount.toFixed(2)})</span>
                    </button>
                    <p className="text-[10px] text-slate-400">
                      Authenticates using Touch ID, Face ID, or Passcode on compatible iOS/macOS devices.
                    </p>
                  </div>
                </div>
              )}

              {/* CASH ON DELIVERY EXPLANATION */}
              {paymentMethod === 'cash' && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-amber-300">
                    <Banknote className="w-4 h-4" />
                    <span>Cash on Delivery / Collection</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    You can hand cash to our driver or counter team upon food handover. Drivers carry change for standard notes.
                  </p>
                </div>
              )}

              {/* PAYMENT SUMMARY BEFORE TRANSACTIONS (5% FEE MENTIONED HERE AS SPECIFIED) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#111116] border border-neutral-800 space-y-3">
                <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-red-500" />
                  <span>Summary of Payment Before Transaction</span>
                </h4>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Items Subtotal</span>
                    <span className="font-mono">£{itemsSubtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>
                      {orderType === 'delivery' ? 'Local Delivery (Carrickfergus)' : 'Counter Collection'}
                    </span>
                    <span className="font-mono">
                      {deliveryFee > 0 ? `£${deliveryFee.toFixed(2)}` : 'FREE'}
                    </span>
                  </div>

                  {/* 5% Platform & Online Ordering Fee (Itemized in summary before transaction) */}
                  <div className="flex justify-between text-amber-300 font-semibold pt-1 border-t border-neutral-800">
                    <span className="flex items-center gap-1">
                      <span>Platform & Online Ordering Fee (5%)</span>
                    </span>
                    <span className="font-mono">£{platformFee.toFixed(2)}</span>
                  </div>

                  <p className="text-[10px] text-slate-400 italic">
                    * A 5% platform and online ordering fee applies to all orders to maintain digital ticketing, secure payment gateway processing, and real-time kitchen tracking.
                  </p>

                  <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-neutral-800">
                    <span>Total Amount to Pay</span>
                    <span className="font-mono text-xl font-black text-amber-400">
                      £{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP 3: ORDER CONFIRMATION & STRIPE RECEIPT ================= */}
          {step === 'confirmation' && completedOrder && (
            <div className="space-y-5 text-center">
              
              <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-3xl mx-auto animate-bounce">
                ✅
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-red-500">
                  {completedOrder.paymentMethod === 'cash'
                    ? 'Order Submitted to Kitchen'
                    : 'Payment Authorized & Order Sent'}
                </span>
                <h3 className="font-display text-2xl font-black text-white mt-1">
                  Thank You, {completedOrder.customer.fullName}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Your order is confirmed and recorded in our live Supabase order system.
                </p>
              </div>

              {/* Order Reference Box */}
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-xs text-slate-400">Order Reference</span>
                  <span className="font-mono text-base font-bold text-amber-400">
                    {completedOrder.orderNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Payment Status</span>
                  <span className="font-bold flex items-center gap-1.5 text-white">
                    {completedOrder.paymentMethod === 'online_card' && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>PAID ONLINE (Card)</span>
                      </span>
                    )}
                    {completedOrder.paymentMethod === 'apple_pay' && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>PAID ONLINE (Apple Pay)</span>
                      </span>
                    )}
                    {completedOrder.paymentMethod === 'cash' && (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>PENDING CASH ON DELIVERY</span>
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Fulfilment</span>
                  <span className="font-bold text-white">
                    {completedOrder.orderType === 'delivery'
                      ? `🚚 Delivery to ${completedOrder.customer.address}, ${completedOrder.customer.postcode}`
                      : '🛍️ Counter Collection (18A High Street)'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Estimated Ready Time</span>
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{completedOrder.orderType === 'delivery' ? '30–45 mins' : '15–20 mins'}</span>
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold">Total Paid (incl. 5% platform fee)</span>
                  <span className="font-mono font-bold text-amber-400 text-base">
                    £{completedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Allergen Instructions Confirmation */}
              {completedOrder.allergens.hasAllergies && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left text-xs text-amber-300">
                  <span className="font-bold block">⚠️ Dietary / Allergen Notice Forwarded to Kitchen:</span>
                  <span>{completedOrder.allergens.selectedAllergens.join(', ')}</span>
                  {completedOrder.allergens.allergenDetails && (
                    <span className="block italic mt-0.5">"{completedOrder.allergens.allergenDetails}"</span>
                  )}
                </div>
              )}

              {/* Shop contact note */}
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Questions about your order?</span>
                <a
                  href={`tel:${SHOP_INFO.phone}`}
                  className="text-red-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {SHOP_INFO.displayPhone}</span>
                </a>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-[#141418] flex items-center justify-between gap-3 shrink-0">
          {step === 'details' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-neutral-700 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Continue Browsing
              </button>

              <button
                type="button"
                onClick={handleProceedToPayment}
                disabled={orderList.length === 0}
                className="cartoon-btn-primary px-6 py-2.5 rounded-xl text-white font-display text-sm font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <span>Proceed to Online Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 'payment' && (
            <>
              <button
                type="button"
                onClick={() => setStep('details')}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-neutral-700 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Back
              </button>

              {paymentMethod === 'apple_pay' ? (
                <button
                  type="button"
                  onClick={() => handleExecutePaymentAndOrder('apple_pay')}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-white hover:bg-neutral-100 text-black font-display text-sm font-bold flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 text-neutral-800">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>{processingStatus}</span>
                    </span>
                  ) : (
                    <span>Pay with Apple Pay (£{totalAmount.toFixed(2)})</span>
                  )}
                </button>
              ) : paymentMethod === 'online_card' ? (
                <button
                  type="button"
                  onClick={() => handleExecutePaymentAndOrder('online_card')}
                  disabled={isSubmitting}
                  className="cartoon-btn-primary flex-1 sm:flex-none px-6 py-3 rounded-xl text-white font-display text-sm font-bold flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{processingStatus}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>Pay Online (£{totalAmount.toFixed(2)})</span>
                    </span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleExecutePaymentAndOrder('cash')}
                  disabled={isSubmitting}
                  className="cartoon-btn-primary flex-1 sm:flex-none px-6 py-3 rounded-xl text-white font-display text-sm font-bold flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{processingStatus}</span>
                    </span>
                  ) : (
                    <span>Confirm Cash on Delivery (£{totalAmount.toFixed(2)})</span>
                  )}
                </button>
              )}
            </>
          )}

          {step === 'confirmation' && (
            <button
              type="button"
              onClick={onClose}
              className="cartoon-btn-primary w-full py-3 rounded-xl text-white font-display text-sm font-bold"
            >
              Done / Return to Menu
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
