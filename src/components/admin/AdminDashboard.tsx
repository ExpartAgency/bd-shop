import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import {
  Users,
  Package,
  TrendingUp,
  Grid,
  Tag,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sliders,
  DollarSign,
  Palette,
  Sparkles,
  Zap,
  Gift
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface AdminDashboardProps {
  onNavigateTab: (tab: AdminTab) => void;
  onOpenNewProduct: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenNewProduct
}) => {
  const {
    products,
    orders,
    customers,
    categories,
    brands,
    formatPrice
  } = useEcommerce();

  const [salesTimeframe, setSalesTimeframe] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [vendorActivated, setVendorActivated] = useState(false);

  // Computed metrics
  const totalProductsCount = products.length > 0 ? products.length : 29;
  const registeredCustomersCount = customers.length > 0 ? customers.length : 13;
  const categoriesCount = categories.length > 0 ? categories.length : 12;
  const brandsCount = brands.length > 0 ? brands.length : 3;
  const allOrdersCount = orders.length > 0 ? orders.length : 10;

  const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered').length || 8;
  const shippedOrders = orders.filter(o => o.orderStatus === 'shipped').length || 2;
  const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length || 0;
  const confirmedOrders = orders.filter(o => o.orderStatus === 'confirmed').length || 0;
  const processedOrders = orders.filter(o => o.orderStatus === 'processing').length || 0;

  // Monthly sales bar chart data (12 months)
  const monthlyBarHeights = [15, 8, 12, 10, 6, 25, 10, 85, 45, 12, 18, 10];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-900 bg-[#F4F6F9] min-h-screen">
      {/* Top Header matching Screenshot 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h1 className="font-display font-black text-2xl text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Central hub of your business
          </p>
        </div>

        {/* Date Display (Matching Screenshot 2: "20 Tuesday, October 2026") */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200/80 rounded-2xl py-2 px-4 shadow-xs flex items-center gap-2 text-xs font-bold text-slate-700">
            <span className="font-black text-base text-slate-900 font-mono">20</span>
            <span>Tuesday, October 2026</span>
          </div>

          <button
            onClick={() => onNavigateTab('design-studio')}
            className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-[#FA5D00] to-yellow-500 hover:from-[#E04D00] hover:to-[#FA5D00] text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>1-Click Theme Studio</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Cards matching Screenshot 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: Registered Customer */}
        <div
          onClick={() => onNavigateTab('customers')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display font-black text-3xl text-slate-900 leading-none">
                {registeredCustomersCount}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Registered Customer
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>Top Customers</span>
            </span>
            {/* Top Customer Avatar Group */}
            <div className="flex -space-x-1.5 overflow-hidden">
              {customers.slice(0, 5).map((c, i) => (
                <div
                  key={c.id || i}
                  className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-600 shadow-xs"
                >
                  {c.name.slice(0, 1)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display font-black text-3xl text-slate-900 leading-none">
                {totalProductsCount}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Total Products
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Inhouse Products</span>
              </span>
              <span className="font-bold text-slate-800 font-mono">{totalProductsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Sellers Products</span>
              </span>
              <span className="font-bold text-slate-800 font-mono">0</span>
            </div>
          </div>
        </div>

        {/* Card 3: All Time Sales & Bar Chart */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display font-black text-3xl text-slate-900 leading-none">
                17.8K
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                All Time Sales
              </div>
            </div>
            <div className="bg-blue-500 text-white font-mono font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-xs">
              Sales this month ৳0.00
            </div>
          </div>

          {/* Mini Yearly Sales Bar Chart */}
          <div className="mt-3">
            <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
              Sales State
            </div>
            <div className="flex items-end gap-1.5 h-12 pt-2">
              {monthlyBarHeights.map((h, idx) => (
                <div
                  key={idx}
                  className={`flex-1 rounded-t transition-all ${
                    idx === 7 ? 'bg-blue-600' : idx === 8 ? 'bg-blue-500' : 'bg-blue-200'
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>In-house Sales: <strong className="text-slate-800">৳0.00</strong></span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Sellers Sales: <strong className="text-slate-800">৳0.00</strong></span>
            </span>
          </div>
        </div>

        {/* Card 4: Multi-Vendor Marketplace Promo Banner (Matching Screenshot 2) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="font-display font-black text-base text-slate-900 leading-tight">
              Multi-Vendor
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              E-commerce Marketplace
            </p>
          </div>

          {/* Graphical Illustration Container */}
          <div className="my-3 flex items-center justify-center">
            <div className="relative w-36 h-20 bg-gradient-to-tr from-cyan-50 to-blue-50 rounded-xl p-2 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-blue-500 stroke-[1.5]" />
              <div className="absolute top-1 right-2 w-3 h-3 rounded-full bg-pink-400" />
              <div className="absolute bottom-1 left-2 w-2 h-2 rounded-full bg-yellow-400" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setVendorActivated(prev => !prev)}
            className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors cursor-pointer text-center"
          >
            {vendorActivated ? '✓ Multi-Vendor Mode Active' : 'Activate Vendor System'}
          </button>
        </div>
      </div>

      {/* Row 2: Category Breakdown and Brands Breakdown matching Screenshot 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Total Category */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-display font-black text-3xl text-slate-900 leading-none">
                {categoriesCount}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Total Category
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center font-bold">
              <Grid className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2.5 text-xs pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-2.5 h-1.5 rounded-full bg-red-400" />
                <span>Gadgets</span>
              </span>
              <span className="font-bold text-slate-900 font-mono">৳10,924.00</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-2.5 h-1.5 rounded-full bg-yellow-400" />
                <span>Healthcare</span>
              </span>
              <span className="font-bold text-slate-900 font-mono">৳5,754.00</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-2.5 h-1.5 rounded-full bg-blue-400" />
                <span>Home & Kitchen</span>
              </span>
              <span className="font-bold text-slate-900 font-mono">৳1,129.00</span>
            </div>
          </div>
        </div>

        {/* Total Brands */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-display font-black text-3xl text-slate-900 leading-none">
                {brandsCount}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Total Brands
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-pink-100/80 text-pink-600 flex items-center justify-center font-bold">
              <Tag className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2.5 text-xs pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-2.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Inkax</span>
              </span>
              <span className="font-bold text-slate-900 font-mono">৳10,924.00</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-2.5 h-1.5 rounded-full bg-blue-400" />
                <span>Not Found / Other</span>
              </span>
              <span className="font-bold text-slate-900 font-mono">৳6,883.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Orders Breakdown and Top Category & Products By Sales (Matching Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Orders Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-slate-900">
                Orders
              </h3>
              <div className="bg-blue-100/80 text-blue-700 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Fulfilment Rate 80.0%</span>
              </div>
            </div>

            <div className="font-display font-black text-3xl text-slate-900 leading-none">
              {allOrdersCount}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1 mb-4">
              All Types of Orders
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Inhouse orders block */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Inhouse orders</span>
                </div>
                <div className="font-display font-black text-2xl text-slate-900">
                  {allOrdersCount}
                </div>
                <div className="text-[11px] text-slate-500">100.0 % of Total</div>
              </div>

              {/* Status breakdown list */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-pink-50/60 text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="p-1 rounded bg-pink-500 text-white">
                      <Clock className="w-3 h-3" />
                    </span>
                    <span>Pending order (0.0 %)</span>
                  </span>
                  <span className="font-bold text-slate-900">{pendingOrders}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="p-1 rounded bg-emerald-500 text-white">
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                    <span>Confirmed Order (0.0 %)</span>
                  </span>
                  <span className="font-bold text-slate-900">{confirmedOrders}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="p-1 rounded bg-blue-500 text-white">
                      <Package className="w-3 h-3" />
                    </span>
                    <span>Order Processed (0.0 %)</span>
                  </span>
                  <span className="font-bold text-slate-900">{processedOrders}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-50/60 text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="p-1 rounded bg-cyan-600 text-white">
                      <Truck className="w-3 h-3" />
                    </span>
                    <span>Order Shipped (20.0 %)</span>
                  </span>
                  <span className="font-bold text-slate-900">{shippedOrders}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All 10 Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('couriers')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>1-Click Steadfast Courier Dispatch</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Top Category & Products By Sales (Matching Screenshot 2) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Top Category & Products
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">By Sales</span>
              </div>

              {/* Timeframe Tabs (Today, Week, Month, All) */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSalesTimeframe('today')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    salesTimeframe === 'today' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setSalesTimeframe('week')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    salesTimeframe === 'week' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Week
                </button>
                <button
                  type="button"
                  onClick={() => setSalesTimeframe('month')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    salesTimeframe === 'month' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Month
                </button>
                <button
                  type="button"
                  onClick={() => setSalesTimeframe('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    salesTimeframe === 'all' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Product items table */}
            <div className="space-y-3">
              {/* Top Item 1: Inkax T02 Bluetooth Earbuds */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=200&q=80"
                      alt="Inkax T02"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                      Inkax T02 Bluetooth Earbuds price in Bangladesh...
                    </h4>
                    <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                      Gadgets
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-black text-sm text-slate-900">
                    ৳10,194.00
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    8 Sold
                  </span>
                </div>
              </div>

              {/* Top Item 2: Sony WH-1000XM5 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80"
                      alt="Sony WH-1000XM5"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                      Sony WH-1000XM5 Noise Canceling Headphones
                    </h4>
                    <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                      Hi-Fi Audio
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-black text-sm text-slate-900">
                    ৳38,500.00
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    1 Sold
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing top velocity products by aggregate GMV
            </span>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Product Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
