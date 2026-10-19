import React from 'react';
import { Download, X, Smartphone, CheckCircle2, Share2, PlusSquare } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstalled: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalled
}) => {
  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        onInstalled();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 p-6 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black font-display text-sm">
              BD
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white">Install BD SHOP App</h3>
              <p className="text-[11px] text-slate-400">Fast 1-tap shopping on phone & desktop</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Instant launch directly from mobile home screen</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Offline catalog browsing and sub-second caching</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Real-time courier order tracking push alerts</span>
          </div>
        </div>

        {/* If native deferred prompt is available */}
        {deferredPrompt ? (
          <button
            onClick={handleNativeInstall}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Install BD SHOP Application</span>
          </button>
        ) : (
          /* Instructions for iOS and manual installation */
          <div className="space-y-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>How to add to Mobile Home Screen:</span>
            </div>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-start gap-2">
                <span className="font-mono text-cyan-400 font-bold">1.</span>
                <span>On <strong>iPhone (Safari)</strong>: Tap the <strong>Share</strong> button at the bottom of the screen, then select <strong>Add to Home Screen</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-cyan-400 font-bold">2.</span>
                <span>On <strong>Android (Chrome)</strong>: Tap the three dots (⋮) in the top-right corner, then select <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
