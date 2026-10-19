import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import {
  LayoutDashboard,
  Store,
  RefreshCw,
  Bell,
  Shield,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileMenu }) => {
  const {
    currentRole,
    setCurrentRole,
    setIsAdminMode,
    flushCache,
    syncEvents
  } = useEcommerce();

  const [flushedNotification, setFlushedNotification] = useState(false);

  const handleFlushCache = () => {
    flushCache();
    setFlushedNotification(true);
    setTimeout(() => setFlushedNotification(false), 2500);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between">
        {/* Left: Mobile Menu + Brand & Live Sync Badge */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Open Admin Navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-slate-950 font-display shrink-0">
              BD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-white text-sm">
                  BD SHOP Management Core
                </span>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded uppercase font-bold">
                  v2.4
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Enterprise Multi-Channel Operations
              </div>
            </div>
          </div>

          {/* Live Sync Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Sub-Second Sync:</span>
            <span className="text-emerald-400 font-mono text-[11px]">Active</span>
          </div>
        </div>

        {/* Right: Actions, Role Selector & Return to Storefront */}
        <div className="flex items-center gap-3">
          {/* Flush Cache Button */}
          <button
            onClick={handleFlushCache}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Invalidate Redis & Cloudflare CDN Edge Cache"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${flushedNotification ? 'animate-spin' : ''}`} />
            <span>{flushedNotification ? 'Cache Purged!' : 'Purge Edge Cache'}</span>
          </button>

          {/* Role Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Role:</span>
            <select
              value={currentRole}
              onChange={e => setCurrentRole(e.target.value as any)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="super_admin" className="bg-slate-900">Super Admin</option>
              <option value="store_manager" className="bg-slate-900">Store Manager</option>
              <option value="inventory_auditor" className="bg-slate-900">Inventory Auditor</option>
            </select>
          </div>

          {/* Return to Customer Storefront */}
          <button
            onClick={() => setIsAdminMode(false)}
            className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Storefront View</span>
          </button>
        </div>
      </div>
    </header>
  );
};
