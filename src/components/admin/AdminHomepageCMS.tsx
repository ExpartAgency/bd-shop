import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import {
  Sparkles,
  Layout,
  MessageSquare,
  CheckCircle2,
  Eye,
  Megaphone,
  Smartphone,
  Download,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap
} from 'lucide-react';

export const AdminHomepageCMS: React.FC = () => {
  const { homepageSettings, updateHomepageSettings, products, formatPrice } = useEcommerce();

  const [announcementText, setAnnouncementText] = useState(homepageSettings.announcementText);
  const [announcementCoupon, setAnnouncementCoupon] = useState(homepageSettings.announcementCoupon);
  const [announcementEnabled, setAnnouncementEnabled] = useState(homepageSettings.announcementEnabled);

  const [heroBadge, setHeroBadge] = useState(homepageSettings.heroBadge);
  const [heroTitle, setHeroTitle] = useState(homepageSettings.heroTitle);
  const [heroTitleHighlight, setHeroTitleHighlight] = useState(homepageSettings.heroTitleHighlight);
  const [heroSubtitle, setHeroSubtitle] = useState(homepageSettings.heroSubtitle);
  const [heroPrimaryCtaText, setHeroPrimaryCtaText] = useState(homepageSettings.heroPrimaryCtaText);
  const [spotlightProductId, setSpotlightProductId] = useState(homepageSettings.spotlightProductId);

  const [whatsappNumber, setWhatsappNumber] = useState(homepageSettings.whatsappNumber);
  const [whatsappWelcomeMessage, setWhatsappWelcomeMessage] = useState(
    homepageSettings.whatsappWelcomeMessage
  );
  const [whatsappEnabled, setWhatsappEnabled] = useState(homepageSettings.whatsappEnabled);

  const [installButtonEnabled, setInstallButtonEnabled] = useState(
    homepageSettings.installButtonEnabled ?? true
  );
  const [installButtonDiscountText, setInstallButtonDiscountText] = useState(
    homepageSettings.installButtonDiscountText || 'Get ৳200 OFF'
  );

  const [guaranteeText1, setGuaranteeText1] = useState(
    homepageSettings.guaranteeText1 || 'Free Shipping (Dhaka & BD Wide)'
  );
  const [guaranteeText2, setGuaranteeText2] = useState(
    homepageSettings.guaranteeText2 || '90-Day Free Returns'
  );
  const [guaranteeText3, setGuaranteeText3] = useState(
    homepageSettings.guaranteeText3 || '100% Genuine Guaranteed'
  );
  const [guaranteeText4, setGuaranteeText4] = useState(
    homepageSettings.guaranteeText4 || 'Steadfast Instant Dispatch'
  );

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomepageSettings({
      announcementText: announcementText.trim(),
      announcementCoupon: announcementCoupon.trim(),
      announcementEnabled,
      heroBadge: heroBadge.trim(),
      heroTitle: heroTitle.trim(),
      heroTitleHighlight: heroTitleHighlight.trim(),
      heroSubtitle: heroSubtitle.trim(),
      heroPrimaryCtaText: heroPrimaryCtaText.trim(),
      spotlightProductId,
      whatsappNumber: whatsappNumber.trim(),
      whatsappWelcomeMessage: whatsappWelcomeMessage.trim(),
      whatsappEnabled,
      installButtonEnabled,
      installButtonDiscountText: installButtonDiscountText.trim(),
      guaranteeText1: guaranteeText1.trim(),
      guaranteeText2: guaranteeText2.trim(),
      guaranteeText3: guaranteeText3.trim(),
      guaranteeText4: guaranteeText4.trim()
    });

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const selectedSpotlight = products.find(p => p.id === spotlightProductId) || products[0];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layout className="w-6 h-6 text-cyan-400" />
            <span>Storefront Homepage & Content CMS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain announcement bars, hero banners, install app widget, WhatsApp support, and trust badges in real time.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          Save & Publish to Storefront
        </button>
      </div>

      {savedToast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Homepage CMS content published! Changes are active instantly on the storefront.</span>
        </div>
      )}

      {/* CMS Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Top Notification Bar */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <Megaphone className="w-4 h-4 text-cyan-400" />
              <span>Top Notification & Flash Sale Banner</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={announcementEnabled}
                onChange={e => setAnnouncementEnabled(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500"
              />
              <span className="text-slate-300 font-semibold">Enable Announcement Bar</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-slate-400 block mb-1">Announcement Message Text</label>
              <input
                type="text"
                value={announcementText}
                onChange={e => setAnnouncementText(e.target.value)}
                placeholder="Special deal announcement text"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Promotional Coupon Code</label>
              <input
                type="text"
                value={announcementCoupon}
                onChange={e => setAnnouncementCoupon(e.target.value)}
                placeholder="BDWELCOME10"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Hero Visual Showcase */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-white pb-2 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Storefront Hero Messaging & Spotlight Product</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Hero Eyebrow Tag / Badge</label>
              <input
                type="text"
                value={heroBadge}
                onChange={e => setHeroBadge(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Primary CTA Button Label</label>
              <input
                type="text"
                value={heroPrimaryCtaText}
                onChange={e => setHeroPrimaryCtaText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Main Headline Part 1</label>
              <input
                type="text"
                value={heroTitle}
                onChange={e => setHeroTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Headline Accent / Highlight</label>
              <input
                type="text"
                value={heroTitleHighlight}
                onChange={e => setHeroTitleHighlight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-slate-400 block mb-1">Hero Subtitle</label>
              <textarea
                rows={2}
                value={heroSubtitle}
                onChange={e => setHeroSubtitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Spotlight Product Selector */}
            <div className="md:col-span-2 p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              {selectedSpotlight && (
                <img
                  src={selectedSpotlight.primaryImage}
                  alt={selectedSpotlight.title}
                  className="w-14 h-14 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                />
              )}
              <div className="flex-1 w-full">
                <label className="text-slate-400 block mb-1 font-bold">
                  Spotlight Flash Deal Product
                </label>
                <select
                  value={spotlightProductId}
                  onChange={e => setSpotlightProductId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white cursor-pointer"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} - {formatPrice(p.price)} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Bottom-Left Floating Install App Widget */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <Download className="w-4 h-4 text-[#FA5D00]" />
              <span>Bottom-Left Floating Install App Button</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={installButtonEnabled}
                onChange={e => setInstallButtonEnabled(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-[#FA5D00]"
              />
              <span className="text-slate-300 font-semibold">Enable Floating Button</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Coupon Incentive Subtext</label>
              <input
                type="text"
                value={installButtonDiscountText}
                onChange={e => setInstallButtonDiscountText(e.target.value)}
                placeholder="Get ৳200 OFF"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="text-slate-400 flex items-center pt-5 text-[11px]">
              <span>Positioned at bottom-left corner of storefront for optimal mobile usability.</span>
            </div>
          </div>
        </div>

        {/* Section 4: Floating WhatsApp Live Chat */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Floating WhatsApp Live Chat Button (Bottom-Right)</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappEnabled}
                onChange={e => setWhatsappEnabled(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-emerald-500"
              />
              <span className="text-slate-300 font-semibold">Enable WhatsApp Widget</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">WhatsApp Business Number (with country code)</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
                placeholder="+8801711892341"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Default Pre-filled Chat Inquirer Message</label>
              <input
                type="text"
                value={whatsappWelcomeMessage}
                onChange={e => setWhatsappWelcomeMessage(e.target.value)}
                placeholder="Hello BD SHOP! I need help with an order."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Trust & Guarantee Badges */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-white pb-2 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Storefront Guarantee & Trust Strip Text</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#FA5D00]" /> Badge 1 Text
              </label>
              <input
                type="text"
                value={guaranteeText1}
                onChange={e => setGuaranteeText1(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" /> Badge 2 Text
              </label>
              <input
                type="text"
                value={guaranteeText2}
                onChange={e => setGuaranteeText2(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Badge 3 Text
              </label>
              <input
                type="text"
                value={guaranteeText3}
                onChange={e => setGuaranteeText3(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-400" /> Badge 4 Text
              </label>
              <input
                type="text"
                value={guaranteeText4}
                onChange={e => setGuaranteeText4(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            Save All Homepage Changes
          </button>
        </div>
      </form>
    </div>
  );
};
