import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { MessageSquare, X, Send } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { homepageSettings } = useEcommerce();
  const [isOpenPrompt, setIsOpenPrompt] = useState(false);

  if (!homepageSettings.whatsappEnabled) return null;

  const cleanPhone = homepageSettings.whatsappNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(homepageSettings.whatsappWelcomeMessage);
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Interactive Popup Speech Bubble */}
      {isOpenPrompt && (
        <div className="mb-3 w-72 sm:w-80 rounded-2xl bg-slate-900 border border-emerald-500/40 p-4 shadow-2xl backdrop-blur-md animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-xs text-white">BD SHOP WhatsApp Support</span>
            </div>
            <button
              onClick={() => setIsOpenPrompt(false)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-2.5 text-xs text-slate-300 leading-relaxed">
            Need instant help with an order, product verification, or courier tracking? Chat with our Dhaka support agents.
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            <span>Start WhatsApp Chat</span>
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpenPrompt(prev => !prev)}
        className="group relative flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-bold p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105 cursor-pointer border border-emerald-300/40"
        title="Chat with BD SHOP on WhatsApp"
        aria-label="WhatsApp Support"
      >
        {/* WhatsApp Icon */}
        <svg
          className="w-6 h-6 text-slate-950 fill-current shrink-0"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.04-2.128-.553-1.832-.759-3.003-2.637-3.095-2.757-.091-.121-.739-.984-.739-1.876 0-.893.469-1.332.636-1.512.167-.181.365-.226.486-.226.122 0 .243.002.348.006.112.005.263-.042.411.314.152.366.516 1.258.562 1.349.045.091.076.197.015.318-.06.121-.091.196-.181.303-.091.106-.192.237-.274.318-.091.091-.186.19-.08.372.106.182.471.778 1.011 1.259.697.62 1.285.813 1.468.904.182.091.288.076.394-.045.106-.121.455-.53.576-.712.121-.182.243-.152.409-.091.167.061 1.061.5 1.243.591.182.091.303.136.348.212.046.076.046.439-.098.844zM12 2C6.477 2 2 6.477 2 12c0 1.891.526 3.662 1.439 5.178L2 22l4.981-1.308C8.423 21.545 10.15 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.154c-1.637 0-3.15-.466-4.437-1.272l-.318-.2-2.955.775.789-2.881-.207-.33A8.106 8.106 0 013.846 12c0-4.496 3.658-8.154 8.154-8.154s8.154 3.658 8.154 8.154-3.658 8.154-8.154 8.154z"/>
        </svg>

        <span className="hidden sm:inline font-mono text-xs uppercase tracking-wider font-extrabold text-slate-950">
          WhatsApp Support
        </span>

        {/* Pulse Dot */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
        </span>
      </button>
    </div>
  );
};
