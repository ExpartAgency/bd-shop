import React, { useState, useEffect } from 'react';
import { EcommerceProvider, useEcommerce } from './context/EcommerceContext';
import { StoreHeader } from './components/storefront/StoreHeader';
import { StoreHero } from './components/storefront/StoreHero';
import { StoreCatalog } from './components/storefront/StoreCatalog';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { OrderTrackingModal } from './components/storefront/OrderTrackingModal';
import { CustomerAccountModal } from './components/storefront/CustomerAccountModal';
import { StoreFooter } from './components/storefront/StoreFooter';
import { WhatsAppButton } from './components/storefront/WhatsAppButton';
import { PwaInstallModal } from './components/common/PwaInstallModal';

// Admin Components
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminSidebar, AdminTab } from './components/admin/AdminSidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminInventory } from './components/admin/AdminInventory';
import { AdminCouriers } from './components/admin/AdminCouriers';
import { AdminPixels } from './components/admin/AdminPixels';
import { AdminHomepageCMS } from './components/admin/AdminHomepageCMS';
import { AdminCoupons } from './components/admin/AdminCoupons';
import { AdminSystem } from './components/admin/AdminSystem';
import { AdminArchitectureHub } from './components/admin/AdminArchitectureHub';

import { Product, Order } from './types';
import {
  Zap,
  ShoppingBag,
  Home,
  Grid,
  Heart,
  MessageCircle,
  Truck,
  ArrowRight,
  Flame,
  User,
  Download
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    isAdminMode,
    setIsAdminMode,
    syncEvents,
    products,
    cartCount,
    wishlist,
    addToCart,
    homepageSettings,
    trackPixelEvent
  } = useEcommerce();

  // Storefront modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');

  // PWA deferred prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Admin tab & mobile drawer state
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('overview');
  const [isMobileAdminSidebarOpen, setIsMobileAdminSidebarOpen] = useState(false);

  // Live Toast notification for background sync events
  const [latestSyncToast, setLatestSyncToast] = useState<string | null>(null);

  // Listen for PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Track PageView on load
  useEffect(() => {
    trackPixelEvent(
      'PageView',
      {
        page_title: document.title,
        page_location: window.location.href
      },
      'browser_pixel'
    );
  }, [trackPixelEvent]);

  useEffect(() => {
    if (syncEvents.length > 0) {
      const latest = syncEvents[0];
      setLatestSyncToast(`${latest.type}: ${latest.message}`);
      const timer = setTimeout(() => setLatestSyncToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [syncEvents]);

  // Handle URL hash /admin routing support
  useEffect(() => {
    if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
      setIsAdminMode(true);
    }
  }, [setIsAdminMode]);

  const handleDirectCheckout = (product: Product, quantity: number, variantId?: string) => {
    addToCart(product, quantity, variantId);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (order: Order) => {
    setTrackingOrderNumber(order.orderNumber);
  };

  const handleTrackFromAccount = (orderNumber: string) => {
    setTrackingOrderNumber(orderNumber);
    setIsTrackingOpen(true);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    trackPixelEvent('ViewContent', {
      content_name: product.title,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'BDT'
    });
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans pb-16 md:pb-0 ${
        isAdminMode
          ? 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950'
          : 'bg-[#F6F6F6] text-gray-900 selection:bg-[#FA5D00] selection:text-white'
      }`}
    >
      {/* Real-time Edge Synchronization Toast Notification */}
      {latestSyncToast && (
        <div className="fixed bottom-20 md:bottom-5 right-4 md:right-5 z-50 max-w-sm p-3.5 rounded-xl bg-gray-900/95 border border-[#FA5D00]/50 shadow-2xl backdrop-blur-md text-xs text-white flex items-center gap-2.5 animate-fadeIn">
          <div className="p-1.5 rounded-lg bg-[#FA5D00] text-white shrink-0">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[#FFD200] text-[10px] uppercase font-mono tracking-wider">
              Sub-Second Synchronization
            </div>
            <div className="text-[11px] text-gray-200 truncate mt-0.5">{latestSyncToast}</div>
          </div>
        </div>
      )}

      {/* Conditionally Render: Admin Panel OR Temu-Style Customer Storefront */}
      {isAdminMode ? (
        <div className="flex-1 flex flex-col bg-slate-950 text-slate-100">
          <AdminHeader onToggleMobileMenu={() => setIsMobileAdminSidebarOpen(true)} />
          <div className="flex-1 flex overflow-hidden">
            <AdminSidebar
              activeTab={activeAdminTab}
              onSelectTab={setActiveAdminTab}
              isOpenMobile={isMobileAdminSidebarOpen}
              onCloseMobile={() => setIsMobileAdminSidebarOpen(false)}
            />
            <main className="flex-1 overflow-y-auto bg-slate-950 min-h-[calc(100vh-61px)]">
              {activeAdminTab === 'overview' && (
                <AdminDashboard
                  onNavigateTab={setActiveAdminTab}
                  onOpenNewProduct={() => setActiveAdminTab('products')}
                />
              )}
              {activeAdminTab === 'products' && <AdminProducts />}
              {activeAdminTab === 'orders' && <AdminOrders />}
              {activeAdminTab === 'inventory' && <AdminInventory />}
              {activeAdminTab === 'couriers' && <AdminCouriers />}
              {activeAdminTab === 'pixels' && <AdminPixels />}
              {activeAdminTab === 'cms' && <AdminHomepageCMS />}
              {activeAdminTab === 'coupons' && <AdminCoupons />}
              {activeAdminTab === 'system' && <AdminSystem />}
              {activeAdminTab === 'architecture' && <AdminArchitectureHub />}
            </main>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Customer Storefront Header (Temu Style) */}
          <StoreHeader
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWishlist={() => setIsAccountOpen(true)}
            onOpenTracking={() => setIsTrackingOpen(true)}
            onOpenAccount={() => setIsAccountOpen(true)}
            onOpenInstall={() => setIsInstallModalOpen(true)}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={slug => setSelectedCategorySlug(slug)}
          />

          <main className="flex-1">
            <StoreHero
              onSelectCategory={slug => setSelectedCategorySlug(slug)}
              onSelectProduct={handleSelectProduct}
            />

            <StoreCatalog
              onSelectProduct={handleSelectProduct}
              selectedCategorySlug={selectedCategorySlug}
              onClearCategoryFilter={() => setSelectedCategorySlug('all')}
            />
          </main>

          <StoreFooter />

          {/* Floating WhatsApp Quick Inquirer Button */}
          <WhatsAppButton />

          {/* Mobile Bottom Navigation Bar (Temu App Style on Phones) */}
          <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 border-t border-gray-200 backdrop-blur-md flex items-center justify-around py-2 px-1 md:hidden shadow-lg">
            <a
              href="#"
              className="flex flex-col items-center gap-1 text-[10px] text-[#FA5D00] font-bold"
            >
              <Home className="w-5 h-5 stroke-[2.2]" />
              <span>Home</span>
            </a>

            <a
              href="#catalog"
              className="flex flex-col items-center gap-1 text-[10px] text-gray-500 hover:text-black font-medium"
            >
              <Grid className="w-5 h-5" />
              <span>Categories</span>
            </a>

            <a
              href="#lightning-deals"
              className="flex flex-col items-center gap-1 text-[10px] text-red-500 hover:text-red-600 font-bold"
            >
              <Flame className="w-5 h-5 fill-current" />
              <span>Deals</span>
            </a>

            <button
              onClick={() => setIsAccountOpen(true)}
              className="relative flex flex-col items-center gap-1 text-[10px] text-gray-500 hover:text-black font-medium cursor-pointer"
            >
              <Heart className="w-5 h-5" />
              <span>Saved</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FA5D00] text-[9px] font-bold text-white font-mono shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex flex-col items-center gap-1 text-[10px] text-gray-500 hover:text-black font-medium cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FA5D00] text-[9px] font-black text-white font-mono shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsAccountOpen(true)}
              className="flex flex-col items-center gap-1 text-[10px] text-gray-500 hover:text-black font-medium cursor-pointer"
            >
              <User className="w-5 h-5" />
              <span>You</span>
            </button>
          </div>

          {/* Interactive Modals */}
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onDirectCheckout={handleDirectCheckout}
          />

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onProceedToCheckout={() => setIsCheckoutOpen(true)}
          />

          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onOrderCompleted={handleOrderCompleted}
          />

          <OrderTrackingModal
            isOpen={isTrackingOpen}
            onClose={() => setIsTrackingOpen(false)}
            initialOrderNumber={trackingOrderNumber}
          />

          <CustomerAccountModal
            isOpen={isAccountOpen}
            onClose={() => setIsAccountOpen(false)}
            onTrackOrder={handleTrackFromAccount}
            onSelectProduct={handleSelectProduct}
          />

          <PwaInstallModal
            isOpen={isInstallModalOpen}
            onClose={() => setIsInstallModalOpen(false)}
            deferredPrompt={deferredPrompt}
            onInstalled={() => setDeferredPrompt(null)}
          />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <EcommerceProvider>
      <MainAppContent />
    </EcommerceProvider>
  );
}
