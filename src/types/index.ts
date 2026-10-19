export interface ProductVariant {
  id: string;
  name: string; // e.g. "Midnight Blue / 256GB"
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>; // e.g. { color: "Midnight Blue", storage: "256GB" }
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number; // 1 - 5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  price: number; // in BDT (৳)
  compareAtPrice?: number;
  discountPercent?: number;
  stock: number;
  lowStockThreshold: number;
  isPublished: boolean;
  isFeatured: boolean;
  shortDescription: string;
  description: string;
  primaryImage: string;
  images: string[];
  variants?: ProductVariant[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  origin: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  price: number;
  product: Product;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  title: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderTimelineEvent {
  status: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. BDS-2026-8941
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  shippingZone: 'inside_dhaka' | 'outside_dhaka' | 'express';
  shippingFee: number;
  paymentMethod: 'bkash' | 'nagad' | 'card' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  notes?: string;
  trackingCourier?: string;
  trackingNumber?: string;
  timeline: OrderTimelineEvent[];
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (e.g. 15 for 15%) or fixed (e.g. 500 for ৳500)
  minSpend: number;
  maxDiscount?: number;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  ordersCount: number;
  totalSpent: number;
  status: 'active' | 'blocked';
  joinedAt: string;
}

export interface SyncEvent {
  id: string;
  type: 'PRODUCT_CREATED' | 'PRODUCT_UPDATED' | 'PRODUCT_DELETED' | 'STOCK_SYNC' | 'CACHE_PURGE' | 'ORDER_PROCESSED';
  entityId: string;
  message: string;
  timestamp: string;
  latencyMs: number;
  status: 'synced' | 'pending' | 'invalidated';
}

export interface CacheKeyEntry {
  key: string;
  tag: string;
  ttlSeconds: number;
  sizeBytes: number;
  hits: number;
  createdAt: string;
}

export interface QueueJob {
  id: string;
  queue: 'emails' | 'inventory_sync' | 'cdn_purge' | 'webhooks';
  name: string;
  payload: Record<string, any>;
  attempts: number;
  maxAttempts: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

export interface SystemHealth {
  databaseStatus: 'healthy' | 'degraded' | 'offline';
  redisStatus: 'healthy' | 'degraded' | 'offline';
  cdnStatus: 'operational' | 'purging' | 'degraded';
  queueWorkerStatus: 'active' | 'idle' | 'stalled';
  avgResponseTimeMs: number;
  cacheHitRatio: number; // 0 - 100
  uptimePercent: number;
  activeJobsCount: number;
}

export interface PixelEventLog {
  id: string;
  eventName: string; // 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase'
  source: 'browser_pixel' | 'server_capi';
  eventTime: string;
  payload: Record<string, any>;
  status: 'dispatched' | 'simulated';
}

export interface PixelSettings {
  facebookPixelId: string;
  capiAccessToken: string;
  testEventCode: string;
  capiEnabled: boolean;
  googleTagManagerId: string;
  googleAnalyticsId: string;
  trackPageView: boolean;
  trackViewContent: boolean;
  trackAddToCart: boolean;
  trackInitiateCheckout: boolean;
  trackPurchase: boolean;
  logs: PixelEventLog[];
}

export interface CourierConsignment {
  id: string;
  orderId: string;
  orderNumber: string;
  courier: 'Steadfast' | 'Pathao' | 'RedX' | 'Paperfly';
  consignmentId: string;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  amountToCollect: number;
  status: 'in_review' | 'picked' | 'in_transit' | 'delivered';
  dispatchedAt: string;
}

export interface CourierSettings {
  steadfastApiKey: string;
  steadfastSecretKey: string;
  steadfastEnabled: boolean;
  pathaoClientId: string;
  pathaoSecret: string;
  pathaoStoreId: string;
  pathaoEnabled: boolean;
  redxToken: string;
  redxEnabled: boolean;
  paperflyUsername: string;
  paperflyKey: string;
  paperflyEnabled: boolean;
  defaultCourier: 'Steadfast' | 'Pathao' | 'RedX' | 'Paperfly';
  consignments: CourierConsignment[];
}

export interface SpinningWheelPrize {
  id: string;
  label: string; // e.g. "৳500 OFF", "FREE GIFT", "20% OFF", "FREE SHIPPING", "৳200 OFF", "৳100 OFF"
  type: 'coupon' | 'free_shipping' | 'free_gift' | 'no_win';
  couponCode?: string;
  discountValue?: number;
  giftItemName?: string;
  color: string;
  textColor: string;
  probability: number; // percentage weight, e.g. 20
  description: string;
}

export interface SpinningWheelSettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  buttonText: string;
  floatingButtonEnabled: boolean;
  maxSpinsPerUser: number;
  autoOpenOnFirstVisit: boolean;
  prizes: SpinningWheelPrize[];
}

export interface HomepageSettings {
  announcementText: string;
  announcementCoupon: string;
  announcementEnabled: boolean;
  heroBadge: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroPrimaryCtaText: string;
  spotlightProductId: string;
  whatsappNumber: string;
  whatsappWelcomeMessage: string;
  whatsappEnabled: boolean;
  installButtonEnabled?: boolean;
  installButtonDiscountText?: string;
  flashSaleHours?: number;
  guaranteeText1?: string;
  guaranteeText2?: string;
  guaranteeText3?: string;
  guaranteeText4?: string;
}


