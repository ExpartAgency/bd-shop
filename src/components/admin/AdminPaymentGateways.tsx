import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  Save,
  AlertTriangle,
  Zap,
  DollarSign
} from 'lucide-react';

export const AdminPaymentGateways: React.FC = () => {
  const { paymentGatewaySettings, updatePaymentGatewaySettings } = useEcommerce();

  const [bkashEnabled, setBkashEnabled] = useState(paymentGatewaySettings.bkashEnabled);
  const [bkashNumber, setBkashNumber] = useState(paymentGatewaySettings.bkashNumber);
  const [bkashAccountType, setBkashAccountType] = useState(paymentGatewaySettings.bkashAccountType);

  const [nagadEnabled, setNagadEnabled] = useState(paymentGatewaySettings.nagadEnabled);
  const [nagadNumber, setNagadNumber] = useState(paymentGatewaySettings.nagadNumber);
  const [nagadAccountType, setNagadAccountType] = useState(paymentGatewaySettings.nagadAccountType);

  const [cardEnabled, setCardEnabled] = useState(paymentGatewaySettings.cardEnabled);
  const [codEnabled, setCodEnabled] = useState(paymentGatewaySettings.codEnabled);
  const [requireVerification, setRequireVerification] = useState(
    paymentGatewaySettings.requireOnlinePaymentVerification
  );

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentGatewaySettings({
      bkashEnabled,
      bkashNumber: bkashNumber.trim(),
      bkashAccountType,
      nagadEnabled,
      nagadNumber: nagadNumber.trim(),
      nagadAccountType,
      cardEnabled,
      codEnabled,
      requireOnlinePaymentVerification: requireVerification
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {savedToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-bounce-slow">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>Payment Gateway & Anti-Fraud Settings Saved Successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 font-black border border-cyan-800">
              <CreditCard className="w-5 h-5" />
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Payment Gateways & Anti-Fraud Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure bKash, Nagad, Visa/Mastercard and enforce strict payment verification to prevent unpaid orders.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Gateway Configurations</span>
        </button>
      </div>

      {/* Anti-Fraud Notice */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-bold text-amber-300">
            Payment Validation Policy ("Pay na kore order" Prevention)
          </div>
          <p className="text-slate-300 leading-relaxed">
            When enabled, customers choosing bKash or Nagad MUST enter a verified Transaction ID (TrxID) and sender mobile number before the order can be placed. Fake orders or unverified checkouts are automatically blocked.
          </p>
          <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={requireVerification}
              onChange={e => setRequireVerification(e.target.checked)}
              className="rounded text-cyan-500 focus:ring-cyan-500"
            />
            <span className="font-bold text-white">
              Strictly Require Transaction ID (TrxID) Verification on Checkout
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* bKash Gateway Settings */}
        <div className="rounded-3xl bg-slate-900 border border-pink-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center font-black text-sm">
                bK
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">bKash Payment Gateway</h3>
                <span className="text-[11px] text-pink-400 font-mono">Instant Mobile Settlement</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={bkashEnabled}
                onChange={e => setBkashEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                bKash Receiving Number
              </label>
              <input
                type="tel"
                value={bkashNumber}
                onChange={e => setBkashNumber(e.target.value)}
                placeholder="01712-345678"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Account Type
              </label>
              <select
                value={bkashAccountType}
                onChange={e => setBkashAccountType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:border-pink-500 focus:outline-none cursor-pointer"
              >
                <option value="Merchant">Merchant Account (0% cash-out fee)</option>
                <option value="Personal">Personal Account (Send Money)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Nagad Gateway Settings */}
        <div className="rounded-3xl bg-slate-900 border border-amber-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-sm">
                ন
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Nagad Digital Payment</h3>
                <span className="text-[11px] text-amber-400 font-mono">Postal Service Digital Pay</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={nagadEnabled}
                onChange={e => setNagadEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Nagad Receiving Number
              </label>
              <input
                type="tel"
                value={nagadNumber}
                onChange={e => setNagadNumber(e.target.value)}
                placeholder="01812-345678"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Account Type
              </label>
              <select
                value={nagadAccountType}
                onChange={e => setNagadAccountType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="Merchant">Merchant Payment Account</option>
                <option value="Personal">Personal Account</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visa / Mastercard SSLCOMMERZ */}
        <div className="rounded-3xl bg-slate-900 border border-blue-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                💳
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">SSLCOMMERZ Cards</h3>
                <span className="text-[11px] text-blue-400 font-mono">Visa, Mastercard, Amex, CityTouch</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={cardEnabled}
                onChange={e => setCardEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed">
            SSLCOMMERZ multi-card payment gateway with 3D Secure 2.0 authorization. Supports local Bangladeshi debit and credit cards with instant tokenization.
          </div>
        </div>

        {/* Cash on Delivery */}
        <div className="rounded-3xl bg-slate-900 border border-emerald-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                💵
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Cash on Delivery (COD)</h3>
                <span className="text-[11px] text-emerald-400 font-mono">Steadfast & Pathao Collection</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={e => setCodEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed">
            Allow customers to pay cash directly to the Steadfast / Pathao delivery rider. Orders are tagged as unpaid until courier remits the collected cash to your merchant ledger.
          </div>
        </div>
      </div>
    </div>
  );
};
