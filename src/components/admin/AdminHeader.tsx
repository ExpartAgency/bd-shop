import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import {
  Menu,
  ChevronDown,
  Plus,
  Globe,
  Activity,
  Bell,
  MessageCircle,
  Store,
  RefreshCw,
  Palette,
  CheckCircle2,
  X,
  ExternalLink
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  activeTab?: AdminTab;
  onSelectTab?: (tab: AdminTab) => void;
  onOpenNewProduct?: () => void;
  onToggleMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab = 'overview',
  onSelectTab,
  onOpenNewProduct,
  onToggleMobileMenu
}) => {
  const {
    setIsAdminMode,
    currency,
    toggleCurrency,
    syncEvents,
    currentTheme
  } = useEcommerce();

  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/80 px-4 sm:px-6 py-2.5 shadow-xs text-slate-800">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Hamburger + Quick Menu + Top Navigation Tabs (Matching Screenshot 2) */}
        <div className="flex items-center gap-2 sm:gap-4">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
              title="Open Admin Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Quick Menu Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsQuickMenuOpen(prev => !prev)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <span>Quick Menu</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isQuickMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs text-slate-700 animate-fadeIn"
                onClick={() => setIsQuickMenuOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 font-mono">
                  Quick Shortcuts
                </div>
                <button
                  onClick={() => onSelectTab?.('products')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2"
                >
                  <span>📦 Manage Products</span>
                </button>
                <button
                  onClick={() => onSelectTab?.('orders')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2"
                >
                  <span>🛍️ Sales & Orders</span>
                </button>
                <button
                  onClick={() => onSelectTab?.('spinning-wheel')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2"
                >
                  <span>🎁 Lucky Spinning Wheel</span>
                </button>
                <button
                  onClick={() => onSelectTab?.('design-studio')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2"
                >
                  <span>🎨 Design Studio Themes</span>
                </button>
                <button
                  onClick={() => onSelectTab?.('payment-gateways')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2"
                >
                  <span>💳 Payment Gateways</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => setIsAdminMode(false)}
                  className="w-full text-left px-3 py-2 text-[#FA5D00] font-bold hover:bg-orange-50 flex items-center gap-2"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>View Customer Storefront</span>
                </button>
              </div>
            )}
          </div>

          {/* Top Tabs (Matching Screenshot 2: Dashboard, Sales, Earnings, Design Studio) */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600">
            <button
              onClick={() => onSelectTab?.('overview')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-black'
                  : 'hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onSelectTab?.('orders')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-black'
                  : 'hover:text-slate-900'
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => onSelectTab?.('reports')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'reports'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-black'
                  : 'hover:text-slate-900'
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => onSelectTab?.('design-studio')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'design-studio'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-black'
                  : 'hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[#FA5D00]" />
              <span>Design Studio</span>
            </button>
          </nav>
        </div>

        {/* Right Actions: + Add New, Globe, Activity, Bell, Chat, Avatar (Matching Screenshot 2) */}
        <div className="flex items-center gap-2.5">
          {/* + Add New Button */}
          {onOpenNewProduct && (
            <button
              onClick={onOpenNewProduct}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
              <span>Add New</span>
            </button>
          )}

          {/* Currency / Globe toggle */}
          <button
            onClick={toggleCurrency}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Toggle Currency (BDT / USD)"
          >
            <Globe className="w-4 h-4" />
          </button>

          {/* Activity / Sync Indicator */}
          <button
            onClick={() => onSelectTab?.('system')}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer relative"
            title="System Synchronization Status"
          >
            <Activity className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(prev => !prev)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5 animate-pulse" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs text-slate-700 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold">
                  <span>Recent Sync Notifications</span>
                  <span className="text-[10px] text-blue-600 font-mono">Live Edge</span>
                </div>
                <div className="py-2 space-y-2 max-h-48 overflow-y-auto">
                  {syncEvents.slice(0, 4).map(evt => (
                    <div key={evt.id} className="p-2 rounded-lg bg-slate-50 text-[11px]">
                      <div className="font-bold text-slate-800">{evt.type}</div>
                      <div className="text-slate-600 truncate">{evt.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat Message Bubble */}
          <button
            onClick={() => onSelectTab?.('cms')}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Customer Inquiries & WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          {/* User Profile Avatar with Leaf / Plant Icon (Matching Screenshot 2) */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(prev => !prev)}
              className="flex items-center gap-1.5 cursor-pointer pl-1"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs border border-emerald-500">
                🌱
              </div>
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs text-slate-700 animate-fadeIn"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900">Administrator</div>
                  <div className="text-[11px] text-slate-500">expartagency@gmail.com</div>
                </div>
                <button
                  onClick={() => setIsAdminMode(false)}
                  className="w-full text-left px-4 py-2.5 text-[#FA5D00] font-bold hover:bg-orange-50 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    <span>Customer Storefront</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
