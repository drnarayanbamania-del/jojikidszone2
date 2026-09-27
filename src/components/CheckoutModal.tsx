import React from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Banknote, QrCode, ReceiptText } from 'lucide-react';
import { CartItemWithProduct, CheckoutFormData, PastOrder, PastOrderItem } from '../types';
import { savePastOrder } from '../lib/orderStorage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItemWithProduct[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  grandTotal: number;
  couponCode: string;
  onOrderCompleted: () => void;
  onTrackOrder?: (orderId: string) => void;
  onViewOrderHistory?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discountAmount,
  shippingFee,
  grandTotal,
  couponCode,
  onOrderCompleted,
  onTrackOrder,
  onViewOrderHistory,
}) => {
  const [formData, setFormData] = React.useState<CheckoutFormData>({
    fullName: 'Priya Sharma',
    phone: '9876543210',
    email: 'priya.sharma@example.com',
    address: 'Flat 402, Sunshine Apartments, Linking Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    paymentMethod: 'upi',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [orderSuccess, setOrderSuccess] = React.useState(false);
  const [orderId, setOrderId] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = 'JOJI-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedId);

      // Save order into past order history
      const pastItems: PastOrderItem[] = items.map((it) => ({
        productId: it.product_id || it.product.id,
        name: it.product.name,
        brand: it.product.brand || 'JOJI KIDS ZONE',
        imageUrl: it.product.image_url,
        size: it.size || null,
        quantity: it.quantity,
        price: it.product.price,
      }));

      const newOrder: PastOrder = {
        id: generatedId,
        orderDate: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'Confirmed',
        items: pastItems,
        subtotal,
        discountAmount,
        shippingFee,
        grandTotal,
        couponCode: discountAmount > 0 ? couponCode : undefined,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'cod' ? 'Pending COD' : 'Paid',
        shippingAddress: { ...formData },
        courier: 'BlueDart Express Air',
        trackingNumber: 'BD' + Math.floor(10000000 + Math.random() * 90000000),
        estimatedDelivery: 'In 2 - 3 business days',
      };

      savePastOrder(newOrder);

      setIsSubmitting(false);
      setOrderSuccess(true);
      onOrderCompleted();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/40 dark:bg-slate-800/40">
          <div>
            <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
              {orderSuccess ? 'Order Confirmation' : 'Secure Checkout'}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
              {orderSuccess ? 'Thank you for choosing JOJI KIDS ZONE!' : 'Fast & Encrypted 256-Bit SSL Checkout'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {orderSuccess ? (
            /* Order Success Receipt View */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">
                  Yay! Order Placed Successfully
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  We have sent the confirmation SMS & email receipt to {formData.email}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 max-w-md mx-auto text-left space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Order ID:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{orderId}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Delivery Address:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[200px]">
                    {formData.address}, {formData.city}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Estimated Delivery:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">In 2 - 3 Business Days</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 text-xs font-bold">
                  <span className="text-slate-900 dark:text-slate-200">Total Paid:</span>
                  <span className="font-display font-black text-base text-slate-900 dark:text-white">
                    ₹{grandTotal} ({formData.paymentMethod.toUpperCase()})
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTrackOrder?.(orderId);
                  }}
                  className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Live Shipment</span>
                </button>
                {onViewOrderHistory && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewOrderHistory();
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-transparent dark:border-slate-700"
                  >
                    <ReceiptText className="w-3.5 h-3.5 text-amber-300" />
                    <span>View in Order History</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Delivery Shipping Address
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Street Address & Landmark *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      City *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        State *
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Pincode *
                      </label>
                      <input
                        required
                        maxLength={6}
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Select Payment Method
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'upi', label: 'UPI / QR', icon: QrCode, desc: 'GPay, PhonePe, Paytm' },
                    { id: 'cod', label: 'Cash On Delivery', icon: Banknote, desc: 'Pay at doorstep' },
                    { id: 'card', label: 'Cards', icon: CreditCard, desc: 'Visa, MasterCard, RuPay' },
                    { id: 'netbanking', label: 'NetBanking', icon: ShieldCheck, desc: 'All major banks' },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = formData.paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: m.id as any })}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 dark:border-amber-500 ring-2 ring-amber-400/30'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                        <div className="mt-2">
                          <div className="font-bold text-xs text-slate-800 dark:text-slate-200">{m.label}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-400 leading-tight">{m.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Order Items ({items.length})</span>
                  <span>₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount ({couponCode})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping Fee</span>
                  <span className="font-semibold">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline font-bold">
                  <span className="text-slate-900 dark:text-white text-sm">Grand Total</span>
                  <span className="font-display font-black text-lg text-slate-950 dark:text-white">₹{grandTotal}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Processing Secure Order...</span>
                ) : (
                  <span>Place Order • ₹{grandTotal}</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
