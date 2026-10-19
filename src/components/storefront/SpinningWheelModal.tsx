import React, { useState, useRef } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { SpinningWheelPrize } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  Gift,
  Copy,
  Check,
  ShoppingBag,
  RotateCcw,
  Flame,
  Award,
  Truck,
  ArrowRight
} from 'lucide-react';

interface SpinningWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreDeals?: () => void;
}

export const SpinningWheelModal: React.FC<SpinningWheelModalProps> = ({
  isOpen,
  onClose,
  onExploreDeals
}) => {
  if (!isOpen) return null;

  const { spinningWheelSettings, userSpinsLeft, claimSpinPrize } = useEcommerce();
  const prizes = spinningWheelSettings.prizes;

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [wonPrize, setWonPrize] = useState<SpinningWheelPrize | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [claimFeedback, setClaimFeedback] = useState<string | null>(null);

  const numSlices = prizes.length;
  const sliceAngle = 360 / numSlices;

  // Spin the wheel with realistic physics
  const handleSpin = () => {
    if (isSpinning || userSpinsLeft <= 0) return;

    setIsSpinning(true);
    setWonPrize(null);
    setClaimFeedback(null);

    // 1. Pick winning prize based on configured probabilities
    const totalWeight = prizes.reduce((sum, p) => sum + (p.probability || 10), 0);
    let randomVal = Math.random() * totalWeight;
    let winningIndex = 0;

    for (let i = 0; i < prizes.length; i++) {
      randomVal -= prizes[i].probability || 10;
      if (randomVal <= 0) {
        winningIndex = i;
        break;
      }
    }

    const selectedPrize = prizes[winningIndex];

    // 2. Compute rotation degrees to land pointer (at 12 o'clock / 270 deg or 0 deg) on winning slice
    // Pointer is at top (0 degrees). Slices start at index 0 from top right.
    const sliceCenterAngle = winningIndex * sliceAngle + sliceAngle / 2;
    const fullSpins = 360 * 5; // 5 full exciting revolutions
    const targetRotation = rotationDegrees + fullSpins + (360 - (sliceCenterAngle % 360));

    setRotationDegrees(targetRotation);

    // 3. When spin finishes after 4.5s
    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(selectedPrize);

      // Claim prize and auto-apply coupon
      const result = claimSpinPrize(selectedPrize);
      setClaimFeedback(result.message);

      // Burst confetti
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 4500);
  };

  const handleCopyCoupon = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Build SVG Slice path
  const getSlicePath = (index: number) => {
    const startAngle = (index * sliceAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * sliceAngle - 90) * (Math.PI / 180);
    const radius = 170;
    const centerX = 180;
    const centerY = 180;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto animate-fadeIn select-none">
      <div
        className="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 text-gray-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#FA5D00] via-[#FF5500] to-[#FF7A00] p-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 hover:bg-black/35 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-yellow-400 text-gray-950 font-bold">
              <Sparkles className="w-4 h-4 fill-current" />
            </span>
            <h2 className="font-display font-black text-base sm:text-lg tracking-tight">
              {spinningWheelSettings.title || 'BD SHOP Lucky Wheel'}
            </h2>
          </div>
          <p className="text-white/90 text-xs mt-1">
            {spinningWheelSettings.subtitle || 'Spin & Win Free Gifts, ৳500 Vouchers, or Free Shipping!'}
          </p>
        </div>

        {/* Wheel Body */}
        <div className="p-4 sm:p-6 flex flex-col items-center">
          {/* Spins Remaining Banner */}
          <div className="mb-4 inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-3.5 py-1 rounded-full text-xs text-[#FA5D00] font-bold">
            <Gift className="w-4 h-4" />
            <span>
              {userSpinsLeft > 0
                ? `You have ${userSpinsLeft} free spin${userSpinsLeft > 1 ? 's' : ''} left today!`
                : 'You have used all free spins today. Claim your voucher below!'}
            </span>
          </div>

          {/* Interactive Wheel Graphic Container */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-2">
            {/* Top Indicator Arrow (Pointing Down at winning slice) */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center drop-shadow-md">
              <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-red-600" />
            </div>

            {/* Rotating SVG Wheel */}
            <div
              className="w-full h-full rounded-full shadow-2xl border-4 border-yellow-400 overflow-hidden bg-gray-900"
              style={{
                transform: `rotate(${rotationDegrees}deg)`,
                transition: isSpinning ? 'transform 4.5s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none'
              }}
            >
              <svg viewBox="0 0 360 360" className="w-full h-full">
                {prizes.map((prize, idx) => {
                  const midAngle = idx * sliceAngle + sliceAngle / 2;
                  return (
                    <g key={prize.id}>
                      <path
                        d={getSlicePath(idx)}
                        fill={prize.color}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      {/* Text Label on Slice */}
                      <g
                        transform={`rotate(${midAngle}, 180, 180) translate(180, 50) rotate(90)`}
                      >
                        <text
                          textAnchor="middle"
                          fill={prize.textColor || '#FFFFFF'}
                          fontSize="12"
                          fontWeight="900"
                          fontFamily="sans-serif"
                          letterSpacing="0.02em"
                        >
                          {prize.label}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Central SPIN Button */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <button
                onClick={handleSpin}
                disabled={isSpinning || userSpinsLeft <= 0}
                className={`pointer-events-auto w-20 h-20 sm:w-22 sm:h-22 rounded-full border-4 border-white shadow-2xl flex flex-col items-center justify-center font-display font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  isSpinning
                    ? 'bg-gray-400 text-white cursor-not-allowed scale-95'
                    : userSpinsLeft <= 0
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-tr from-yellow-400 to-[#FA5D00] text-white hover:scale-105 active:scale-95 shadow-orange-500/50'
                }`}
              >
                {isSpinning ? (
                  <span className="text-[11px] animate-pulse">SPINNING</span>
                ) : userSpinsLeft <= 0 ? (
                  <span className="text-[10px] text-center leading-tight">NO SPINS</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current mb-0.5" />
                    <span>SPIN</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Winning Announcement Card */}
          {wonPrize && (
            <div className="mt-4 w-full p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 text-center space-y-2.5 animate-fadeIn">
              <div className="inline-flex items-center gap-1.5 bg-red-600 text-white font-black text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-current" />
                CONGRATULATIONS! YOU WON:
              </div>

              <div className="font-display font-black text-2xl text-[#FA5D00]">
                {wonPrize.label}
              </div>

              <p className="text-xs text-gray-700 max-w-sm mx-auto leading-relaxed">
                {wonPrize.description}
              </p>

              {/* Coupon code box if prize provides coupon */}
              {wonPrize.couponCode && (
                <div className="pt-1 flex items-center justify-center gap-2 max-w-xs mx-auto">
                  <div className="bg-white border-2 border-dashed border-[#FA5D00] rounded-xl px-4 py-2 font-mono font-bold text-sm text-gray-900 shadow-inner flex items-center gap-2">
                    <span>{wonPrize.couponCode}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                      AUTO-APPLIED
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCoupon(wonPrize.couponCode!)}
                    className="p-2.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-[#FA5D00] transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}

              {/* Free Gift Details */}
              {wonPrize.type === 'free_gift' && wonPrize.giftItemName && (
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  🎁 Free Gift: <strong>{wonPrize.giftItemName}</strong> will be bundled in your package!
                </div>
              )}

              <div className="pt-2 flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => {
                    onClose();
                    if (onExploreDeals) onExploreDeals();
                  }}
                  className="bg-[#FA5D00] hover:bg-[#E04D00] text-white font-bold py-2 px-5 rounded-full text-xs shadow-md shadow-[#FA5D00]/25 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Use Coupon & Shop Deals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Footer disclaimer */}
          <div className="mt-4 text-[10px] text-gray-400 text-center">
            Valid on all BD SHOP orders. Vouchers expire within 7 days. Managed via Admin Panel.
          </div>
        </div>
      </div>
    </div>
  );
};
