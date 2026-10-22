import React, { useState, useRef, useEffect } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import {
  ShoppingBag,
  Heart,
  Search,
  Truck,
  ShieldCheck,
  LayoutDashboard,
  X,
  ArrowRight,
  User,
  Download,
  Menu,
  Phone,
  Flame,
  Zap,
  Sparkles,
  ChevronDown,
  Gift,
  Palette,
  Check
} from 'lucide-react';
import { Product } from '../../types';

interface StoreHeaderProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenTracking: () => void;
  onOpenAccount: () => void;
  onOpenInstall: () => void;
  onOpenSpinningWheel?: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory?: (categorySlug: string) => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  onOpenCart,
  onOpenWishlist,
  onOpenTracking,
  onOpenAccount,
  onOpenInstall,
  onOpenSpinningWheel,
  onSelectProduct,
  onSelectCategory
}) => {
  const {
    cartCount,
    cartSubtotal,
    wishlist,
    formatPrice,
    currency,
    toggleCurrency,
    searchQuery,
    setSearchQuery,
    publishedProducts,
    categories,
    setIsAdminMode,
    homepageSettings,
    currentTheme,
    availableThemes,
    setTheme
  } = useEcommerce();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Suggested trending search tags (Temu style)
  const trendingTags = ['AirPods Pro', 'Smartwatch', 'Sneakers', 'Power Bank', 'Curved Monitor', 'TWS Earbuds'];

  // Filter search results in real time
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return publishedProducts
      .filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [searchQuery, publishedProducts]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-gray-200">
      {/* 1. Dynamic Top Promo Strip with Active Theme */}
      <div
        className="text-white px-3 sm:px-4 py-1.5 text-xs font-medium transition-colors"
        style={{
          background: `linear-gradient(to right, ${currentTheme.headerBackground}, ${currentTheme.primaryColor})`
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] sm:text-xs">
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3 text-[#FFD200] fill-current" />
              {currentTheme.name.toUpperCase()}
            </span>
            <span className="truncate">
              {homepageSettings.announcementText || 'Free Shipping on all orders over ৳1,000 | 90-Day Free Returns'}
            </span>
            {homepageSettings.announcementCoupon && (
              <span className="hidden sm:inline bg-white text-slate-900 px-2 py-0.5 rounded-full font-mono font-bold text-[10px] shadow-sm">
                Use: {homepageSettings.announcementCoupon}
              </span>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3.5 text-xs font-medium shrink-0">
            {/* 1-Click Theme Switcher Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsThemeMenuOpen(prev => !prev)}
                className="hover:scale-105 flex items-center gap-1.5 cursor-pointer bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-0.5 rounded-full transition-all text-[11px] border border-white/25 shadow-xs"
                title="1-Click Theme Engine"
              >
                <Palette className="w-3 h-3 text-yellow-300" />
                <span>Theme: {currentTheme.badge}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {isThemeMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-slate-950 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 py-2.5 z-50 text-xs animate-fadeIn"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center justify-between">
                    <span>1-Click Modern Themes</span>
                    <span className="text-[9px] text-cyan-400">Instant Switch</span>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {availableThemes.map(t => {
                      const isCur = currentTheme.id === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setTheme(t.id);
                            setIsThemeMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-slate-900 flex items-center justify-between transition-colors cursor-pointer ${
                            isCur ? 'bg-slate-900/90 font-bold' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full shadow-xs border border-white/20 shrink-0"
                              style={{ backgroundColor: t.primaryColor }}
                            />
                            <div>
                              <div className="text-white text-xs">{t.name}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{t.badge}</div>
                            </div>
                          </div>
                          {isCur && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Lucky Wheel Spin & Win Button */}
            {onOpenSpinningWheel && (
              <button
                onClick={onOpenSpinningWheel}
                className="hover:scale-105 flex items-center gap-1.5 cursor-pointer bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black px-2.5 py-0.5 rounded-full transition-all shadow-xs text-[11px]"
                title="Spin & Win Free Gift & Coupons"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600 fill-current" />
                <span>🎁 Spin & Win</span>
              </button>
            )}

            {/* Direct PWA Install Button */}
            <button
              onClick={onOpenInstall}
              className="hover:underline flex items-center gap-1.5 cursor-pointer bg-white/15 px-2 py-0.5 rounded-full transition-colors text-white"
              title="Install BD SHOP App"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
            <span className="opacity-40">|</span>
            <button
              onClick={onOpenTracking}
              className="hover:underline flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Tracking</span>
            </button>
            <span className="opacity-40">|</span>
            <button
              onClick={toggleCurrency}
              className="hover:underline transition-colors cursor-pointer font-bold"
              title="Toggle Currency"
            >
              {currency === 'BDT' ? '৳ BDT' : '$ USD'}
            </button>
            <span className="opacity-40">|</span>
            <button
              onClick={() => setIsAdminMode(true)}
              className="hover:underline flex items-center gap-1 text-yellow-200 cursor-pointer font-bold"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar with Temu Branding & Big Search */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Brand Logo (Temu Style) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="p-1.5 -ml-1 text-gray-700 hover:text-black md:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <a href="#" className="flex items-center gap-2 group select-none">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#FA5D00] to-[#FF7A00] flex items-center justify-center text-white shadow-md shadow-[#FA5D00]/30 transition-transform group-hover:scale-105">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-display font-black text-xl sm:text-2xl text-[#FA5D00] tracking-tight leading-none">
                    BD SHOP
                  </span>
                  <span className="hidden sm:inline bg-[#FA5D00] text-white text-[9px] font-black px-1 rounded uppercase">
                    PRO
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 font-semibold tracking-wide hidden sm:block">
                  Shop Like a Billionaire
                </div>
              </div>
            </a>
          </div>

          {/* Temu-Style Central Search Input with Autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative">
            <div className="relative flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setIsDropdownVisible(true);
                  }}
                  onFocus={() => setIsDropdownVisible(true)}
                  placeholder="Search products, brands, tech & deals..."
                  className="w-full bg-gray-50 hover:bg-gray-100/80 focus:bg-white text-gray-900 placeholder:text-gray-400 pl-10 pr-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm border-2 border-[#FA5D00] focus:outline-none transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-[#FA5D00] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsDropdownVisible(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Temu Orange Search Button */}
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    const el = document.getElementById('catalog');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="hidden sm:flex items-center justify-center bg-[#FA5D00] hover:bg-[#E04D00] text-white px-5 py-2.5 rounded-full font-bold text-xs ml-1.5 transition-colors cursor-pointer shadow-sm"
              >
                Search
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {isDropdownVisible && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-3.5 py-2 bg-orange-50 border-b border-orange-100 flex items-center justify-between text-xs text-[#FA5D00] font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Instant Matches ({searchResults.length})
                  </span>
                  <span className="text-[11px] text-gray-400">Click to preview</span>
                </div>
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {searchResults.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        setIsDropdownVisible(false);
                        setSearchQuery('');
                      }}
                      className="p-2.5 hover:bg-orange-50/60 flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <img
                        src={p.primaryImage}
                        alt={p.title}
                        className="w-11 h-11 rounded-lg object-cover bg-gray-100 border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-gray-900 truncate">{p.title}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                          <span className="text-[#FA5D00] font-bold">{formatPrice(p.price)}</span>
                          {p.compareAtPrice && (
                            <span className="line-through text-gray-400 text-[10px]">
                              {formatPrice(p.compareAtPrice)}
                            </span>
                          )}
                          <span className="text-emerald-600 font-medium">Free Delivery</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Buttons (Desktop & Tablet) */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Install Icon for Mobile & Desktop (Prominently visible) */}
            <button
              onClick={onOpenInstall}
              className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-[#FA5D00] border border-orange-200/80 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Install Web App on your phone"
            >
              <Download className="w-4 h-4" />
              <span className="hidden lg:inline">Install App</span>
            </button>

            {/* Saved / Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-gray-700 hover:text-[#FA5D00] hover:bg-orange-50 rounded-full transition-colors cursor-pointer hidden sm:flex items-center gap-1.5"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FA5D00] text-[9px] font-bold text-white font-mono">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account / Orders */}
            <button
              onClick={onOpenAccount}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 text-gray-700 hover:text-[#FA5D00] hover:bg-orange-50 rounded-full transition-colors cursor-pointer"
              title="My Account & Orders"
            >
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden xl:block text-left text-xs leading-tight">
                <div className="text-[10px] text-gray-400">Hello, Sign In</div>
                <div className="font-bold text-gray-800">Orders & You</div>
              </div>
            </button>

            {/* Temu-Style Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-[#FA5D00] hover:bg-[#E04D00] text-white px-3 sm:px-4 py-2 rounded-full font-bold text-xs shadow-md shadow-[#FA5D00]/25 transition-all cursor-pointer"
              title="Open Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFD200] text-[9px] font-black text-gray-950 font-mono shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">
                {cartCount > 0 ? formatPrice(cartSubtotal) : 'Cart'}
              </span>
            </button>
          </div>
        </div>

        {/* Trending hot search chips underneath search (Temu style) */}
        <div className="hidden md:flex items-center gap-2 mt-2 pt-1 border-t border-gray-100 text-[11px] text-gray-500 overflow-x-auto no-scrollbar">
          <span className="font-semibold text-gray-700 shrink-0">Trending:</span>
          {trendingTags.map(tag => (
            <button
              key={tag}
              onClick={() => {
                setSearchQuery(tag);
                const el = document.getElementById('catalog');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-2 py-0.5 rounded-full bg-gray-100 hover:bg-orange-100 hover:text-[#FA5D00] text-gray-600 transition-colors shrink-0 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Temu-Style Secondary Category & Flash Deals Bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-3 sm:px-4 lg:px-8 py-1.5 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-4 text-xs font-semibold text-gray-700 whitespace-nowrap">
          <button
            onClick={() => {
              if (onSelectCategory) onSelectCategory('all');
              const el = document.getElementById('catalog');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[#FA5D00] hover:bg-orange-100 font-bold transition-colors cursor-pointer"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </button>

          <a
            href="#lightning-deals"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[#FA5D00] hover:bg-orange-100 transition-colors font-bold"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Lightning Deals</span>
          </a>

          <a
            href="#best-sellers"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-amber-700 hover:bg-amber-100 transition-colors font-bold"
          >
            <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>Best Sellers</span>
          </a>

          <a
            href="#catalog"
            className="px-2.5 py-1 rounded-md hover:text-[#FA5D00] hover:bg-gray-200/60 transition-colors"
          >
            5-Star Rated
          </a>

          <a
            href="#catalog"
            className="px-2.5 py-1 rounded-md hover:text-[#FA5D00] hover:bg-gray-200/60 transition-colors"
          >
            New In
          </a>

          <button
            onClick={() => {
              setSearchQuery('Smart');
              const el = document.getElementById('catalog');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-2.5 py-1 rounded-md hover:text-[#FA5D00] hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            Gadgets Under ৳1,999
          </button>

          <div className="ml-auto hidden lg:flex items-center gap-3 text-[11px] text-gray-500 font-normal">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Temu-Standard BD Buyer Protection
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden flex">
          <div className="w-4/5 max-w-xs bg-white h-full p-5 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FA5D00] flex items-center justify-center text-white font-bold">
                    BD
                  </div>
                  <span className="font-bold text-gray-900">BD SHOP Menu</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded text-gray-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Install PWA Prompt inside mobile menu */}
              <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FA5D00] mb-1">
                  <Gift className="w-4 h-4" />
                  <span>Get ৳200 Welcome Gift</span>
                </div>
                <p className="text-[11px] text-gray-600 mb-2">Install BD SHOP App on your phone for faster checkout.</p>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenInstall();
                  }}
                  className="w-full bg-[#FA5D00] text-white py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install App Now</span>
                </button>
              </div>

              {/* Navigation links */}
              <div className="space-y-1 text-sm font-semibold text-gray-700">
                <a
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-[#FA5D00]"
                >
                  Home
                </a>
                <a
                  href="#catalog"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-[#FA5D00]"
                >
                  All Products
                </a>
                {onOpenSpinningWheel && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenSpinningWheel();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg bg-yellow-50 text-yellow-800 font-bold flex items-center gap-2"
                  >
                    <span>🎁 Lucky Wheel (Free Gifts & Coupons)</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenInstall();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-[#FA5D00] flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#FA5D00]" />
                  <span>Install BD SHOP App</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenTracking();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-[#FA5D00]"
                >
                  Track BD Courier Order
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAccount();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-[#FA5D00]"
                >
                  My Orders & Saved
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAdminMode(true);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-orange-600 bg-orange-50"
                >
                  Switch to Admin Panel
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
              BD SHOP • Inspired by Temu UI
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
