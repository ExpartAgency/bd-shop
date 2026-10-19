import React from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Zap,
  Clock,
  ExternalLink
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
    formatPrice,
    updateOrderStatus,
    syncEvents,
    flushCache
  } = useEcommerce();

  // Financial statistics
  const grossRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUnitsSold = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0),
    0
  );
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

  // Payment Breakdown
  const paymentMethodCounts = orders.reduce((acc, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + o.total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Executive Command & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time sales tracking, atomic inventory locks, and sub-second edge replication.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewProduct}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>Create New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Gross Revenue</span>
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-white font-mono">
            {formatPrice(grossRevenue)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs previous 30 days</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Fulfilled Orders</span>
            <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-white font-mono">
            {orders.length}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {totalUnitsSold} total catalog units dispatched
          </div>
        </div>

        {/* Catalog Items */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Published Catalog</span>
            <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-white font-mono">
            {products.length}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {products.filter(p => p.isPublished).length} live on customer storefront
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 shadow-sm relative overflow-hidden group cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Low Stock Alerts</span>
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-amber-400 font-mono">
            {lowStockProducts.length}
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-400 mt-2 font-medium">
            <span>Review & restock warehouse</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Middle Row: Payment Settlements & Recent Sync Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Channels Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-display font-bold text-sm text-white">
            Settlement by Payment Method
          </h3>

          <div className="space-y-3 text-xs">
            {['bkash', 'nagad', 'card', 'cod'].map(method => {
              const amount = paymentMethodCounts[method] || 0;
              const percent = grossRevenue > 0 ? Math.round((amount / grossRevenue) * 100) : 0;

              return (
                <div key={method} className="space-y-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="uppercase font-semibold tracking-wider font-mono">
                      {method}
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">
                      {formatPrice(amount)} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-Time Sync Stream */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-bold text-sm text-white">
                Live Synchronization Event Stream
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Auto-invalidating Edge Cache
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {syncEvents.slice(0, 6).map(evt => (
              <div
                key={evt.id}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span className="font-mono text-[10px] font-bold text-cyan-300 uppercase shrink-0">
                    {evt.type}
                  </span>
                  <span className="text-slate-300 truncate text-[11px]">{evt.message}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {evt.latencyMs}ms
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-bold text-sm text-white">
              Recent Fulfillment Orders
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({orders.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Order Ref</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Zone & Gateway</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Fulfillment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {o.orderNumber}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-200">{o.customerName}</div>
                    <div className="text-[11px] text-slate-400">{o.city}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="capitalize text-slate-300">{o.shippingZone.replace('_', ' ')}</div>
                    <div className="text-[10px] uppercase font-mono text-cyan-400">{o.paymentMethod}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {formatPrice(o.total)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <select
                      value={o.orderStatus}
                      onChange={e => updateOrderStatus(o.id, e.target.value as any)}
                      className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-medium cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
