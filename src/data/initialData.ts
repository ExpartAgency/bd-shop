import { Product, Category, Brand, Coupon, Order, Customer, ProductReview } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat_electronics',
    name: 'Smartphones & Tech',
    slug: 'smartphones-tech',
    description: 'Flagship smartphones, laptops, smart accessories, and audio gear.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    iconName: 'Smartphone',
    productCount: 12
  },
  {
    id: 'cat_audio',
    name: 'Hi-Fi Audio & Earwear',
    slug: 'audio-earwear',
    description: 'Studio monitors, audiophile headphones, and wireless earbuds.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    iconName: 'Headphones',
    productCount: 8
  },
  {
    id: 'cat_wearables',
    name: 'Smartwatches & Fit',
    slug: 'smartwatches-fit',
    description: 'Precision health trackers, sapphire glass smartwatches, and bands.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    iconName: 'Watch',
    productCount: 6
  },
  {
    id: 'cat_computing',
    name: 'Computing & Displays',
    slug: 'computing-displays',
    description: 'Creator workstations, mechanical keyboards, and 4K displays.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    iconName: 'Laptop',
    productCount: 9
  },
  {
    id: 'cat_home_living',
    name: 'Smart Living & Decor',
    slug: 'smart-living-decor',
    description: 'Minimalist desk ergonomics, ambient smart lamps, and artisan crafts.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    iconName: 'Home',
    productCount: 7
  }
];

export const INITIAL_BRANDS: Brand[] = [
  { id: 'b_apple', name: 'Apple', slug: 'apple', origin: 'USA' },
  { id: 'b_sony', name: 'Sony Audio', slug: 'sony-audio', origin: 'Japan' },
  { id: 'b_samsung', name: 'Samsung', slug: 'samsung', origin: 'South Korea' },
  { id: 'b_keychron', name: 'Keychron', slug: 'keychron', origin: 'Hong Kong' },
  { id: 'b_anker', name: 'Anker Innovations', slug: 'anker', origin: 'USA' },
  { id: 'b_bd_artisan', name: 'Bengal Artisans', slug: 'bengal-artisans', origin: 'Bangladesh' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    title: 'Sony WH-1000XM5 Noise Canceling Headphones',
    slug: 'sony-wh-1000xm5-headphones',
    sku: 'SNY-WH-XM5-BLK',
    categoryId: 'cat_audio',
    categoryName: 'Hi-Fi Audio & Earwear',
    brand: 'Sony Audio',
    price: 38500,
    compareAtPrice: 42000,
    discountPercent: 8,
    stock: 18,
    lowStockThreshold: 5,
    isPublished: true,
    isFeatured: true,
    shortDescription: 'Industry-leading noise cancelation with two processors and 8 microphones.',
    description: 'The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality. With a newly developed driver, DSEE – Extreme and Hi-Res audio support the WH-1000XM5 headphones provide awe-inspiring audio quality.',
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85'
    ],
    variants: [
      { id: 'v_xm5_blk', name: 'Obsidian Black', sku: 'SNY-WH-XM5-BLK', price: 38500, stock: 12, attributes: { color: 'Black' } },
      { id: 'v_xm5_slv', name: 'Platinum Silver', sku: 'SNY-WH-XM5-SLV', price: 38500, stock: 6, attributes: { color: 'Silver' } }
    ],
    specifications: {
      'Battery Life': 'Up to 30 hours with ANC on',
      'Driver Unit': '30mm, Carbon Fiber Composite',
      'Bluetooth': 'Version 5.2, LDAC support',
      'Weight': '250g',
      'Warranty': '1 Year Official Sony BD Warranty'
    },
    rating: 4.9,
    reviewCount: 38,
    tags: ['Flagship', 'Noise Canceling', 'Hi-Res', 'Bluetooth 5.2'],
    createdAt: '2026-09-10T10:00:00.000Z',
    updatedAt: '2026-10-18T14:32:00.000Z'
  },
  {
    id: 'prod_002',
    title: 'Apple MacBook Pro 16" (M3 Max / 36GB / 1TB)',
    slug: 'apple-macbook-pro-16-m3-max',
    sku: 'APL-MBP-16-M3M',
    categoryId: 'cat_computing',
    categoryName: 'Computing & Displays',
    brand: 'Apple',
    price: 365000,
    compareAtPrice: 385000,
    discountPercent: 5,
    stock: 7,
    lowStockThreshold: 3,
    isPublished: true,
    isFeatured: true,
    shortDescription: 'Liquid Retina XDR display, up to 22 hours of battery life, pro performance.',
    description: 'MacBook Pro blasts forward with M3 Max, an exceptionally advanced chip that brings serious speed and capability for demanding workflows. Featuring an expansive Liquid Retina XDR display, incredible array of pro ports, and all-day battery life.',
    primaryImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=900&q=85'
    ],
    variants: [
      { id: 'v_mbp_spaceblack', name: 'Space Black / 1TB', sku: 'APL-MBP-16-SB', price: 365000, stock: 4, attributes: { color: 'Space Black', storage: '1TB' } },
      { id: 'v_mbp_silver', name: 'Silver / 1TB', sku: 'APL-MBP-16-SL', price: 365000, stock: 3, attributes: { color: 'Silver', storage: '1TB' } }
    ],
    specifications: {
      'Processor': 'Apple M3 Max (14-core CPU, 30-core GPU)',
      'Memory': '36GB Unified Memory',
      'Storage': '1TB Ultra-fast NVMe SSD',
      'Display': '16.2-inch Liquid Retina XDR (120Hz ProMotion)',
      'Warranty': '1 Year Apple Official International'
    },
    rating: 5.0,
    reviewCount: 19,
    tags: ['Apple Silicon', 'M3 Max', 'Retina XDR', 'Creator Workstation'],
    createdAt: '2026-08-20T12:00:00.000Z',
    updatedAt: '2026-10-15T09:15:00.000Z'
  },
  {
    id: 'prod_003',
    title: 'Samsung Galaxy S25 Ultra 5G (Titanium Gray / 512GB)',
    slug: 'samsung-galaxy-s25-ultra-5g',
    sku: 'SAM-S25U-512-TGY',
    categoryId: 'cat_electronics',
    categoryName: 'Smartphones & Tech',
    brand: 'Samsung',
    price: 182000,
    compareAtPrice: 195000,
    discountPercent: 7,
    stock: 14,
    lowStockThreshold: 4,
    isPublished: true,
    isFeatured: true,
    shortDescription: 'Galaxy AI powerhouse, 200MP camera, titanium frame, embedded S Pen.',
    description: 'Meet Galaxy S25 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display. It is an absolute marvel of industrial design equipped with next-gen Snapdragon compute and 200MP detail resolution.',
    primaryImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85'
    ],
    variants: [
      { id: 'v_s25_tgray', name: 'Titanium Gray', sku: 'SAM-S25U-512-TGY', price: 182000, stock: 8, attributes: { color: 'Titanium Gray' } },
      { id: 'v_s25_tblk', name: 'Titanium Black', sku: 'SAM-S25U-512-TBK', price: 182000, stock: 6, attributes: { color: 'Titanium Black' } }
    ],
    specifications: {
      'Display': '6.8" Dynamic AMOLED 2X, 120Hz, 2600 nits',
      'Camera': '200MP Wide + 50MP Periscope + 12MP Ultra-wide',
      'Processor': 'Snapdragon 8 Elite Mobile Platform',
      'Battery': '5,000 mAh with 45W Fast Charging',
      'Warranty': 'Official Samsung Bangladesh 1 Year'
    },
    rating: 4.8,
    reviewCount: 42,
    tags: ['Titanium', '200MP', 'S Pen', 'Flagship Phone'],
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-10-18T16:00:00.000Z'
  },
  {
    id: 'prod_004',
    title: 'Keychron Q1 Pro Custom Wireless Mechanical Keyboard',
    slug: 'keychron-q1-pro-wireless-keyboard',
    sku: 'KEY-Q1P-RGB-BAN',
    categoryId: 'cat_computing',
    categoryName: 'Computing & Displays',
    brand: 'Keychron',
    price: 24500,
    compareAtPrice: 27000,
    discountPercent: 9,
    stock: 22,
    lowStockThreshold: 6,
    isPublished: true,
    isFeatured: false,
    shortDescription: 'Full CNC aluminum body, QMK/VIA support, double-gasket acoustic dampening.',
    description: 'The Keychron Q1 Pro is a groundbreaking full metal wireless custom mechanical keyboard. Along with our many premium designs, including double-gasket design, PBT keycaps, and screw-in stabs, it delivers an unprecedented typing experience.',
    primaryImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=85'
    ],
    specifications: {
      'Body Material': 'Full CNC Machined Anodized Aluminum',
      'Switches': 'K Pro Banana Tactile / Red Linear',
      'Connectivity': 'Bluetooth 5.1 & Type-C Cable',
      'Polling Rate': '1000 Hz (Wired) / 90 Hz (Wireless)',
      'Keycaps': 'KSA double-shot PBT keycaps'
    },
    rating: 4.9,
    reviewCount: 27,
    tags: ['Mechanical Keyboard', 'Wireless', 'Hot-Swappable', 'Custom Desk'],
    createdAt: '2026-07-15T10:00:00.000Z',
    updatedAt: '2026-10-12T11:00:00.000Z'
  },
  {
    id: 'prod_005',
    title: 'Apple Watch Ultra 2 (Titanium / Ocean Band)',
    slug: 'apple-watch-ultra-2-titanium',
    sku: 'APL-WTU2-49-OCN',
    categoryId: 'cat_wearables',
    categoryName: 'Smartwatches & Fit',
    brand: 'Apple',
    price: 105000,
    compareAtPrice: 115000,
    discountPercent: 9,
    stock: 9,
    lowStockThreshold: 2,
    isPublished: true,
    isFeatured: true,
    shortDescription: 'Rugged titanium case, precision dual-frequency GPS, up to 36 hours battery.',
    description: 'The most capable and rugged Apple Watch pushes the limits again. Featuring the all-new S9 SiP, a magical new way to use your watch without touching the screen, the brightest Apple display ever, and precision dual-frequency GPS.',
    primaryImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=85'
    ],
    specifications: {
      'Case': '49mm Aerospace-grade Titanium',
      'Brightness': '3000 nits peak display',
      'Water Resistance': '100m, EN13319 dive computer rated',
      'Battery': '36 hours normal, up to 72 hours low power mode'
    },
    rating: 4.9,
    reviewCount: 15,
    tags: ['Apple Watch', 'Titanium', 'Endurance', 'Diving'],
    createdAt: '2026-08-10T14:00:00.000Z',
    updatedAt: '2026-10-17T08:00:00.000Z'
  },
  {
    id: 'prod_006',
    title: 'Anker Prime 20,000mAh Power Bank (200W Output)',
    slug: 'anker-prime-20000-powerbank-200w',
    sku: 'ANK-PRM-20K-200W',
    categoryId: 'cat_electronics',
    categoryName: 'Smartphones & Tech',
    brand: 'Anker Innovations',
    price: 14500,
    compareAtPrice: 16500,
    discountPercent: 12,
    stock: 35,
    lowStockThreshold: 8,
    isPublished: true,
    isFeatured: false,
    shortDescription: 'Multi-device fast charging with smart digital screen and 100W rapid recharge.',
    description: 'Equipped with two high-powered USB-C ports and one USB-A port totaling 200W output, quickly charge two laptops simultaneously at 100W each for maximum efficiency. Includes a vibrant smart digital display that shows real-time battery status and input/output power.',
    primaryImage: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=900&q=85'
    ],
    specifications: {
      'Capacity': '20,000mAh (72Wh)',
      'Total Output': '200W Max',
      'Ports': '2x USB-C + 1x USB-A',
      'Display': 'TFT Color Power Analytics Screen',
      'Warranty': '18 Months Anker Warranty'
    },
    rating: 4.7,
    reviewCount: 51,
    tags: ['Fast Charge', 'Power Bank', 'USB-C PD 3.1', 'Laptop Charger'],
    createdAt: '2026-06-25T09:00:00.000Z',
    updatedAt: '2026-10-10T12:00:00.000Z'
  },
  {
    id: 'prod_007',
    title: 'Minimalist Walnut Solid Wood Desk Shelf & Organizer',
    slug: 'minimalist-walnut-desk-shelf-organizer',
    sku: 'BNG-DSK-WLN-01',
    categoryId: 'cat_home_living',
    categoryName: 'Smart Living & Decor',
    brand: 'Bengal Artisans',
    price: 8800,
    compareAtPrice: 10500,
    discountPercent: 16,
    stock: 15,
    lowStockThreshold: 4,
    isPublished: true,
    isFeatured: false,
    shortDescription: 'Handcrafted North American Walnut with matte black aerospace aluminum legs.',
    description: 'Raise your monitor to ergonomic eye level while organizing your desk periphery. Hand-carved from seasoned walnut wood by heritage Bengali woodturners with chamfered edges and anodized structural stands.',
    primaryImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=85'
    ],
    specifications: {
      'Material': 'Solid American Walnut + Anodized Aluminum',
      'Dimensions': '115cm (L) x 23cm (W) x 11cm (H)',
      'Load Capacity': 'Up to 50kg',
      'Finish': 'Food-safe Organic Hardwax Oil'
    },
    rating: 4.8,
    reviewCount: 22,
    tags: ['Artisanal', 'Desk Setup', 'Walnut', 'Ergonomic'],
    createdAt: '2026-07-01T11:00:00.000Z',
    updatedAt: '2026-10-14T17:00:00.000Z'
  },
  {
    id: 'prod_008',
    title: 'Sony Alpha 7 IV Full-Frame Mirrorless Hybrid Camera',
    slug: 'sony-alpha-7-iv-mirrorless-camera',
    sku: 'SNY-A7M4-BODY',
    categoryId: 'cat_electronics',
    categoryName: 'Smartphones & Tech',
    brand: 'Sony Audio',
    price: 255000,
    compareAtPrice: 275000,
    discountPercent: 7,
    stock: 5,
    lowStockThreshold: 2,
    isPublished: true,
    isFeatured: true,
    shortDescription: '33MP Exmor R CMOS sensor, 4K 60p 10-bit recording, AI-driven autofocus.',
    description: 'An ideal all-arounder that pushes beyond basic, the Sony a7 IV does double duty with strong stills and video performance. An advanced hybrid mirrorless camera, the a7 IV has the resolution and AF performance that appeals to photographers alongside robust 4K 60p video recording for filmmakers.',
    primaryImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85'
    ],
    specifications: {
      'Sensor': '33MP Full-Frame Exmor R CMOS',
      'Video': '4K 60p in 10-Bit 4:2:2, S-Cinetone',
      'AF Points': '759-Point Fast Hybrid AF with Real-Time Eye AF',
      'Stabilization': '5-Axis SteadyShot Inside (5.5 stops)'
    },
    rating: 4.9,
    reviewCount: 31,
    tags: ['Full Frame', '4K 60p', 'Cinematography', 'Hybrid Camera'],
    createdAt: '2026-05-18T10:00:00.000Z',
    updatedAt: '2026-10-16T15:00:00.000Z'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c_welcome',
    code: 'BDWELCOME10',
    type: 'percentage',
    value: 10,
    minSpend: 5000,
    maxDiscount: 3000,
    expiresAt: '2026-12-31T23:59:59.000Z',
    usageLimit: 500,
    usedCount: 142,
    isActive: true,
    description: '10% off for verified new customers on orders over ৳5,000'
  },
  {
    id: 'c_cyber',
    code: 'CYBER20',
    type: 'percentage',
    value: 20,
    minSpend: 25000,
    maxDiscount: 8000,
    expiresAt: '2026-11-30T23:59:59.000Z',
    usageLimit: 100,
    usedCount: 68,
    isActive: true,
    description: '20% off high-performance computing & audio over ৳25,000'
  },
  {
    id: 'c_eid',
    code: 'EID500',
    type: 'fixed',
    value: 500,
    minSpend: 3000,
    expiresAt: '2026-12-31T23:59:59.000Z',
    usageLimit: 1000,
    usedCount: 420,
    isActive: true,
    description: 'Flat ৳500 instant discount on orders above ৳3,000'
  }
];

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev_01',
    productId: 'prod_001',
    customerName: 'Tanvir Hossain',
    rating: 5,
    title: 'Outstanding ANC performance on flights',
    comment: 'The noise cancellation is unmatched. Tested between Dhaka and Singapore flights, battery lasted throughout with incredible comfort.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-10-12T10:15:00.000Z'
  },
  {
    id: 'rev_02',
    productId: 'prod_001',
    customerName: 'Farhan Rahman',
    rating: 5,
    title: 'Pristine sound and quick delivery in Gulshan',
    comment: 'Arrived the same day I ordered via BD SHOP Express. Packaging had official Sony Bangladesh warranty sticker intact.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-10-14T16:20:00.000Z'
  },
  {
    id: 'rev_03',
    productId: 'prod_003',
    customerName: 'Nusrat Jahan',
    rating: 5,
    title: 'Titanium build feels supreme',
    comment: 'Camera zoom at night is unbelievable. The flat display makes screen protection so much cleaner than previous curved edges.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-10-15T09:40:00.000Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'BDS-2026-8941',
    customerName: 'Sheikh Rafiqul Islam',
    customerEmail: 'rafiqul.islam@dhakatech.com',
    customerPhone: '+880 1711-892341',
    shippingAddress: 'House 42, Road 11, Block D, Banani',
    city: 'Dhaka',
    postalCode: '1213',
    shippingZone: 'inside_dhaka',
    shippingFee: 60,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    items: [
      {
        productId: 'prod_001',
        title: 'Sony WH-1000XM5 Noise Canceling Headphones',
        sku: 'SNY-WH-XM5-BLK',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
        price: 38500,
        quantity: 1,
        subtotal: 38500
      }
    ],
    subtotal: 38500,
    discount: 3000,
    couponCode: 'BDWELCOME10',
    total: 35560,
    trackingCourier: 'Pathao Express Logistics',
    trackingNumber: 'PTH-DH-89214',
    timeline: [
      { status: 'pending', title: 'Order Placed', description: 'Order recorded with transaction ID #TRX-BK78129', timestamp: '2026-10-18T10:14:00.000Z', completed: true },
      { status: 'confirmed', title: 'Payment Verified', description: 'bKash instant merchant settlement confirmed', timestamp: '2026-10-18T10:15:00.000Z', completed: true },
      { status: 'processing', title: 'Packaged & Checked', description: 'Item picked from Dhanmondi Fulfilment Hub', timestamp: '2026-10-18T13:30:00.000Z', completed: true },
      { status: 'shipped', title: 'Dispatched with Courier', description: 'Courier handover to Pathao Rider #R-412', timestamp: '2026-10-19T08:00:00.000Z', completed: true },
      { status: 'delivered', title: 'Delivered', description: 'Recipient signed and verified OTP', timestamp: '', completed: false }
    ],
    createdAt: '2026-10-18T10:14:00.000Z',
    updatedAt: '2026-10-19T08:00:00.000Z'
  },
  {
    id: 'ord_102',
    orderNumber: 'BDS-2026-7290',
    customerName: 'Dr. Sabrina Haque',
    customerEmail: 'sabrina.haque@medicare.bd',
    customerPhone: '+880 1822-451902',
    shippingAddress: 'Apartment 7B, Green Heritage, Nasirabad',
    city: 'Chittagong',
    postalCode: '4000',
    shippingZone: 'outside_dhaka',
    shippingFee: 120,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    items: [
      {
        productId: 'prod_004',
        title: 'Keychron Q1 Pro Custom Wireless Mechanical Keyboard',
        sku: 'KEY-Q1P-RGB-BAN',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85',
        price: 24500,
        quantity: 1,
        subtotal: 24500
      }
    ],
    subtotal: 24500,
    discount: 500,
    couponCode: 'EID500',
    total: 24120,
    trackingCourier: 'Steadfast Courier',
    trackingNumber: 'SFC-CTG-99231',
    timeline: [
      { status: 'pending', title: 'Order Placed', description: 'Order created via checkout', timestamp: '2026-10-18T16:00:00.000Z', completed: true },
      { status: 'confirmed', title: 'Card Authorized', description: 'Visa 3D-Secure 2.0 authorized', timestamp: '2026-10-18T16:02:00.000Z', completed: true },
      { status: 'processing', title: 'Packaging for Out-of-District Transit', description: 'Double bubble-wrap with anti-shock carton', timestamp: '2026-10-19T09:30:00.000Z', completed: true }
    ],
    createdAt: '2026-10-18T16:00:00.000Z',
    updatedAt: '2026-10-19T09:30:00.000Z'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_01',
    name: 'Sheikh Rafiqul Islam',
    email: 'rafiqul.islam@dhakatech.com',
    phone: '+880 1711-892341',
    district: 'Dhaka (Banani)',
    ordersCount: 4,
    totalSpent: 142000,
    status: 'active',
    joinedAt: '2026-03-15'
  },
  {
    id: 'cust_02',
    name: 'Dr. Sabrina Haque',
    email: 'sabrina.haque@medicare.bd',
    phone: '+880 1822-451902',
    district: 'Chittagong',
    ordersCount: 2,
    totalSpent: 48500,
    status: 'active',
    joinedAt: '2026-05-20'
  },
  {
    id: 'cust_03',
    name: 'Mahmudur Rahman',
    email: 'mahmud.engr@gmail.com',
    phone: '+880 1912-774019',
    district: 'Sylhet',
    ordersCount: 6,
    totalSpent: 289000,
    status: 'active',
    joinedAt: '2026-01-10'
  }
];
