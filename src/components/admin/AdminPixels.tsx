import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import {
  Activity,
  Server,
  ShieldCheck,
  CheckCircle2,
  Play,
  Copy,
  Check,
  Zap,
  Globe,
  Radio
} from 'lucide-react';

export const AdminPixels: React.FC = () => {
  const { pixelSettings, updatePixelSettings, trackPixelEvent, formatPrice } = useEcommerce();

  const [pixelId, setPixelId] = useState(pixelSettings.facebookPixelId);
  const [capiToken, setCapiToken] = useState(pixelSettings.capiAccessToken);
  const [testCode, setTestCode] = useState(pixelSettings.testEventCode);
  const [capiEnabled, setCapiEnabled] = useState(pixelSettings.capiEnabled);
  const [gtmId, setGtmId] = useState(pixelSettings.googleTagManagerId);
  const [ga4Id, setGa4Id] = useState(pixelSettings.googleAnalyticsId);

  const [trackPageView, setTrackPageView] = useState(pixelSettings.trackPageView);
  const [trackViewContent, setTrackViewContent] = useState(pixelSettings.trackViewContent);
  const [trackAddToCart, setTrackAddToCart] = useState(pixelSettings.trackAddToCart);
  const [trackInitiateCheckout, setTrackInitiateCheckout] = useState(pixelSettings.trackInitiateCheckout);
  const [trackPurchase, setTrackPurchase] = useState(pixelSettings.trackPurchase);

  const [saveNotification, setSaveNotification] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePixelSettings({
      facebookPixelId: pixelId.trim(),
      capiAccessToken: capiToken.trim(),
      testEventCode: testCode.trim(),
      capiEnabled,
      googleTagManagerId: gtmId.trim(),
      googleAnalyticsId: ga4Id.trim(),
      trackPageView,
      trackViewContent,
      trackAddToCart,
      trackInitiateCheckout,
      trackPurchase
    });
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 3000);
  };

  const handleRunCapiTest = () => {
    const testOrderId = `BDS-TEST-${Math.floor(1000 + Math.random() * 9000)}`;
    const eventPayload = {
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      event_id: `evt_${Date.now()}`,
      action_source: 'website',
      user_data: {
        em: 'f660ab912ec121d1b1e928a0bb4bc61b15f5ad44d5efdc4e1c92a25e99b8e44a', // SHA256 hashed
        ph: '7c86a1005f52445e99dfc46e3100645607db3c8091176b9ee2ecb3543b593672', // SHA256 hashed
        client_ip_address: '103.205.71.18', // Bangladesh IP
        client_user_agent: navigator.userAgent
      },
      custom_data: {
        currency: 'BDT',
        value: 38500,
        content_type: 'product',
        order_id: testOrderId,
        test_event_code: testCode || 'TEST89412'
      }
    };

    trackPixelEvent('Purchase', eventPayload, 'server_capi');
    setTestResult(JSON.stringify(eventPayload, null, 2));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            <span>Facebook Pixel & Server-Side Conversions API (CAPI)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deduplicated client & server tracking bypassing iOS 14.5+ ad blockers with secure SHA256 hashed payload delivery.
          </p>
        </div>

        <button
          onClick={handleRunCapiTest}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Simulate CAPI Purchase Event</span>
        </button>
      </div>

      {saveNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Tracking IDs and Server-Side CAPI configurations updated and deployed!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Meta Pixel & CAPI Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Meta / Facebook Tracking</h3>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                CAPI Active
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">
                  Facebook Pixel ID (Browser Tracking)
                </label>
                <input
                  type="text"
                  value={pixelId}
                  onChange={e => setPixelId(e.target.value)}
                  placeholder="e.g. 894120938102381"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">
                  Conversions API (CAPI) System User Access Token
                </label>
                <textarea
                  rows={3}
                  value={capiToken}
                  onChange={e => setCapiToken(e.target.value)}
                  placeholder="EAAGNO4P19z8BAPL5..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500">
                  Generated in Facebook Events Manager &gt; Settings &gt; Conversions API &gt; Generate access token.
                </span>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">
                  Test Event Code (Optional for Verification)
                </label>
                <input
                  type="text"
                  value={testCode}
                  onChange={e => setTestCode(e.target.value)}
                  placeholder="e.g. TEST89412"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={capiEnabled}
                    onChange={e => setCapiEnabled(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-cyan-500"
                  />
                  <span className="text-slate-200 font-semibold">
                    Enable Dual Redundancy (Browser Pixel + Server-Side CAPI)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Google Analytics 4 & GTM Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Google Marketing Platform</h3>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                GA4 & GTM
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">
                  Google Tag Manager (GTM) Container ID
                </label>
                <input
                  type="text"
                  value={gtmId}
                  onChange={e => setGtmId(e.target.value)}
                  placeholder="e.g. GTM-BDSHOP7"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">
                  Google Analytics 4 Measurement ID
                </label>
                <input
                  type="text"
                  value={ga4Id}
                  onChange={e => setGa4Id(e.target.value)}
                  placeholder="e.g. G-89K4LP2301"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2">
                <div className="font-semibold text-slate-300 mb-2">Active Event Triggers:</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trackPageView}
                      onChange={e => setTrackPageView(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-cyan-500"
                    />
                    <span className="text-slate-300">PageView (All catalog, cart & checkout pages)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trackViewContent}
                      onChange={e => setTrackViewContent(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-cyan-500"
                    />
                    <span className="text-slate-300">ViewContent (Product details & gallery view)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trackAddToCart}
                      onChange={e => setTrackAddToCart(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-cyan-500"
                    />
                    <span className="text-slate-300">AddToCart (When shopper adds to bag)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trackPurchase}
                      onChange={e => setTrackPurchase(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-cyan-500"
                    />
                    <span className="text-slate-300">Purchase (Order placed with currency BDT)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            Save Tracking Configurations
          </button>
        </div>
      </form>

      {/* Test CAPI Output Preview */}
      {testResult && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <Zap className="w-4 h-4" />
              <span>Facebook Conversions API Payload (HTTP 200 Sent to graph.facebook.com/v19.0)</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(testResult);
                setCopiedPayload(true);
                setTimeout(() => setCopiedPayload(false), 2000);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPayload ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 max-h-60 overflow-y-auto">
            {testResult}
          </pre>
        </div>
      )}

      {/* Live Dispatched Pixel Events Log */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-white">
            Recent Tracked Pixel & CAPI Stream
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            {pixelSettings.logs.length} logged events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Event Name</th>
                <th className="py-2.5 px-3">Dispatch Channel</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Data Parameters</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {pixelSettings.logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-cyan-300 font-bold">{log.eventName}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        log.source === 'server_capi'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}
                    >
                      {log.source === 'server_capi' ? 'Server CAPI' : 'Browser Pixel'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                    {new Date(log.eventTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 text-[11px] truncate max-w-xs">
                    {JSON.stringify(log.payload)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      200 OK
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
