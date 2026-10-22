import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Layers,
  Tag,
  Activity,
  Code2,
  Truck,
  Radio,
  Layout,
  Gift,
  Palette,
  CreditCard,
  BarChart3,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Sparkles,
  X,
  ShieldCheck
} from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'inventory'
  | 'couriers'
  | 'pixels'
  | 'spinning-wheel'
  | 'cms'
  | 'design-studio'
  | 'customers'
  | 'payment-gateways'
  | 'reports'
  | 'coupons'
  | 'system'
  | 'architecture';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const {
    products,
    orders,
    coupons,
    customers,
    courierSettings,
    pixelSettings,
    currentTheme
  } = useEcommerce();

  // Collapsible section state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    product: true,
    orders: true,
    users: true,
    marketing: true,
    content: true,
    integrations: true,
    settings: true
  });

  const toggleSection = (sec: string) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const pendingOrders = orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'confirmed').length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0A1024] border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand & Mobile Close */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FA5D00] to-yellow-400 flex items-center justify-center font-display font-black text-slate-950 text-sm shadow-md">
              BD
            </div>
            <div>
              <span className="font-display font-black text-sm text-white tracking-tight">
                BD SHOP
              </span>
              <span className="block text-[10px] text-slate-400 font-mono">
                Enterprise Admin
              </span>
            </div>
          </div>
          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Categories matching Screenshot 2 */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
          {/* Dashboard Quick Tab */}
          <div>
            <button
              onClick={() => {
                onSelectTab('overview');
                onCloseMobile?.();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Dashboard</span>
              </span>
            </button>
          </div>

          {/* 1. PRODUCT MANAGEMENT */}
          <div className="space-y-1">
            <div
              onClick={() => toggleSection('product')}
              className="flex items-center justify-between px-2 text-[10px] font-mono uppercase font-bold text-slate-400 hover:text-slate-200 cursor-pointer py-1"
            >
              <span>Product Management</span>
              {openSections.product ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
            {openSections.product && (
              <div className="space-y-0.5 pt-0.5">
                <button
                  onClick={() => {
                    onSelectTab('products');
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'products' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    <span>Products & Catalog</span>
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                    {products.length}
                  </span>
                </button>
                <button
                  onClick={() => {
                    onSelectTab('inventory');
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'inventory' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Inventory & Stock</span>
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 2. ORDERS & SALES */}
          <div className="space-y-1">
            <div
              onClick={() => toggleSection('orders')}
              className="flex items-center justify-between px-2 text-[10px] font-mono uppercase font-bold text-slate-400 hover:text-slate-200 cursor-pointer py-1"
            >
              <span>Orders & Sales</span>
              {openSections.orders ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
            {openSections.orders && (
              <div className="space-y-0.5 pt-0.5">
                <button
                  onClick={() => {
                    onSelectTab('orders');
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'orders' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sales & Orders</span>
                  </span>
                  {pendingOrders > 0 && (
                    <span className="text-[9px] bg-cyan-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full font-mono">
                      {pendingOrders}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    onSelectTab('couriers');
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'couriers' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Steadfast & Couriers</span>
                  </span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1 rounded font-mono">
                    1-Click
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 3. USERS */}
          <div className="space-y-1">
            <div
              onClick={() => toggleSection('users')}
              className="flex items-center justify-between px-2 text-[10px] font-mono uppercase font-bold text-slate-400 hover:text-slate-200 cursor-pointer py-1"
            >
              <span>Users</span>
              {openSections.users ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
            {openSections.users && (
              <div className="space-y-0.5 pt-0.5">
                <button
                  onClick={() => {
                    onSelectTab('customers');
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'customers' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>Customers</span>
                  </span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono">
                    {customers.length}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 4. MARKETING & PROMOTIONS */}
          <div className="space-y-1">
            <div
              onClick={() => toggleSection('marketing')}
              className="flex items-center justify-between px-2 text-[10px] font-mono uppercase font-bold text-slate-400 hover:text-slate-200 cursor-pointer py-1"
            >
              <span>Marketing & Promotions</span>
              {openSections.marketing ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
            {openSections.marketing && (
              <div className="space-y-0.5 pt-0.5">
                <button
                  onClick={() => {
                    onSelectTab('spinning-wheel');
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'spinning-wheel' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Gift className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Lucky Spinning Wheel</span>
                  </span>
                  <span className="text-[9px] bg-yellow-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full font-mono">
                    Gifts & Code
                  </span>
                </button>
                <button
                  onClick={() => {
                    onSelectTab('coupons');
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'coupons' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Promotion & Offers</span>
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                    {coupons.length}
                  </span>
                </button>
                <button
                  onClick={() => {
                    onSelectTab('pixels');
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'pixels' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-purple-400" />
                    <span>Marketing Analytics & Pixels</span>
                  </span>
                  <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800 px-1 rounded font-mono">
                    CAPI
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 5. CONTENT & DESIGN */}
          <div className="space-y-1">
            <div
              onClick={() => toggleSection('content')}
              className="flex items-center justify-between px-2 text-[10px] font-mono uppercase font-bold text-slate-400 hover:text-slate-200 cursor-pointer py-1"
            >
              <span>Content & Design</span>
              {openSections.content ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
            {openSections.content && (
              <div className="space-y-0.5 pt-0.5">
                <button
                  onClick={() => {
                    onSelectTab('design-studio');
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'design-studio' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-[#FA5D00]" />
                    <span>Design Studio (Themes)</span>
                  </span>
                  <span className="text-[9px] bg-orange-950 text-orange-300 border border-orange-800 px-1 rounded font-mono">
                    1-Click
                  </span>
                </button>
                <button
                  onClick={() => {
                    onSelectTab('cms');
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'cms' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layout className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Homepage Content CMS</span>
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 6. INTEGRATIONS */}
          <div className="space-y-1">
            <div
              onClick={() => toggleSection('integrations')}
              className="flex items-center justify-between px-2 text-[10px] font-mono uppercase font-bold text-slate-400 hover:text-slate-200 cursor-pointer py-1"
            >
              <span>Integrations</span>
              {openSections.integrations ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
            {openSections.integrations && (
              <div className="space-y-0.5 pt-0.5">
                <button
                  onClick={() => {
                    onSelectTab('payment-gateways');
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'payment-gateways' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-pink-400" />
                    <span>Payment Gateways</span>
                  </span>
                  <span className="text-[9px] bg-pink-950 text-pink-300 border border-pink-800 px-1 rounded font-mono">
                    bKash/Nagad
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 7. SETTINGS */}
          <div className="space-y-1">
            <div
              onClick={() => toggleSection('settings')}
              className="flex items-center justify-between px-2 text-[10px] font-mono uppercase font-bold text-slate-400 hover:text-slate-200 cursor-pointer py-1"
            >
              <span>Settings</span>
              {openSections.settings ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
            {openSections.settings && (
              <div className="space-y-0.5 pt-0.5">
                <button
                  onClick={() => {
                    onSelectTab('system');
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'system' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-slate-400" />
                    <span>System & Health</span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    onSelectTab('architecture');
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'architecture' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Developer Hub & ZIP</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="font-mono">Theme: {currentTheme.name.split(' ')[0]}</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>
      </aside>
    </>
  );
};
