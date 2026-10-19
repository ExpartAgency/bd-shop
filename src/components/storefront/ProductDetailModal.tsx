import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Product, ProductVariant } from '../../types';
import {
  X,
  Star,
  Check,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  Heart,
  Share2,
  Clock,
  MessageSquare,
  RotateCcw,
  Flame,
  Award
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onDirectCheckout: (product: Product, quantity: number, variantId?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onDirectCheckout
}) => {
  if (!product) return null;

  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isWishlisted,
    reviews,
    addReview,
    trackPixelEvent
  } = useEcommerce();

  const [activeImage, setActiveImage] = useState(product.primaryImage);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  const productReviews = reviews.filter(
    r => r.productId === product.id && r.status === 'approved'
  );

  const handleAddToCart = () => {
    const res = addToCart(product, quantity, selectedVariant?.id);
    if (res.success) {
      setAddedSuccess(true);
      trackPixelEvent('AddToCart', {
        content_name: product.title,
        content_ids: [product.id],
        content_type: 'product',
        value: currentPrice * quantity,
        currency: 'BDT'
      });
      setTimeout(() => setAddedSuccess(false), 2000);
    }
  };

  const handleBuyNow = () => {
    onDirectCheckout(product, quantity, selectedVariant?.id);
    trackPixelEvent('InitiateCheckout', {
      content_name: product.title,
      content_ids: [product.id],
      value: currentPrice * quantity,
      currency: 'BDT'
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    addReview({
      productId: product.id,
      customerName: reviewName,
      rating: reviewRating,
      title: reviewTitle || 'Verified Buyer',
      comment: reviewComment,
      verifiedPurchase: true
    });

    setReviewSubmitted(true);
    setReviewName('');
    setReviewComment('');
    setReviewTitle('');
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  // Gallery images list (primary + images array)
  const allImages = [product.primaryImage, ...(product.images || [])].filter(
    (img, index, self) => self.indexOf(img) === index
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 text-gray-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black shadow-md transition-all cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="md:col-span-6 p-4 sm:p-6 bg-gray-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100">
            <div>
              {/* Main Active Image with Badges */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-xs mb-3">
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />

                {product.discountPercent && (
                  <div className="absolute top-3 left-3 bg-[#FA5D00] text-white font-black text-xs px-2.5 py-1 rounded-md shadow-md">
                    -{product.discountPercent}% OFF
                  </div>
                )}

                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                  <Flame className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  <span>Selling Fast in Bangladesh</span>
                </div>
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden bg-white border-2 transition-all shrink-0 cursor-pointer ${
                        activeImage === img ? 'border-[#FA5D00] shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Temu Trust Badges Mini Banner */}
            <div className="mt-4 p-3 bg-orange-50/80 border border-orange-200/60 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-gray-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#FA5D00]" />
                <span>BD SHOP Buyer Purchase Protection</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                <div className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free Courier Shipping</span>
                </div>
                <div className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                  <span>90-Day Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Variants, Urgency & Add to Cart (7 cols) */}
          <div className="md:col-span-6 p-4 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Brand, Title & Social share */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="font-bold text-[#FA5D00] uppercase tracking-wider">
                    {product.brand} • SKU: {product.sku}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="p-1 rounded text-gray-400 hover:text-black cursor-pointer"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    {copiedLink && (
                      <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                    )}
                  </div>
                </div>

                <h2 className="font-display font-bold text-lg sm:text-xl text-gray-900 leading-snug">
                  {product.title}
                </h2>

                {/* Rating & Sold count */}
                <div className="flex items-center gap-3 mt-1.5 text-xs">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="font-bold ml-1 text-gray-900">{product.rating}</span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600 font-medium">
                    {product.reviewCount} Reviews
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                    Top Choice
                  </span>
                </div>
              </div>

              {/* Price Block (Temu Signature Look) */}
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#FA5D00]">
                    {formatPrice(currentPrice)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm line-through text-gray-400">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="bg-[#FA5D00] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      -{product.discountPercent}% OFF
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-600 mt-1 flex items-center gap-2">
                  <span className="text-emerald-700 font-semibold">✓ In Stock & Verified</span>
                  <span>•</span>
                  <span>Dispatched within 24h via Steadfast / Pathao</span>
                </div>
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-2 block">
                    Choose Option / Model:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          selectedVariant?.id === v.id
                            ? 'bg-[#FA5D00] text-white border-[#FA5D00] shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {v.name} - {formatPrice(v.price)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Counter */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={quantity >= currentStock}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold cursor-pointer disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-gray-500">
                  {currentStock > 0 ? `(${currentStock} available in stock)` : '(Out of Stock)'}
                </span>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now (Temu Style) */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={currentStock <= 0}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-orange-100 hover:bg-orange-200 text-[#FA5D00]'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={currentStock <= 0}
                  className="py-3 px-4 rounded-xl font-black text-xs sm:text-sm bg-[#FA5D00] hover:bg-[#E04D00] text-white flex items-center justify-center gap-1.5 shadow-md shadow-[#FA5D00]/30 transition-all cursor-pointer active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-current text-yellow-300" />
                  <span>Buy Now (1-Click)</span>
                </button>
              </div>

              {/* Secondary Navigation for Specifications & Reviews */}
              <div className="pt-3">
                <div className="flex border-b border-gray-200 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 px-3 border-b-2 cursor-pointer ${
                      activeTab === 'details'
                        ? 'border-[#FA5D00] text-[#FA5D00]'
                        : 'border-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2 px-3 border-b-2 cursor-pointer ${
                      activeTab === 'specs'
                        ? 'border-[#FA5D00] text-[#FA5D00]'
                        : 'border-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    Specs
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 px-3 border-b-2 cursor-pointer ${
                      activeTab === 'reviews'
                        ? 'border-[#FA5D00] text-[#FA5D00]'
                        : 'border-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    Reviews ({productReviews.length})
                  </button>
                </div>

                <div className="pt-3 text-xs text-gray-600">
                  {activeTab === 'details' && (
                    <div className="space-y-2 leading-relaxed">
                      <p>{product.description}</p>
                      <div className="pt-1 flex flex-wrap gap-1">
                        {product.tags.map(tag => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(product.specifications || {}).map(([key, val]) => (
                        <div key={key} className="p-2 bg-gray-50 rounded-lg">
                          <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                            {key}
                          </span>
                          <span className="font-bold text-gray-800 text-xs">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-3">
                      {productReviews.length > 0 ? (
                        productReviews.slice(0, 3).map(rev => (
                          <div key={rev.id} className="p-2.5 bg-gray-50 rounded-xl space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900">{rev.customerName}</span>
                              <div className="flex text-amber-500">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 text-[11px]">{rev.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 italic">No reviews yet. Be the first to review!</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
