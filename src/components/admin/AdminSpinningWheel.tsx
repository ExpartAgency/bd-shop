import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { SpinningWheelPrize } from '../../types';
import {
  Gift,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCw,
  Sliders,
  DollarSign,
  Truck,
  Percent,
  Tag,
  Palette,
  Eye,
  AlertCircle
} from 'lucide-react';

export const AdminSpinningWheel: React.FC = () => {
  const { spinningWheelSettings, updateSpinningWheelSettings } = useEcommerce();

  const [enabled, setEnabled] = useState(spinningWheelSettings.enabled);
  const [title, setTitle] = useState(spinningWheelSettings.title);
  const [subtitle, setSubtitle] = useState(spinningWheelSettings.subtitle);
  const [buttonText, setButtonText] = useState(spinningWheelSettings.buttonText);
  const [floatingButtonEnabled, setFloatingButtonEnabled] = useState(
    spinningWheelSettings.floatingButtonEnabled
  );
  const [maxSpinsPerUser, setMaxSpinsPerUser] = useState(spinningWheelSettings.maxSpinsPerUser);
  const [autoOpenOnFirstVisit, setAutoOpenOnFirstVisit] = useState(
    spinningWheelSettings.autoOpenOnFirstVisit
  );
  const [prizes, setPrizes] = useState<SpinningWheelPrize[]>(spinningWheelSettings.prizes);

  // New prize draft state
  const [isAddingPrize, setIsAddingPrize] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<'coupon' | 'free_shipping' | 'free_gift' | 'no_win'>('coupon');
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newDiscountValue, setNewDiscountValue] = useState(250);
  const [newGiftItemName, setNewGiftItemName] = useState('');
  const [newColor, setNewColor] = useState('#FA5D00');
  const [newProbability, setNewProbability] = useState(15);
  const [newDescription, setNewDescription] = useState('');

  const [savedToast, setSavedToast] = useState(false);
  const [simulatedWinner, setSimulatedWinner] = useState<SpinningWheelPrize | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSpinningWheelSettings({
      enabled,
      title: title.trim(),
      subtitle: subtitle.trim(),
      buttonText: buttonText.trim(),
      floatingButtonEnabled,
      maxSpinsPerUser,
      autoOpenOnFirstVisit,
      prizes
    });

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleAddPrize = () => {
    if (!newLabel.trim()) return;

    const newPrize: SpinningWheelPrize = {
      id: `prize_${Date.now()}`,
      label: newLabel.trim().toUpperCase(),
      type: newType,
      couponCode: newCouponCode.trim() ? newCouponCode.trim().toUpperCase() : undefined,
      discountValue: newType === 'coupon' ? Number(newDiscountValue) : undefined,
      giftItemName: newType === 'free_gift' ? newGiftItemName.trim() : undefined,
      color: newColor,
      textColor: '#FFFFFF',
      probability: Number(newProbability) || 10,
      description:
        newDescription.trim() ||
        (newType === 'coupon'
          ? `Special discount voucher of ৳${newDiscountValue}`
          : newType === 'free_shipping'
          ? 'Free courier delivery anywhere in Bangladesh'
          : newType === 'free_gift'
          ? `Free Gift: ${newGiftItemName}`
          : 'Better luck on your next spin!')
    };

    setPrizes(prev => [...prev, newPrize]);
    setIsAddingPrize(false);
    setNewLabel('');
    setNewCouponCode('');
    setNewGiftItemName('');
    setNewDescription('');
  };

  const handleDeletePrize = (id: string) => {
    if (prizes.length <= 2) {
      alert('The spinning wheel must contain at least 2 prize slices.');
      return;
    }
    setPrizes(prev => prev.filter(p => p.id !== id));
  };

  const handleTestSimulator = () => {
    const totalWeight = prizes.reduce((s, p) => s + (p.probability || 10), 0);
    let rand = Math.random() * totalWeight;
    let chosen = prizes[0];

    for (const p of prizes) {
      rand -= p.probability || 10;
      if (rand <= 0) {
        chosen = p;
        break;
      }
    }

    setSimulatedWinner(chosen);
    setTimeout(() => setSimulatedWinner(null), 4000);
  };

  const totalProbabilities = prizes.reduce((sum, p) => sum + (p.probability || 0), 0);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Gift className="w-6 h-6 text-[#FA5D00]" />
            <span>Spin & Win Wheel (Prizes, Gifts & Coupons Manager)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure the customer Lucky Spinning Wheel, customize prize slices, discount vouchers, free gift bundles, and probability weights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTestSimulator}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCw className="w-4 h-4 text-cyan-400" />
            <span>Test Simulator Spin</span>
          </button>

          <button
            onClick={handleSave}
            className="bg-[#FA5D00] hover:bg-[#E04D00] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-[#FA5D00]/25 transition-all cursor-pointer"
          >
            Save & Publish Changes
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Spinning Wheel settings published to live storefront!</span>
        </div>
      )}

      {simulatedWinner && (
        <div className="p-4 rounded-xl bg-orange-950/90 border border-orange-500/60 text-xs text-white flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <div>
              <span className="font-bold text-yellow-300">Simulator Winning Result: </span>
              <strong>{simulatedWinner.label}</strong> ({simulatedWinner.type.toUpperCase()})
              {simulatedWinner.couponCode && (
                <span className="ml-2 font-mono bg-black/40 px-2 py-0.5 rounded text-orange-300">
                  Code: {simulatedWinner.couponCode}
                </span>
              )}
            </div>
          </div>
          <span className="text-[11px] text-slate-400">Calculated from configured weights</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 1. General Wheel Settings */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <Sliders className="w-4 h-4 text-[#FA5D00]" />
              <span>General Game & Wheel Behavior</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={e => setEnabled(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-[#FA5D00] focus:ring-[#FA5D00]"
              />
              <span className="font-semibold text-slate-300">Enable Spinning Wheel on Storefront</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Modal Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-[#FA5D00] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Sub-heading / Offer text</label>
              <input
                type="text"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-[#FA5D00] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Center Button Label</label>
              <input
                type="text"
                value={buttonText}
                onChange={e => setButtonText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-[#FA5D00] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Max Daily Free Spins per Visitor
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={maxSpinsPerUser}
                onChange={e => setMaxSpinsPerUser(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-[#FA5D00] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-6 border-t border-slate-800/80">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={floatingButtonEnabled}
                onChange={e => setFloatingButtonEnabled(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-[#FA5D00] focus:ring-[#FA5D00]"
              />
              <span className="text-slate-300">Show Floating "🎁 Spin & Win" badge on Storefront</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoOpenOnFirstVisit}
                onChange={e => setAutoOpenOnFirstVisit(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-[#FA5D00] focus:ring-[#FA5D00]"
              />
              <span className="text-slate-300">Auto-popup on new customer landing</span>
            </label>
          </div>
        </div>

        {/* 2. Prize Slices & Probability Table */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Palette className="w-4 h-4 text-[#FA5D00]" />
                <span>Wheel Prize Slices & Probabilities ({prizes.length} Slices)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Total weight sum: <strong className="text-cyan-400">{totalProbabilities}%</strong>. Slices are drawn sequentially on the wheel.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingPrize(prev => !prev)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Prize Slice</span>
            </button>
          </div>

          {/* Add Prize Form */}
          {isAddingPrize && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3">
              <div className="font-bold text-cyan-400 text-xs">New Prize Slice Configuration</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Slice Label</label>
                  <input
                    type="text"
                    placeholder="e.g. ৳300 OFF, FREE GIFT"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Prize Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="coupon">Discount Coupon Voucher</option>
                    <option value="free_shipping">Free Courier Shipping</option>
                    <option value="free_gift">Free Physical Gift Bundle</option>
                    <option value="no_win">Better Luck Next Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Coupon Code to Reward</label>
                  <input
                    type="text"
                    placeholder="e.g. SPIN300"
                    value={newCouponCode}
                    onChange={e => setNewCouponCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                {newType === 'coupon' && (
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Discount Value (৳)</label>
                    <input
                      type="number"
                      value={newDiscountValue}
                      onChange={e => setNewDiscountValue(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                )}

                {newType === 'free_gift' && (
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Gift Item Name</label>
                    <input
                      type="text"
                      placeholder="e.g. AirPods Protective Case"
                      value={newGiftItemName}
                      onChange={e => setNewGiftItemName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Slice Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColor}
                      onChange={e => setNewColor(e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={newColor}
                      onChange={e => setNewColor(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Winning Probability Weight</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newProbability}
                    onChange={e => setNewProbability(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingPrize(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddPrize}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold cursor-pointer"
                >
                  Add Slice to Wheel
                </button>
              </div>
            </div>
          )}

          {/* Slices Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-mono">
                  <th className="p-3">Color</th>
                  <th className="p-3">Slice Label</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Coupon / Gift Details</th>
                  <th className="p-3">Win Weight</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {prizes.map((prize, idx) => (
                  <tr key={prize.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-full border border-white/20 shrink-0 shadow-sm"
                          style={{ backgroundColor: prize.color }}
                        />
                        <span className="font-mono text-[10px] text-slate-400">{prize.color}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-white text-xs">{prize.label}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{prize.description}</div>
                    </td>

                    <td className="p-3">
                      <span className="bg-slate-800 text-cyan-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                        {prize.type.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-xs">
                      {prize.couponCode ? (
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-[#FA5D00]" />
                          <span className="font-bold text-white">{prize.couponCode}</span>
                          {prize.discountValue && (
                            <span className="text-emerald-400 text-[10px]">
                              (-৳{prize.discountValue})
                            </span>
                          )}
                        </div>
                      ) : prize.giftItemName ? (
                        <div className="text-emerald-400 flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5" />
                          <span>{prize.giftItemName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">None</span>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className="bg-cyan-400 h-full rounded-full"
                            style={{ width: `${Math.min(100, prize.probability * 2.5)}%` }}
                          />
                        </div>
                        <span className="font-bold text-white text-xs">{prize.probability}%</span>
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeletePrize(prize.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete slice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
};
