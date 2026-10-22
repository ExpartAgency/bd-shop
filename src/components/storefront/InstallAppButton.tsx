import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Download, Smartphone, X, Sparkles, ChevronRight } from 'lucide-react';

interface InstallAppButtonProps {
  onOpenInstall: () => void;
}

export const InstallAppButton: React.FC<InstallAppButtonProps> = ({ onOpenInstall }) => {
  const { homepageSettings } = useEcommerce();
  const [isDismissed, setIsDismissed] = useState(false);

  // If disabled by admin in Homepage CMS
  if (homepageSettings.installButtonEnabled === false) {
    return null;
  }

  const discountText = homepageSettings.installButtonDiscountText || 'Get ৳200 OFF';

  return (
    <aside
      aria-label="Install App Quick Access"
      className="fixed bottom-20 md:bottom-6 left-3 sm:left-6 z-40 flex items-center select-none"
    >
      {!isDismissed ? (
        <div className="relative group flex items-center">
          {/* Main Floating Install Pill */}
          <button
            onClick={onOpenInstall}
            className="flex items-center gap-2.5 bg-gradient-to-r from-[#FA5D00] to-[#FF7A00] hover:from-[#E04D00] hover:to-[#FA5D00] text-white p-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-orange-600/40 border-2 border-white/60 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            title="Install BD SHOP App to get instant discount"
            aria-label="Install BD SHOP mobile application"
          >
            {/* Animated App Icon */}
            <div className="relative w-8 h-8 rounded-full bg-white text-[#FA5D00] flex items-center justify-center font-black shadow-inner shrink-0">
              <Smartphone className="w-4 h-4 stroke-[2.5]" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400" />
              </span>
            </div>

            {/* Copy */}
            <div className="text-left hidden xs:block sm:block pr-1">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-black text-xs sm:text-sm tracking-tight text-white drop-shadow-xs">
                  App Install
                </span>
                <span className="bg-yellow-400 text-gray-950 font-black text-[9px] px-1.5 py-0.5 rounded-full font-mono uppercase shadow-xs">
                  {discountText}
                </span>
              </div>
              <p className="text-[10px] text-orange-100 font-medium mt-0.5">
                1-Tap install • Free gift code
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-white/80 shrink-0 hidden sm:block" />
          </button>

          {/* Dismiss button to minimize to simple icon */}
          <button
            onClick={e => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            className="ml-1 text-gray-500 hover:text-gray-800 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm text-xs transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Minimize install widget"
            aria-label="Minimize install prompt"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        /* Minimized Round Button on Bottom-Left */
        <button
          onClick={onOpenInstall}
          className="w-12 h-12 rounded-full bg-[#FA5D00] hover:bg-[#E04D00] text-white flex items-center justify-center shadow-xl shadow-orange-500/40 border-2 border-white hover:scale-110 active:scale-95 transition-all cursor-pointer relative"
          title="Install BD SHOP App"
          aria-label="Install BD SHOP App"
        >
          <Download className="w-5 h-5 stroke-[2.5]" />
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-950 text-[9px] font-black px-1 rounded-full font-mono">
            ৳
          </span>
        </button>
      )}
    </aside>
  );
};
