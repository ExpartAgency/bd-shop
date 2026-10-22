import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { ThemePreset } from '../../types';
import {
  Palette,
  Check,
  Sparkles,
  Eye,
  Sliders,
  RotateCcw,
  Layout,
  Smartphone,
  Monitor,
  ShoppingBag,
  Zap,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Tag
} from 'lucide-react';

export const AdminDesignStudio: React.FC = () => {
  const { currentTheme, availableThemes, setTheme, formatPrice } = useEcommerce();
  const [selectedPreviewTheme, setSelectedPreviewTheme] = useState<ThemePreset>(currentTheme);
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  const handleApply = (theme: ThemePreset) => {
    setTheme(theme.id);
    setSelectedPreviewTheme(theme);
    setAppliedToast(`Theme "${theme.name}" applied successfully! Storefront has been updated in 1-click.`);
    setTimeout(() => setAppliedToast(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Toast Notification */}
      {appliedToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-bounce-slow">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>{appliedToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#FA5D00] to-yellow-400 text-slate-950 font-black">
              <Palette className="w-5 h-5" />
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Design Studio • 1-Click Theme Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Instantly switch the entire storefront design, color tokens, and header branding with a single click.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Currently Active:</span>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold font-mono text-white flex items-center gap-1.5 shadow-sm"
            style={{ backgroundColor: currentTheme.primaryColor }}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {currentTheme.name}
          </span>
        </div>
      </div>

      {/* 1-Click Theme Preset Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Select a Modern E-Commerce Theme (1-Click Application)</span>
          </h2>
          <span className="text-[11px] text-slate-400">
            {availableThemes.length} production-grade themes available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableThemes.map(theme => {
            const isActive = currentTheme.id === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setSelectedPreviewTheme(theme)}
                className={`relative rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 border-2 shadow-xl'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
                style={{
                  borderColor: isActive ? theme.primaryColor : undefined
                }}
              >
                {/* Active / Preset Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {theme.badge}
                  </span>
                  {isActive ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active Storefront</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 hover:text-white">
                      Click to Preview
                    </span>
                  )}
                </div>

                {/* Theme Name & Description */}
                <div className="space-y-1 mb-4">
                  <h3 className="font-display font-bold text-base text-white">
                    {theme.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {theme.subtitle}
                  </p>
                </div>

                {/* Color Palette Swatches */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-4 space-y-2">
                  <div className="text-[10px] font-mono uppercase text-slate-400 flex justify-between">
                    <span>Palette Swatches</span>
                    <span>{theme.isDark ? 'Dark Theme' : 'Light Canvas'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg shadow-sm border border-white/20 flex items-center justify-center text-[9px] font-mono text-white font-bold"
                      style={{ backgroundColor: theme.primaryColor }}
                      title={`Primary: ${theme.primaryColor}`}
                    >
                      P
                    </div>
                    <div
                      className="w-7 h-7 rounded-lg shadow-sm border border-white/20 flex items-center justify-center text-[9px] font-mono text-gray-900 font-bold"
                      style={{ backgroundColor: theme.secondaryColor }}
                      title={`Secondary: ${theme.secondaryColor}`}
                    >
                      S
                    </div>
                    <div
                      className="w-7 h-7 rounded-lg shadow-sm border border-white/20 flex items-center justify-center text-[9px] font-mono text-white font-bold"
                      style={{ backgroundColor: theme.accentColor }}
                      title={`Accent: ${theme.accentColor}`}
                    >
                      A
                    </div>
                    <div
                      className="w-7 h-7 rounded-lg shadow-sm border border-white/20 flex items-center justify-center text-[9px] font-mono font-bold"
                      style={{
                        backgroundColor: theme.backgroundColor,
                        color: theme.isDark ? '#FFF' : '#000'
                      }}
                      title={`Background: ${theme.backgroundColor}`}
                    >
                      Bg
                    </div>
                  </div>
                </div>

                {/* 1-Click Apply Button */}
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleApply(theme);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'text-white shadow-lg shadow-black/30 hover:scale-[1.02]'
                  }`}
                  style={{
                    backgroundColor: isActive ? undefined : theme.primaryColor
                  }}
                >
                  {isActive ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Re-Apply Active Theme</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Apply 1-Click Theme</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Storefront Component Preview Simulator */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-bold text-sm text-white">
              Live Storefront Component Simulator: "{selectedPreviewTheme.name}"
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Previewing how headers, product cards, and CTAs render in real time.
          </span>
        </div>

        {/* Mock Storefront Canvas */}
        <div
          className="rounded-2xl p-4 sm:p-6 transition-colors shadow-inner"
          style={{
            backgroundColor: selectedPreviewTheme.backgroundColor,
            color: selectedPreviewTheme.textColor
          }}
        >
          {/* Mock Header Strip */}
          <div
            className="rounded-xl p-3 text-white flex items-center justify-between shadow-md mb-4"
            style={{
              backgroundColor: selectedPreviewTheme.headerBackground,
              color: selectedPreviewTheme.headerTextColor
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm tracking-tight">
                BD SHOP
              </span>
              <span className="text-[10px] opacity-80 hidden sm:inline">
                • {selectedPreviewTheme.tagline}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: selectedPreviewTheme.secondaryColor,
                  color: '#111'
                }}
              >
                Free Delivery on ৳1,000+
              </span>
              <button
                className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs cursor-pointer"
                style={{ backgroundColor: selectedPreviewTheme.primaryColor }}
              >
                Cart (2)
              </button>
            </div>
          </div>

          {/* Mock Product Cards in this Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Card 1: Inkax T02 */}
            <div
              className={`p-3 border shadow-sm transition-all flex flex-col justify-between ${
                selectedPreviewTheme.borderRadius
              }`}
              style={{
                backgroundColor: selectedPreviewTheme.cardBackground,
                borderColor: selectedPreviewTheme.isDark ? '#334155' : '#E2E8F0'
              }}
            >
              <div>
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80"
                    alt="Inkax T02"
                    className="w-full h-full object-cover"
                  />
                  <span
                    className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: selectedPreviewTheme.primaryColor }}
                  >
                    -24% OFF
                  </span>
                </div>
                <h4 className="font-bold text-xs line-clamp-1 mb-1">
                  Inkax T02 Bluetooth Earbuds Pro
                </h4>
                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className="text-base font-black"
                    style={{ color: selectedPreviewTheme.primaryColor }}
                  >
                    ৳1,250
                  </span>
                  <span className="text-xs text-gray-400 line-through">৳1,650</span>
                </div>
              </div>
              <button
                type="button"
                className="w-full py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                style={{ backgroundColor: selectedPreviewTheme.primaryColor }}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Card 2: Sony Headphones */}
            <div
              className={`p-3 border shadow-sm transition-all flex flex-col justify-between ${
                selectedPreviewTheme.borderRadius
              }`}
              style={{
                backgroundColor: selectedPreviewTheme.cardBackground,
                borderColor: selectedPreviewTheme.isDark ? '#334155' : '#E2E8F0'
              }}
            >
              <div>
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
                    alt="Sony WH-1000XM5"
                    className="w-full h-full object-cover"
                  />
                  <span
                    className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: selectedPreviewTheme.primaryColor }}
                  >
                    🔥 Deal
                  </span>
                </div>
                <h4 className="font-bold text-xs line-clamp-1 mb-1">
                  Sony WH-1000XM5 Headphones
                </h4>
                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className="text-base font-black"
                    style={{ color: selectedPreviewTheme.primaryColor }}
                  >
                    ৳38,500
                  </span>
                  <span className="text-xs text-gray-400 line-through">৳42,000</span>
                </div>
              </div>
              <button
                type="button"
                className="w-full py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                style={{ backgroundColor: selectedPreviewTheme.primaryColor }}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Card 3: Free Shipping Guarantee Badge */}
            <div
              className={`p-4 border shadow-sm transition-all flex flex-col justify-center items-center text-center ${
                selectedPreviewTheme.borderRadius
              }`}
              style={{
                backgroundColor: selectedPreviewTheme.cardBackground,
                borderColor: selectedPreviewTheme.isDark ? '#334155' : '#E2E8F0'
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{
                  backgroundColor: selectedPreviewTheme.primaryColor + '20',
                  color: selectedPreviewTheme.primaryColor
                }}
              >
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h4 className="font-display font-bold text-xs mb-1">
                Buyer Protection & Free BD Shipping
              </h4>
              <p className="text-[11px] text-gray-500 mb-3">
                Steadfast 24h Express Delivery & 90-Day Hassle-Free Returns.
              </p>
              <button
                type="button"
                onClick={() => handleApply(selectedPreviewTheme)}
                className="py-1.5 px-4 rounded-full text-white text-[11px] font-bold shadow-xs cursor-pointer"
                style={{ backgroundColor: selectedPreviewTheme.primaryColor }}
              >
                Activate This Theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
