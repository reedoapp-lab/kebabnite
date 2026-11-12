import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Search, 
  Package, 
  Clock, 
  Sparkles, 
  ShoppingBag, 
  RotateCcw, 
  ChevronRight,
  HelpCircle,
  Phone
} from 'lucide-react';
import { fetchOrdersByPhone, OrderRecord } from '../services/orderService';
import { SHOP_INFO } from '../data/menuData';
import { PageId } from '../types';

interface NeedHelpBotProps {
  onNavigate: (page: PageId) => void;
  onOpenCart: () => void;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  orders?: OrderRecord[];
  timestamp: string;
  action?: {
    label: string;
    actionType: 'navigate-menu' | 'navigate-orders' | 'open-cart';
  };
}

export const NeedHelpBot: React.FC<NeedHelpBotProps> = ({ onNavigate, onOpenCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneForTracking, setPhoneForTracking] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hello! I'm your Kebab Nite AI assistant. I can look up your order status & history, explain our £15 deals, show allergen info, or guide you through ordering online!",
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Extract phone number from text if present
  const extractPhone = (text: string): string | null => {
    const cleaned = text.replace(/[^\d+]/g, '');
    if (cleaned.length >= 8 && cleaned.length <= 14) {
      return cleaned;
    }
    return null;
  };

  const handleSend = async (customText?: string) => {
    const query = (customText || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // 1. Check if user is asking to track an order or provided a phone number
    const detectedPhone = extractPhone(query);
    const trackingKeywords = ['track', 'order status', 'where is my order', 'my order', 'history', 'previous order'];
    const isTrackingIntent = trackingKeywords.some((k) => query.toLowerCase().includes(k)) || !!detectedPhone;

    if (detectedPhone || (isTrackingIntent && phoneForTracking)) {
      const phoneToUse = detectedPhone || phoneForTracking;
      try {
        const foundOrders = await fetchOrdersByPhone(phoneToUse);
        setPhoneForTracking(phoneToUse);

        if (foundOrders.length > 0) {
          const latest = foundOrders[0];
          const botReply: Message = {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: `Found ${foundOrders.length} order(s) for ${phoneToUse}! Your latest order #${latest.id.slice(-6).toUpperCase()} is currently marked as "${latest.status.toUpperCase()}". Here are the details:`,
            orders: foundOrders.slice(0, 3),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: {
              label: 'View full history on My Orders page',
              actionType: 'navigate-orders',
            },
          };
          setMessages((prev) => [...prev, botReply]);
          setIsLoading(false);
          return;
        } else {
          const botReply: Message = {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: `I couldn't find any recent orders placed under ${phoneToUse}. Please ensure you enter the same UK mobile or landline number used during checkout, or open your Food Cart to place an order now!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: {
              label: 'Open Food Cart & Order',
              actionType: 'open-cart',
            },
          };
          setMessages((prev) => [...prev, botReply]);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error in bot order lookup:', err);
      }
    }

    // 2. Query Gemini AI through /api/chat or smart local knowledge base
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          customerPhone: phoneForTracking || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.reply || "I'm here to help with your Kebab Nite order!";
        const botReply: Message = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botReply]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // High-grade fallback answering based on shop knowledge
      let fallbackAnswer = "Welcome to Kebab Nite at 18A High Street, Carrickfergus! We are open daily from 4:00 PM till Late.";
      const lower = query.toLowerCase();

      if (lower.includes('deal') || lower.includes('£15') || lower.includes('15')) {
        fallbackAnswer = "🔥 Our legendary £15 deals include:\n1) Munchy Box Special (Doner, Tikka, Chips, Onion Rings, Garlic Bread, 2 Sauces)\n2) 12\" Pizza Deal (Any 12\" pizza + chips + 2 cans)\n3) Kebab Feast Deal (Large Doner/Tikka on naan + chips + drink)\n4) Burger Night (2 Quarter Pounder Burgers + 2 chips + 2 dips)!";
      } else if (lower.includes('pay') || lower.includes('card') || lower.includes('cash') || lower.includes('fee') || lower.includes('stripe')) {
        fallbackAnswer = "💳 Online payments are processed directly with Stripe (Visa, Mastercard, Amex, Apple Pay). Cash on delivery is also available as an optional backup payment system if you don't have a card on hand. A transparent 5% platform fee is shown at checkout summary before transaction.";
      } else if (lower.includes('drink') || lower.includes('ayran') || lower.includes('pepsi') || lower.includes('coke')) {
        fallbackAnswer = "🥤 We have all major soft drinks to bulk up your meal: Pepsi, Diet Pepsi, Coca Cola, Diet Coke, Fanta, 7Up, Dr Pepper, and refreshing Turkish Ayran yoghurt drink!";
      } else if (lower.includes('track') || lower.includes('status')) {
        fallbackAnswer = "📦 To track your order right now, please type your mobile phone number (e.g. 07700 900123) and I will retrieve your live kitchen status from our database!";
      } else if (lower.includes('hour') || lower.includes('time') || lower.includes('open')) {
        fallbackAnswer = `🕒 Kebab Nite is open 7 days a week: Mon–Sun 4:00 PM – Late (Delivery service starts 4:30 PM). Find us at ${SHOP_INFO.address}!`;
      } else if (lower.includes('allergen') || lower.includes('allergy') || lower.includes('gluten')) {
        fallbackAnswer = "⚠️ Allergen notice: Please leave dietary requests in the order notes during checkout, or give our counter a quick ring at 028 9332 1805 so we can safely prepare your food without cross-contact.";
      }

      const botReply: Message = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: fallbackAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: Message['action']) => {
    if (!action) return;
    setIsOpen(false);
    if (action.actionType === 'navigate-menu') onNavigate('menu');
    if (action.actionType === 'navigate-orders') onNavigate('my-orders');
    if (action.actionType === 'open-cart') onOpenCart();
  };

  const getStatusColor = (status: OrderRecord['status'] | string) => {
    switch (status) {
      case 'preparing':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'on_the_way':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ready_for_collection':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'completed':
        return 'bg-neutral-800 text-slate-300 border-neutral-700';
      default:
        return 'bg-red-600/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <>
      {/* Floating Need Help Trigger Button on the Right Side */}
      <div className="fixed right-3 sm:right-6 bottom-20 sm:bottom-6 z-40">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="group relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-display font-bold text-xs sm:text-sm shadow-2xl border-2 border-red-400/40 hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Open AI Help and Order Tracking"
        >
          {/* Subtle pulse aura */}
          <span className="absolute -inset-1 rounded-full bg-red-600/30 blur-sm group-hover:bg-red-500/40 transition-all"></span>

          <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-950/60 border border-red-300/40 text-amber-400">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="relative text-left pr-1">
            <div className="leading-tight flex items-center gap-1.5">
              <span>Need Help?</span>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            </div>
            <span className="text-[10px] text-red-200 block font-normal font-sans">
              AI & Order Status
            </span>
          </div>
        </button>
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-24 sm:bottom-24 sm:right-6 sm:left-auto sm:w-[440px] 2xl:w-[480px] max-h-[600px] 2xl:max-h-[680px] h-[80vh] z-50 rounded-3xl bg-gradient-to-b from-[#181114] to-[#0d0d10] border border-red-600/40 shadow-2xl flex flex-col overflow-hidden animate-soft-fade">
          
          {/* Chat Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-red-700 via-red-800 to-neutral-900 border-b border-red-600/40 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-neutral-950/80 border border-red-400/40 flex items-center justify-center text-amber-400 shadow">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-bold text-sm flex items-center gap-2">
                  <span>Kebab Nite Assistant</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-red-200 font-sans uppercase font-bold tracking-wider">
                    AI Online
                  </span>
                </div>
                <p className="text-[11px] text-red-100/80">
                  Track orders • Menu advice • Payment guide
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all"
              aria-label="Close Help Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Tracking Sub-bar */}
          <div className="px-3.5 py-2.5 bg-neutral-950/90 border-b border-neutral-800 flex items-center gap-2 text-xs">
            <Search className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <input
              type="tel"
              value={phoneForTracking}
              onChange={(e) => setPhoneForTracking(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && phoneForTracking) {
                  handleSend(`Track orders for ${phoneForTracking}`);
                }
              }}
              placeholder="Enter phone # to check live order status..."
              className="bg-transparent text-white text-xs placeholder:text-neutral-500 focus:outline-none w-full"
            />
            {phoneForTracking && (
              <button
                onClick={() => handleSend(`Track orders for ${phoneForTracking}`)}
                className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase tracking-wider shrink-0"
              >
                Find
              </button>
            )}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-red-600 text-white rounded-br-none shadow-md font-medium'
                      : 'bg-neutral-900 border border-neutral-800 text-slate-200 rounded-bl-none shadow'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Render Orders if returned by tracking */}
                  {msg.orders && msg.orders.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-neutral-800 space-y-2">
                      {msg.orders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-[11px] space-y-1"
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-white">Order #{((ord.orderNumber || ord.id) as string).slice(-6).toUpperCase()}</span>
                            <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase font-bold ${getStatusColor(ord.status)}`}>
                              {ord.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-slate-400">
                            {Array.isArray(ord.items) ? ord.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ') : 'Items recorded'}
                          </div>
                          <div className="flex items-center justify-between text-neutral-400 pt-1 text-[10px]">
                            <span>{new Date(ord.createdAt || (ord as any).timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="font-bold text-amber-400">£{(ord.total || (ord as any).total_amount || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action button inside message */}
                  {msg.action && (
                    <button
                      onClick={() => handleActionClick(msg.action)}
                      className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>{msg.action.label}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <span className="text-[10px] text-neutral-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                <span className="italic">Kebab Nite AI is checking the kitchen...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-neutral-950/70 border-t border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <button
              onClick={() => handleSend("What are the £15 deals?")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-slate-300 font-medium transition-all"
            >
              🔥 £15 Deals
            </button>
            <button
              onClick={() => handleSend("How does payment and the 5% fee work?")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-slate-300 font-medium transition-all"
            >
              💳 Payment Info
            </button>
            <button
              onClick={() => handleSend("What soft drinks can I add?")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-slate-300 font-medium transition-all"
            >
              🥤 Drinks Menu
            </button>
            <button
              onClick={() => handleSend("Opening hours and delivery areas?")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-slate-300 font-medium transition-all"
            >
              🕒 Opening Hours
            </button>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask about menu, deals, or type phone #..."
              className="flex-1 bg-neutral-900 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-neutral-500 focus:outline-none transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputText.trim()}
              className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 shadow"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
