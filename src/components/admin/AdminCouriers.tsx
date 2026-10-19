import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { CourierConsignment } from '../../types';
import {
  Truck,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';

export const AdminCouriers: React.FC = () => {
  const { courierSettings, updateCourierSettings, orders, dispatchOrderToCourier, formatPrice } = useEcommerce();

  const [steadfastKey, setSteadfastKey] = useState(courierSettings.steadfastApiKey);
  const [steadfastSecret, setSteadfastSecret] = useState(courierSettings.steadfastSecretKey);
  const [steadfastEnabled, setSteadfastEnabled] = useState(courierSettings.steadfastEnabled);

  const [pathaoClient, setPathaoClient] = useState(courierSettings.pathaoClientId);
  const [pathaoSecret, setPathaoSecret] = useState(courierSettings.pathaoSecret);
  const [pathaoStore, setPathaoStore] = useState(courierSettings.pathaoStoreId);
  const [pathaoEnabled, setPathaoEnabled] = useState(courierSettings.pathaoEnabled);

  const [redxToken, setRedxToken] = useState(courierSettings.redxToken);
  const [redxEnabled, setRedxEnabled] = useState(courierSettings.redxEnabled);

  const [defaultCourier, setDefaultCourier] = useState(courierSettings.defaultCourier);
  const [notification, setNotification] = useState<string | null>(null);

  // Manual 1-click test dispatch dialog
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || '');
  const [selectedCourierForDispatch, setSelectedCourierForDispatch] = useState<CourierConsignment['courier']>('Steadfast');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateCourierSettings({
      steadfastApiKey: steadfastKey.trim(),
      steadfastSecretKey: steadfastSecret.trim(),
      steadfastEnabled,
      pathaoClientId: pathaoClient.trim(),
      pathaoSecret: pathaoSecret.trim(),
      pathaoStoreId: pathaoStore.trim(),
      pathaoEnabled,
      redxToken: redxToken.trim(),
      redxEnabled,
      defaultCourier
    });
    setNotification('Courier gateway credentials saved and active!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOneClickDispatch = () => {
    if (!selectedOrderId) return;
    const res = dispatchOrderToCourier(selectedOrderId, selectedCourierForDispatch);
    setNotification(res.message);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-cyan-400" />
            <span>Steadfast & Bangladesh Courier Gateway Integrations</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automate parcel booking, generate consignment barcodes, and track courier cash-on-delivery settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Default Courier:</span>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold text-xs font-mono">
            {courierSettings.defaultCourier}
          </span>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1-Click Dispatch Quick Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-800/50 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <Zap className="w-4 h-4" />
          <span>1-Click Order Parcel Booking & Dispatch</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="w-full sm:w-1/2 text-xs">
            <label className="text-slate-300 block mb-1 font-semibold">Select Order to Dispatch:</label>
            <select
              value={selectedOrderId}
              onChange={e => setSelectedOrderId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
            >
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  {o.orderNumber} — {o.customerName} ({formatPrice(o.total)}) [{o.orderStatus.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-1/4 text-xs">
            <label className="text-slate-300 block mb-1 font-semibold">Courier Provider:</label>
            <select
              value={selectedCourierForDispatch}
              onChange={e => setSelectedCourierForDispatch(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
            >
              <option value="Steadfast">Steadfast Courier</option>
              <option value="Pathao">Pathao Express</option>
              <option value="RedX">RedX Logistics</option>
              <option value="Paperfly">Paperfly Delivery</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleOneClickDispatch}
            className="w-full sm:w-auto self-end bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-500/20 whitespace-nowrap"
          >
            Push to {selectedCourierForDispatch} API
          </button>
        </div>
      </div>

      {/* Courier Provider API Configs */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Steadfast Courier Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Steadfast Courier API (portal.steadfast.com.bd)</h3>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={steadfastEnabled}
                  onChange={e => setSteadfastEnabled(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500"
                />
                <span className="text-[11px] text-emerald-400 font-semibold">Active</span>
              </label>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">API Key</label>
                <input
                  type="text"
                  value={steadfastKey}
                  onChange={e => setSteadfastKey(e.target.value)}
                  placeholder="stdf_live_api_..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Secret Key</label>
                <input
                  type="password"
                  value={steadfastSecret}
                  onChange={e => setSteadfastSecret(e.target.value)}
                  placeholder="stdf_sec_..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="text-[11px] text-slate-500 pt-1">
                Endpoint: <code>https://portal.steadfast.com.bd/api/v1/create_order</code> (Instant tracking code generation).
              </div>
            </div>
          </div>

          {/* Pathao Logistics Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Pathao Logistics BD (merchant.pathao.com)</h3>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pathaoEnabled}
                  onChange={e => setPathaoEnabled(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500"
                />
                <span className="text-[11px] text-emerald-400 font-semibold">Active</span>
              </label>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Client ID</label>
                <input
                  type="text"
                  value={pathaoClient}
                  onChange={e => setPathaoClient(e.target.value)}
                  placeholder="pth_client_..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Client Secret</label>
                <input
                  type="password"
                  value={pathaoSecret}
                  onChange={e => setPathaoSecret(e.target.value)}
                  placeholder="pth_sec_..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Store / Warehouse ID</label>
                <input
                  type="text"
                  value={pathaoStore}
                  onChange={e => setPathaoStore(e.target.value)}
                  placeholder="DHAKA_MAIN_STORE_101"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Primary Default Courier:</span>
            <select
              value={defaultCourier}
              onChange={e => setDefaultCourier(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
            >
              <option value="Steadfast">Steadfast Courier</option>
              <option value="Pathao">Pathao Logistics</option>
              <option value="RedX">RedX Logistics</option>
              <option value="Paperfly">Paperfly</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            Save Gateway Credentials
          </button>
        </div>
      </form>

      {/* Dispatched Consignments Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-white">
            Active Bangladesh Consignments ({courierSettings.consignments.length})
          </h3>
          <span className="text-xs text-slate-400">Real-time status synchronized with courier endpoints</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Order Ref</th>
                <th className="py-2.5 px-3">Courier Provider</th>
                <th className="py-2.5 px-3">Consignment ID / Tracking</th>
                <th className="py-2.5 px-3">Customer & Phone</th>
                <th className="py-2.5 px-3">COD to Collect</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {courierSettings.consignments.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-white font-bold">{c.orderNumber}</td>
                  <td className="py-2.5 px-3 text-cyan-300 font-semibold">{c.courier}</td>
                  <td className="py-2.5 px-3">
                    <div className="text-white font-bold">{c.trackingCode}</div>
                    <div className="text-[10px] text-slate-400">{c.consignmentId}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="text-slate-200">{c.customerName}</div>
                    <div className="text-[10px] text-slate-400">{c.customerPhone}</div>
                  </td>
                  <td className="py-2.5 px-3 text-white">
                    {c.amountToCollect > 0 ? formatPrice(c.amountToCollect) : 'Prepaid'}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {c.status.replace('_', ' ')}
                    </span>
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
