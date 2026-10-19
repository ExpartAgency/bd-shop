import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Product } from '../../types';
import {
  X,
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Clock,
  ExternalLink,
  Trash2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onTrackOrder: (orderNumber: string) => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onTrackOrder
}) => {
  if (!isOpen) return null;

  const { orders, wishlist, publishedProducts, formatPrice, toggleWishlist, addToCart } =
    useEcommerce();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses'>('orders');

  const wishlistedProducts = publishedProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 text-gray-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FA5D00] to-[#FF7A00] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              SR
            </div>
            <div>
              <h2 className="font-display font-black text-base sm:text-lg text-gray-900 leading-tight">
                Sheikh Rafiqul Islam
              </h2>
              <span className="text-[11px] text-gray-500 font-medium">
                rafiqul.islam@dhakatech.com • BD VIP Member
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-white text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-[#FA5D00] text-[#FA5D00]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'wishlist'
                ? 'border-[#FA5D00] text-[#FA5D00]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Items ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'addresses'
                ? 'border-[#FA5D00] text-[#FA5D00]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  No orders placed yet. Grab something from today's flash sale!
                </div>
              ) : (
                orders.map(order => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-3 hover:border-orange-200 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200/60 text-xs">
                      <div>
                        <span className="font-mono font-bold text-gray-900">
                          {order.orderNumber}
                        </span>
                        <div className="text-[11px] text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="bg-orange-100 text-[#FA5D00] font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                          {order.orderStatus}
                        </span>
                        <button
                          onClick={() => {
                            onClose();
                            onTrackOrder(order.orderNumber);
                          }}
                          className="text-[#FA5D00] hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span>Track Courier</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {order.items.map(item => (
                        <div key={`${item.productId}-${item.variantId || 'std'}`} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700 truncate max-w-xs">
                            {item.quantity}x {item.title}
                          </span>
                          <span className="font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        Via {order.trackingCourier || 'Steadfast Courier'}
                      </span>
                      <span className="font-black text-sm text-[#FA5D00]">
                        Total: {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="space-y-3">
              {wishlistedProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  Your wishlist is empty. Tap the heart on products you love!
                </div>
              ) : (
                wishlistedProducts.map(p => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3"
                  >
                    <div
                      onClick={() => {
                        onClose();
                        onSelectProduct(p);
                      }}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      <img
                        src={p.primaryImage}
                        alt={p.title}
                        className="w-12 h-12 rounded-lg object-cover bg-white shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-bold text-xs text-gray-900 truncate">{p.title}</div>
                        <div className="text-[#FA5D00] font-bold text-xs mt-0.5">
                          {formatPrice(p.price)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          addToCart(p, 1);
                        }}
                        className="bg-[#FA5D00] hover:bg-[#E04D00] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Default Delivery Address (Dhaka)</span>
                  <span className="bg-[#FA5D00] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    DEFAULT
                  </span>
                </div>
                <p className="text-gray-600">House 42, Road 11, Block D, Banani, Dhaka-1213</p>
                <p className="text-gray-500 text-[11px]">Phone: +880 1711-892341</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Office / Tech Hub Address</span>
                  <span className="text-[10px] text-gray-400">SECONDARY</span>
                </div>
                <p className="text-gray-600">Level 8, Concord Tower, Gulshan-1, Dhaka-1212</p>
                <p className="text-gray-500 text-[11px]">Phone: +880 1912-334455</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
