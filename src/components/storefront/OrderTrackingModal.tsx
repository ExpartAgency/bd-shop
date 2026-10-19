import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Order } from '../../types';
import {
  X,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  AlertCircle
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber = ''
}) => {
  if (!isOpen) return null;

  const { getOrderByIdOrNumber } = useEcommerce();
  const [searchInput, setSearchInput] = useState(initialOrderNumber || 'BDS-2026-8941');
  const [searchedOrder, setSearchedOrder] = useState<Order | undefined>(
    getOrderByIdOrNumber(initialOrderNumber || 'BDS-2026-8941')
  );
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const order = getOrderByIdOrNumber(searchInput.trim());
    if (order) {
      setSearchedOrder(order);
      setNotFound(false);
    } else {
      setSearchedOrder(undefined);
      setNotFound(true);
    }
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', desc: 'Received & Inventory Allocated' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Payment verified & Packed' },
    { key: 'shipped', label: 'Dispatched to Courier', desc: 'Handed over to Steadfast / Pathao' },
    { key: 'delivered', label: 'Delivered', desc: 'Successfully handed to customer' }
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const orderIndex = statusSteps.findIndex(s => s.key === currentStatus);
    const thisIndex = statusSteps.findIndex(s => s.key === stepKey);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (thisIndex < orderIndex) return 'completed';
    if (thisIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 text-gray-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FA5D00] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-black text-base sm:text-lg text-gray-900">
                Track Bangladesh Courier Shipment
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Live delivery progress via Steadfast, Pathao, RedX & Paperfly
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Search Input Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Enter BD SHOP order number (e.g. BDS-2026-8941)"
                className="w-full bg-white text-gray-900 text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FA5D00] font-mono"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="bg-[#FA5D00] hover:bg-[#E04D00] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Track Order
            </button>
          </form>

          {notFound && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                No order found matching "{searchInput}". Please double check your order number or contact support on WhatsApp.
              </span>
            </div>
          )}

          {searchedOrder && (
            <div className="space-y-6">
              {/* Order Meta Header Card */}
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-mono font-bold text-sm text-[#FA5D00]">
                    {searchedOrder.orderNumber}
                  </div>
                  <div className="text-gray-500 text-[11px] mt-0.5">
                    Placed on: {new Date(searchedOrder.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Courier</div>
                    <div className="font-bold text-gray-900">
                      {searchedOrder.trackingCourier || 'Steadfast Courier'}
                    </div>
                  </div>

                  <span className="bg-[#FA5D00] text-white font-black px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider">
                    {searchedOrder.orderStatus}
                  </span>
                </div>
              </div>

              {/* Visual Vertical Timeline */}
              <div className="space-y-4 pl-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Shipment Milestones
                </h4>

                <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pb-2">
                  {statusSteps.map((step) => {
                    const status = getStepStatus(step.key, searchedOrder.orderStatus);
                    return (
                      <div key={step.key} className="relative pl-6">
                        <div
                          className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                            status === 'completed'
                              ? 'bg-emerald-500 text-white'
                              : status === 'current'
                              ? 'bg-[#FA5D00] text-white ring-4 ring-orange-100'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {status === 'completed' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>

                        <div>
                          <div
                            className={`text-xs font-bold ${
                              status === 'current'
                                ? 'text-[#FA5D00]'
                                : status === 'completed'
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{step.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Destination Address & Items */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-gray-800">
                  <MapPin className="w-3.5 h-3.5 text-[#FA5D00]" />
                  <span>Delivery Address:</span>
                </div>
                <p className="text-gray-600 pl-5">
                  {searchedOrder.shippingAddress}, {searchedOrder.city} - {searchedOrder.postalCode}
                </p>
                <div className="pl-5 text-[11px] text-gray-500">
                  Recipient: <strong className="text-gray-700">{searchedOrder.customerName}</strong> ({searchedOrder.customerPhone})
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
