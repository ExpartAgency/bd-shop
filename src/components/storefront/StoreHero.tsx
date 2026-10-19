import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  Sparkles,
  Flame,
  Clock,
  Gift,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  Headphones,
  Watch,
  Laptop,
  Home,
  Tag
} from 'lucide-react';
import { Product } from '../../types';

interface StoreHeroProps {
  onSelectCategory: (categorySlug: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenSpinningWheel?: () => void;
}

export const StoreHero: React.FC<StoreHeroProps> = ({
  onSelectCategory,
  onSelectProduct,
  onOpenSpinningWheel
}) => {
  const { publishedProducts, formatPrice, homepageSettings, applyCoupon } = useEcommerce();

  // Pick spotlight item based on CMS or default
  const heroProduct =
    publishedProducts.find(p => p.id === homepageSettings.spotlightProductId) ||
    publishedProducts[0];

  // Live ticking countdown timer for Temu Lightning Deals
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 35, seconds: 42 });
  const [claimedVoucher, setClaimedVoucher] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaimVoucher = () => {
    applyCoupon('BDWELCOME10');
    setClaimedVoucher(true);
    setTimeout(() => setClaimedVoucher(false), 5000);
  };

  // Temu category circle data
  const categoryBubbles = [
    { name: 'All Deals', slug: 'all', icon: Sparkles, color: 'bg-orange-500' },
    { name: 'Smartphones', slug: 'smartphones-tech', icon: Smartphone, color: 'bg-blue-500' },
    { name: 'Audio & TWS', slug: 'audio-sound', icon: Headphones, color: 'bg-purple-500' },
    { name: 'Smartwatches', slug: 'wearables-health', icon: Watch, color: 'bg-emerald-500' },
    { name: 'Laptops & PC', slug: 'computing-accessories', icon: Laptop, color: 'bg-amber-500' },
    { name: 'Smart Living', slug: 'smart-living', icon: Home, color: 'bg-rose-500' },
    { name: 'Flash Deals', slug: 'all', icon: Zap, color: 'bg-red-500' },
    { name: 'Under ৳1,999', slug: 'all', icon: Tag, color: 'bg-cyan-500' }
  ];

  return (
    <section className="bg-[#F6F6F6] pt-3 pb-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 space-y-4">
        {/* 1. Temu Category Circular Icons Carousel (Ultra-responsive on mobile) */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-xs border border-gray-100 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-4 sm:gap-6 min-w-max justify-start md:justify-around">
            {categoryBubbles.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <button
                  key={i}
                  onClick={() => {
                    onSelectCategory(cat.slug);
                    const el = document.getElementById('catalog');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${cat.color} text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110 group-active:scale-95`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-gray-700 group-hover:text-[#FA5D00] text-center whitespace-nowrap">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Temu Main Hero Banner & Lightning Deals Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          {/* Main Visual Banner */}
          <div className="lg:col-span-8 rounded-2xl bg-gradient-to-r from-[#FA5D00] via-[#FF5500] to-[#FF7A00] p-5 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-md">
            {/* Background decorative circles & pattern */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute right-10 top-5 opacity-20 pointer-events-none hidden sm:block">
              <Sparkles className="w-32 h-32" />
            </div>

            <div className="relative z-10 space-y-3 sm:space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-black/25 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase text-yellow-300">
                <Flame className="w-4 h-4 fill-current text-yellow-400" />
                <span>TEMU STYLE MEGA DISCOUNTS</span>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-xs">
                {homepageSettings.heroTitle || 'Shop Millions of Products'}{' '}
                <span className="text-[#FFD200] block sm:inline">
                  {homepageSettings.heroTitleHighlight || 'At Factory Prices'}
                </span>
              </h1>

              <p className="text-white/90 text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-2">
                {homepageSettings.heroSubtitle ||
                  'Authentic branded electronics, smart wearables, audio accessories with direct Dhaka same-day dispatch and 7-day return guarantee.'}
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href="#catalog"
                  className="inline-flex items-center gap-2 bg-white text-[#FA5D00] hover:bg-yellow-50 font-black px-5 py-2.5 sm:py-3 rounded-full shadow-lg shadow-black/10 transition-transform active:scale-95 text-xs sm:text-sm cursor-pointer"
                >
                  <span>{homepageSettings.heroPrimaryCtaText || 'Explore All Deals'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={() => onOpenSpinningWheel && onOpenSpinningWheel()}
                  className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black px-4 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-black/20 animate-pulse-slow"
                >
                  <Sparkles className="w-4 h-4 text-[#FA5D00] fill-current" />
                  <span>🎁 Spin Lucky Wheel</span>
                </button>

                <button
                  onClick={handleClaimVoucher}
                  className="inline-flex items-center gap-1.5 bg-black/30 hover:bg-black/40 text-yellow-300 border border-yellow-300/40 font-bold px-4 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <Gift className="w-4 h-4" />
                  <span>{claimedVoucher ? '✓ ৳500 Voucher Claimed!' : 'Claim ৳500 Voucher'}</span>
                </button>
              </div>
            </div>

            {/* Micro Trust Strip on Hero */}
            <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-white/90">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-yellow-300" /> Free Shipping on ৳1,000+
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" /> 100% Genuine Guarantee
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-yellow-300" /> 90-Day Free Returns
              </span>
            </div>
          </div>

          {/* Right Column: Temu Lightning Deal / Flash Sale Countdown Box */}
          <div
            id="lightning-deals"
            className="lg:col-span-4 rounded-2xl bg-white border border-gray-200 p-4 sm:p-5 flex flex-col justify-between shadow-xs"
          >
            <div>
              {/* Header with live timer */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded-md bg-red-100 text-red-600 font-bold">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm text-gray-900 leading-none">
                      Lightning Deals
                    </h3>
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                      Ends Soon!
                    </span>
                  </div>
                </div>

                {/* Temu Style Digital Clock Countdown */}
                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-white">
                  <span className="bg-gray-900 px-1.5 py-0.5 rounded">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-gray-900">:</span>
                  <span className="bg-gray-900 px-1.5 py-0.5 rounded">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-gray-900">:</span>
                  <span className="bg-red-600 px-1.5 py-0.5 rounded animate-pulse">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Spotlight Product Display */}
              {heroProduct && (
                <div
                  onClick={() => onSelectProduct(heroProduct)}
                  className="mt-3 group cursor-pointer"
                >
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100 mb-2.5">
                    <img
                      src={heroProduct.primaryImage}
                      alt={heroProduct.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white font-black text-[11px] px-2 py-0.5 rounded-full shadow">
                      -{heroProduct.discountPercent || 40}% OFF
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded-lg flex items-center justify-between">
                      <span className="font-semibold text-yellow-300">🔥 Almost Sold Out</span>
                      <span>Only {heroProduct.stock} left</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1 group-hover:text-[#FA5D00] transition-colors">
                    {heroProduct.title}
                  </h4>

                  {/* Stock progress bar (Temu Style) */}
                  <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-[#FA5D00] h-full w-[82%] rounded-full" />
                  </div>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-black text-[#FA5D00]">
                      {formatPrice(heroProduct.price)}
                    </span>
                    {heroProduct.compareAtPrice && (
                      <span className="text-xs line-through text-gray-400">
                        {formatPrice(heroProduct.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => heroProduct && onSelectProduct(heroProduct)}
              className="mt-3 w-full bg-[#FA5D00] hover:bg-[#E04D00] text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Grab Flash Deal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. Temu-Style BD SHOP Buyer Protection Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white rounded-xl p-3 border border-gray-200/80 text-xs shadow-xs">
          <div className="flex items-center gap-2 p-1">
            <div className="w-7 h-7 rounded-full bg-orange-100 text-[#FA5D00] flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-gray-900 leading-tight">
                {homepageSettings.guaranteeText1 || 'Free Shipping'}
              </div>
              <div className="text-[10px] text-gray-500">Dhaka & Nationwide</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-gray-900 leading-tight">
                {homepageSettings.guaranteeText2 || '90-Day Returns'}
              </div>
              <div className="text-[10px] text-gray-500">No Questions Asked</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-gray-900 leading-tight">
                {homepageSettings.guaranteeText3 || 'Security & Privacy'}
              </div>
              <div className="text-[10px] text-gray-500">Encrypted Payments</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-gray-900 leading-tight">
                {homepageSettings.guaranteeText4 || 'Instant Dispatch'}
              </div>
              <div className="text-[10px] text-gray-500">Steadfast / Pathao</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
