import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Tag,
  Activity,
  Code2,
  Truck,
  Radio,
  Layout,
  Gift,
  X
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
  const { products, orders, coupons, courierSettings, pixelSettings, systemHealth } = useEcommerce();

  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'confirmed').length;

  const navItems = [
    {
      id: 'overview' as AdminTab,
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'products' as AdminTab,
      label: 'Catalog & Products',
      icon: Package,
      badge: products.length
    },
    {
      id: 'orders' as AdminTab,
      label: 'Orders & Fulfillment',
      icon: ShoppingBag,
      badge: pendingOrders > 0 ? pendingOrders : null,
      badgeColor: 'bg-cyan-500 text-slate-950'
    },
    {
      id: 'couriers' as AdminTab,
      label: 'Steadfast & Couriers',
      icon: Truck,
      badge: courierSettings.consignments.length > 0 ? `${courierSettings.consignments.length} Active` : '1-Click',
      badgeColor: 'bg-emerald-500 text-slate-950'
    },
    {
      id: 'pixels' as AdminTab,
      label: 'Pixel & Server CAPI',
      icon: Radio,
      badge: pixelSettings.capiEnabled ? 'CAPI ON' : null,
      badgeColor: 'bg-purple-500 text-white'
    },
    {
      id: 'spinning-wheel' as AdminTab,
      label: 'Spin & Win Wheel',
      icon: Gift,
      badge: 'Gifts & Coupons',
      badgeColor: 'bg-[#FA5D00] text-white'
    },
    {
      id: 'cms' as AdminTab,
      label: 'Homepage Content CMS',
      icon: Layout,
      badge: 'Live',
      badgeColor: 'bg-cyan-950 text-cyan-300 border border-cyan-800'
    },
    {
      id: 'inventory' as AdminTab,
      label: 'Inventory & Restock',
      icon: Layers,
      badge: lowStockCount > 0 ? `${lowStockCount} Alert` : null,
      badgeColor: 'bg-amber-500 text-slate-950'
    },
    {
      id: 'coupons' as AdminTab,
      label: 'Coupons & Campaigns',
      icon: Tag,
      badge: coupons.length
    },
    {
      id: 'system' as AdminTab,
      label: 'Cache & System Health',
      icon: Activity,
      badge: `${systemHealth.cacheHitRatio}% Hit`
    },
    {
      id: 'architecture' as AdminTab,
      label: 'Developer Hub & ZIP',
      icon: Code2,
      badge: 'OpenAPI'
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Mobile drawer header */}
      <div className="flex md:hidden items-center justify-between p-4 border-b border-slate-800">
        <span className="font-display font-bold text-white text-sm">Navigation Menu</span>
        <button
          onClick={onCloseMobile}
          className="p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-1 overflow-y-auto flex-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Management Controls
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    item.badgeColor || 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sync Health Snapshot at bottom of sidebar */}
      <div className="mt-auto p-4 border-t border-slate-900">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Sync Bus</span>
            <span className="text-emerald-400 font-mono font-semibold">Sub-Second</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Active PoPs</span>
            <span className="text-white font-mono">6 Edge Nodes</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Uptime</span>
            <span className="text-cyan-400 font-mono">99.98%</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-slate-800 flex-col shrink-0 min-h-[calc(100vh-61px)]">
        {sidebarContent}
      </aside>

      {/* Mobile Responsive Slide-Over Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-72 max-w-[85vw] h-full shadow-2xl">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={onCloseMobile} />
        </div>
      )}
    </>
  );
};
