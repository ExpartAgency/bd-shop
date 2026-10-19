import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Heart, ShoppingBag, Star, Check, Zap, Flame } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { formatPrice, addToCart, toggleWishlist, isWishlisted, trackPixelEvent } = useEcommerce();
  const [isAdded, setIsAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = addToCart(product, 1);
    if (result.success) {
      setIsAdded(true);
      trackPixelEvent('AddToCart', {
        content_name: product.title,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'BDT'
      });
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.stock <= 0;

  // Fake sold counter for Temu-style social proof
  const soldCount = Math.floor(product.price % 300) + 120;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white hover:bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-orange-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-200 cursor-pointer select-none"
    >
      {/* 1. Image Container with Temu Badges & Wishlist */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={product.primaryImage}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top-Left: Discount Badge (Temu Red/Orange Style) */}
        {product.discountPercent && product.discountPercent > 0 ? (
          <div className="absolute top-2 left-2 bg-[#FA5D00] text-white font-black text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md shadow-xs">
            -{product.discountPercent}%
          </div>
        ) : (
          <div className="absolute top-2 left-2 bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
            <Zap className="w-2.5 h-2.5 fill-current" />
            <span>DEAL</span>
          </div>
        )}

        {/* Top-Right: Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-xs transition-all cursor-pointer ${
            wishlisted
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/80 text-gray-500 hover:text-red-500 hover:bg-white shadow-xs'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Image Overlay: Sold Count / Stock Urgency (Temu Style) */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[9px] sm:text-[10px] pointer-events-none">
          {isOutOfStock ? (
            <span className="bg-gray-900/85 text-white px-1.5 py-0.5 rounded font-bold">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-red-600/90 text-white px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
              <Flame className="w-2.5 h-2.5 fill-current" /> Only {product.stock} left!
            </span>
          ) : (
            <span className="bg-black/60 backdrop-blur-xs text-white/95 px-1.5 py-0.5 rounded font-medium">
              🔥 {soldCount}+ sold
            </span>
          )}
        </div>
      </div>

      {/* 2. Card Body: Title, Rating, Temu Orange Price & Quick Cart Button */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          {/* Title (2 lines max) */}
          <h3 className="font-sans font-medium text-xs sm:text-sm text-gray-800 group-hover:text-[#FA5D00] transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Ratings & Brand */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-bold ml-0.5 text-gray-800 text-[10px] sm:text-[11px]">
                {product.rating}
              </span>
            </div>
            <span className="text-gray-400 text-[10px]">({product.reviewCount})</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] text-gray-500 truncate max-w-[80px]">{product.brand}</span>
          </div>
        </div>

        {/* Price & Cart Add Button */}
        <div className="pt-1 border-t border-gray-100 flex items-end justify-between gap-1">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {/* Bold Temu Orange Price */}
              <span className="font-black text-sm sm:text-base text-[#FA5D00] font-sans">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="line-through text-gray-400 text-[10px] sm:text-xs">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Free shipping tag */}
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span>🚚 Free Shipping</span>
            </div>
          </div>

          {/* Quick Add To Cart Button (Temu Style) */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2 rounded-full transition-all cursor-pointer shadow-xs shrink-0 ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-500 text-white scale-110'
                : 'bg-[#FA5D00] hover:bg-[#E04D00] text-white hover:scale-105 active:scale-95'
            }`}
            title="Add to Shopping Cart"
          >
            {isAdded ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
