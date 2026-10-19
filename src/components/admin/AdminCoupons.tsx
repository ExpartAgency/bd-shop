import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Coupon } from '../../types';
import { Plus, Tag, CheckCircle2, X } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const { coupons, createCoupon, formatPrice } = useEcommerce();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(15);
  const [minSpend, setMinSpend] = useState(5000);
  const [maxDiscount, setMaxDiscount] = useState(2500);
  const [usageLimit, setUsageLimit] = useState(500);
  const [description, setDescription] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    createCoupon({
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minSpend: Number(minSpend),
      maxDiscount: type === 'percentage' ? Number(maxDiscount) : undefined,
      expiresAt: '2026-12-31T23:59:59.000Z',
      usageLimit: Number(usageLimit),
      isActive: true,
      description: description.trim() || `${value}% discount for loyal shoppers`
    });

    setIsModalOpen(false);
    setCode('');
    setDescription('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Coupons & Promotional Campaigns
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage promotional percentage and flat discount vouchers with minimum spend rules and redemption quotas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount Type & Value</th>
                <th className="py-3 px-4">Min. Spend Rule</th>
                <th className="py-3 px-4">Redemptions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Campaign Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {coupons.map(coupon => (
                <tr key={coupon.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-mono font-bold text-white text-sm">
                        {coupon.code}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono font-semibold text-cyan-300">
                      {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `৳${coupon.value} FLAT`}
                    </span>
                    {coupon.maxDiscount && (
                      <div className="text-[10px] text-slate-500 font-mono">
                        Capped at ৳{coupon.maxDiscount}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-300">
                    ৳{coupon.minSpend.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="text-white font-bold">{coupon.usedCount}</span>
                    <span className="text-slate-500"> / {coupon.usageLimit}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                    {coupon.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <h2 className="font-display font-bold text-sm text-white">Create New Coupon</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH25"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed BDT (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={e => setValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Min Spend (৳)</label>
                  <input
                    type="number"
                    required
                    value={minSpend}
                    onChange={e => setMinSpend(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Max Discount Cap (৳)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={e => setMaxDiscount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Campaign Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15% off during Eid flash sale on electronics"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl shadow cursor-pointer"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
