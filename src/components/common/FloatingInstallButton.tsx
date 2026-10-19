import React from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Download, Smartphone, Sparkles, Gift } from 'lucide-react';

interface FloatingInstallButtonProps {
  onOpenInstall: () => void;
}

export const FloatingInstallButton: React.FC<FloatingInstallButtonProps> = ({ onOpenInstall }) => {
  const { homepageSettings } = useEcommerce();

  // If disabled in admin settings, do not render
  if (homepageSettings.installButtonEnabled === false) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-40 flex flex-col items-start select-none">
      <button
        onClick={onOpenInstall}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#FA5D00] via-[#FF5000] to-[#FF7A00] hover:from-[#E04D00] hover:to-[#FA5D00] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-[#FA5D00]/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
        title="Install BD SHOP App on your phone"
        aria-label="Install App"
      >
        {/* Pulsing Ping Indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-400 border border-white" />
        </span>

        {/* Icon */}
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.5]" />
        </div>

        {/* Label and discount text */}
        <div className="text-left leading-tight hidden xs:block sm:block">
          <div className="text-xs font-black uppercase tracking-wider flex items-center gap-1 text-white">
            <span>Install App</span>
            <Gift className="w-3 h-3 text-[#FFD200]" />
          </div>
          <div className="text-[10px] text-yellow-200 font-bold">
            {homepageSettings.installButtonDiscountText || 'Get ৳200 OFF'}
          </div>
        </div>
      </button>
    </div>
  );
};
