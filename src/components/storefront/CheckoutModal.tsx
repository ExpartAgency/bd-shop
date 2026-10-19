import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Order } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  Lock,
  ArrowRight,
  Printer,
  Sparkles
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted
}) => {
  if (!isOpen) return null;

  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    placeOrder,
    formatPrice,
    trackPixelEvent
  } = useEcommerce();

  // Form states
  const [customerName, setCustomerName] = useState('Sheikh Rafiqul Islam');
  const [customerEmail, setCustomerEmail] = useState('rafiqul.islam@dhakatech.com');
  const [customerPhone, setCustomerPhone] = useState('01711892341');
  const [shippingAddress, setShippingAddress] = useState('House 42, Road 11, Block D, Banani');
  const [city, setCity] = useState('Dhaka');
  const [postalCode, setPostalCode] = useState('1213');
  const [shippingZone, setShippingZone] = useState<'inside_dhaka' | 'outside_dhaka' | 'express'>('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card' | 'cod'>('bkash');
  const [orderNotes, setOrderNotes] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Delivery Charges based on geographical zones
  const shippingFee = shippingZone === 'inside_dhaka' ? 60 : shippingZone === 'outside_dhaka' ? 120 : 180;

  // Coupon discount computation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = (cartSubtotal * appliedCoupon.value) / 100;
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName || !customerPhone || !shippingAddress) {
      setErrorMessage('Please fill in your name, valid BD phone number, and delivery address.');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate real-world network latency for atomic stock check
      await new Promise(res => setTimeout(res, 900));

      const result = await placeOrder({
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        postalCode,
        shippingZone,
        shippingFee,
        paymentMethod,
        notes: orderNotes
      });

      if (result.success && result.order) {
        setPlacedOrder(result.order);
        onOrderCompleted(result.order);

        // Fire Facebook Pixel Purchase Event
        trackPixelEvent('Purchase', {
          content_type: 'product',
          content_ids: result.order.items.map(i => i.productId),
          value: result.order.total,
          currency: 'BDT',
          num_items: result.order.items.reduce((s, i) => s + i.quantity, 0),
          order_id: result.order.orderNumber
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setErrorMessage(result.error || 'Failed to place order. Please review your stock or details.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 text-gray-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FA5D00] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-black text-base sm:text-lg text-gray-900">
                {placedOrder ? 'Order Confirmed!' : 'Temu-Style Express Checkout'}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                {placedOrder
                  ? `Invoice reference: ${placedOrder.orderNumber}`
                  : 'Fast 1-click checkout with atomic inventory verification'}
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

        {/* Successful Confirmation View */}
        {placedOrder ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-black text-2xl text-gray-900">
                Dhonnobad! Order Placed Successfully
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                We have reserved your inventory and sent a confirmation SMS to{' '}
                <strong className="text-gray-900">{placedOrder.customerPhone}</strong>.
              </p>
            </div>

            {/* Order Card summary */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 max-w-lg mx-auto text-left space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-orange-200/60 text-xs">
                <span className="font-bold text-gray-700">Order Number:</span>
                <span className="font-mono font-bold text-[#FA5D00] text-sm">
                  {placedOrder.orderNumber}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Total Paid / Payable:</span>
                <span className="font-black text-gray-900 text-base">
                  {formatPrice(placedOrder.total)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Delivery Courier:</span>
                <span className="font-bold text-gray-800">
                  {placedOrder.trackingCourier || 'Steadfast Courier'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Payment Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                  {placedOrder.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="bg-[#FA5D00] hover:bg-[#E04D00] text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md shadow-[#FA5D00]/25 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-6">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Customer & Shipping Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#FA5D00] flex items-center gap-1.5">
                  <Truck className="w-4 h-4" />
                  <span>1. Delivery Information</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:border-[#FA5D00]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Phone Number (BD)</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 font-mono focus:outline-none focus:border-[#FA5D00]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Email (Optional)</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={e => setCustomerEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:border-[#FA5D00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Full Street Address</label>
                    <textarea
                      required
                      rows={2}
                      value={shippingAddress}
                      onChange={e => setShippingAddress(e.target.value)}
                      placeholder="House number, road number, area, landmark"
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:border-[#FA5D00]"
                    />
                  </div>

                  {/* Geographical Shipping Zone Selector */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-1.5">
                      Geographical Delivery Zone
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setShippingZone('inside_dhaka')}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          shippingZone === 'inside_dhaka'
                            ? 'bg-orange-50 border-[#FA5D00] text-[#FA5D00]'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-bold text-[11px]">Inside Dhaka</div>
                        <div className="text-[10px] text-gray-500">৳60 • 24h</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShippingZone('outside_dhaka')}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          shippingZone === 'outside_dhaka'
                            ? 'bg-orange-50 border-[#FA5D00] text-[#FA5D00]'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-bold text-[11px]">Outside Dhaka</div>
                        <div className="text-[10px] text-gray-500">৳120 • 48-72h</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShippingZone('express')}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          shippingZone === 'express'
                            ? 'bg-orange-50 border-[#FA5D00] text-[#FA5D00]'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-bold text-[11px]">Express Same-Day</div>
                        <div className="text-[10px] text-gray-500">৳180 • 6h</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment & Order Summary */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#FA5D00] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>2. Payment Method</span>
                </h3>

                {/* Payment Selection Tabs */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3 rounded-xl border text-left cursor-pointer flex items-center gap-2.5 transition-all ${
                      paymentMethod === 'bkash'
                        ? 'bg-pink-50 border-pink-500 text-pink-700 font-bold'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-pink-600 text-white flex items-center justify-center font-black text-xs">
                      bK
                    </div>
                    <div>
                      <div className="leading-tight">bKash Instant</div>
                      <div className="text-[10px] text-gray-500">Official Merchant</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-3 rounded-xl border text-left cursor-pointer flex items-center gap-2.5 transition-all ${
                      paymentMethod === 'nagad'
                        ? 'bg-amber-50 border-amber-500 text-amber-700 font-bold'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-black text-xs">
                      ন
                    </div>
                    <div>
                      <div className="leading-tight">Nagad Gateway</div>
                      <div className="text-[10px] text-gray-500">Direct Payment</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-left cursor-pointer flex items-center gap-2.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                      💳
                    </div>
                    <div>
                      <div className="leading-tight">Visa / Mastercard</div>
                      <div className="text-[10px] text-gray-500">SSLCOMMERZ</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-left cursor-pointer flex items-center gap-2.5 transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                      💵
                    </div>
                    <div>
                      <div className="leading-tight">Cash on Delivery</div>
                      <div className="text-[10px] text-gray-500">Pay at Doorstep</div>
                    </div>
                  </button>
                </div>

                {/* Order Summary Box */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                  <div className="font-bold text-gray-800 pb-1 border-b border-gray-200">
                    Order Summary ({cart.length} unique items)
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal:</span>
                    <span className="font-bold text-gray-900">{formatPrice(cartSubtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Voucher Discount:</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Courier Delivery Fee:</span>
                    <span className="font-bold text-gray-900">{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                    <span>Payable Amount:</span>
                    <span className="text-[#FA5D00] text-base">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Primary Place Order CTA */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#FA5D00] hover:bg-[#E04D00] text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FA5D00]/25 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Verifying stock & processing...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>Confirm & Place Order ({formatPrice(grandTotal)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
