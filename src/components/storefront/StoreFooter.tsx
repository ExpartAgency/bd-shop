import React from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  LayoutDashboard,
  Lock,
  Phone,
  Mail,
  MapPin,
  Heart,
  ShoppingBag
} from 'lucide-react';

export const StoreFooter: React.FC = () => {
  const { setIsAdminMode } = useEcommerce();

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 text-xs">
      {/* 1. Temu 4-Point Guarantee Banner */}
      <div className="bg-gray-50 border-b border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FA5D00] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-xs sm:text-sm">Free Shipping</div>
              <div className="text-[11px] text-gray-500">Dhaka & all 64 districts in Bangladesh</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-xs sm:text-sm">90-Day Free Return</div>
              <div className="text-[11px] text-gray-500">Easy refunds & zero hassle guarantee</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-xs sm:text-sm">Purchase Protection</div>
              <div className="text-[11px] text-gray-500">100% genuine products with warranty</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-xs sm:text-sm">Secure Payment</div>
              <div className="text-[11px] text-gray-500">bKash, Nagad, Visa & Cash on Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Links */}
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand & About */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FA5D00] flex items-center justify-center text-white font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="font-display font-black text-xl text-[#FA5D00]">BD SHOP</span>
          </div>

          <p className="text-gray-500 text-xs leading-relaxed max-w-sm">
            Bangladesh's premier high-conversion e-commerce platform inspired by the world-class shopping experience of Temu. Enjoy lightning flash deals, verified electronics, and 1-click Steadfast courier delivery.
          </p>

          <div className="pt-2 text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#FA5D00]" />
              <span>Plot 12, Gulshan-2, Dhaka-1212, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#FA5D00]" />
              <span>+880 1711-892341 (WhatsApp 24/7)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#FA5D00]" />
              <span>support@bdshop.com.bd</span>
            </div>
          </div>
        </div>

        {/* Customer Service */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
            Customer Service
          </h4>
          <ul className="space-y-1.5 text-xs text-gray-500">
            <li><a href="#lightning-deals" className="hover:text-[#FA5D00]">Lightning Deals</a></li>
            <li><a href="#catalog" className="hover:text-[#FA5D00]">Order Tracking</a></li>
            <li><a href="#catalog" className="hover:text-[#FA5D00]">Return Policy</a></li>
            <li><a href="#catalog" className="hover:text-[#FA5D00]">Shipping Info</a></li>
            <li><a href="#catalog" className="hover:text-[#FA5D00]">Price Adjustment</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
            Top Categories
          </h4>
          <ul className="space-y-1.5 text-xs text-gray-500">
            <li><a href="#catalog" className="hover:text-[#FA5D00]">Smartphones & Tech</a></li>
            <li><a href="#catalog" className="hover:text-[#FA5D00]">Audio & Earbuds</a></li>
            <li><a href="#catalog" className="hover:text-[#FA5D00]">Smartwatches</a></li>
            <li><a href="#catalog" className="hover:text-[#FA5D00]">Computing Accessories</a></li>
            <li><a href="#catalog" className="hover:text-[#FA5D00]">Smart Home & Living</a></li>
          </ul>
        </div>

        {/* Admin & Security */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
            System & Admin
          </h4>
          <ul className="space-y-1.5 text-xs text-gray-500">
            <li>
              <button
                onClick={() => setIsAdminMode(true)}
                className="text-[#FA5D00] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            </li>
            <li><span className="text-gray-400">Facebook Pixel & CAPI</span></li>
            <li><span className="text-gray-400">Steadfast Courier API</span></li>
            <li><span className="text-gray-400">Instant Sync Engine</span></li>
          </ul>
        </div>
      </div>

      {/* 3. Payment Methods & Courier Partners Badges */}
      <div className="bg-gray-100/70 border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="font-bold text-gray-700">Courier Partners:</span>
            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 font-bold text-red-600">Steadfast</span>
            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 font-bold text-rose-600">Pathao</span>
            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 font-bold text-orange-600">RedX</span>
            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 font-bold text-blue-600">Paperfly</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="font-bold text-gray-700">Payment:</span>
            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 font-bold text-pink-600">bKash</span>
            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 font-bold text-amber-600">Nagad</span>
            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 font-bold text-blue-700">VISA</span>
            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 font-bold text-red-500">Mastercard</span>
            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 font-bold text-emerald-700">COD</span>
          </div>
        </div>
      </div>

      {/* 4. Copyright */}
      <div className="py-4 text-center text-[11px] text-gray-400 border-t border-gray-200">
        © 2026 BD SHOP Inc. All rights reserved. Designed with Temu-style high performance e-commerce architecture.
      </div>
    </footer>
  );
};
