import React from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Sparkles, Gift } from 'lucide-react';

interface SpinningWheelFloatingButtonProps {
  onOpen: () => void;
}

export const SpinningWheelFloatingButton: React.FC<SpinningWheelFloatingButtonProps> = ({ onOpen }) => {
  const { spinningWheelSettings, userSpinsLeft } = useEcommerce();

  // If disabled by admin
  if (!spinningWheelSettings.enabled || !spinningWheelSettings.floatingButtonEnabled) {
    return null;
  }

  return (
    <aside
      aria-label="Lucky Spinning Wheel Quick Access"
      className="fixed bottom-36 md:bottom-22 right-4 sm:right-6 z-40 select-none animate-bounce-slow"
    >
      <button
        onClick={onOpen}
        className="group relative flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-[#FA5D00] hover:from-yellow-300 hover:to-[#E04D00] text-gray-950 font-black p-2.5 sm:px-4 sm:py-2.5 rounded-full shadow-2xl shadow-yellow-500/40 border-2 border-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        title="Spin the Lucky Wheel to win Free Gifts & Coupons"
        aria-label="Open Lucky Spinning Wheel"
      >
        {/* Animated Spin/Gift Icon */}
        <div className="relative w-8 h-8 rounded-full bg-white text-[#FA5D00] flex items-center justify-center shadow-inner shrink-0 group-hover:rotate-180 transition-transform duration-700">
          <Gift className="w-4 h-4 text-[#FA5D00] fill-current" />
          {userSpinsLeft > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white font-mono text-[9px] font-black border border-white">
              {userSpinsLeft}
            </span>
          )}
        </div>

        {/* Text Label */}
        <div className="text-left hidden xs:block sm:block pr-1">
          <div className="flex items-center gap-1 leading-none">
            <span className="font-display font-black text-xs sm:text-sm tracking-tight text-gray-950">
              Spin & Win
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#FA5D00] fill-current" />
          </div>
          <span className="text-[10px] text-gray-900 font-bold">
            Free Gift & ৳500 OFF
          </span>
        </div>
      </button>
    </aside>
  );
};
