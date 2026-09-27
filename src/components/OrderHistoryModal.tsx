import React, { useState } from 'react';
import {
  X,
  PackageCheck,
  RotateCcw,
  ShoppingBag,
  Truck,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ReceiptText,
  AlertCircle
} from 'lucide-react';
import { PastOrder, PastOrderItem } from '../types';
import { resetSampleOrders, clearPastOrders } from '../lib/orderStorage';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: PastOrder[];
  onReorderItem: (productId: string, size?: string | null, quantity?: number) => void;
  onReorderEntireOrder: (order: PastOrder) => void;
  onTrackOrder: (orderId: string) => void;
  onOpenCart: () => void;
  onRefreshOrders?: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onReorderItem,
  onReorderEntireOrder,
  onTrackOrder,
  onOpenCart,
  onRefreshOrders,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'delivered' | 'transit' | 'confirmed'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [reorderNotification, setReorderNotification] = useState<{
    text: string;
    itemCount: number;
  } | null>(null);
  const [addingOrderId, setAddingOrderId] = useState<string | null>(null);
  const [addingItemId, setAddingItemId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter orders by search & status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === '' ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'delivered') return order.status === 'Delivered';
    if (statusFilter === 'transit')
      return order.status === 'In Transit' || order.status === 'Out for Delivery';
    if (statusFilter === 'confirmed')
      return order.status === 'Confirmed' || order.status === 'Processing';

    return true;
  });

  const handleCopyOrderId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleReorderOrderClick = (order: PastOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddingOrderId(order.id);
    onReorderEntireOrder(order);

    setReorderNotification({
      text: `All ${order.items.length} items from ${order.id} added to your bag!`,
      itemCount: order.items.length,
    });

    setTimeout(() => {
      setAddingOrderId(null);
    }, 1200);
  };

  const handleReorderSingleItemClick = (item: PastOrderItem, orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const key = `${orderId}-${item.productId}-${item.size}`;
    setAddingItemId(key);
    onReorderItem(item.productId, item.size, 1);

    setReorderNotification({
      text: `"${item.name}" (${item.size || 'Standard'}) added to your bag!`,
      itemCount: 1,
    });

    setTimeout(() => {
      setAddingItemId(null);
    }, 1200);
  };

  const handleResetSampleOrders = () => {
    resetSampleOrders();
    onRefreshOrders?.();
  };

  const handleClearAll = () => {
    if (window.confirm('Clear your local past order history?')) {
      clearPastOrders();
      onRefreshOrders?.();
    }
  };

  const getStatusBadge = (status: PastOrder['status']) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Delivered
          </span>
        );
      case 'Out for Delivery':
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Truck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
            {status}
          </span>
        );
      case 'Confirmed':
      case 'Processing':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            {status}
          </span>
        );
    }
  };

  return (
    <div
      id="order-history-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="order-history-modal-container"
        className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-linear-to-r from-amber-50/60 to-orange-50/40 dark:from-slate-800/80 dark:to-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <ReceiptText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                  Past Order History
                </h2>
                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-400 rounded-full text-[11px] font-black">
                  {orders.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                View previous purchases, download details, or reorder items with 1 click
              </p>
            </div>
          </div>

          <button
            id="order-history-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="px-5 sm:px-7 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID (e.g. JOJI-742918) or item name..."
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'delivered'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700'
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setStatusFilter('transit')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'transit'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700'
              }`}
            >
              In Transit
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'confirmed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
              }`}
            >
              Processing
            </button>
          </div>
        </div>

        {/* Reorder Floating Banner Notification */}
        {reorderNotification && (
          <div className="mx-5 sm:mx-7 mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-300 animate-slide-down">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold">{reorderNotification.text}</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View Bag</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <PackageCheck className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                  {searchQuery ? 'No matching orders found' : 'No past orders yet'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {searchQuery
                    ? `We couldn't find any orders matching "${searchQuery}". Try searching with another term.`
                    : 'Any orders you place at JOJI KIDS ZONE will appear here with one-click reordering and live shipment tracking.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResetSampleOrders}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Sample Demo Orders</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const isAddingThisOrder = addingOrderId === order.id;

              return (
                <div
                  key={order.id}
                  id={`order-card-${order.id}`}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-amber-300/80 dark:hover:border-amber-500/50 transition-all shadow-xs overflow-hidden"
                >
                  {/* Order Card Header */}
                  <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                          #{order.id}
                        </span>
                        <button
                          onClick={(e) => handleCopyOrderId(order.id, e)}
                          title="Copy Order ID"
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          {copiedOrderId === order.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Placed on {order.orderDate}</span>
                        {order.estimatedDelivery && (
                          <>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {order.status === 'Delivered' ? 'Delivered' : 'ETA'}: {order.estimatedDelivery}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Total Amount</span>
                        <span className="font-display font-black text-base text-slate-900 dark:text-white">
                          ₹{order.grandTotal}
                        </span>
                      </div>

                      {/* Reorder Entire Order Button */}
                      <button
                        id={`reorder-all-btn-${order.id}`}
                        onClick={(e) => handleReorderOrderClick(order, e)}
                        disabled={isAddingThisOrder}
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-75"
                        title="Add all items in this order to bag"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${isAddingThisOrder ? 'animate-spin' : ''}`} />
                        <span>{isAddingThisOrder ? 'Adding...' : 'Reorder All'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Items Preview List */}
                  <div className="p-4 sm:p-5 divide-y divide-slate-100 dark:divide-slate-800">
                    {order.items.map((item, idx) => {
                      const itemKey = `${order.id}-${item.productId}-${item.size}`;
                      const isAddingThisItem = addingItemId === itemKey;

                      return (
                        <div
                          key={idx}
                          className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-14 h-14 object-cover rounded-xl border border-slate-100 dark:border-slate-700 shrink-0 bg-slate-50 dark:bg-slate-800"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 space-y-0.5">
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                                {item.brand}
                              </span>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                {item.size && (
                                  <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-semibold text-[10px]">
                                    Size: {item.size}
                                  </span>
                                )}
                                <span>Qty: {item.quantity}</span>
                                <span>•</span>
                                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                  ₹{item.price} each
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Individual Item Reorder Action */}
                          <button
                            id={`reorder-single-btn-${item.productId}`}
                            onClick={(e) => handleReorderSingleItemClick(item, order.id, e)}
                            disabled={isAddingThisItem}
                            className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-slate-700 dark:text-slate-300 hover:text-amber-900 dark:hover:text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                            title="Reorder just this item"
                          >
                            <ShoppingBag className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            <span>{isAddingThisItem ? 'Added' : 'Reorder'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Footer & Expandable Details Drawer */}
                  <div className="px-4 sm:px-5 py-3 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Order Details & Receipt'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status !== 'Delivered' && (
                        <button
                          onClick={() => {
                            onClose();
                            onTrackOrder(order.id);
                          }}
                          className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Truck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          <span>Track Live Shipment</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Detailed Breakdown Accordion */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-amber-50/30 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Delivery Address & Contact */}
                        <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            Shipping Address:
                          </span>
                          <div className="text-slate-600 dark:text-slate-300 space-y-0.5 text-xs">
                            <p className="font-bold text-slate-800 dark:text-slate-200">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                              {order.shippingAddress.pincode}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                              Phone: {order.shippingAddress.phone} • Email: {order.shippingAddress.email}
                            </p>
                          </div>
                        </div>

                        {/* Payment & Logistics Info */}
                        <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                            <CreditCard className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            Payment & Logistics:
                          </span>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 dark:text-slate-400">Method:</span>
                              <span className="font-bold uppercase text-slate-800 dark:text-slate-200">
                                {order.paymentMethod} ({order.paymentStatus})
                              </span>
                            </div>
                            {order.courier && (
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500 dark:text-slate-400">Courier:</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200">{order.courier}</span>
                              </div>
                            )}
                            {order.trackingNumber && (
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500 dark:text-slate-400">AWB Tracking #:</span>
                                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                  {order.trackingNumber}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Financial Bill Breakdown */}
                      <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-1.5">
                        <span className="font-bold text-slate-900 dark:text-white block text-xs pb-1 border-b border-slate-100 dark:border-slate-700">
                          Price Breakdown:
                        </span>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300 pt-1">
                          <span>Items Subtotal:</span>
                          <span className="font-mono">₹{order.subtotal}</span>
                        </div>
                        {order.discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                            <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                            <span className="font-mono font-bold">-₹{order.discountAmount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Delivery Fee:</span>
                          <span className="font-mono">
                            {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
                          </span>
                        </div>
                        <div className="flex justify-between font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-700 text-sm">
                          <span>Grand Total Paid:</span>
                          <span className="font-display font-black text-amber-600 dark:text-amber-400">
                            ₹{order.grandTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 sm:px-7 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <span>
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
            {orders.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 underline text-[11px] cursor-pointer"
              >
                Clear History
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="px-4 py-2 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300 dark:text-slate-950" />
              <span>Go to Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
