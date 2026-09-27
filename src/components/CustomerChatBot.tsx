import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Sparkles,
  Truck,
  RotateCcw,
  Ruler,
  Tag,
  PhoneCall,
  ShoppingBag,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Smile,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { Category, PastOrder } from '../types';

interface CustomerChatBotProps {
  onOpenTrackOrder: (orderId?: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenContactUs: () => void;
  onSelectCategory: (categorySlug: string) => void;
  onOpenSizeGuide?: () => void;
  categories: Category[];
  pastOrders?: PastOrder[];
  isDarkMode?: boolean;
}

interface MessageAction {
  label: string;
  type: 'track' | 'cart' | 'wishlist' | 'category' | 'contact' | 'whatsapp' | 'size' | 'url';
  value?: string;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actions?: MessageAction[];
  quickReplies?: string[];
}

export const CustomerChatBot: React.FC<CustomerChatBotProps> = ({
  onOpenTrackOrder,
  onOpenCart,
  onOpenWishlist,
  onOpenContactUs,
  onSelectCategory,
  onOpenSizeGuide,
  categories,
  pastOrders = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  const [showLauncherBubble, setShowLauncherBubble] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const initialMessages: Message[] = [
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "👋 Hi there! Welcome to **Joji Kids Zone**! I'm **Joji Buddy**, your shopping & order assistant 🧸\n\nHow can I help you and your little one today?",
      timestamp: formatTime(),
      actions: [
        { label: '📦 Track My Order', type: 'track' },
        { label: '🏷️ View Discount Offers', type: 'url', value: 'coupon' },
        { label: '📏 Kids Size Chart', type: 'size' },
      ],
      quickReplies: [
        'Track my order',
        'What are the active coupons?',
        'How does 7-day return work?',
        'Shipping & delivery time',
        'Connect on WhatsApp',
      ],
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setUnreadCount(0);
      setShowNotificationBadge(false);
      setShowLauncherBubble(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, isMinimized]);

  // Hide launcher tooltip after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLauncherBubble(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenBot = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    setShowNotificationBadge(false);
    setShowLauncherBubble(false);
  };

  const handleActionClick = (action: MessageAction) => {
    switch (action.type) {
      case 'track':
        if (action.value) {
          onOpenTrackOrder(action.value);
        } else if (pastOrders.length > 0) {
          onOpenTrackOrder(pastOrders[0].id);
        } else {
          onOpenTrackOrder('JOJI-742918');
        }
        break;
      case 'cart':
        onOpenCart();
        break;
      case 'wishlist':
        onOpenWishlist();
        break;
      case 'contact':
        onOpenContactUs();
        break;
      case 'whatsapp':
        window.open(
          'https://wa.me/919876543210?text=Hi%20Joji%20Kids%20Zone!%20I%20have%20a%20question%20regarding%20my%20order/products.',
          '_blank'
        );
        break;
      case 'category':
        if (action.value) {
          onSelectCategory(action.value);
          setIsOpen(false);
        }
        break;
      case 'size':
        if (onOpenSizeGuide) {
          onOpenSizeGuide();
        } else {
          respondToQuery('size chart');
        }
        break;
      case 'url':
        if (action.value === 'coupon') {
          handleSendQuery('What coupons are available?');
        }
        break;
    }
  };

  const generateBotResponse = (userInput: string): { text: string; actions?: MessageAction[]; quickReplies?: string[] } => {
    const lower = userInput.toLowerCase().trim();

    // Check for order ID pattern: JOJI-123456 or JJ-123456
    const orderMatch = lower.match(/(joji|jj)-?\d{6}/i);
    if (orderMatch) {
      const orderId = orderMatch[0].toUpperCase().replace(/^JJ(\d)/, 'JJ-$1').replace(/^JOJI(\d)/, 'JOJI-$1');
      return {
        text: `🔍 Found order **${orderId}**! It's currently in transit with BlueDart Express and on schedule for on-time delivery.`,
        actions: [
          { label: `📍 Track Order ${orderId}`, type: 'track', value: orderId },
          { label: '💬 Need delivery help?', type: 'whatsapp' },
        ],
        quickReplies: ['Track another order', 'When will it be delivered?', 'What is the return policy?'],
      };
    }

    // Tracking queries
    if (lower.includes('track') || lower.includes('status') || lower.includes('where is my order') || lower.includes('courier')) {
      if (pastOrders.length > 0) {
        const latestOrder = pastOrders[0];
        return {
          text: `📦 Your latest order **#${latestOrder.id}** (${latestOrder.items.length} items, ₹${latestOrder.totalAmount}) is placed!\n\nYou can track live milestones (Packed, Shipped, Out for Delivery) with one tap.`,
          actions: [
            { label: `📍 Track #${latestOrder.id}`, type: 'track', value: latestOrder.id },
            { label: '📦 All Past Orders', type: 'contact' },
          ],
          quickReplies: ['Sample tracking: JOJI-742918', 'Delivery time in India', 'Exchange my order'],
        };
      }
      return {
        text: '📦 To track your order, please type your **Order ID** (e.g., `JOJI-742918`) or click below to open our live order tracker with sample tracking!',
        actions: [
          { label: '📍 Open Order Tracker', type: 'track', value: 'JOJI-742918' },
          { label: '💬 Ask on WhatsApp', type: 'whatsapp' },
        ],
        quickReplies: ['JOJI-742918', 'How long does delivery take?', 'What if I am not home?'],
      };
    }

    // Shipping & Delivery queries
    if (lower.includes('shipping') || lower.includes('delivery') || lower.includes('deliver') || lower.includes('time') || lower.includes('charge')) {
      return {
        text: `🚚 **Shipping & Delivery Details:**\n\n• **Free Shipping:** On all prepaid & COD orders above ₹999 (₹49 for orders below ₹999).\n• **Delivery Speed:** 3 to 5 business days across metro cities & India.\n• **Couriers:** BlueDart, Delhivery, DTDC with real-time SMS updates.\n• **COD:** Cash on Delivery available at 27,000+ pin codes!`,
        actions: [
          { label: '📦 Track My Order', type: 'track' },
          { label: '💬 WhatsApp Support', type: 'whatsapp' },
        ],
        quickReplies: ['Track order JOJI-742918', 'What is your return policy?', 'Check coupons'],
      };
    }

    // Returns & Refund queries
    if (lower.includes('return') || lower.includes('exchange') || lower.includes('refund') || lower.includes('cancel') || lower.includes('replace')) {
      return {
        text: `🔄 **7-Day Hassle-Free Returns & Exchanges:**\n\n• You can request a return or size exchange within **7 days** of delivery.\n• Items must be unwashed, unused, and with original brand tags.\n• Free doorstep reverse pickup by our courier partner.\n• Refunds are processed within 24-48 hours to original payment method or UPI.`,
        actions: [
          { label: '💬 Request Return on WhatsApp', type: 'whatsapp' },
          { label: '📞 Call Support', type: 'contact' },
        ],
        quickReplies: ['How to exchange for a larger size?', 'Track my return', 'Check size chart'],
      };
    }

    // Size Guide queries
    if (lower.includes('size') || lower.includes('fitting') || lower.includes('chart') || lower.includes('age') || lower.includes('measurement')) {
      return {
        text: `📏 **Kids Sizing Quick Reference:**\n\n• **0 - 6 Months:** Height 50-68 cm | Weight 3-7 kg\n• **1 - 2 Years (1-2Y):** Height 80-90 cm | Chest 50-52 cm\n• **3 - 4 Years (3-4Y):** Height 98-104 cm | Chest 54-56 cm\n• **5 - 8 Years:** Height 110-128 cm\n• **Footwear:** EU 20 to 30 available.\n\n*Tip: If between sizes, we recommend ordering one size up for growing kids!*`,
        actions: [
          { label: '📐 Open Full Size Guide', type: 'size' },
          { label: '💬 Sizing Advice on WhatsApp', type: 'whatsapp' },
        ],
        quickReplies: ['Browse baby clothes', 'Browse footwear', 'What are current discounts?'],
      };
    }

    // Offers & Discount queries
    if (lower.includes('coupon') || lower.includes('discount') || lower.includes('offer') || lower.includes('promo') || lower.includes('code') || lower.includes('sale')) {
      return {
        text: `🎉 **Active Offers & Discount Codes Today:**\n\n1. **JOJI15** - Flat 15% OFF on all orders above ₹999! (Applied automatically at checkout)\n2. **KIDS10** - Extra 10% OFF for first-time shoppers!\n3. **BABYCOMBO** - Buy 2 Baby Rompers & get 1 free toy accessory!\n4. **FREE SHIPPING** automatically on all orders above ₹999.`,
        actions: [
          { label: '🛒 View Cart & Apply Promo', type: 'cart' },
          { label: '🧸 Explore Best Sellers', type: 'category', value: 'all' },
        ],
        quickReplies: ['Track my order', 'Check delivery charges', 'Payment options'],
      };
    }

    // Payment & COD queries
    if (lower.includes('payment') || lower.includes('cod') || lower.includes('cash on delivery') || lower.includes('upi') || lower.includes('gpay') || lower.includes('paytm') || lower.includes('card')) {
      return {
        text: `💳 **100% Safe & Secure Payment Options:**\n\n• **Cash on Delivery (COD)**: Available nationwide.\n• **UPI**: Google Pay, PhonePe, Paytm, BHIM with instant 1-tap checkout.\n• **Cards**: Visa, Mastercard, RuPay, Maestro credit & debit cards.\n• **Net Banking**: 50+ supported Indian banks.\n• Bank-grade 256-bit SSL encryption.`,
        actions: [
          { label: '🛒 Go to Cart & Checkout', type: 'cart' },
          { label: '💬 Ask about payment issues', type: 'whatsapp' },
        ],
        quickReplies: ['Is COD available in my area?', 'What are current discounts?', 'Track my order'],
      };
    }

    // Contact & Support queries
    if (lower.includes('contact') || lower.includes('phone') || lower.includes('call') || lower.includes('email') || lower.includes('agent') || lower.includes('human') || lower.includes('support') || lower.includes('whatsapp') || lower.includes('help')) {
      return {
        text: `📞 **We're here for you!**\n\n• **WhatsApp Support**: +91 98765 43210 (Fastest: replies in ~2 mins)\n• **Toll-Free Phone**: 1800-JOJI-KIDS (9:00 AM – 9:00 PM IST)\n• **Email**: care@jojikidszone.com\n• **Store Address**: Bandra West, Mumbai, Maharashtra 400050.`,
        actions: [
          { label: '💬 Chat on WhatsApp', type: 'whatsapp' },
          { label: '📋 Open Support Form', type: 'contact' },
        ],
        quickReplies: ['Track my order', '7-day return policy', 'Available coupons'],
      };
    }

    // Category / Product queries
    for (const cat of categories) {
      if (lower.includes(cat.name.toLowerCase()) || lower.includes(cat.slug.toLowerCase())) {
        return {
          text: `🌟 Great choice! We have an adorable collection in **${cat.name}** tailored with soft, non-toxic, child-safe fabrics and materials.`,
          actions: [
            { label: `🧸 Browse ${cat.name}`, type: 'category', value: cat.slug },
            { label: '🛒 View My Cart', type: 'cart' },
          ],
          quickReplies: ['Check size chart', 'Are there any discounts?', 'Track my order'],
        };
      }
    }

    // Kids clothing / baby clothes / toys / shoes
    if (lower.includes('toy') || lower.includes('game') || lower.includes('puzzle')) {
      return {
        text: '🧸 Check out our **Educational & Wooden Toys** section! BPA-free, rounded edges, and certified for infant and toddler safety.',
        actions: [{ label: 'Browse Toys', type: 'category', value: 'toys' }],
        quickReplies: ['Baby clothes', 'Shoes & Footwear', 'Active coupons'],
      };
    }

    if (lower.includes('shoe') || lower.includes('footwear') || lower.includes('sandal') || lower.includes('sneaker')) {
      return {
        text: '👟 Explore our **Kids Footwear** collection! Designed with non-slip flexible rubber soles and soft anti-chafing lining for active feet.',
        actions: [{ label: 'Browse Footwear', type: 'category', value: 'footwear' }],
        quickReplies: ['Kids size chart', 'Track my order', '7-day return policy'],
      };
    }

    if (lower.includes('dress') || lower.includes('frock') || lower.includes('party') || lower.includes('romper') || lower.includes('cloth') || lower.includes('pant') || lower.includes('shirt')) {
      return {
        text: '👗 We have beautiful **Kids Apparel** made with breathable 100% GOTS organic cotton—gentle on sensitive skin and machine washable.',
        actions: [{ label: 'Browse Clothing', type: 'category', value: 'clothing' }],
        quickReplies: ['What size should I pick?', 'Discounts and coupons', 'Delivery times'],
      };
    }

    // Greetings
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('namaste') || lower.includes('good morning') || lower.includes('good evening')) {
      return {
        text: '😊 Hello! How is your day going? How can I help you find the perfect outfit or toy for your little one today?',
        actions: [
          { label: '📦 Track My Order', type: 'track' },
          { label: '🏷️ View Discounts (15% Off)', type: 'url', value: 'coupon' },
          { label: '📏 Size Guide', type: 'size' },
        ],
        quickReplies: ['Track my order', 'Shipping time', 'Size chart', 'Active offers'],
      };
    }

    // Thank you
    if (lower.includes('thank') || lower.includes('shukriya') || lower.includes('thanks') || lower.includes('awesome') || lower.includes('great')) {
      return {
        text: '🥰 You are most welcome! We love putting smiles on little faces. Feel free to ask if you need anything else!',
        actions: [
          { label: '🛍️ Continue Shopping', type: 'category', value: 'all' },
          { label: '❤️ View Wishlist', type: 'wishlist' },
        ],
        quickReplies: ['Track my order', 'Available discounts', 'Connect on WhatsApp'],
      };
    }

    // Default Fallback
    return {
      text: `Got it! I can help you with:\n\n• **Order Tracking:** Enter your ID like \`JOJI-742918\`\n• **Sizing & Age Chart:** Infant to 12 Years\n• **Delivery & Shipping:** Metro 3-5 days & Free above ₹999\n• **Returns:** 7-day easy exchange\n• **Special Offers:** Code **JOJI15** for 15% OFF\n\nOr connect directly with our support team on WhatsApp!`,
      actions: [
        { label: '📦 Track Order', type: 'track' },
        { label: '💬 WhatsApp Support', type: 'whatsapp' },
        { label: '📏 Size Chart', type: 'size' },
      ],
      quickReplies: ['Track order JOJI-742918', '7-day return policy', 'Shipping time in India', 'Connect on WhatsApp'],
    };
  };

  const respondToQuery = (queryText: string) => {
    setIsTyping(true);

    // Realistic typing delay
    setTimeout(() => {
      const response = generateBotResponse(queryText);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: formatTime(),
        actions: response.actions,
        quickReplies: response.quickReplies,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (!isOpen) {
        setUnreadCount((c) => c + 1);
        setShowNotificationBadge(true);
      }
    }, 550);
  };

  const handleSendQuery = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    respondToQuery(text);
  };

  const handleClearChat = () => {
    setMessages(initialMessages);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Launcher speech bubble notification */}
        {showLauncherBubble && !isOpen && (
          <div className="mb-3 max-w-[260px] bg-white dark:bg-slate-900 border border-pink-200 dark:border-pink-900/60 shadow-xl rounded-2xl p-3 text-xs text-slate-700 dark:text-slate-200 animate-bounce duration-1000 relative">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 font-bold text-pink-600 dark:text-pink-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hi! Need help shopping?</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLauncherBubble(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
              Track orders, check sizing, or get 15% discount coupons with Joji Buddy! 🧸
            </p>
            {/* Bubble arrow */}
            <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white dark:bg-slate-900 border-r border-b border-pink-200 dark:border-pink-900/60 transform rotate-45"></div>
          </div>
        )}

        <button
          onClick={isOpen ? () => setIsOpen(false) : handleOpenBot}
          aria-label="Open customer support chat"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-900"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageCircle className="w-7 h-7" />
              {/* Online pulse indicator */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
              </span>
            </div>
          )}

          {/* Unread badge */}
          {showNotificationBadge && unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1 -left-1 bg-amber-400 text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] max-w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 ${
            isMinimized ? 'h-16' : 'h-[540px] max-h-[82vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-4 py-3.5 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/30">
                  🧸
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-wide text-white">Joji Buddy</h3>
                  <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-medium">
                    AI Assistant
                  </span>
                </div>
                <p className="text-[11px] text-pink-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                  Online • Replies instantly
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={handleClearChat}
                title="Reset conversation"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body & Messages */}
          {!isMinimized && (
            <>
              {/* Quick Status Bar */}
              <div className="bg-pink-50/70 dark:bg-pink-950/20 px-3.5 py-2 border-b border-pink-100 dark:border-pink-900/30 flex items-center justify-between text-[11px] text-pink-800 dark:text-pink-300">
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  Code <strong className="font-bold text-pink-600 dark:text-pink-400">JOJI15</strong> for 15% OFF!
                </span>
                <button
                  onClick={() => handleActionClick({ label: 'WhatsApp', type: 'whatsapp' })}
                  className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  WhatsApp Support
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Messages container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/50 dark:bg-slate-900/50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[88%]">
                      {msg.sender === 'bot' && (
                        <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-950/70 text-slate-800 dark:text-pink-200 flex items-center justify-center text-xs shrink-0 mb-1 shadow-sm">
                          🧸
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-xs font-medium'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs'
                        }`}
                      >
                        <div className="whitespace-pre-line break-words">{msg.text}</div>

                        {/* Interactive Buttons embedded in Bot message */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-1.5">
                            {msg.actions.map((act, i) => (
                              <button
                                key={i}
                                onClick={() => handleActionClick(act)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-900/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 transition active:scale-95 shadow-2xs"
                              >
                                {act.label}
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>

                    {/* Quick reply suggestion chips */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 pl-8">
                        {msg.quickReplies.map((reply, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendQuery(reply)}
                            className="bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] px-2.5 py-1 rounded-full shadow-2xs transition active:scale-95"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-950 text-slate-800 dark:text-pink-200 flex items-center justify-center text-xs shrink-0 shadow-sm">
                      🧸
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-sm flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-medium">Joji Buddy is typing</span>
                      <div className="flex gap-1 items-center ml-1">
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Quick Action Bar */}
              <div className="px-3 py-1.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
                <button
                  onClick={() => handleSendQuery('Track order')}
                  className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition"
                >
                  <Truck className="w-3 h-3 text-pink-500" />
                  Track Order
                </button>
                <button
                  onClick={() => handleSendQuery('Size Guide')}
                  className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition"
                >
                  <Ruler className="w-3 h-3 text-indigo-500" />
                  Size Guide
                </button>
                <button
                  onClick={() => handleSendQuery('7-Day Returns')}
                  className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition"
                >
                  <RotateCcw className="w-3 h-3 text-emerald-500" />
                  Returns
                </button>
                <button
                  onClick={() => handleSendQuery('Discounts and Coupons')}
                  className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition"
                >
                  <Tag className="w-3 h-3 text-amber-500" />
                  Offers
                </button>
              </div>

              {/* Chat Input Field */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendQuery();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about orders, sizing, delivery..."
                    className="flex-1 px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 transition"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    aria-label="Send message"
                    className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition active:scale-95 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
