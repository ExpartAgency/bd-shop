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
  Lock,
  ArrowRight,
  Printer,
  Sparkles,
  Copy,
  Check,
  Smartphone,
  PhoneCall
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
    paymentGatewaySettings,
    verifyPaymentTransaction,
    trackPixelEvent
  } = useEcommerce();

  // Customer Delivery details
  const [customerName, setCustomerName] = useState('Sheikh Rafiqul Islam');
  const [customerEmail, setCustomerEmail] = useState('rafiqul.islam@dhakatech.com');
  const [customerPhone, setCustomerPhone] = useState('01711892341');
  const [shippingAddress, setShippingAddress] = useState('House 42, Road 11, Block D, Banani');
  const [city, setCity] = useState('Dhaka');
  const [postalCode, setPostalCode] = useState('1213');
  const [shippingZone, setShippingZone] = useState<'inside_dhaka' | 'outside_dhaka' | 'express'>('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card' | 'cod'>('bkash');
  const [orderNotes, setOrderNotes] = useState('');

  // Payment inputs & verification ("Payna kore order hose fix koro")
  const [bkashSenderNumber, setBkashSenderNumber] = useState('01711892341');
  const [bkashTrxId, setBkashTrxId] = useState('');
  const [isBkashVerified, setIsBkashVerified] = useState(false);
  const [bkashVerifyError, setBkashVerifyError] = useState<string | null>(null);

  const [nagadSenderNumber, setNagadSenderNumber] = useState('01822451902');
  const [nagadTrxId, setNagadTrxId] = useState('');
  const [isNagadVerified, setIsNagadVerified] = useState(false);
  const [nagadVerifyError, setNagadVerifyError] = useState<string | null>(null);

  const [cardHolder, setCardHolder] = useState('Sheikh Rafiqul Islam');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [isCardVerified, setIsCardVerified] = useState(false);

  const [codConfirmed, setCodConfirmed] = useState(true);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

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

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedAccount(text);
      setTimeout(() => setCopiedAccount(null), 2000);
    }
  };

  // Verify bKash payment TrxID
  const handleVerifyBkash = () => {
    setBkashVerifyError(null);
    const result = verifyPaymentTransaction('bkash', bkashTrxId, bkashSenderNumber);
    if (!result.valid) {
      setBkashVerifyError(result.message);
      setIsBkashVerified(false);
      return;
    }
    setIsBkashVerified(true);
  };

  // Verify Nagad payment TrxID
  const handleVerifyNagad = () => {
    setNagadVerifyError(null);
    const result = verifyPaymentTransaction('nagad', nagadTrxId, nagadSenderNumber);
    if (!result.valid) {
      setNagadVerifyError(result.message);
      setIsNagadVerified(false);
      return;
    }
    setIsNagadVerified(true);
  };

  // Authorize Card via simulated 3D Secure
  const handleVerifyCard = () => {
    if (!cardNumber || cardNumber.length < 12 || !cardCvv) {
      setErrorMessage('Please enter complete valid card details.');
      return;
    }
    setIsCardVerified(true);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName || !customerPhone || !shippingAddress) {
      setErrorMessage('Please fill in your name, valid BD phone number, and delivery address.');
      return;
    }

    // STRICT PAYMENT VALIDATION - "Payna kore order hose fix koro"
    let transactionIdToSave: string | undefined = undefined;
    let senderNumberToSave: string | undefined = undefined;

    if (paymentMethod === 'bkash') {
      if (!bkashTrxId.trim() || bkashTrxId.trim().length < 6) {
        setErrorMessage('⚠️ bKash পেমেন্ট সম্পন্ন করা হয়নি! অনুগ্রহ করে bKash নাম্বারে টাকা পাঠিয়ে প্রাপ্ত TrxID লিখুন এবং ভেরিফাই করুন। (Payment TrxID is required to prevent unpaid orders)');
        return;
      }
      const verifyRes = verifyPaymentTransaction('bkash', bkashTrxId, bkashSenderNumber);
      if (!verifyRes.valid) {
        setErrorMessage(`⚠️ bKash ভেরিফিকেশন ব্যর্থ: ${verifyRes.message}`);
        setIsBkashVerified(false);
        return;
      }
      setIsBkashVerified(true);
      transactionIdToSave = bkashTrxId.trim().toUpperCase();
      senderNumberToSave = bkashSenderNumber.trim();
    } else if (paymentMethod === 'nagad') {
      if (!nagadTrxId.trim() || nagadTrxId.trim().length < 6) {
        setErrorMessage('⚠️ নগদ পেমেন্ট সম্পন্ন করা হয়নি! অনুগ্রহ করে নগদ নাম্বারে টাকা পাঠিয়ে প্রাপ্ত TrxID লিখুন এবং ভেরিফাই করুন। (Nagad TrxID is required)');
        return;
      }
      const verifyRes = verifyPaymentTransaction('nagad', nagadTrxId, nagadSenderNumber);
      if (!verifyRes.valid) {
        setErrorMessage(`⚠️ নগদ ভেরিফিকেশন ব্যর্থ: ${verifyRes.message}`);
        setIsNagadVerified(false);
        return;
      }
      setIsNagadVerified(true);
      transactionIdToSave = nagadTrxId.trim().toUpperCase();
      senderNumberToSave = nagadSenderNumber.trim();
    } else if (paymentMethod === 'card') {
      if (!isCardVerified) {
        setErrorMessage('⚠️ অনুগ্রহ করে কার্ড পেমেন্ট অথরাইজ করুন ("Authorize & Pay" বাটনে চাপুন)।');
        return;
      }
      transactionIdToSave = `CARD-AUTH-${Date.now().toString().slice(-6)}`;
      senderNumberToSave = customerPhone;
    } else if (paymentMethod === 'cod') {
      if (!codConfirmed) {
        setErrorMessage('অনুগ্রহ করে ক্যাশ অন ডেলিভারি শর্তাবলী গ্রহণ করুন।');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Simulate real-world network latency for atomic stock check and payment gateway
      await new Promise(res => setTimeout(res, 900));

      const isVerified =
        paymentMethod === 'bkash'
          ? true
          : paymentMethod === 'nagad'
          ? true
          : paymentMethod === 'card'
          ? isCardVerified
          : false;

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
        transactionId: transactionIdToSave,
        paymentSenderNumber: senderNumberToSave,
        paymentVerified: isVerified,
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
          order_id: result.order.orderNumber,
          payment_method: paymentMethod
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 90,
          spread: 80,
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
            <div className="p-2 rounded-xl bg-orange-100 text-[#FA5D00]">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-black text-base sm:text-lg text-gray-900 tracking-tight">
                Secure 1-Click Checkout
              </h2>
              <p className="text-xs text-gray-500">
                Encrypted • Verified Bangladeshi Payment Gateways • Fast Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation Screen */}
        {placedOrder ? (
          <div className="p-6 sm:p-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="font-display font-black text-xl text-gray-900">
              Order Confirmed & Payment Verified!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              Your parcel <span className="font-mono font-bold text-[#FA5D00]">{placedOrder.orderNumber}</span> has been entered into the fulfilment queue and assigned to Steadfast Courier.
            </p>

            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 max-w-md mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-mono font-bold text-gray-900">{placedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="font-bold text-emerald-600 uppercase">
                  {placedOrder.paymentStatus === 'paid' ? '✓ PAID & VERIFIED' : 'CASH ON DELIVERY'}
                </span>
              </div>
              {placedOrder.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID (TrxID):</span>
                  <span className="font-mono font-bold text-gray-900">{placedOrder.transactionId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Courier Tracking:</span>
                <span className="font-mono font-bold text-[#FA5D00]">{placedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-orange-200 font-bold">
                <span className="text-gray-800">Total Paid:</span>
                <span className="text-gray-900 font-mono text-sm">{formatPrice(placedOrder.total)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={onClose}
                className="bg-[#FA5D00] hover:bg-[#E04D00] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Track Live Order
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Customer & Delivery Details */}
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

              {/* Right Column: Payment & Verification ("Payna kore order hose fix koro") */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#FA5D00] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    <span>2. Payment Verification</span>
                  </span>
                  <span className="text-[10px] text-gray-500 font-normal">
                    Secure Gateway
                  </span>
                </h3>

                {/* Payment Selection Tabs */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer flex items-center gap-2 transition-all ${
                      paymentMethod === 'bkash'
                        ? 'bg-pink-50 border-pink-500 text-pink-700 font-bold shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-pink-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                      bK
                    </div>
                    <div>
                      <div className="leading-tight font-bold">bKash</div>
                      <div className="text-[9px] text-gray-500">Merchant / TrxID</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer flex items-center gap-2 transition-all ${
                      paymentMethod === 'nagad'
                        ? 'bg-amber-50 border-amber-500 text-amber-700 font-bold shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                      ন
                    </div>
                    <div>
                      <div className="leading-tight font-bold">Nagad</div>
                      <div className="text-[9px] text-gray-500">Direct Pay / TrxID</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer flex items-center gap-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                      💳
                    </div>
                    <div>
                      <div className="leading-tight font-bold">Cards</div>
                      <div className="text-[9px] text-gray-500">Visa / Mastercard</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer flex items-center gap-2 transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                      💵
                    </div>
                    <div>
                      <div className="leading-tight font-bold">Cash on Deliv.</div>
                      <div className="text-[9px] text-gray-500">Pay at Doorstep</div>
                    </div>
                  </button>
                </div>

                {/* 1. bKash Step-by-Step Payment Instructions & Verification Box */}
                {paymentMethod === 'bkash' && (
                  <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200 text-xs space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between pb-1.5 border-b border-pink-200/80">
                      <span className="font-bold text-pink-900 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-pink-600" />
                        <span>bKash Payment Instructions</span>
                      </span>
                      <span className="bg-pink-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {paymentGatewaySettings.bkashAccountType}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-700 space-y-1">
                      <p>
                        1. Open bKash App or dial <span className="font-mono font-bold">*247#</span>
                      </p>
                      <p>
                        2. Send exact amount <strong className="text-pink-700">{formatPrice(grandTotal)}</strong> to:
                      </p>
                      <div className="flex items-center justify-between bg-white border border-pink-200 rounded-lg p-2 font-mono font-bold text-gray-900 text-xs my-1">
                        <span>{paymentGatewaySettings.bkashNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(paymentGatewaySettings.bkashNumber)}
                          className="text-pink-600 hover:text-pink-800 text-[10px] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedAccount === paymentGatewaySettings.bkashNumber ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-sans">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="font-sans">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p>
                        3. Use Reference: <span className="font-mono font-bold text-gray-800">BDS{Date.now().toString().slice(-4)}</span>
                      </p>
                    </div>

                    {/* TrxID Input & Live Verification */}
                    <div className="pt-2 border-t border-pink-200/80 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                            Sender bKash No.
                          </label>
                          <input
                            type="tel"
                            value={bkashSenderNumber}
                            onChange={e => setBkashSenderNumber(e.target.value)}
                            placeholder="017XXXXXXXX"
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                            bKash TrxID (Required)
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={bkashTrxId}
                              onChange={e => {
                                setBkashTrxId(e.target.value.toUpperCase());
                                setIsBkashVerified(false);
                                setBkashVerifyError(null);
                              }}
                              placeholder="e.g. 9J7B32X8"
                              className={`w-full bg-white border rounded-lg p-2 text-xs font-mono font-bold uppercase focus:outline-none ${
                                isBkashVerified
                                  ? 'border-emerald-500 text-emerald-700 bg-emerald-50/30'
                                  : 'border-pink-300 text-gray-900 focus:border-pink-500'
                              }`}
                            />
                            {isBkashVerified && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-2.5 top-2.5" />
                            )}
                          </div>
                        </div>
                      </div>

                      {bkashVerifyError && (
                        <div className="text-[10px] text-red-600 font-semibold">
                          {bkashVerifyError}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleVerifyBkash}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isBkashVerified
                            ? 'bg-emerald-600 text-white'
                            : 'bg-pink-600 hover:bg-pink-700 text-white shadow-xs'
                        }`}
                      >
                        {isBkashVerified ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>TrxID Verified ✓</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verify bKash Payment TrxID</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Nagad Payment Instructions & Verification Box */}
                {paymentMethod === 'nagad' && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/80">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                        <span>Nagad Payment Instructions</span>
                      </span>
                      <span className="bg-amber-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {paymentGatewaySettings.nagadAccountType}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-700 space-y-1">
                      <p>
                        1. Open Nagad App or dial <span className="font-mono font-bold">*167#</span>
                      </p>
                      <p>
                        2. Send exact amount <strong className="text-amber-800">{formatPrice(grandTotal)}</strong> to:
                      </p>
                      <div className="flex items-center justify-between bg-white border border-amber-200 rounded-lg p-2 font-mono font-bold text-gray-900 text-xs my-1">
                        <span>{paymentGatewaySettings.nagadNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(paymentGatewaySettings.nagadNumber)}
                          className="text-amber-700 hover:text-amber-900 text-[10px] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedAccount === paymentGatewaySettings.nagadNumber ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-sans">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="font-sans">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Nagad TrxID Input & Verification */}
                    <div className="pt-2 border-t border-amber-200/80 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                            Sender Nagad No.
                          </label>
                          <input
                            type="tel"
                            value={nagadSenderNumber}
                            onChange={e => setNagadSenderNumber(e.target.value)}
                            placeholder="018XXXXXXXX"
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                            Nagad TrxID (Required)
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={nagadTrxId}
                              onChange={e => {
                                setNagadTrxId(e.target.value.toUpperCase());
                                setIsNagadVerified(false);
                                setNagadVerifyError(null);
                              }}
                              placeholder="e.g. 7N38AB91"
                              className={`w-full bg-white border rounded-lg p-2 text-xs font-mono font-bold uppercase focus:outline-none ${
                                isNagadVerified
                                  ? 'border-emerald-500 text-emerald-700 bg-emerald-50/30'
                                  : 'border-amber-300 text-gray-900 focus:border-amber-500'
                              }`}
                            />
                            {isNagadVerified && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-2.5 top-2.5" />
                            )}
                          </div>
                        </div>
                      </div>

                      {nagadVerifyError && (
                        <div className="text-[10px] text-red-600 font-semibold">
                          {nagadVerifyError}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleVerifyNagad}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isNagadVerified
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                        }`}
                      >
                        {isNagadVerified ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Nagad TrxID Verified ✓</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verify Nagad Payment TrxID</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Visa / Mastercard Card Box */}
                {paymentMethod === 'card' && (
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between pb-1.5 border-b border-blue-200/80">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                        <span>SSLCOMMERZ 3D-Secure 2.0</span>
                      </span>
                      <span className="text-[10px] text-gray-500">256-bit Encrypted</span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={e => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 mb-0.5">CVV / CVC</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={e => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleVerifyCard}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isCardVerified
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        }`}
                      >
                        {isCardVerified ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Card Authorized ✓</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Authorize & Verify Card Payment</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Cash on Delivery (COD) Confirmation Notice */}
                {paymentMethod === 'cod' && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Cash on Delivery Verification</span>
                    </div>
                    <p className="text-[11px] text-gray-700 leading-relaxed">
                      You will pay full amount <strong className="text-emerald-800">{formatPrice(grandTotal)}</strong> in cash to the courier agent when parcel arrives at your doorstep.
                    </p>
                    <label className="flex items-start gap-2 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={codConfirmed}
                        onChange={e => setCodConfirmed(e.target.checked)}
                        className="mt-0.5 rounded text-[#FA5D00] focus:ring-[#FA5D00]"
                      />
                      <span className="text-[11px] text-gray-700 font-medium select-none">
                        I confirm this order and agree to receive parcel upon courier delivery.
                      </span>
                    </label>
                  </div>
                )}

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
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Payment & Placing Order...</span>
                    </div>
                  ) : (
                    <>
                      <span>Confirm & Place Order</span>
                      <ArrowRight className="w-4 h-4" />
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
