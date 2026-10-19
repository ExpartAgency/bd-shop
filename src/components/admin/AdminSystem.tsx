import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import {
  Activity,
  RefreshCw,
  Database,
  Layers,
  Zap,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';

export const AdminSystem: React.FC = () => {
  const {
    cacheStats,
    flushCache,
    syncEvents,
    queueJobs,
    retryQueueJob,
    systemHealth,
    exportDatabaseBackup,
    restoreDatabaseBackup,
    resetToSampleData
  } = useEcommerce();

  const [notification, setNotification] = useState<string | null>(null);
  const [restoreInput, setRestoreInput] = useState('');
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);

  const handleFlushTag = (tag: string) => {
    flushCache(tag);
    setNotification(`Cache for tag [${tag}] purged across all 6 Edge PoPs!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseBackup();
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `bdshop-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePerformRestore = () => {
    if (!restoreInput.trim()) return;
    const res = restoreDatabaseBackup(restoreInput);
    if (res.success) {
      setNotification('Database state successfully restored from snapshot!');
      setIsRestoreOpen(false);
      setRestoreInput('');
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            System Health, Cache & Asynchronous Workers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Observe Redis cache hit ratios, inspect Cloudflare edge tags, and monitor queue workers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleFlushTag('all')}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Purge All Edge Cache</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Cluster Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Database Layer</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="font-bold text-white text-base">MySQL 8.0 (InnoDB)</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Row Locks: Active</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Redis Cache Hit Ratio</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span className="font-bold text-cyan-400 font-mono text-xl">{systemHealth.cacheHitRatio}%</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {cacheStats.hits} Hits · {cacheStats.misses} Misses
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Edge CDN (Cloudflare)</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="font-bold text-white text-base">6 Global PoPs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Tag Revalidation: ON</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Queue Worker Daemon</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white text-base">Active (Supervisor)</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {queueJobs.length} processed jobs
          </div>
        </div>
      </div>

      {/* Layered Cache Table & Tag Purges */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-sm text-white">
              Layered Redis & Edge CDN Key Index
            </h3>
            <p className="text-xs text-slate-400">
              Cached responses served with X-Cache: HIT headers to minimize MySQL load.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleFlushTag('products')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
            >
              Purge [products]
            </button>
            <button
              onClick={() => handleFlushTag('homepage')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
            >
              Purge [homepage]
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Cache Key</th>
                <th className="py-2.5 px-3">Purge Tag</th>
                <th className="py-2.5 px-3">TTL</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Cumulative Hits</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {cacheStats.keys.map((k, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-cyan-300 font-bold">{k.key}</td>
                  <td className="py-2.5 px-3 text-slate-400">[{k.tag}]</td>
                  <td className="py-2.5 px-3 text-white">{k.ttlSeconds}s</td>
                  <td className="py-2.5 px-3 text-slate-400">{(k.sizeBytes / 1024).toFixed(1)} KB</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{k.hits}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleFlushTag(k.tag)}
                      className="text-xs text-cyan-400 hover:text-white cursor-pointer"
                    >
                      Evict
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Queue Jobs Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-display font-bold text-sm text-white">
          Background Queue Daemon Workers (Redis Queue)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Job ID / Queue</th>
                <th className="py-2.5 px-3">Class Name</th>
                <th className="py-2.5 px-3">Payload Preview</th>
                <th className="py-2.5 px-3">Attempts</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {queueJobs.map(j => (
                <tr key={j.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono">
                    <div className="text-white font-bold">{j.id}</div>
                    <div className="text-[10px] text-cyan-400">{j.queue}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-300">
                    {j.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] font-mono truncate max-w-xs">
                    {JSON.stringify(j.payload)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">
                    {j.attempts} / {j.maxAttempts}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        j.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {j.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => retryQueueJob(j.id)}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      Re-run
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Backup & Disaster Recovery */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h3 className="font-display font-bold text-sm text-white">
            Database Snapshot & Disaster Recovery
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Export a full JSON snapshot of products, orders, coupons, reviews, and customers for emergency cold restore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadBackup}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download Database JSON Dump</span>
          </button>

          <button
            onClick={() => setIsRestoreOpen(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Restore from JSON Snapshot</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset catalog and orders to clean benchmark sample state?')) {
                resetToSampleData();
                setNotification('Catalog reset to clean initial seed benchmark!');
                setTimeout(() => setNotification(null), 3000);
              }
            }}
            className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-rose-400 text-xs px-4 py-2 rounded-xl border border-slate-800 transition-colors cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Benchmark Seed</span>
          </button>
        </div>

        {/* Restore dialog */}
        {isRestoreOpen && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 mt-3">
            <div className="text-xs font-semibold text-white">
              Paste JSON Snapshot to Restore:
            </div>
            <textarea
              rows={4}
              value={restoreInput}
              onChange={e => setRestoreInput(e.target.value)}
              placeholder='{"version": "1.0.0", "products": [...], ...}'
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsRestoreOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handlePerformRestore}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs"
              >
                Apply Snapshot
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
