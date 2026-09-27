import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  Package,
  RotateCcw,
  Truck,
  XCircle,
  CreditCard,
  Ticket,
  Crown,
  Building2,
  HelpCircle,
  Handshake,
  Phone,
  Mail,
  Clock,
  MapPin,
  Search,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  Send,
  MessageSquare,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface ContactUsViewProps {
  onBackToHome: () => void;
  onOpenOrderHistory: () => void;
  onOpenTrackModal: (orderId?: string) => void;
  onOpenAdminLogin?: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Order Information',
    question: 'What is the status of my order? How can I check the status of my order?',
    answer:
      'You can check the real-time status of your order anytime by visiting the "Manage Your Order" section above or clicking "View My Orders". Each order features live milestones including Confirmed, Packed at Warehouse, Shipped with AWB tracking, Out for Delivery, and Delivered.',
  },
  {
    id: 'faq-2',
    category: 'Order Information',
    question: 'How do I know if my Order is confirmed?',
    answer:
      'Once your order is successfully placed, you will instantly receive an on-screen confirmation with your Order ID, along with a confirmation SMS and email summary with your item breakdown and delivery ETA.',
  },
  {
    id: 'faq-3',
    category: 'Order Information',
    question: "What's the minimum order value required to place an order?",
    answer:
      'There is no minimum order value to shop on JOJI KIDS ZONE! You can order any item of your choice. Furthermore, all orders above ₹999 qualify for Free Standard Delivery across India.',
  },
  {
    id: 'faq-4',
    category: 'Order Information',
    question: 'Does JOJI KIDS deliver products outside India?',
    answer:
      'Currently, JOJI KIDS ZONE ships to all serviceable pincodes across India. International shipping to select countries is coming soon. Stay tuned to our official Instagram @jojiidszone.in for international launch updates.',
  },
  {
    id: 'faq-5',
    category: 'Order Information',
    question: 'Is it mandatory to register before placing an order?',
    answer:
      'No, account registration is not mandatory. You can quickly place an order via guest checkout by simply providing your contact number, delivery address, and recipient name.',
  },
  {
    id: 'faq-6',
    category: 'Order Information',
    question: 'Can I ship different items in my order to different shipping addresses?',
    answer:
      'Currently, all items in a single order will be dispatched to the same shipping address specified during checkout. If you wish to send items to multiple addresses (such as gifting relatives), please place separate orders for each destination.',
  },
  {
    id: 'faq-7',
    category: 'Order Information',
    question: 'Why is my order not confirmed?',
    answer:
      'Orders are typically confirmed within seconds. In rare cases where payment gateway verification is pending or if bank servers experience high latency, confirmation may take 5 to 10 minutes. If the amount was debited but your order is not showing, rest assured the amount will either confirm your order or automatically reverse to your source account within 24-48 bank hours.',
  },
  {
    id: 'faq-8',
    category: 'Order Information',
    question: 'How do I track my order?',
    answer:
      'Simply enter your Order ID in our "Track Order" lookup tool or visit "Manage Your Order" -> "Track, Return, Cancel". You can also view step-by-step courier transit updates directly from the delivery partner link.',
  },
  {
    id: 'faq-9',
    category: 'Order Information',
    question: "What is JOJI KIDS's Shipping Policy?",
    answer:
      'We pack and dispatch most orders within 24-48 business hours from our central warehouse. Standard delivery takes 3 to 5 business days for major metro cities and 4 to 7 business days for other regions across India.',
  },
  {
    id: 'faq-10',
    category: 'Order Information',
    question: 'What is the shipping cost?',
    answer:
      'Shipping is completely FREE on all orders valued above ₹999! For orders below ₹999, a nominal flat convenience and handling charge of ₹49 applies nationwide.',
  },
  {
    id: 'faq-11',
    category: 'Order Information',
    question: 'How do I receive a copy of my invoice?',
    answer:
      'A tax invoice is physically enclosed in your shipping parcel box. Additionally, you can download a digital PDF copy of your GST tax invoice anytime from the "Order Information / View My Orders" dashboard.',
  },
];

export const ContactUsView: React.FC<ContactUsViewProps> = ({
  onBackToHome,
  onOpenOrderHistory,
  onOpenTrackModal,
}) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketSent, setTicketSent] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    name: '',
    phone: '',
    orderId: '',
    topic: 'Order Status',
    message: '',
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setTicketForm({
        name: '',
        phone: '',
        orderId: '',
        topic: 'Order Status',
        message: '',
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs sm:text-sm">
            <button
              onClick={onBackToHome}
              className="text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium cursor-pointer transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-amber-600 dark:text-amber-400 font-bold">Contact Us</span>
          </nav>

          <button
            onClick={onBackToHome}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
          >
            ← Back to Store
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Contact us
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Help Center, Order Assistance & Customer Protection Hub
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenOrderHistory}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>View My Orders</span>
            </button>
            <button
              onClick={() => onOpenTrackModal()}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-amber-400 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-amber-500" />
              <span>Track Parcel</span>
            </button>
          </div>
        </div>

        {/* Security & Anti-Fraud Advisory Alert Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 p-5 sm:p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wide text-xs px-2 py-0.5 bg-amber-200/70 dark:bg-amber-900/60 rounded-md">
                  Official Security Advisory
                </span>
              </div>
              <p className="font-medium">
                Please do not share your OTP, PIN, or personal details with anyone over calls, messages, or emails.
                Always make payments only through{' '}
                <span className="font-extrabold inline-flex items-baseline gap-1">
                  <span className="text-[#EC4899]">joji</span>
                  <span className="text-[#16A34A] dark:text-[#22C55E]">kids</span>
                  <span className="text-[#0284C7] dark:text-[#38BDF8]">zone</span>
                </span>{' '}
                official mobile app or website. Additionally, beware of fraudulent scratch cards received by post claiming prizes.{' '}
                <span className="font-extrabold inline-flex items-baseline gap-1">
                  <span className="text-[#EC4899]">joji</span>
                  <span className="text-[#16A34A] dark:text-[#22C55E]">kids</span>
                </span>{' '}
                does not send physical scratch cards, and any request to pay tax or TDS to claim a prize is a scam. Stay alert and protect your information.
              </p>
            </div>
          </div>
        </div>

        {/* Login Prompt Callout for Order Queries */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              To raise any order related query,{' '}
              <button
                onClick={onOpenOrderHistory}
                className="text-amber-600 dark:text-amber-400 font-extrabold hover:underline cursor-pointer"
              >
                click here to login / view my orders
              </button>{' '}
              to continue.
            </span>
          </div>

          <button
            onClick={onOpenOrderHistory}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            Access My Orders →
          </button>
        </div>

        {/* Section 1: Manage Your Order */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              <span>Manage Your Order</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Track, Return, Cancel, View order details
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Tile 1: Order Information */}
            <div
              onClick={onOpenOrderHistory}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Open <ChevronRight className="w-3 h-3" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Order Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Check status, view invoice and dispatch timeline
                </p>
              </div>
            </div>

            {/* Tile 2: Return, Replacement & Exchange */}
            <div
              onClick={onOpenOrderHistory}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Open <ChevronRight className="w-3 h-3" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Return, Replacement & Exchange
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Raise request / Check status of item returns
                </p>
              </div>
            </div>

            {/* Tile 3: Delivery / Pickup */}
            <div
              onClick={() => onOpenTrackModal()}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Track <ChevronRight className="w-3 h-3" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Delivery / Pickup
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Live transit map, carrier details & OTP verify
                </p>
              </div>
            </div>

            {/* Tile 4: Modify / Cancel Order */}
            <div
              onClick={onOpenOrderHistory}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <XCircle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Manage <ChevronRight className="w-3 h-3" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Modify / Cancel Order
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Cancellation / Modify items before dispatch
                </p>
              </div>
            </div>

            {/* Tile 5: Refunds */}
            <div
              onClick={onOpenOrderHistory}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Check <ChevronRight className="w-3 h-3" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Refunds
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Check Refunds Status & Bank Credit Timelines
                </p>
              </div>
            </div>

            {/* Tile 6: Coupons / Club Cash */}
            <div
              onClick={() => {
                alert('Active Coupons:\n• JOJI15 - 15% OFF Launch Discount\n• JOJIFEST - Extra Festive Special\n• HITZ - Rush Hour Deal');
              }}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Ticket className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View <ChevronRight className="w-3 h-3" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Coupons / Club Cash
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Cashback Code, GC, GSO... etc.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Manage Your Account & Business Tie-ups */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span>Manage Your Account & Partnerships</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Club benefits, franchise opportunities and vendor collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Firstcry Club / Joji Club */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-slate-800 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
                  <Crown className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Firstcry Club / Joji Club
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Exclusive member savings, early bird flash sales, and free delivery perks.
                </p>
              </div>
              <span className="inline-block mt-3 text-xs font-bold text-amber-600 dark:text-amber-400">
                Member Benefits Active
              </span>
            </div>

            {/* Become Franchisee */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Become Franchisee
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Partner with JOJI KIDS ZONE for retail store expansion across Tier 1, 2 & 3 cities.
                </p>
              </div>
              <a
                href="mailto:franchise@jojikidszone.com?subject=Franchisee%20Inquiry%20-%20JOJI%20KIDS%20ZONE"
                className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Apply for Franchise <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* Business / Supplier Tie Up */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <Handshake className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Business / Supplier Tie Up
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Sell your quality kids wear, toys or baby products on our platform.
                </p>
              </div>
              <a
                href="mailto:vendors@jojikidszone.com?subject=Vendor%20Supplier%20Tie%20Up%20Inquiry"
                className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Vendor Collaboration <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* Other Queries */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-slate-800 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-3">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Other Queries
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Institutional bulk orders, media partnerships or feedback for our store.
                </p>
              </div>
              <a
                href="#contact-form"
                className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Send Message <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Official Contact Details Box */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 bg-amber-500/30 text-amber-300 rounded-full border border-amber-400/30">
                Official Support Channels
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                Contact Details & Direct Helpdesk
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our support executives are available Monday to Saturday (9:00 AM – 8:00 PM IST) to assist you with order modifications, size exchanges, and delivery follow-ups.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Customer Care Phone</span>
                    <a
                      href="tel:7415432020"
                      className="font-bold text-sm text-white hover:text-amber-400 transition-colors"
                    >
                      +91 74154 32020
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Support Email</span>
                    <a
                      href="mailto:support@jojikidszone.com"
                      className="font-bold text-sm text-white hover:text-amber-400 transition-colors truncate block"
                    >
                      support@jojikidszone.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Working Hours</span>
                    <span className="font-bold text-xs text-white">
                      Mon – Sat (9:00 AM – 8:00 PM)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Store & Warehouse</span>
                    <span className="font-bold text-xs text-white">
                      120 A.B. Road, Dewas, MP, India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Raise Ticket Form */}
            <div id="contact-form" className="md:col-span-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span>Submit a Quick Inquiry</span>
              </h4>

              {ticketSent ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500" />
                  <p className="font-bold">Inquiry Received Successfully!</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Our care executive will call or message you on WhatsApp within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={ticketForm.name}
                      onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={ticketForm.phone}
                        onChange={(e) => setTicketForm({ ...ticketForm, phone: e.target.value })}
                        placeholder="10-digit number"
                        required
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Order ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={ticketForm.orderId}
                        onChange={(e) => setTicketForm({ ...ticketForm, orderId: e.target.value })}
                        placeholder="e.g. JOJI-98214"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Query Details
                    </label>
                    <textarea
                      rows={3}
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                      placeholder="Describe what you need help with..."
                      required
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Query</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Security Warning Notice Card (Firstcry / JOJI KIDS protection notice) */}
        <div className="rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900 dark:text-white font-bold">Important Notice:</strong> Firstcry and JOJI KIDS will never contact you for cash prizes or deposit money for photoshoots or franchise or distributorship or request a password, PIN or CVV etc. Please refrain from sharing such sensitive information with anyone, as it could lead to fraudulent transactions. Further, please be vigilant against fraudulent sites, social media pages, fake offers, SMS, email, whatsapp messages, or any other suspicious communication claiming to be from Firstcry or JOJI KIDS.
            </p>
          </div>
        </div>

        {/* Section 3: Order Information & FAQs */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Order Information & Help Topics
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Order Information Related Other Help Topics
              </p>
            </div>

            {/* FAQ Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help questions..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Orders Button */}
          <div className="flex items-center gap-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4">
            <Package className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex-1">
              Want to see your placed orders, invoices, or delivery status directly?
            </div>
            <button
              onClick={onOpenOrderHistory}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
            >
              View My Orders
            </button>
          </div>

          {/* Accordion FAQ List */}
          <div className="space-y-2.5">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-500' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
