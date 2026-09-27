import React from 'react';
import {
  X,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export interface TrackingData {
  orderId: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  statusText: string;
  courier: string;
  awbNumber: string;
  destination: string;
  estimatedDelivery: string;
  timeline: {
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
    current?: boolean;
  }[];
}

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onTrackAgain?: (newId: string) => void;
}

export const getMockTrackingData = (id: string): TrackingData => {
  const cleanId = id.toUpperCase().trim();
  return {
    orderId: cleanId,
    status: 'out_for_delivery',
    statusText: 'Out for Delivery',
    courier: 'BlueDart Express Air',
    awbNumber: 'BD' + Math.floor(10000000 + Math.random() * 90000000),
    destination: 'Mumbai, Maharashtra, 400050',
    estimatedDelivery: 'Today by 6:00 PM',
    timeline: [
      {
        title: 'Order Confirmed',
        description: 'Payment verified & order sent to JOJI KIDS ZONE Fulfillment Center.',
        timestamp: 'Sep 16, 2026 • 10:45 AM',
        completed: true,
      },
      {
        title: 'Quality Check & Eco-Packaging',
        description: 'All baby garments inspected for softness, sanitized & packed in recyclable boxes.',
        timestamp: 'Sep 16, 2026 • 03:20 PM',
        completed: true,
      },
      {
        title: 'Dispatched with Courier',
        description: 'Package handed over to BlueDart Express at Mumbai Sorting Hub.',
        timestamp: 'Sep 17, 2026 • 06:10 AM',
        completed: true,
      },
      {
        title: 'Out for Delivery',
        description: 'Our delivery associate is en route to your doorstep.',
        timestamp: 'Sep 17, 2026 • 11:30 AM',
        completed: true,
        current: true,
      },
      {
        title: 'Delivered',
        description: 'Package delivered with contactless OTP verification.',
        timestamp: 'Expected Today • by 6:00 PM',
        completed: false,
      },
    ],
  };
};

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  orderId,
}) => {
  if (!isOpen) return null;

  const tracking = getMockTrackingData(orderId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-lg tracking-tight text-white">
                  Live Order Tracker
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {tracking.statusText}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Order ID: <span className="font-mono font-bold text-amber-300">{tracking.orderId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Summary Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Estimated Arrival</span>
              <p className="font-display font-extrabold text-slate-900 text-sm sm:text-base text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                {tracking.estimatedDelivery}
              </p>
            </div>
            <div className="sm:text-right space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Carrier & AWB</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {tracking.courier} ({tracking.awbNumber})
              </p>
            </div>
          </div>

          {/* Delivery Step Timeline */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Shipment Journey
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
              {tracking.timeline.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      step.current
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950/60 shadow-sm animate-pulse'
                        : step.completed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                    )}
                  </div>

                  {/* Text */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-bold ${
                          step.current
                            ? 'text-amber-600 dark:text-amber-400'
                            : step.completed
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {step.title}
                        {step.current && (
                          <span className="ml-2 text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-400 px-1.5 py-0.2 rounded-full">
                            Current Status
                          </span>
                        )}
                      </h4>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium font-mono">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address & Assurance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-bold">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Destination</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">{tracking.destination}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Safe Delivery Guarantee</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Contactless delivery with 7-day hassle-free exchange.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Need help with delivery?</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
