import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Tag,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  Clock,
  Flame
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const {
    cart,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    formatPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useEcommerce();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(
    null
  );

  // Free shipping threshold for Dhaka: ৳1,000 (Temu style)
  const FREE_SHIPPING_THRESHOLD = 1000;
  const progressPercent = Math.min(
    100,
    Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  // Discount calculation
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

  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput.trim());
    setCouponFeedback({ success: res.success, message: res.message });
    if (res.success) {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white border-l border-gray-200 h-full flex flex-col shadow-2xl z-10 text-gray-900">
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FA5D00] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-black text-base text-gray-900">Shopping Cart</h2>
              <span className="text-[11px] text-gray-500 font-medium">({cartCount} items)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer mr-1"
                title="Clear cart"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Temu-Style Item Reservation Countdown */}
        <div className="bg-orange-50 border-b border-orange-100 px-4 py-2 flex items-center justify-between text-xs text-[#FA5D00]">
          <span className="flex items-center gap-1.5 font-bold">
            <Clock className="w-3.5 h-3.5" />
            Items reserved for 14:59
          </span>
          <span className="text-[10px] text-gray-500 font-semibold">High Demand</span>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="p-4 bg-white border-b border-gray-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-gray-800">
              <Truck className="w-4 h-4 text-[#FA5D00]" />
              {progressPercent >= 100 ? (
                <span className="text-emerald-600 font-black">🎉 You have unlocked FREE Delivery!</span>
              ) : (
                <span>
                  Add <strong className="text-[#FA5D00]">{formatPrice(remainingForFreeShipping)}</strong> more for FREE Shipping!
                </span>
              )}
            </span>
            <span className="font-mono text-[11px] font-bold text-gray-600">{progressPercent}%</span>
          </div>

          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-[#FA5D00] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-[#FA5D00] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 text-sm">Your Temu cart is empty</h3>
                <p className="text-xs text-gray-400">Discover incredible discounts across top electronics & gadgets</p>
              </div>
              <button
                onClick={onClose}
                className="bg-[#FA5D00] hover:bg-[#E04D00] text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md shadow-[#FA5D00]/25 transition-all cursor-pointer"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            cart.map(item => {
              const matchedVariant = item.variantId && item.product.variants
                ? item.product.variants.find(v => v.id === item.variantId)
                : undefined;

              return (
                <div
                  key={`${item.productId}-${item.variantId || 'standard'}`}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 flex gap-3 items-center"
                >
                  <img
                    src={item.product.primaryImage}
                    alt={item.product.title}
                    className="w-16 h-16 rounded-lg object-cover bg-white border border-gray-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-gray-900 truncate">
                      {item.product.title}
                    </h4>
                    {matchedVariant && (
                      <div className="text-[10px] text-gray-500 font-medium">
                        {matchedVariant.name}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-xs text-[#FA5D00]">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-gray-300 rounded-md bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.variantId)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter Coupon (e.g. BDWELCOME10)"
                  className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-xs px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FA5D00]"
                />
                <Tag className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {couponFeedback && (
              <div
                className={`text-[11px] flex items-center gap-1.5 ${
                  couponFeedback.success ? 'text-emerald-600 font-bold' : 'text-red-500'
                }`}
              >
                {couponFeedback.success ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                <span>{couponFeedback.message}</span>
              </div>
            )}

            {appliedCoupon && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Coupon <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(discountAmount)})
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-emerald-700 hover:text-red-600 text-[10px] font-bold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-gray-900">{formatPrice(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount:</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping:</span>
                <span className="text-emerald-600 font-bold">
                  {cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : '৳60 Inside Dhaka'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Estimated Total:</span>
                <span className="text-[#FA5D00] text-base">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Primary Temu Orange Checkout CTA Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-[#FA5D00] hover:bg-[#E04D00] text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FA5D00]/25 transition-all cursor-pointer active:scale-98"
            >
              <span>Checkout Now ({cartCount} Items)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
